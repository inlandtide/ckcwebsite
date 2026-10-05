# CKC Website

Welcome to the repository for the CKC website. This project provides a responsive coming-soon page for `ckcwoodworks.com` while the full website is being developed. The page introduces the upcoming online experience, keeps CKC's contact information available, and links to the new residential division, Moulding Saint Louis.

## Instructions for AI Agents & Developers

**Update the changelog before every push.** Before committing and pushing any change, add a dated summary to `CHANGELOG.md`. This preserves a concise, human-readable project history.

**Commit all site images directly to this repository.** Do not use an external CDN for production site images. Store image files under `/public` and commit them to GitHub so Vercel serves version-controlled assets directly.

## Architecture & Infrastructure

This project uses the same core stack and deployment conventions as the existing Moulding Saint Louis website.

| Area | Implementation |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org/) with the App Router |
| Language | TypeScript |
| Styling | Tailwind CSS v4 with global CSS variables in `app/globals.css` |
| Fonts | Cormorant Garamond for headlines and Zilla Slab for supporting text |
| Package manager | pnpm |
| Hosting | [Vercel](https://vercel.com/) |
| Deployment | Pushes to the `main` branch trigger Vercel deployment |
| Production domain | `ckcwoodworks.com` (`www.ckcwoodworks.com` redirects to the non-www domain) |
| Additional domains | `ckc.mouldingstl.com`, `ckcwebsite.vercel.app` |

## Current Site State

The temporary page uses the established serif fonts with an ivory, navy, brass, and sage palette. It includes a photograph of the CKC Woodworks shop, the upcoming website announcement, accessible phone and email links, a Google Maps address link, and a feature for [Moulding Saint Louis](https://mouldingstl.com/) using its official navy-and-gold logo. Both images are stored in `public/images/` and rendered with Next.js image optimization. The shop photograph comes from the [Moulding Saint Louis gallery](https://mouldingstl.com/gallery). All page content renders as a static server component. Google Analytics loads after hydration through the shared root layout.

## SEO & Search Visibility

The owner requested indexing of the existing page on October 4, 2026, so CKC can remain discoverable while the full site is developed. The page is now crawlable and indexable. Its visible content is unchanged; the search description accurately notes that the new website is being built.

| Control | Location | Purpose |
| --- | --- | --- |
| Search and social metadata | `app/layout.tsx` | Supplies a business-focused title and description, canonical URL, index/follow directives, and Open Graph and Twitter previews using the existing shop photo. |
| Shared SEO data | `app/data/seo.ts` | Defines the production origin and confirmed LocalBusiness and WebSite JSON-LD, including contact details and the Moulding Saint Louis relationship. |
| Robots endpoint | `app/robots.ts` | Allows crawling and points to the canonical sitemap. |
| Sitemap | `app/sitemap.ts` | Includes only the published canonical homepage at `https://ckcwoodworks.com/`. |

The `ckcwoodworks.com` Domain property is verified in Google Search Console. Use that property for sitemap submissions and URL inspection. DNS ownership verification is managed outside this repository.

When the full site launches:

- Add each published canonical page to `app/sitemap.ts`; keep preview, private, error, and noindex pages out of the sitemap.
- Give each page its own title, description, canonical URL, and social metadata. Replace the temporary homepage description with the finished site's description.
- Add service and project structured data only for information shown on the corresponding visible pages. Do not invent reviews, ratings, business hours, or contact details.
- Add sitemap `lastModified` values only when accurate substantive content edit dates are available; a new build is not a content update.
- Resubmit the sitemap and inspect the new priority URLs in Search Console. Keep staging and preview deployments out of search.

## Project Structure

| Path | Purpose |
| --- | --- |
| `app/page.tsx` | Coming-soon announcement, contact details, shop photograph, and residential division feature. |
| `app/layout.tsx` | Root document, shared fonts, search and social metadata, Analytics, and JSON-LD. |
| `app/data/seo.ts` | Shared SEO configuration and structured data. |
| `app/globals.css` | Tailwind import, visual variables, responsive layout, image presentation, and accessibility styles. |
| `app/robots.ts` | Generated crawler permissions and sitemap location. |
| `app/sitemap.ts` | Canonical published-page sitemap. |
| `public/images/` | Version-controlled CKC shop photograph and official Moulding Saint Louis logo. |

## Analytics

Google Analytics 4 uses measurement ID `G-WLYT8DJC9P`. The shared root layout (`app/layout.tsx`) includes the official `GoogleAnalytics` component from `@next/third-parties/google`, which loads Google's tag after hydration and initializes page-view tracking across the site. The measurement ID is public configuration and requires no environment variable.

## Environment Variables

The current placeholder page requires **no environment variables**. Any future secret or third-party integration must be configured in Vercel and documented here before deployment.

## Getting Started Locally

```bash
git clone https://github.com/inlandtide/ckcwebsite.git
cd ckcwebsite
pnpm install
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Available Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the local development server. |
| `pnpm lint` | Run ESLint checks. |
| `pnpm build` | Create the production build used by Vercel. |
| `pnpm start` | Run the production build locally. |

---

*Document prepared for future development context.*
