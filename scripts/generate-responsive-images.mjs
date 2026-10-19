import { createHash } from "node:crypto";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { basename, extname } from "node:path";
import sharp from "sharp";

// Generate delivery variants without changing or cropping the source artwork.
// Only the site's photo assets qualify; logos and certification marks stay intact.
const source = await readFile("src/pages/Site.tsx", "utf8");
const assets = source.match(/const assets = \{([\s\S]*?)\n\};/)[1];
const photos = [...new Set([...assets.matchAll(/\s+(\w+): "(\/media\/[^"\n]+\.(?:jpg|jpeg|png|webp))"/g)]
  .filter(([, key]) => !/logo|certification/i.test(key)).map(([, , path]) => path))];
const directory = "public/media/responsive";
await mkdir(directory, { recursive: true });
const manifest = {};
const dimensions = {};
const localImages = [...new Set([...source.matchAll(/"(\/media\/[^"\n]+\.(?:jpg|jpeg|png|webp|svg))"/g)].map((match) => match[1]))];
for (const path of localImages) {
  const metadata = await sharp(`public${path}`).metadata();
  if (!metadata.width || !metadata.height) throw new Error(`Missing image dimensions: ${path}`);
  dimensions[path] = { width: metadata.width, height: metadata.height };
}
for (const path of photos) {
  const bytes = await readFile(`public${path}`);
  const hash = createHash("sha256").update(bytes).update("webp-q82-v1").digest("hex").slice(0, 10);
  const name = basename(path, extname(path));
  const metadata = await sharp(bytes).metadata();
  const originalWidth = metadata.autoOrient?.width ?? metadata.width;
  const originalHeight = metadata.autoOrient?.height ?? metadata.height;
  const widths = [...new Set([320, 640, 960, 1440, 1920].map((width) => Math.min(width, originalWidth)))];
  const variants = [];
  for (const width of widths) {
    const file = `${name}-${hash}-${width}.webp`;
    let size;
    try { size = (await stat(`${directory}/${file}`)).size; }
    catch (error) {
      if (error.code !== "ENOENT") throw error;
      size = (await sharp(bytes).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 82, effort: 5 }).toFile(`${directory}/${file}`)).size;
    }
    variants.push({ src: `/media/responsive/${file}`, width, bytes: size });
  }
  manifest[path] = { width: originalWidth, height: originalHeight, variants };
}
await writeFile("src/lib/generated-images.json", JSON.stringify(manifest));
await writeFile("src/lib/generated-image-dimensions.json", JSON.stringify(dimensions));
console.log(`Generated responsive WebP variants for ${photos.length} existing photos.`);
