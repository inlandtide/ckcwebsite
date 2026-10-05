import type { MetadataRoute } from "next";
import { siteUrl } from "./data/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  // Include only published canonical pages. Extend this list at full-site launch;
  // add lastModified only when accurate content edit dates are maintained.
  return [{ url: `${siteUrl}/` }];
}
