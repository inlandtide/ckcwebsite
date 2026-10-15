import assert from "node:assert/strict";
import test from "node:test";
import { createContactDelivery, createContactHandler } from "../lib/contact-delivery.mjs";

const logger = { info() {}, error() {} };
const valid = {
  name: "Test <Lead>", email: "test@example.com", phone: "+13145550100", message: "<b>Example inquiry</b>",
  attribution: { landingPage: "/services/custom-cabinetry-casework?email=private@example.com", submissionPage: "/contact", campaign: "commercial", formLocation: "contact-page" },
};

function deferred() {
  let resolve;
  const promise = new Promise((finish) => { resolve = finish; });
  return { promise, resolve };
}

function setup({ email = async () => true, sheet = async () => true } = {}) {
  const events = [];
  const background = [];
  const req = { method: "POST", headers: { host: "ckcwoodworks.com", origin: "https://ckcwoodworks.com", "content-type": "application/json" }, body: structuredClone(valid) };
  const res = {
    statusCode: 0, headers: {}, body: undefined,
    setHeader(key, value) { this.headers[key] = value; },
    end(value) { this.body = JSON.parse(value); events.push(["response", this.statusCode]); },
  };
  const handler = createContactHandler({
    sendNotification: async (...args) => { events.push(["email", ...args]); return email(...args); },
    saveToSheets: async (...args) => { events.push(["sheet", ...args]); return sheet(...args); },
    waitUntil(promise) { events.push(["waitUntil"]); background.push(promise); },
    logger, newReference: () => "test-reference",
  });
  return { handler, req, res, events, background };
}

test("accepts email before acknowledging, then starts Sheets after the response without waiting for it", async () => {
  const email = deferred();
  const sheet = deferred();
  const app = setup({ email: () => email.promise, sheet: () => sheet.promise });
  const request = app.handler(app.req, app.res);
  assert.deepEqual(app.events.map(([type]) => type), ["email"]);
  assert.equal(app.res.body, undefined);
  email.resolve(true);
  await request;
  assert.equal(app.res.statusCode, 200);
  assert.deepEqual(app.res.body, { success: true });
  assert.deepEqual(app.events.map(([type]) => type), ["email", "waitUntil", "response", "sheet"]);
  let finished = false;
  app.background[0].then(() => { finished = true; });
  await Promise.resolve();
  assert.equal(finished, false, "slow Sheets must be independent of the completed response");
  sheet.resolve(true);
  await Promise.all(app.background);
  assert.equal(app.events.filter(([type]) => type === "sheet").length, 1);
});

test("a missing Sheets receipt alerts the team once and never blindly appends a duplicate", async () => {
  const app = setup({ sheet: async () => false });
  await app.handler(app.req, app.res);
  await Promise.all(app.background);
  assert.deepEqual(app.res.body, { success: true });
  assert.deepEqual(app.events.map(([type]) => type), ["email", "waitUntil", "response", "sheet", "email"]);
  const emails = app.events.filter(([type]) => type === "email");
  assert.equal(emails[1][3], true);
  assert.equal(emails[0][2], emails[1][2], "warning keeps the original reference");
});

test("an email outage acknowledges only after confirmed backup, then retries the same notification", async () => {
  const sheet = deferred();
  const sheetStarted = deferred();
  const app = setup({ email: async () => false, sheet: () => { sheetStarted.resolve(); return sheet.promise; } });
  const request = app.handler(app.req, app.res);
  await sheetStarted.promise;
  assert.deepEqual(app.events.map(([type]) => type), ["email", "sheet"]);
  assert.equal(app.res.body, undefined);
  sheet.resolve(true);
  await request;
  await Promise.all(app.background);
  assert.deepEqual(app.res.body, { success: true });
  assert.deepEqual(app.events.map(([type]) => type), ["email", "sheet", "waitUntil", "response", "email"]);
  assert.equal(app.events[0][2], app.events[4][2]);
});

test("when neither system confirms receipt, returns an actionable 503 and does not claim success", async () => {
  const app = setup({ email: async () => false, sheet: async () => false });
  await app.handler(app.req, app.res);
  assert.equal(app.res.statusCode, 503);
  assert.match(app.res.body.error, /314-383-8222/);
  assert.equal(app.background.length, 0);
  assert.equal(app.res.headers["Cache-Control"], "no-store");
});

test("malformed, missing, wrongly typed and oversized fields cannot send a lead", async () => {
  const bodies = [undefined, null, [], "{broken", {}, { ...valid, name: " " }, { ...valid, email: "invalid" }, { ...valid, email: "lead@example.com\r\nBcc:someone@example.com" }, { ...valid, phone: {} }, { ...valid, message: " " }, { ...valid, name: "a".repeat(201) }, { ...valid, message: "a".repeat(10001) }, { ...valid, website: {} }];
  for (const body of bodies) {
    const app = setup();
    app.req.body = body;
    await app.handler(app.req, app.res);
    assert.equal(app.res.statusCode, 400, JSON.stringify(body)?.slice(0, 80));
    assert.deepEqual(app.events.map(([type]) => type), ["response"]);
  }
});

test("supports Vercel's lazy parsed body and catches its malformed-JSON exception", async () => {
  const parsed = setup();
  let reads = 0;
  Object.defineProperty(parsed.req, "body", { get() { reads += 1; return structuredClone(valid); } });
  await parsed.handler(parsed.req, parsed.res);
  await Promise.all(parsed.background);
  assert.equal(parsed.res.statusCode, 200);
  assert.equal(reads, 1);
  const raw = setup();
  raw.req.body = JSON.stringify(valid);
  await raw.handler(raw.req, raw.res);
  await Promise.all(raw.background);
  assert.equal(raw.res.statusCode, 200);
  const malformed = setup();
  Object.defineProperty(malformed.req, "body", { get() { throw new SyntaxError("Invalid JSON"); } });
  await malformed.handler(malformed.req, malformed.res);
  assert.equal(malformed.res.statusCode, 400);
  assert.deepEqual(malformed.events.map(([type]) => type), ["response"]);
});

test("only JSON POSTs from the current origin are accepted; hidden-field bots are quietly discarded", async () => {
  for (const [change, status] of [
    [(req) => { req.method = "GET"; }, 405],
    [(req) => { req.headers["content-type"] = "text/plain"; }, 415],
    [(req) => { req.headers.origin = "https://elsewhere.example"; }, 403],
    [(req) => { req.headers.origin = "not a URL"; }, 403],
    [(req) => { req.body.website = "https://spam.example"; }, 200],
  ]) {
    const app = setup();
    change(app.req);
    await app.handler(app.req, app.res);
    assert.equal(app.res.statusCode, status);
    assert.deepEqual(app.events.map(([type]) => type), ["response"]);
  }
});

test("labels CKC inquiries and strips arbitrary URL query strings and external landing URLs", async () => {
  const app = setup();
  app.req.body.attribution.referringSite = "https://search.example/path?email=private@example.com";
  await app.handler(app.req, app.res);
  await Promise.all(app.background);
  const lead = app.events[0][1];
  assert.equal(lead.attribution.leadSource, "CKC Woodworks Website");
  assert.equal(lead.attribution.landingPage, "https://ckcwoodworks.com/services/custom-cabinetry-casework");
  assert.equal(lead.attribution.referringSite, "https://search.example");
  assert.match(lead.attribution.attributionDetails, /Form: contact-page/);
  assert.doesNotMatch(JSON.stringify(lead.attribution), /private@example.com/);
  const external = setup();
  external.req.body.attribution = { landingPage: "https://elsewhere.example/", referringSite: "javascript:alert(1)" };
  await external.handler(external.req, external.res);
  await Promise.all(external.background);
  assert.equal(external.events[0][1].attribution.landingPage, "https://ckcwoodworks.com/");
  assert.equal(external.events[0][1].attribution.referringSite, "");
});

function deliveryWith(fetcher, env = { RESEND_API: "mock-key", GOOGLE_SHEETS_WEBAPP_URL: "https://sheets.example.test" }) {
  return createContactDelivery({ fetch: fetcher, env, logger });
}

const lead = { ...valid, attribution: { leadSource: "CKC Woodworks Website", campaign: "=unsafe()", landingPage: "https://ckcwoodworks.com/", attributionDetails: "Website: ckcwoodworks.com" } };

test("email retains configured recipients and reply-to, escapes user HTML, and separates alert idempotency", async () => {
  const sent = [];
  const delivery = deliveryWith(async (url, options) => { sent.push({ url, options }); return Response.json({ id: "email-receipt" }); });
  assert.equal(await delivery.sendNotification(lead, "reference"), true);
  assert.equal(await delivery.sendNotification(lead, "reference"), true);
  assert.equal(await delivery.sendNotification(lead, "reference", true), true);
  const payload = JSON.parse(sent[0].options.body);
  assert.deepEqual(payload.to, ["tim@inlandtide.com", "ryan@inlandtide.com"]);
  assert.equal(payload.from, "CKC Woodworks <contact@mouldingstl.com>");
  assert.equal(payload.reply_to, "test@example.com");
  assert.match(payload.html, /&lt;b&gt;Example inquiry&lt;\/b&gt;/);
  assert.doesNotMatch(payload.html, /<b>Example inquiry/);
  assert.match(payload.text, /CKC Woodworks Website/);
  assert.equal(sent[0].options.headers["Idempotency-Key"], sent[1].options.headers["Idempotency-Key"]);
  assert.notEqual(sent[0].options.headers["Idempotency-Key"], sent[2].options.headers["Idempotency-Key"]);
  assert.ok(sent.every(({ options }) => options.signal instanceof AbortSignal));
});

test("Sheets payload preserves the receiver schema and converts formula-like values to cell text", async () => {
  let request;
  const delivery = deliveryWith(async (url, options) => { request = { url, options }; return Response.json({ status: "success" }); });
  assert.equal(await delivery.saveToSheets({ ...lead, name: "=HYPERLINK(\"bad\")", message: "  +SUM(1,2)" }, "reference"), true);
  const data = JSON.parse(request.options.body);
  assert.equal(request.url, "https://sheets.example.test");
  assert.equal(data.name, "'=HYPERLINK(\"bad\")");
  assert.equal(data.phone, "'+13145550100");
  assert.equal(data.message, "'  +SUM(1,2)");
  assert.equal(data.campaign, "'=unsafe()");
  assert.equal(data.leadSource, "CKC Woodworks Website");
  assert.equal(data.landingPage, "https://ckcwoodworks.com/");
  assert.ok(request.options.signal instanceof AbortSignal);
});

test("HTTP 200 without the expected receipts cannot be mistaken for confirmed delivery", async () => {
  for (const result of [() => Response.json({ error: "no receipt" }), () => new Response("<html>Login</html>"), () => Response.json({ id: "", status: "error" }), () => Response.json({ id: "bad", status: "success" }, { status: 500 })]) {
    const delivery = deliveryWith(async () => result());
    assert.equal(await delivery.sendNotification(lead, "reference"), false);
    assert.equal(await delivery.saveToSheets(lead, "reference"), false);
  }
});

test("missing configuration and network errors fail closed without leaking personal data into logs", async () => {
  const logs = [];
  const log = { info: (...args) => logs.push(args), error: (...args) => logs.push(args) };
  const missing = createContactDelivery({ env: {}, fetch: async () => { throw new Error("Must not fetch"); }, logger: log });
  assert.equal(await missing.sendNotification(lead, "reference"), false);
  assert.equal(await missing.saveToSheets(lead, "reference"), false);
  const outage = createContactDelivery({ env: { RESEND_API: "secret-key", GOOGLE_SHEETS_WEBAPP_URL: "https://sheets.example.test" }, fetch: async () => { throw new Error("Timeout"); }, logger: log });
  assert.equal(await outage.sendNotification(lead, "reference"), false);
  assert.equal(await outage.saveToSheets(lead, "reference"), false);
  assert.doesNotMatch(JSON.stringify(logs), /test@example.com|Test <Lead>|secret-key|Example inquiry/);
});
