import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { createServer } from "vite";

// Use the actual React page components so search engines and visitors receive
// the same content even before JavaScript runs.
const server = await createServer({ server: { middlewareMode: true }, appType: "custom" });
try {
  const { render, renderSeoHead, seoPages, SITE_ORIGIN } = await server.ssrLoadModule("/src/entry-server.tsx");
  const template = await readFile(resolve("dist/index.html"), "utf8");
  const seoMarker = /<!--seo-start-->[\s\S]*?<!--seo-end-->/;
  if (!seoMarker.test(template) || !template.includes('<div id="root"></div>')) {
    throw new Error("Prerender requires the SEO markers and an empty root in the built HTML template.");
  }

  for (const path of [...seoPages.map((page) => page.path), "/404"]) {
    const html = template
      .replace(seoMarker, () => renderSeoHead(path))
      .replace('<div id="root"></div>', () => `<div id="root">${render(path)}</div>`);
    const destination = resolve("dist", path === "/" ? "index.html" : `${path.slice(1)}.html`);
    await mkdir(dirname(destination), { recursive: true });
    await writeFile(destination, html);
  }

  const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + seoPages.map((page) => `  <url><loc>${SITE_ORIGIN}${page.path}</loc><lastmod>${page.lastModified}</lastmod></url>`).join("\n")
    + "\n</urlset>\n";
  await writeFile(resolve("dist/sitemap.xml"), sitemap);
  const pageLink = (page) => `- [${page.name}](${SITE_ORIGIN}${page.path}): ${page.description}`;
  const llms = [
    "# CKC Woodworks",
    "",
    `> ${seoPages[0].description}`,
    "",
    "## Company and contact",
    ...seoPages.filter((page) => ["/", "/about", "/contact"].includes(page.path)).map(pageLink),
    "",
    "## Commercial woodwork services",
    ...seoPages.filter((page) => page.path === "/services" || page.service).map(pageLink),
    "",
    "## Project examples",
    ...seoPages.filter((page) => ["/portfolio", "/gallery"].includes(page.path)).map(pageLink),
    "",
    "## Optional",
    ...seoPages.filter((page) => page.path === "/careers").map(pageLink),
    "",
  ].join("\n");
  await writeFile(resolve("dist/llms.txt"), llms);

  console.log(`Prerendered ${seoPages.length} indexable pages and a noindex 404 page.`);
} finally {
  await server.close();
}
