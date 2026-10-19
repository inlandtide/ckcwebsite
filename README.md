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

Run `pnpm test:seo` after building to check crawlable HTML, sitemap coverage, canonical URLs, structured-data image consistency, sharing-image sizes, and homepage image loading. The alternate `ckc.mouldingstl.com` hostname redirects permanently to the matching production path, preserving query strings. Sharing images use existing page photos with explicit dimensions, formats, and descriptive alternatives. Homepage gallery images load as visitors approach them, and the hero is prioritized. The existing Cormorant Garamond and Source Sans 3 fonts are self-hosted as unmodified Latin WOFF2 subsets, with licenses and source hashes in public/fonts. Critical font files are preloaded; no Google Fonts request is needed.

Run `pnpm test` for contact delivery and bot-verification regression tests. `pnpm check` includes the browser code and API handler.

## Navigation and gallery collections

The entire Services button opens its submenu on desktop and mobile; All Services opens the overview. Homepage cards use collection-specific gallery URLs. Gallery selection follows the query string, including direct visits and browser Back/Forward navigation. Retail Fixtures replaces Luxury Suites on the homepage, and Interiors opens Education.

## Contact delivery

The contact page and shared Start a Project section use the same accessible form. Name, email, and project details are required; phone is optional. The server validates input, rejects cross-origin browser submissions, and includes a hidden spam field.

Production forms use Vercel BotID Basic invisible verification. The browser initializes BotID before React hydration, and `vercel.json` provides the challenge/proxy routes for this Vite site. The API requires a human result before contacting either delivery destination. Bots receive 403; unavailable, timed-out, or unconfigured verification receives 503. Verification has an 8-second deadline, and the browser submission has a 45-second deadline with retained field values on failure. Basic is explicitly selected on both sides; no Deep Analysis subscription or CAPTCHA keys are needed. Development uses the SDK's local behavior, so production browser and unsigned-request checks are also required when changing this integration.

Configure `RESEND_API` and `GOOGLE_SHEETS_WEBAPP_URL` as server-only Vercel environment variables before enabling production submissions. The sample file contains names only; keep credentials out of Git and browser-prefixed variables.

`api/contact.ts` waits for a confirmed Resend email receipt, ends the visitor response successfully, then saves to Sheets using Vercel `waitUntil`. If the spreadsheet receipt is missing, the team receives a warning email; the append is never blindly retried. During an email outage, a confirmed spreadsheet save can accept the inquiry, followed by a background notification retry. If neither destination confirms receipt, the visitor receives an actionable error.

Notifications go to `tim@inlandtide.com` and `ryan@inlandtide.com`, with the visitor as Reply-To. The CKC sender uses the existing verified Moulding sending domain. Inquiries are labeled `CKC Woodworks Website` and use the existing spreadsheet receiver's A:L schema, preserving its Web Forms and CRM processing. Logs record reference IDs and delivery status without inquiry details.

## Analytics and assets

The existing CKC GA4 property `G-WLYT8DJC9P` is restored on the production domain. Google Analytics handles initial page views and its configured History API measurement; no contact field values are sent to Analytics.

Favicons derive from the existing CKC brand artwork. Official vector portfolio-logo sources are recorded in `public/media/portfolio-logo-sources.json`; monochrome display is applied by CSS.

## Responsive photos and shared footer

`pnpm images` generates WebP delivery variants (320–1920px, without enlarging or cropping) from the photo assets declared in `Site.tsx`. `dev`, `build`, and `check` run this step automatically. Generated files and the client manifest are ignored by Git and regenerated in the Vercel build. Sharp is pinned in the lockfile. `SiteImage` supplies `srcset`, contextual `sizes`, intrinsic dimensions, and lazy loading; page heroes remain eager. Original source photos, logos, and full-resolution lightbox images are preserved. Generated photo URLs include a content/configuration hash, and fonts include their source hash; both receive immutable caching.

The footer provides page and service navigation, the business address, phone, and the existing residential-division link. Shared and contact-page form callouts no longer show raw email links; the contact details cards retain email beside phone and address. The contact cards span their section, and the gallery uses the shared copper divider above the inquiry form.

## Technical SEO maintenance

The build generates `/llms.txt` from the same page descriptions and canonical URLs used by the site. It is a compact directory of existing content, not a crawler permission file. Valid pages link to it through `rel="describedby"`.

`seoPages[].lastModified` records the last material content or metadata change. Update it only when that page changes meaningfully, and keep `public/sitemap.xml` in sync for development. The initial dates reflect the shared footer/contact update in commit `055deb9` on October 19, 2026; builds do not refresh them automatically.

The About page and its Person structured data share `src/lib/team.ts`, so names and roles stay consistent. Only people already visible on About are described. Add business `sameAs` links only after confirming the exact CKC profile; do not substitute Moulding Saint Louis or similarly named companies.

`pnpm images` also reads intrinsic dimensions for all local images referenced in `Site.tsx`. Logos are delivered unchanged with width/height attributes. The lightbox retains its original full-resolution image URLs.
