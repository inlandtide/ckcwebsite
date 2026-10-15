export const SITE_ORIGIN = "https://ckcwoodworks.com";

type PageMetadata = {
  path: string;
  name: string;
  title: string;
  description: string;
  type?: "AboutPage" | "ContactPage" | "CollectionPage";
  service?: string;
  image?: string;
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
    image: "/media/img-1913_a0d80be8.jpg",
  },
  {
    path: "/services/custom-cabinetry-casework",
    name: "Custom cabinetry & casework",
    title: "Commercial Cabinetry & Casework in St. Louis | CKC Woodworks",
    description: "Custom commercial cabinetry, built-ins, workstations, and storage built around the needs of your project by CKC Woodworks in St. Louis.",
    service: "Cabinetry, built-ins, workstations, and storage built around the realities of the project.",
    image: "/media/img-1870_2e2a4583.jpg",
  },
  {
    path: "/services/commercial-fixtures",
    name: "Commercial fixtures",
    title: "Custom Commercial & Retail Fixtures | CKC Woodworks St. Louis",
    description: "CKC Woodworks fabricates custom service counters, retail displays, branded fixtures, and purpose-built commercial elements in St. Louis.",
    service: "Service counters, retail displays, branded fixtures, and purpose-built point-of-use elements.",
    image: "/media/project-p-105926_873b0560.jpg",
  },
  {
    path: "/services/cnc-machining",
    name: "CNC machining",
    title: "CNC Machining & Panel Processing in St. Louis | CKC Woodworks",
    description: "CNC-cut panels, components, and repeatable parts made for exact geometry and efficient custom fabrication at CKC Woodworks in St. Louis.",
    service: "CNC-cut panels, components, and repeatable parts made for exact geometry and efficient custom fabrication.",
    image: "/media/ckc-cnc-panel-processing-moulding-stl_28b513f9.jpg",
  },
  {
    path: "/services/countertops-specialty-shapes",
    name: "Countertops & specialty shapes",
    title: "Custom Countertops & Specialty Shapes | CKC Woodworks St. Louis",
    description: "Custom countertops, shaped work surfaces, curved profiles, and one-off components for commercial projects from CKC Woodworks in St. Louis.",
    service: "Custom countertops, shaped work surfaces, curved profiles, and one-off components made to carry the detail.",
    image: "/media/project-p-105939_be470785.jpg",
  },
  {
    path: "/services/custom-finishes-veneer",
    name: "Custom finishes & veneer",
    title: "Custom Wood Finishes & Veneer | CKC Woodworks St. Louis",
    description: "Finish development, veneer selection, and color matching for commercial woodwork, with careful attention to material character at CKC Woodworks.",
    service: "Finish development, veneer selection, and color matching with a close eye on material character.",
    image: "/media/img-1912_c7d20516.jpg",
  },
  {
    path: "/services/shop-drawings-design-assist",
    name: "Shop drawings & design assist",
    title: "Millwork Shop Drawings & Design Assist | CKC Woodworks",
    description: "Drawing review, material input, and early project coordination to turn architectural intent into buildable commercial woodwork with CKC Woodworks.",
    service: "Drawing review, material input, and early coordination to turn architectural intent into buildable woodwork.",
    image: "/media/img-1872_b8f2b558.jpg",
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
    image: "/media/ckc-shop-production_0345d4ba.webp",
  },
  {
    path: "/contact",
    name: "Contact",
    title: "Contact CKC Woodworks | St. Louis Commercial Millwork",
    description: "Discuss your commercial millwork, cabinetry, or fabrication project with CKC Woodworks in St. Louis. Call 314-383-8222 or send a project inquiry.",
    type: "ContactPage",
  },
];

const businessId = `${SITE_ORIGIN}/#business`;
const websiteId = `${SITE_ORIGIN}/#website`;
const defaultImage = "/media/micds-commons-people-removed_7b3a9bf7.png";
const absoluteUrl = (path: string) => `${SITE_ORIGIN}${path}`;

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
    image: absoluteUrl(defaultImage),
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
      primaryImageOfPage: { "@type": "ImageObject", url: absoluteUrl(page.image ?? defaultImage) },
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
  const image = absoluteUrl(page.image ?? defaultImage);
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
    meta("og:image", image, true),
    meta("og:image:alt", "Commercial woodwork by CKC Woodworks in St. Louis", true),
    meta("twitter:card", "summary_large_image"),
    meta("twitter:title", page.title),
    meta("twitter:description", page.description),
    meta("twitter:image", image),
    meta("twitter:image:alt", "Commercial woodwork by CKC Woodworks in St. Louis"),
    `<script data-seo type="application/ld+json">${JSON.stringify(structuredData(page)).replace(/</g, "\\u003c")}</script>`,
  ].join("\n    ");
}
