import assert from "node:assert/strict";
import test from "node:test";
import { createContactHandler } from "../lib/contact-delivery.mjs";
import { createContactVerification } from "../lib/contact-verification.mjs";

const valid = { name: "Private Lead", email: "private@example.com", phone: "", message: "Private project details" };
const human = { isHuman: true, isBot: false, isVerifiedBot: false, bypassed: false };

function deferred() {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

function setup(verifyRequest) {
  const events = [], background = [], logs = [];
  const logger = { info: (...args) => logs.push(args), error: (...args) => logs.push(args) };
  const req = {
    method: "POST",
    headers: { host: "ckcwoodworks.com", origin: "https://ckcwoodworks.com", "content-type": "application/json" },
    body: structuredClone(valid),
  };
  const res = {
    statusCode: 0, headers: {}, body: undefined,
    setHeader(key, value) { this.headers[key] = value; },
    end(value) { this.body = JSON.parse(value); events.push("response"); },
  };
  const handler = createContactHandler({
    verifyRequest,
    sendNotification: async () => { events.push("email"); return true; },
    saveToCRM: async () => { events.push("crm"); return true; },
    waitUntil(promise) { events.push("waitUntil"); background.push(promise); },
    logger, newReference: () => "test-verification-reference",
  });
  return { handler, req, res, events, background, logs, logger };
}

test("a human verdict is required before email, response, and background CRM in that order", async () => {
  const verdict = deferred();
  const app = setup(async () => { app.events.push("verification"); return verdict.promise; });
  const pending = app.handler(app.req, app.res);
  assert.deepEqual(app.events, ["verification"]);
  assert.equal(app.res.body, undefined);
  verdict.resolve("human");
  await pending;
  await Promise.all(app.background);
  assert.equal(app.res.statusCode, 200);
  assert.deepEqual(app.events, ["verification", "email", "waitUntil", "response", "crm"]);
});

test("bot, missing dependency, unknown verdict, and verification exception never touch either delivery system", async () => {
  for (const [verifyRequest, status] of [
    [async () => "bot", 403],
    [undefined, 503],
    [async () => undefined, 503],
    [async () => true, 503],
    [async () => { throw new Error("private@example.com secret-token"); }, 503],
  ]) {
    const app = setup(verifyRequest);
    await app.handler(app.req, app.res);
    assert.equal(app.res.statusCode, status);
    assert.match(app.res.body.error, /314-383-8222/);
    assert.deepEqual(app.events, ["response"]);
    assert.equal(app.background.length, 0);
    assert.doesNotMatch(JSON.stringify(app.logs), /private@example.com|Private Lead|secret-token|Private project/);
  }
});

test("honeypot submissions are cheaply discarded before BotID or delivery", async () => {
  const app = setup(async () => { throw new Error("Must not verify honeypot"); });
  app.req.body.website = "https://spam.example";
  await app.handler(app.req, app.res);
  assert.equal(app.res.statusCode, 200);
  assert.deepEqual(app.res.body, { success: true });
  assert.deepEqual(app.events, ["response"]);
  assert.deepEqual(app.logs, []);
});

test("adapter forces Basic, passes request headers to the SDK, and accepts only an explicit human result", async () => {
  const req = { headers: { host: "ckcwoodworks.com", "x-test-header": "opaque" } };
  const logs = [];
  const logger = { info: (...args) => logs.push(args), error: (...args) => logs.push(args) };
  let options;
  const verify = createContactVerification({ checkBotId: async (value) => { options = value; return human; }, logger });
  assert.equal(await verify(req, "reference"), "human");
  assert.equal(options.advancedOptions.checkLevel, "basic");
  assert.equal(options.advancedOptions.headers, req.headers);
  assert.doesNotMatch(JSON.stringify(logs), /opaque|x-test-header/);

  for (const [classification, expected] of [
    [{ isHuman: false, isBot: true }, "bot"],
    [{ isHuman: true, isBot: true }, "bot"],
    [{ isHuman: false, isBot: false }, "unavailable"],
    [{ isHuman: true }, "unavailable"],
    [null, "unavailable"],
  ]) {
    const classify = createContactVerification({ checkBotId: async () => classification, logger });
    assert.equal(await classify(req, "reference"), expected);
  }
});

test("missing browser challenge is classified by the SDK and its bot verdict blocks mail and CRM", async () => {
  let calls = 0;
  const verify = createContactVerification({
    checkBotId: async ({ advancedOptions }) => {
      calls += 1;
      assert.equal(advancedOptions.headers["x-is-human"], undefined);
      return { isHuman: false, isBot: true };
    },
    logger: { info() {}, error() {} },
  });
  const app = setup(verify);
  await app.handler(app.req, app.res);
  assert.equal(calls, 1);
  assert.equal(app.res.statusCode, 403);
  assert.deepEqual(app.events, ["response"]);
});

test("SDK rejection and synchronous exceptions fail closed without logging exception data", async () => {
  for (const checkBotId of [
    async () => { throw new Error("private@example.com secret-token"); },
    () => { throw new Error("Private Lead secret-token"); },
    undefined,
  ]) {
    const app = setup();
    const verify = createContactVerification({ checkBotId, logger: app.logger });
    const guarded = setup(verify);
    await guarded.handler(guarded.req, guarded.res);
    assert.equal(guarded.res.statusCode, 503);
    assert.deepEqual(guarded.events, ["response"]);
    assert.doesNotMatch(JSON.stringify(app.logs), /private@example.com|Private Lead|secret-token/);
  }
});

test("verification timeout rejects before delivery and a late result cannot start delivery", async () => {
  const verdict = deferred();
  const verify = createContactVerification({ checkBotId: () => verdict.promise, timeoutMs: 8, logger: { info() {}, error() {} } });
  const app = setup(verify);
  await app.handler(app.req, app.res);
  assert.equal(app.res.statusCode, 503);
  assert.deepEqual(app.events, ["response"]);
  verdict.resolve(human);
  await Promise.resolve();
  await Promise.resolve();
  assert.deepEqual(app.events, ["response"]);
  assert.equal(app.background.length, 0);
});

test("the default eight-second timer is cleared after verification completes", async (t) => {
  const handle = {};
  let cleared = false;
  t.mock.method(globalThis, "setTimeout", (_callback, delay) => {
    assert.equal(delay, 8000);
    return handle;
  });
  t.mock.method(globalThis, "clearTimeout", (value) => {
    assert.equal(value, handle);
    cleared = true;
  });
  const verify = createContactVerification({ checkBotId: async () => human, logger: { info() {}, error() {} } });
  assert.equal(await verify({ headers: {} }, "reference"), "human");
  assert.equal(cleared, true);
});
