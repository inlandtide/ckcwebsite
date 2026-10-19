export const SITE_ORIGIN = "https://ckcwoodworks.com";

// Existing site photos, with verified intrinsic sizes. Sharing metadata should
// describe the current page and avoid the former 6.9 MB default PNG.
const seoImages = {
  home: { path: "/media/ckc-home-hero-micds_045eaf1f.webp", width: 2048, height: 1536, type: "image/webp", alt: "CKC custom architectural woodwork in a bright library interior." },
  shop: { path: "/media/ckc-shop-overview_7745b818.webp", width: 2048, height: 1536, type: "image/webp", alt: "Overview of the CKC Woodworks production floor in St. Louis." },
  millwork: { path: "/media/img-1913_a0d80be8.jpg", width: 2200, height: 1650, type: "image/jpeg", alt: "CKC custom wall paneling and wood ceiling in a commercial gathering space." },
  cabinetry: { path: "/media/cabinetry-casework-02-service-hero-wide_a7493f0b.webp", width: 2560, height: 1440, type: "image/webp", alt: "Custom painted cabinetry, built-ins, fireplace surround, and display millwork in a finished hospitality interior." },
  fixtures: { path: "/media/kendra-scott-fixture-two-service-hero-wide_33e5ecab.webp", width: 2560, height: 1440, type: "image/webp", alt: "Custom dark-wood retail display fixture with illuminated glass shelving and integrated cabinetry." },
  cnc: { path: "/media/ckc-cnc-panel-processing-moulding-stl_28b513f9.jpg", width: 2048, height: 1536, type: "image/jpeg", alt: "CKC commercial CNC panel-processing equipment in the St. Louis shop." },
  countertops: { path: "/media/healthcare-reception-01_6123ae47.webp", width: 2048, height: 1536, type: "image/webp", alt: "CKC curved white solid-surface reception counter and shaped base in a healthcare interior." },
  finishing: { path: "/media/finishing-craftsman-varnishing-wood_d0e8658e.webp", width: 2048, height: 1516, type: "image/webp", alt: "Craftsman applying a clear wood finish with a brush in a workshop." },
  production: { path: "/media/ckc-shop-production_0345d4ba.webp", width: 2048, height: 1536, type: "image/webp", alt: "Custom commercial millwork and casework in production at CKC Woodworks." },
  contact: { path: "/media/img-1912_c7d20516.jpg", width: 2200, height: 1650, type: "image/jpeg", alt: "CKC commercial interior woodwork in a gathering space." },
} as const;

type PageMetadata = {
  path: string;
  name: string;
  title: string;
  description: string;
  type?: "AboutPage" | "ContactPage" | "CollectionPage";
  service?: string;
  image?: keyof typeof seoImages;
};

// All business details and service descriptions come from the visible site.
export const seoPages: PageMetadata[] = [
  {
    path: "/",
    name: "Home",
    title: "Commercial Millwork & Custom Cabinetry in St. Louis | CKC Woodworks",
    description: "CKC Woodworks builds commercial millwork, custom cabinetry, casework, and fixtures in St. Louis, with more than 40 years of commercial experience.",
  },
  {
    path: "/about",
    name: "About CKC",
    title: "About Our St. Louis Commercial Woodshop | CKC Woodworks",
    description: "Meet CKC Woodworks, a St. Louis commercial woodshop bringing more than four decades of experience to architectural millwork, cabinetry, and custom fabrication.",
    type: "AboutPage",
    image: "shop",
  },
  {
    path: "/services",
    name: "Services",
    title: "Commercial Millwork & Fabrication Services | CKC Woodworks",
    description: "Explore CKC's St. Louis commercial woodwork capabilities, from architectural millwork and casework to CNC machining, custom finishes, and shop drawings.",
    type: "CollectionPage",
  },
  {
    path: "/services/architectural-millwork",
    name: "Architectural millwork",
    title: "Architectural Millwork in St. Louis | CKC Woodworks",
    description: "Custom feature walls, panels, screens, and architectural wood elements for commercial spaces, fabricated by CKC Woodworks in St. Louis.",
    service: "Feature walls, panels, screens, and wood elements that set the character of a room.",
    image: "millwork",
  },
  {
    path: "/services/custom-cabinetry-casework",
    name: "Custom cabinetry & casework",
    title: "Commercial Cabinetry & Casework in St. Louis | CKC Woodworks",
    description: "Custom commercial cabinetry, built-ins, workstations, and storage built around the needs of your project by CKC Woodworks in St. Louis.",
    service: "Cabinetry, built-ins, workstations, and storage built around the realities of the project.",
    image: "cabinetry",
  },
  {
    path: "/services/commercial-fixtures",
    name: "Commercial fixtures",
    title: "Custom Commercial & Retail Fixtures | CKC Woodworks St. Louis",
    description: "CKC Woodworks fabricates custom service counters, retail displays, branded fixtures, and purpose-built commercial elements in St. Louis.",
    service: "Service counters, retail displays, branded fixtures, and purpose-built point-of-use elements.",
    image: "fixtures",
  },
  {
    path: "/services/cnc-machining",
    name: "CNC machining",
    title: "CNC Machining & Panel Processing in St. Louis | CKC Woodworks",
    description: "CNC-cut panels, components, and repeatable parts made for exact geometry and efficient custom fabrication at CKC Woodworks in St. Louis.",
    service: "CNC-cut panels, components, and repeatable parts made for exact geometry and efficient custom fabrication.",
    image: "cnc",
  },
  {
    path: "/services/countertops-specialty-shapes",
    name: "Countertops & specialty shapes",
    title: "Custom Countertops & Specialty Shapes | CKC Woodworks St. Louis",
    description: "Custom countertops, shaped work surfaces, curved profiles, and one-off components for commercial projects from CKC Woodworks in St. Louis.",
    service: "Custom countertops, shaped work surfaces, curved profiles, and one-off components made to carry the detail.",
    image: "countertops",
  },
  {
    path: "/services/custom-finishes-veneer",
    name: "Finishing",
    title: "Wood Finishing & Color Matching in St. Louis | CKC Woodworks",
    description: "Stain development, color matching, and protective wood finishes for commercial millwork, with careful attention to material character at CKC Woodworks in St. Louis.",
    service: "Stain development, color matching, and protective finishes with a close eye on wood character.",
    image: "finishing",
  },
  {
    path: "/services/shop-drawings-design-assist",
    name: "Shop drawings & design assist",
    title: "Millwork Shop Drawings & Design Assist | CKC Woodworks",
    description: "Drawing review, material input, and early project coordination to turn architectural intent into buildable commercial woodwork with CKC Woodworks.",
    service: "Drawing review, material input, and early coordination to turn architectural intent into buildable woodwork.",
    image: "shop",
  },
  {
    path: "/portfolio",
    name: "Client portfolio",
    title: "Commercial Millwork Client Portfolio | CKC Woodworks",
    description: "Explore CKC Woodworks' client portfolio across healthcare, education, retail, and commercial environments in St. Louis and beyond.",
    type: "CollectionPage",
  },
  {
    path: "/gallery",
    name: "Project gallery",
    title: "Commercial Millwork & Cabinetry Project Gallery | CKC Woodworks",
    description: "View selected CKC Woodworks projects: healthcare, retail fixtures, education, architectural woodwork, custom cabinetry, casework, and shop fabrication.",
    type: "CollectionPage",
  },
  {
    path: "/careers",
    name: "Careers",
    title: "Woodshop & Cabinet Maker Careers in St. Louis | CKC Woodworks",
    description: "Explore the Bench Hand / Cabinet Maker opportunity at CKC Woodworks, a St. Louis shop producing custom commercial cabinetry, casework, and millwork.",
    image: "production",
  },
  {
    path: "/contact",
    name: "Contact",
    title: "Contact CKC Woodworks | St. Louis Commercial Millwork",
    description: "Discuss your commercial millwork, cabinetry, or fabrication project with CKC Woodworks in St. Louis. Call 314-383-8222 or send a project inquiry.",
    type: "ContactPage",
    image: "contact",
  },
];

const businessId = `${SITE_ORIGIN}/#business`;
const websiteId = `${SITE_ORIGIN}/#website`;
const absoluteUrl = (path: string) => `${SITE_ORIGIN}${path}`;
const pageImage = (page: PageMetadata) => seoImages[page.image ?? "home"];
const imageObject = (page: PageMetadata) => {
  const image = pageImage(page);
  return {
    "@type": "ImageObject",
    url: absoluteUrl(image.path),
    contentUrl: absoluteUrl(image.path),
    width: image.width,
    height: image.height,
    encodingFormat: image.type,
    caption: image.alt,
  };
};

export function normalizePath(location: string) {
  return location.split(/[?#]/, 1)[0].replace(/\/+$/, "") || "/";
}

export function structuredData(page: PageMetadata) {
  const url = absoluteUrl(page.path);
  const breadcrumbId = `${url}#breadcrumb`;
  const crumbs = [{ name: "Home", path: "/" }];
  if (page.path.startsWith("/services/")) crumbs.push({ name: "Services", path: "/services" });
  if (page.path !== "/") crumbs.push({ name: page.name, path: page.path });

  const business = {
    "@type": "LocalBusiness",
    "@id": businessId,
    name: "CKC Woodworks",
    url: `${SITE_ORIGIN}/`,
    logo: absoluteUrl("/media/ckc-horizontal-primary-aged-copper-transparent_1567f15b.svg"),
    image: imageObject(seoPages[0]),
    description: "Commercial millwork, cabinetry, and custom fabrication for spaces that have to work.",
    telephone: "+1-314-383-8222",
    email: "info@ckcwoodworks.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "1750 Salzman Ave",
      addressLocality: "St. Louis",
      addressRegion: "MO",
      postalCode: "63133",
      addressCountry: "US",
    },
    hasMap: "https://maps.google.com/?q=1750+Salzman+Ave+St+Louis+MO+63133",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Commercial woodwork services",
      itemListElement: seoPages.filter((item) => item.service).map((item) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          "@id": `${absoluteUrl(item.path)}#service`,
          name: item.name,
          description: item.service,
          url: absoluteUrl(item.path),
          provider: { "@id": businessId },
        },
      })),
    },
  };

  const graph: Record<string, unknown>[] = [
    business,
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: `${SITE_ORIGIN}/`,
      name: "CKC Woodworks",
      publisher: { "@id": businessId },
      inLanguage: "en-US",
    },
    {
      "@type": page.type ?? "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: page.title,
      description: page.description,
      isPartOf: { "@id": websiteId },
      about: { "@id": businessId },
      ...(page.service ? { mainEntity: { "@id": `${url}#service` } } : {}),
      primaryImageOfPage: imageObject(page),
      ...(crumbs.length > 1 ? { breadcrumb: { "@id": breadcrumbId } } : {}),
      inLanguage: "en-US",
    },
  ];

  if (crumbs.length > 1) graph.push({
      "@type": "BreadcrumbList",
      "@id": breadcrumbId,
      itemListElement: crumbs.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: absoluteUrl(item.path),
      })),
  });

  if (page.service) graph.push({
    "@type": "Service",
    "@id": `${url}#service`,
    url,
    name: page.name,
    description: page.service,
    image: imageObject(page),
    provider: { "@id": businessId },
    mainEntityOfPage: { "@id": `${url}#webpage` },
  });

  return { "@context": "https://schema.org", "@graph": graph };
}

const escapeAttribute = (value: string) => value
  .replace(/&/g, "&amp;")
  .replace(/"/g, "&quot;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;");

// Shared by the generated HTML and client-side navigation to prevent metadata drift.
export function renderSeoHead(location: string) {
  const page = seoPages.find((item) => item.path === normalizePath(location));
  if (!page) return '<title data-seo>Page Not Found | CKC Woodworks</title>\n<meta data-seo name="robots" content="noindex, follow" />';

  const url = absoluteUrl(page.path);
  const image = pageImage(page);
  const imageUrl = absoluteUrl(image.path);
  const meta = (name: string, content: string, property = false) => `<meta data-seo ${property ? "property" : "name"}="${name}" content="${escapeAttribute(content)}" />`;
  return [
    `<title data-seo>${escapeAttribute(page.title)}</title>`,
    meta("description", page.description),
    meta("robots", "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"),
    `<link data-seo rel="canonical" href="${url}" />`,
    meta("og:type", "website", true),
    meta("og:locale", "en_US", true),
    meta("og:site_name", "CKC Woodworks", true),
    meta("og:title", page.title, true),
    meta("og:description", page.description, true),
    meta("og:url", url, true),
    meta("og:image", imageUrl, true),
    meta("og:image:type", image.type, true),
    meta("og:image:width", String(image.width), true),
    meta("og:image:height", String(image.height), true),
    meta("og:image:alt", image.alt, true),
    meta("twitter:card", "summary_large_image"),
    meta("twitter:title", page.title),
    meta("twitter:description", page.description),
    meta("twitter:image", imageUrl),
    meta("twitter:image:alt", image.alt),
    `<script data-seo type="application/ld+json">${JSON.stringify(structuredData(page)).replace(/</g, "\\u003c")}</script>`,
  ].join("\n    ");
}
