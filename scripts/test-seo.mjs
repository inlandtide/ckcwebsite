import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { after, test } from "node:test";
import { createServer } from "vite";

// Exercise the built HTML that crawlers actually receive, not just JS helpers.
// Run after pnpm build.
const server = await createServer({ server: { middlewareMode: true }, appType: "custom" });
after(() => server.close());
const { seoPages, renderSeoHead, SITE_ORIGIN } = await server.ssrLoadModule("/src/lib/seo.ts");
const readPage = (path) => readFile(`dist/${path === "/" ? "index" : path.slice(1)}.html`, "utf8");
const meta = (html, name) => html.match(new RegExp(`(?:name|property)="${name}" content="([^"]+)"`))?.[1];
const graph = (html) => JSON.parse(html.match(/<script data-seo type="application\/ld\+json">(.*?)<\/script>/s)[1])["@graph"];

test("every sitemap page serves unique, indexable metadata and prerendered content", async () => {
  const sitemap = await readFile("dist/sitemap.xml", "utf8");
  assert.deepEqual([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]), seoPages.map((page) => SITE_ORIGIN + page.path));
  const titles = new Set();
  const descriptions = new Set();
  for (const page of seoPages) {
    const html = await readPage(page.path);
    assert.equal((html.match(/<title\b/g) ?? []).length, 1, page.path);
    assert.equal((html.match(/rel="canonical"/g) ?? []).length, 1, page.path);
    assert.ok(html.includes(`rel="canonical" href="${SITE_ORIGIN}${page.path}"`), page.path);
    assert.match(meta(html, "robots"), /^index, follow/);
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1, page.path);
    assert.match(html, /<main\b/);
    titles.add(html.match(/<title[^>]*>(.*?)<\/title>/)[1]);
    descriptions.add(meta(html, "description"));
  }
  assert.equal(titles.size, seoPages.length);
  assert.equal(descriptions.size, seoPages.length);
});

test("social images exist, stay below 1 MB, and agree with page and service structured data", async () => {
  for (const page of seoPages) {
    const html = await readPage(page.path);
    const imageUrl = meta(html, "og:image");
    const image = new URL(imageUrl);
    assert.equal(image.origin, SITE_ORIGIN);
    assert.ok((await stat(`public${image.pathname}`)).size < 1_000_000, page.path);
    assert.equal(meta(html, "twitter:image"), imageUrl);
    assert.equal(meta(html, "twitter:image:alt"), meta(html, "og:image:alt"));
    const nodes = graph(html);
    const webpage = nodes.find((node) => node["@id"] === `${SITE_ORIGIN}${page.path}#webpage`);
    assert.equal(webpage.primaryImageOfPage.url, imageUrl);
    assert.equal(webpage.primaryImageOfPage.width, Number(meta(html, "og:image:width")));
    assert.equal(webpage.primaryImageOfPage.height, Number(meta(html, "og:image:height")));
    assert.equal(webpage.primaryImageOfPage.encodingFormat, meta(html, "og:image:type"));
    if (page.service) {
      const service = nodes.find((node) => node["@type"] === "Service");
      assert.equal(service.image.url, imageUrl);
      assert.equal(webpage.mainEntity["@id"], service["@id"]);
      assert.equal(service.provider["@id"], `${SITE_ORIGIN}/#business`);
    }
    const breadcrumbs = nodes.find((node) => node["@type"] === "BreadcrumbList");
    if (page.path !== "/") {
      assert.equal(breadcrumbs.itemListElement.at(-1).item, SITE_ORIGIN + page.path);
      assert.equal(webpage.breadcrumb["@id"], breadcrumbs["@id"]);
    }
  }
});

test("query and slash variants retain the canonical page; missing routes stay noindex", async () => {
  for (const page of seoPages) {
    assert.equal(renderSeoHead(`${page.path === "/" ? "" : page.path}/?utm_source=test#section`), renderSeoHead(page.path));
  }
  const missing = await readPage("/404");
  assert.equal(meta(missing, "robots"), "noindex, follow");
  assert.ok(!missing.includes('rel="canonical"'));
});

test("the duplicate-domain redirect is permanent, host-scoped, and keeps the requested path", async () => {
  const config = JSON.parse(await readFile("vercel.json", "utf8"));
  const redirect = config.redirects.find((rule) => rule.has?.some((condition) => condition.type === "host"));
  assert.equal(redirect.permanent, true);
  assert.equal(redirect.source, "/:path*");
  assert.equal(redirect.destination, `${SITE_ORIGIN}/:path*`);
  const host = new RegExp(`^(?:${redirect.has[0].value})$`);
  assert.ok(host.test("ckc.mouldingstl.com"));
  assert.ok(!host.test("ckcwoodworks.com"));
  assert.ok(!host.test("preview.vercel.app"));
});

test("homepage prioritizes the hero and defers gallery downloads; fonts are discoverable from HTML", async () => {
  const html = await readPage("/");
  const images = [...html.matchAll(/<img\b[^>]*>/g)].map((match) => match[0]);
  const hero = images.find((image) => image.includes('class="home-hero__image"'));
  assert.match(hero, /fetchPriority="high"/);
  assert.ok(!hero.includes('loading="lazy"'));
  assert.match(html, /rel="preload" as="image" imageSrcSet="\/media\/responsive\/ckc-home-hero/);
  for (const image of images.filter((image) => !image.includes('alt="CKC Woodworks"') && image !== hero)) {
    assert.match(image, /loading="lazy"/);
  }
  assert.ok(!html.includes('rel="preload" as="image" href="/media/commercial-environments-hero-original'));
  assert.match(html, /rel="preload" href="\/fonts\/source-sans-3-normal-[^"]+" as="font"/);
  assert.ok(!html.includes("fonts.googleapis.com"));
  assert.ok(!html.includes("fonts.gstatic.com"));
});

test("responsive variants preserve photo proportions and offer small mobile downloads", async () => {
  const { default: sharp } = await import("sharp");
  const manifest = JSON.parse(await readFile("src/lib/generated-images.json", "utf8"));
  for (const [source, photo] of Object.entries(manifest)) {
    assert.ok(!/logo|certification/i.test(source), source);
    for (const variant of photo.variants) {
      const metadata = await sharp(`dist${variant.src}`).metadata();
      assert.equal(metadata.format, "webp");
      assert.equal(metadata.width, variant.width);
      assert.ok(Math.abs(metadata.height - variant.width * photo.height / photo.width) <= 1, source);
      assert.ok(metadata.width <= photo.width, source);
    }
  }
  const largePng = manifest["/media/commercial-environments-hero-original_086df75f.png"];
  assert.ok(largePng.variants.find((variant) => variant.width === 640).bytes < 100_000);
});


test("people structured data describes the existing About team only", async () => {
  const html = await readPage("/about");
  const nodes = graph(html);
  const people = nodes.filter((node) => node["@type"] === "Person");
  const team = html.match(/<section class="team-section[\s\S]*?<\/section><\/div><\/section>/)?.[0];
  assert.ok(team, "The visible team section must exist");
  assert.equal(people.length, (team.match(/class="team-card"/g) ?? []).length);
  assert.equal(new Set(people.map((person) => person["@id"])).size, people.length);
  for (const person of people) {
    assert.ok(team.includes(person.name), person.name);
    assert.ok(team.includes(person.jobTitle), person.name);
    assert.equal(person.worksFor["@id"], `${SITE_ORIGIN}/#business`);
  }
  for (const page of seoPages.filter((page) => page.path !== "/about")) {
    assert.ok(!graph(await readPage(page.path)).some((node) => node["@type"] === "Person"));
  }
});

test("every rendered image has dimensions matching its original asset or responsive photo", async () => {
  const { default: sharp } = await import("sharp");
  const cache = new Map();
  for (const page of seoPages) {
    const html = await readPage(page.path);
    for (const [image] of html.matchAll(/<img\b[^>]*>/g)) {
      const src = image.match(/\bsrc="([^"]+)"/)[1];
      const width = Number(image.match(/\bwidth="([^"]+)"/)?.[1]);
      const height = Number(image.match(/\bheight="([^"]+)"/)?.[1]);
      assert.ok(width > 0 && height > 0, `${page.path}: ${src}`);
      if (!cache.has(src)) cache.set(src, await sharp(`dist${src}`).metadata());
      const actual = cache.get(src);
      assert.ok(Math.abs(width / height - actual.width / actual.height) < .01, src);
    }
  }
});

test("AI directory links resolve to canonical pages and sitemap dates match tracked updates", async () => {
  const llms = await readFile("dist/llms.txt", "utf8");
  assert.ok(llms.startsWith("# CKC Woodworks\n\n> "));
  const links = [...llms.matchAll(/^- \[[^\]]+\]\((https:[^)]+)\): /gm)].map((match) => match[1]);
  assert.deepEqual(links.toSorted(), seoPages.map((page) => SITE_ORIGIN + page.path).toSorted());
  const sitemap = await readFile("dist/sitemap.xml", "utf8");
  assert.equal(sitemap.trim(), (await readFile("public/sitemap.xml", "utf8")).replace(/\r\n/g, "\n").trim());
  for (const page of seoPages) {
    assert.match(page.lastModified, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(Date.parse(page.lastModified) <= Date.now());
    assert.ok(sitemap.includes(`<loc>${SITE_ORIGIN}${page.path}</loc><lastmod>${page.lastModified}</lastmod>`));
    assert.ok((await readPage(page.path)).includes(`rel="describedby" href="${SITE_ORIGIN}/llms.txt"`));
  }
});
