# CKC Woodworks

Marketing website for CKC Woodworks, a St. Louis commercial millwork and cabinetry shop.

## Local development

```bash
pnpm install
pnpm dev
```

## Validation and production build

```bash
pnpm check
pnpm build
```

The site is configured for Vercel. The build renders all 14 pages to HTML with unique metadata, canonical URLs, Open Graph/Twitter previews, and JSON-LD for the business, website, pages, services, and breadcrumbs. Client navigation updates the same metadata. `vercel.json` serves clean URLs and a real 404 for unknown routes; `public/robots.txt` permits crawling and links to the production sitemap.

Run `pnpm test` for contact delivery regression tests. `pnpm check` includes the browser code and API handler.

## Contact delivery

The contact page and shared Start a Project section use the same accessible form. Name, email, and project details are required; phone is optional. The server validates input, rejects cross-origin browser submissions, and includes a hidden spam field.

Configure `RESEND_API` and `GOOGLE_SHEETS_WEBAPP_URL` as server-only Vercel environment variables before enabling production submissions. The sample file contains names only; keep credentials out of Git and browser-prefixed variables.

`api/contact.ts` waits for a confirmed Resend email receipt, ends the visitor response successfully, then saves to Sheets using Vercel `waitUntil`. If the spreadsheet receipt is missing, the team receives a warning email; the append is never blindly retried. During an email outage, a confirmed spreadsheet save can accept the inquiry, followed by a background notification retry. If neither destination confirms receipt, the visitor receives an actionable error.

Notifications go to `tim@inlandtide.com` and `ryan@inlandtide.com`, with the visitor as Reply-To. The CKC sender uses the existing verified Moulding sending domain. Inquiries are labeled `CKC Woodworks Website` and use the existing spreadsheet receiver's A:L schema, preserving its Web Forms and CRM processing. Logs record reference IDs and delivery status without inquiry details.

## Analytics and assets

The existing CKC GA4 property `G-WLYT8DJC9P` is restored on the production domain. Google Analytics handles initial page views and its configured History API measurement; no contact field values are sent to Analytics.

Favicons derive from the existing CKC brand artwork. Official vector portfolio-logo sources are recorded in `public/media/portfolio-logo-sources.json`; monochrome display is applied by CSS.
