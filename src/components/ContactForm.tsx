import { type FormEvent, useEffect, useId, useRef, useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import "./ContactForm.css";

type ContactFormProps = {
  variant?: "light" | "dark";
  formLocation?: string;
};

type Attribution = {
  landingPage: string;
  referringSite: string;
  utmSource: string;
  utmMedium: string;
  campaign: string;
};

const ATTRIBUTION_KEY = "ckc-contact-visit-v1";

function referrerOrigin(value: string): string {
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url.origin : "";
  } catch {
    return "";
  }
}

function visitAttribution(): Attribution {
  const params = new URLSearchParams(window.location.search);
  const current: Attribution = {
    landingPage: window.location.pathname,
    referringSite: referrerOrigin(document.referrer),
    utmSource: params.get("utm_source")?.slice(0, 200) || "",
    utmMedium: params.get("utm_medium")?.slice(0, 200) || "",
    campaign: params.get("utm_campaign")?.slice(0, 300) || "",
  };
  try {
    const saved = window.sessionStorage.getItem(ATTRIBUTION_KEY);
    if (saved) {
      const value: unknown = JSON.parse(saved);
      if (value && typeof value === "object" && Object.keys(current).every((key) => typeof (value as Record<string, unknown>)[key] === "string")) {
        const previous = value as Attribution;
        const sanitized: Attribution = {
          landingPage: previous.landingPage.split(/[?#]/, 1)[0].slice(0, 2000),
          referringSite: referrerOrigin(previous.referringSite),
          utmSource: previous.utmSource.slice(0, 200),
          utmMedium: previous.utmMedium.slice(0, 200),
          campaign: previous.campaign.slice(0, 300),
        };
        window.sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(sanitized));
        return sanitized;
      }
    }
    window.sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(current));
  } catch { /* Forms also work when browser storage is unavailable. */ }
  return current;
}

export default function ContactForm({ variant = "light", formLocation = "website" }: ContactFormProps) {
  const id = useId();
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const submitting = useRef(false);
  const visit = useRef<Attribution | null>(null);
  const confirmation = useRef<HTMLDivElement>(null);
  const errorNotice = useRef<HTMLParagraphElement>(null);

  useEffect(() => { visit.current = visitAttribution(); }, []);
  useEffect(() => {
    if (state === "success") confirmation.current?.focus();
    if (state === "error") errorNotice.current?.focus();
  }, [state]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    setState("submitting");
    setError("");
    const form = event.currentTarget;
    const values = new FormData(form);
    const field = (name: string) => String(values.get(name) || "").trim();
    const controller = new AbortController();
    let requestTimer: ReturnType<typeof setTimeout> | undefined;
    try {
      // Bound the whole fetch, including BotID's wait for a browser challenge.
      const response = await Promise.race([
        new Promise<Response>((_, reject) => {
          requestTimer = setTimeout(() => {
            controller.abort();
            reject(new DOMException("Request timed out", "TimeoutError"));
          }, 45000);
        }),
        fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: field("name"), email: field("email"), phone: field("phone"), message: field("message"), website: field("website"),
            attribution: { ...(visit.current || visitAttribution()), submissionPage: window.location.pathname, formLocation },
          }),
          keepalive: true,
          signal: controller.signal,
        }),
      ]);
      if (response.status === 429) {
        throw new Error("We’ve received several requests. Please wait a few minutes and try again, or call 314-383-8222.");
      }
      const receipt: unknown = await response.json().catch(() => null);
      if (!response.ok || !receipt || typeof receipt !== "object" || !("success" in receipt) || receipt.success !== true) {
        const fallback = response.status === 403
          ? "We couldn’t verify your request. Please refresh the page and try again, or call 314-383-8222."
          : "We couldn’t confirm your request. Please try again or call 314-383-8222.";
        const message = receipt && typeof receipt === "object" && "error" in receipt && typeof receipt.error === "string" ? receipt.error : fallback;
        throw new Error(message);
      }
      form.reset();
      setState("success");
    } catch (failure) {
      setError(failure instanceof Error && failure.name === "Error" ? failure.message : "We couldn’t confirm your request. Please check your connection and try again, or call 314-383-8222.");
      setState("error");
    } finally {
      clearTimeout(requestTimer);
      submitting.current = false;
    }
  }

  return (
    <div className={`contact-form contact-form--${variant}`}>
      {state === "success" ? (
        <div className="contact-form__confirmation" role="status" tabIndex={-1} ref={confirmation}>
          <Check aria-hidden="true" />
          <p className="contact-form__success-title">Message received.</p>
          <p>Thank you for reaching out. Our team will review your project details and follow up with you.</p>
          <button type="button" onClick={() => setState("idle")} className="contact-form__again">Send another message <ArrowUpRight aria-hidden="true" /></button>
        </div>
      ) : (
        <form method="post" action="/api/contact" onSubmit={submit} aria-busy={state === "submitting"} aria-label="Project inquiry" className="contact-form__fields">
          <div className="contact-form__row">
            <label htmlFor={`${id}-name`}>
              <span>Full name <span aria-hidden="true">*</span></span>
              <input id={`${id}-name`} name="name" autoComplete="name" required maxLength={200} placeholder="Your name" />
            </label>
            <label htmlFor={`${id}-email`}>
              <span>Email address <span aria-hidden="true">*</span></span>
              <input id={`${id}-email`} name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@company.com" />
            </label>
          </div>
          <label htmlFor={`${id}-phone`}>
            <span>Phone <span className="contact-form__optional">(optional)</span></span>
            <input id={`${id}-phone`} name="phone" type="tel" autoComplete="tel" maxLength={100} placeholder="Your phone number" />
          </label>
          <label htmlFor={`${id}-message`}>
            <span>Project details <span aria-hidden="true">*</span></span>
            <textarea id={`${id}-message`} name="message" required maxLength={10000} rows={4} placeholder="Tell us about your project, scope, and timeline." />
          </label>
          <div className="contact-form__honeypot" aria-hidden="true">
            <label htmlFor={`${id}-website`}>Leave this field empty</label>
            <input id={`${id}-website`} name="website" tabIndex={-1} autoComplete="off" />
          </div>
          <p className="contact-form__required">* Required fields</p>
          {state === "error" && <p className="contact-form__error" role="alert" tabIndex={-1} ref={errorNotice}>{error}</p>}
          <button type="submit" disabled={state === "submitting"} className="contact-form__submit">
            {state === "submitting" ? "Sending…" : "Send project inquiry"}<ArrowUpRight aria-hidden="true" />
          </button>
        </form>
      )}
    </div>
  );
}
