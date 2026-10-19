import { randomUUID } from "node:crypto";

const NOTIFY_EMAILS = ["tim@inlandtide.com", "ryan@inlandtide.com"];
const SITE = "https://ckcwoodworks.com";
const MAX_BODY_BYTES = 65536;

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
  })[character]);
}

// The existing Apps Script also escapes formula-like text. Do it here as well so
// CKC's integration always supplies plain cell values, including optional tags.
function cellText(value) {
  const text = String(value ?? "");
  return /^[\s\u0000-\u001f]*[=+@-]/.test(text) ? `'${text}` : text;
}

function textValue(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function sitePage(value) {
  try {
    const url = new URL(textValue(value, 2000) || "/", SITE);
    if (url.origin !== SITE || !url.pathname.startsWith("/") || url.pathname.startsWith("//")) return SITE + "/";
    // Do not record arbitrary URL query strings, which can contain personal data.
    return SITE + url.pathname;
  } catch {
    return SITE + "/";
  }
}

function attributionFrom(value) {
  const input = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  let referringSite = "";
  try {
    const referrer = new URL(textValue(input.referringSite, 2000));
    if (["https:", "http:"].includes(referrer.protocol)) referringSite = referrer.origin;
  } catch { /* An absent or invalid referrer is normal. */ }
  const landingPage = sitePage(input.landingPage);
  const submissionPage = sitePage(input.submissionPage);
  const utmSource = textValue(input.utmSource, 200);
  const utmMedium = textValue(input.utmMedium, 200);
  const campaign = textValue(input.campaign, 300);
  const formLocation = textValue(input.formLocation, 100);
  return {
    leadSource: "CKC Woodworks Website",
    campaign,
    sourceMedium: utmSource ? `${utmSource} / ${utmMedium || "unknown"}` : "ckcwoodworks.com / website",
    firstSource: "CKC Woodworks Website",
    landingPage,
    referringSite,
    attributionDetails: [
      "Website: ckcwoodworks.com",
      `Submission page: ${submissionPage}`,
      formLocation ? `Form: ${formLocation}` : "",
      utmSource ? `UTM source: ${utmSource}` : "",
      utmMedium ? `UTM medium: ${utmMedium}` : "",
      campaign ? `Campaign: ${campaign}` : "",
    ].filter(Boolean).join("\n"),
  };
}

function emailPayload(lead, reference, sheetsFailed) {
  const title = sheetsFailed ? "Google Sheets save was not confirmed" : "New CKC project inquiry";
  const fields = [
    ["Name", lead.name], ["Email", lead.email], ["Phone", lead.phone || "Not provided"],
    ["Lead source", lead.attribution.leadSource], ["Campaign", lead.attribution.campaign || "Not provided"],
    ["Landing page", lead.attribution.landingPage], ["Project details", lead.message],
  ];
  const alert = sheetsFailed
    ? "Your original notification contains this lead. Check Web Forms before adding it manually: a lost receipt can occur after the row is saved."
    : "A project inquiry was submitted through ckcwoodworks.com. The spreadsheet is updated separately; this email is your copy of the lead.";
  return {
    // Use the existing verified sending domain; replies go to the prospective client.
    from: "CKC Woodworks <contact@mouldingstl.com>",
    to: NOTIFY_EMAILS,
    reply_to: lead.email,
    subject: `${sheetsFailed ? "[CHECK SHEETS] " : ""}CKC Project Inquiry — ${lead.name.replace(/[\r\n\u0000-\u001f]/g, " ")}`,
    text: `${title}\n\n${alert}\n\n${fields.map(([label, value]) => `${label}: ${value}`).join("\n\n")}\n\n${lead.attribution.attributionDetails}\n\nReference: ${reference}`,
    html: `<div style="max-width:640px;margin:0 auto;padding:32px;background:#F0E7D4;color:#292917;font-family:Arial,sans-serif;border-top:5px solid #A65D46">
      <p style="margin:0 0 12px;color:#A65D46;font-size:12px;letter-spacing:2px;text-transform:uppercase">CKC Woodworks</p>
      <h1 style="font-family:Georgia,serif;font-weight:normal;font-size:30px;margin:0 0 20px">${escapeHtml(title)}</h1>
      <p style="line-height:1.6;${sheetsFailed ? "padding:16px;border:2px solid #A65D46;" : ""}">${escapeHtml(alert)}</p>
      <table style="width:100%;border-collapse:collapse">${fields.map(([label, value]) => `<tr><th style="width:120px;padding:12px 12px 12px 0;text-align:left;vertical-align:top;border-bottom:1px solid #c7bca5;font-size:13px">${escapeHtml(label)}</th><td style="padding:12px 0;border-bottom:1px solid #c7bca5;white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.6">${escapeHtml(value)}</td></tr>`).join("")}</table>
      <p style="font-size:12px;line-height:1.7;white-space:pre-wrap">${escapeHtml(lead.attribution.attributionDetails)}</p>
      <p style="margin-top:24px;font-size:11px;color:#68624f">ckcwoodworks.com · Reference: ${escapeHtml(reference)}</p>
    </div>`,
  };
}

export function createContactDelivery({ fetch: fetcher = globalThis.fetch, env = process.env, logger = console } = {}) {
  async function sendNotification(lead, reference, sheetsFailed = false) {
    if (!env.RESEND_API) {
      logger.error("CKC email is not configured", { reference });
      return false;
    }
    const started = Date.now();
    try {
      const response = await fetcher("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.RESEND_API}`,
          "Content-Type": "application/json",
          "Idempotency-Key": `ckc-contact/${reference}/${sheetsFailed ? "sheets-alert" : "notification"}`,
        },
        body: JSON.stringify(emailPayload(lead, reference, sheetsFailed)),
        signal: AbortSignal.timeout(10000),
      });
      const receipt = await response.json().catch(() => null);
      const accepted = response.ok && typeof receipt?.id === "string" && receipt.id.length > 0;
      logger[accepted ? "info" : "error"]("CKC email receipt", { reference, accepted, sheetsFailed, status: response.status, durationMs: Date.now() - started });
      return accepted;
    } catch {
      logger.error("CKC email request failed or timed out", { reference, sheetsFailed, durationMs: Date.now() - started });
      return false;
    }
  }

  async function saveToSheets(lead, reference) {
    if (!env.GOOGLE_SHEETS_WEBAPP_URL) {
      logger.error("CKC spreadsheet is not configured", { reference });
      return false;
    }
    const started = Date.now();
    try {
      const data = { name: lead.name, email: lead.email, phone: lead.phone, message: lead.message, ...lead.attribution };
      const response = await fetcher(env.GOOGLE_SHEETS_WEBAPP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(Object.entries(data).map(([key, value]) => [key, cellText(value)]))),
        signal: AbortSignal.timeout(20000),
      });
      const receipt = await response.json().catch(() => null);
      const saved = response.ok && receipt?.status === "success";
      logger[saved ? "info" : "error"]("CKC spreadsheet receipt", { reference, saved, status: response.status, durationMs: Date.now() - started });
      return saved;
    } catch {
      logger.error("CKC spreadsheet request failed or timed out", { reference, durationMs: Date.now() - started });
      return false;
    }
  }

  return { sendNotification, saveToSheets };
}

export function createContactHandler({ sendNotification, saveToSheets, verifyRequest, waitUntil, logger = console, newReference = randomUUID }) {
  return async function contactHandler(req, res) {
    function respond(status, body) {
      res.statusCode = status;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.setHeader("Cache-Control", "no-store");
      res.end(JSON.stringify(body));
    }

    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      respond(405, { error: "Please submit the contact form." });
      return;
    }
    const origin = req.headers?.origin;
    if (origin) {
      try {
        const url = new URL(origin);
        if (url.host !== req.headers.host || !["https:", "http:"].includes(url.protocol)) throw new Error("Invalid origin");
      } catch {
        respond(403, { error: "Please submit the form from ckcwoodworks.com." });
        return;
      }
    }
    if (!String(req.headers?.["content-type"] || "").toLowerCase().startsWith("application/json")) {
      respond(415, { error: "Please submit a valid form." });
      return;
    }
    let body;
    try {
      if (Number(req.headers?.["content-length"] || 0) > MAX_BODY_BYTES) throw new Error("Oversize");
      // Vercel exposes a lazy getter that can itself throw on malformed JSON.
      const suppliedBody = req.body;
      if (typeof suppliedBody === "string") {
        if (Buffer.byteLength(suppliedBody) > MAX_BODY_BYTES) throw new Error("Oversize");
        body = JSON.parse(suppliedBody);
      } else {
        body = suppliedBody;
        if (Buffer.byteLength(JSON.stringify(body)) > MAX_BODY_BYTES) throw new Error("Oversize");
      }
      if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("Invalid body");
    } catch {
      respond(400, { error: "Please submit a valid form." });
      return;
    }

    if (typeof body.website === "string" && body.website.trim()) {
      // Quietly discard automated submissions that complete the hidden field.
      respond(200, { success: true });
      return;
    }
    if (body.website !== undefined && typeof body.website !== "string") {
      respond(400, { error: "Please submit a valid form." });
      return;
    }
    const { name, email, phone = "", message } = body;
    if (typeof name !== "string" || !name.trim() || typeof email !== "string" || !email.trim() ||
        typeof phone !== "string" || typeof message !== "string" || !message.trim()) {
      respond(400, { error: "Please include your name, email, and project details." });
      return;
    }
    if (name.length > 200 || email.length > 254 || phone.length > 100 || message.length > 10000) {
      respond(400, { error: "Please shorten your form entry and try again." });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || /[\r\n\u0000-\u001f]/.test(email)) {
      respond(400, { error: "Please provide a valid email address." });
      return;
    }

    const reference = newReference();
    let verification;
    try {
      if (typeof verifyRequest === "function") verification = await verifyRequest(req, reference);
    } catch {
      logger.error("CKC verification dependency failed", { reference, verified: false });
    }
    if (verification !== "human") {
      if (verification === "bot") {
        respond(403, { error: "We couldn’t verify your request. Please refresh the page and try again, or call 314-383-8222." });
      } else {
        logger.error("CKC contact verification unavailable", { reference, verified: false });
        respond(503, { error: "We couldn’t verify your request right now. Please try again or call 314-383-8222." });
      }
      return;
    }

    const lead = { name: name.trim(), email: email.trim(), phone: phone.trim(), message: message.trim(), attribution: attributionFrom(body.attribution) };
    const started = Date.now();
    const emailed = await sendNotification(lead, reference);
    if (emailed) {
      // Register the promise before ending the HTTP response. The microtask only
      // starts after respond() below; Vercel keeps it alive if the visitor leaves.
      waitUntil(Promise.resolve().then(async () => {
        // A lost receipt can hide a successful append: alert, never append twice.
        if (!await saveToSheets(lead, reference)) await sendNotification(lead, reference, true);
      }).catch(() => { logger.error("CKC background delivery failed", { reference }); }));
      respond(200, { success: true });
      logger.info("CKC contact accepted via email", { reference, durationMs: Date.now() - started });
      return;
    }

    // During an email outage, only acknowledge after confirming the backup copy.
    if (await saveToSheets(lead, reference)) {
      waitUntil(Promise.resolve().then(() => sendNotification(lead, reference))
        .catch(() => { logger.error("CKC fallback notification failed", { reference }); }));
      respond(200, { success: true });
      logger.info("CKC contact accepted via spreadsheet", { reference, durationMs: Date.now() - started });
      return;
    }
    respond(503, { error: "We couldn’t confirm your request. Please try again or call 314-383-8222." });
  };
}
