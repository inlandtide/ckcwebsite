# CKC Website

Welcome to the repository for the CKC website. This project currently provides a temporary **Coming Soon!** page for `ckc.mouldingstl.com` while the full website is being developed.

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
| Production domain | `ckc.mouldingstl.com` |

## Current Site State

The current site intentionally renders only **Coming Soon!**. The temporary page uses the established Moulding Saint Louis visual palette and responsive presentation while avoiding premature brand, service, or contact content.

## Search Visibility Controls

This is a private testing placeholder and must remain excluded from search indexing.

| Control | Location | Purpose |
| --- | --- | --- |
| Page metadata | `app/layout.tsx` | Sends `noindex, nofollow` directives to standard crawlers and Googlebot. |
| Robots endpoint | `app/robots.ts` | Serves a `robots.txt` policy that disallows all crawling. |

Do not remove or relax these protections until the production CKC site is ready for public search visibility.

## Project Structure

| Path | Purpose |
| --- | --- |
| `app/page.tsx` | Single-message Coming Soon page. |
| `app/layout.tsx` | Root document, shared fonts, metadata, and no-index directives. |
| `app/globals.css` | Tailwind import, visual variables, and responsive placeholder styling. |
| `app/robots.ts` | Generated robots policy that blocks crawling. |
| `public/` | Version-controlled static assets for future use. |

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
