import { randomUUID, createHash } from "node:crypto";

const NOTIFY_EMAILS = ["tim@inlandtide.com", "ryan@inlandtide.com"];
const SITE = "https://ckcwoodworks.com";
const MAX_BODY_BYTES = 65536;

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
  })[character]);
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

function emailPayload(lead, reference, crmFailed) {
  const title = crmFailed ? "CRM save was not confirmed" : "New CKC project inquiry";
  const fields = [
    ["Name", lead.name], ["Email", lead.email], ["Phone", lead.phone || "Not provided"],
    ["Lead source", lead.attribution.leadSource], ["Campaign", lead.attribution.campaign || "Not provided"],
    ["Landing page", lead.attribution.landingPage], ["Project details", lead.message],
  ];
  const alert = crmFailed
    ? "Your original notification contains this lead. The CRM save could not be confirmed after retries. This email contains the full inquiry and its reference. Check Form Submission Archives before adding it manually."
    : "A project inquiry was submitted through ckcwoodworks.com. The CRM is updated in the background; this email is your copy of the lead.";
  return {
    // Use the existing verified sending domain; replies go to the prospective client.
    from: "CKC Woodworks <contact@mouldingstl.com>",
    to: NOTIFY_EMAILS,
    reply_to: lead.email,
    subject: `${crmFailed ? "[CHECK CRM] " : ""}CKC Project Inquiry — ${lead.name.replace(/[\r\n\u0000-\u001f]/g, " ")}`,
    text: `${title}\n\n${alert}\n\n${fields.map(([label, value]) => `${label}: ${value}`).join("\n\n")}\n\n${lead.attribution.attributionDetails}\n\nReference: ${reference}`,
    html: `<div style="max-width:640px;margin:0 auto;padding:32px;background:#F0E7D4;color:#292917;font-family:Arial,sans-serif;border-top:5px solid #A65D46">
      <p style="margin:0 0 12px;color:#A65D46;font-size:12px;letter-spacing:2px;text-transform:uppercase">CKC Woodworks</p>
      <h1 style="font-family:Georgia,serif;font-weight:normal;font-size:30px;margin:0 0 20px">${escapeHtml(title)}</h1>
      <p style="line-height:1.6;${crmFailed ? "padding:16px;border:2px solid #A65D46;" : ""}">${escapeHtml(alert)}</p>
      <table style="width:100%;border-collapse:collapse">${fields.map(([label, value]) => `<tr><th style="width:120px;padding:12px 12px 12px 0;text-align:left;vertical-align:top;border-bottom:1px solid #c7bca5;font-size:13px">${escapeHtml(label)}</th><td style="padding:12px 0;border-bottom:1px solid #c7bca5;white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.6">${escapeHtml(value)}</td></tr>`).join("")}</table>
      <p style="font-size:12px;line-height:1.7;white-space:pre-wrap">${escapeHtml(lead.attribution.attributionDetails)}</p>
      <p style="margin-top:24px;font-size:11px;color:#68624f">ckcwoodworks.com · Reference: ${escapeHtml(reference)}</p>
    </div>`,
  };
}


// Profile-aware delivery retains a durable original before acknowledging. During
// a CRM outage the independent email service remains an emergency lead copy.
async function sendProfileNotification(lead, reference, crmFailed, mail, fetcher, env, logger) {
  if (env.CRM_NOTIFICATION_PREFERENCES !== "true") return null;
  const event = crmFailed ? "crm-alert" : "notification";
  const payload = { externalId: reference, name: lead.name, email: lead.email, phone: lead.phone,
    message: lead.message, campaign: lead.attribution.campaign, sourceLabel: lead.attribution.leadSource, attribution: lead.attribution };
  try {
    const response = await fetcher("https://crm.ckcwoodworks.com/api/intake/website_ckc/notify", {
      method: "POST", headers: { "Content-Type": "application/json", "x-crm-key": env.CRM_INGEST_SECRET || "" },
      body: JSON.stringify({ reference, crmFailed, lead: payload, mail }), signal: AbortSignal.timeout(25000), redirect: "error",
    });
    const receipt = await response.json().catch(() => null);
    if (response.ok && receipt?.accepted === true && receipt?.integration === "crm_notification_preferences_v1") return true;
    // An identity conflict must never send different content under the same key.
    if (response.status === 409) return false;
  } catch { /* Fall through to independent email; never log contact details. */ }
  logger.error("CRM notification broker unavailable; using emergency email", { reference, crmFailed });
  if (!env.RESEND_API) return false;
  const results = await Promise.all(NOTIFY_EMAILS.map(async recipient => {
    try {
      const id = createHash("sha256").update(`website-notice:website_ckc:${reference}:${event}:${recipient}`).digest("hex");
      const response = await fetcher("https://api.resend.com/emails", {
        method: "POST", headers: { Authorization: `Bearer ${env.RESEND_API}`, "Content-Type": "application/json", "Idempotency-Key": "ckc-crm-" + id },
        body: JSON.stringify({ ...mail, to: [recipient], text: mail.text || lead.message }), signal: AbortSignal.timeout(10000),
      });
      const receipt = await response.json().catch(() => null);
      return response.ok && typeof receipt?.id === "string" && receipt.id.length > 0;
    } catch { return false; }
  }));
  return results.every(Boolean);
}

export function createContactDelivery({ fetch: fetcher = globalThis.fetch, env = process.env, logger = console } = {}) {
  async function sendNotification(lead, reference, crmFailed = false) {
    const profileResult = await sendProfileNotification(lead, reference, crmFailed, emailPayload(lead, reference, crmFailed), fetcher, env, logger);
    if (profileResult !== null) return profileResult;
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
          "Idempotency-Key": `ckc-contact/${reference}/${crmFailed ? "crm-alert" : "notification"}`,
        },
        body: JSON.stringify(emailPayload(lead, reference, crmFailed)),
        signal: AbortSignal.timeout(10000),
      });
      const receipt = await response.json().catch(() => null);
      const accepted = response.ok && typeof receipt?.id === "string" && receipt.id.length > 0;
      logger[accepted ? "info" : "error"]("CKC email receipt", { reference, accepted, crmFailed, status: response.status, durationMs: Date.now() - started });
      return accepted;
    } catch {
      logger.error("CKC email request failed or timed out", { reference, crmFailed, durationMs: Date.now() - started });
      return false;
    }
  }

  async function saveToCRM(lead, reference) {
    const key = env.CRM_INGEST_SECRET;
    if (!key) { logger.error('CRM delivery is not configured', { reference }); return false; }
    const payload = {
      externalId: reference, name: lead.name, email: lead.email, phone: lead.phone,
      message: lead.message, campaign: lead.attribution.campaign,
      sourceLabel: lead.attribution.leadSource, attribution: lead.attribution,
    };
    // A lost response may follow a committed save. Every retry keeps the same ID
    // and content; the CRM acknowledges that receipt without creating another lead.
    for (let attempt = 1; attempt <= 3; attempt++) {
      const started = Date.now();
      try {
        const response = await fetcher('https://crm.ckcwoodworks.com/api/intake/website_ckc', {
          method: 'POST', headers: { 'Content-Type': 'application/json', 'x-crm-key': key },
          body: JSON.stringify(payload), signal: AbortSignal.timeout(8000), redirect: 'error',
        });
        const receipt = await response.json().catch(() => null);
        const saved = response.ok && receipt?.status === 'success' && receipt?.integration === 'crm_intake_v1' && typeof receipt?.id === 'string';
        logger[saved ? 'info' : 'error']('CRM delivery receipt', { reference, saved, attempt, status: response.status, durationMs: Date.now() - started });
        if (saved) return true;
        if (response.status >= 400 && response.status < 500 && ![408, 429].includes(response.status)) return false;
      } catch { logger.error('CRM delivery request failed or timed out', { reference, attempt }); }
    }
    return false;
  }

  return { sendNotification, saveToCRM };
}

export function createContactHandler({ sendNotification, saveToCRM, verifyRequest, waitUntil, logger = console, newReference = randomUUID }) {
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

    if (body.submissionId !== undefined && (typeof body.submissionId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.submissionId))) {
      respond(400, { error: 'Please submit a valid form.' }); return;
    }
    const reference = body.submissionId || newReference();
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
        // Retries keep one CRM identity; warn only after bounded retries fail.
        if (!await saveToCRM(lead, reference)) await sendNotification(lead, reference, true);
      }).catch(() => { logger.error("CKC background delivery failed", { reference }); }));
      respond(200, { success: true });
      logger.info("CKC contact accepted via email", { reference, durationMs: Date.now() - started });
      return;
    }

    // During an email outage, only acknowledge after confirming the backup copy.
    if (await saveToCRM(lead, reference)) {
      waitUntil(Promise.resolve().then(() => sendNotification(lead, reference))
        .catch(() => { logger.error("CKC fallback notification failed", { reference }); }));
      respond(200, { success: true });
      logger.info("CKC contact accepted via CRM", { reference, durationMs: Date.now() - started });
      return;
    }
    respond(503, { error: "We couldn’t confirm your request. Please try again or call 314-383-8222." });
  };
}
