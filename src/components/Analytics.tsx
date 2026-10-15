import { useEffect } from "react";

const MEASUREMENT_ID = "G-WLYT8DJC9P";
const SCRIPT_ID = "ckc-google-analytics";

type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

export default function Analytics() {
  useEffect(() => {
    // Keep local development and deployment previews out of the live property.
    if (!["ckcwoodworks.com", "www.ckcwoodworks.com"].includes(window.location.hostname)) return;
    if (document.getElementById(SCRIPT_ID)) return;

    const analytics = window as AnalyticsWindow;
    analytics.dataLayer ??= [];
    analytics.gtag ??= function () {
      analytics.dataLayer!.push(arguments);
    };
    analytics.gtag("js", new Date());
    analytics.gtag("config", MEASUREMENT_ID);

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // GA4 Enhanced Measurement handles wouter's History API navigation. Do not
    // also send manual page_view events, which would double-count those visits.
    // No names, email addresses, phone numbers, or inquiry fields are forwarded.
  }, []);

  return null;
}
