export const siteUrl = "https://ckcwoodworks.com";
export const siteName = "CKC Woodworks";
export const siteTitle = "CKC Woodworks | Custom Millwork in St. Louis";
export const siteDescription =
  "CKC Woodworks is a St. Louis custom woodwork and architectural millwork shop. Contact our team at 314-383-8222 while our new website is being built.";
export const socialImage = `${siteUrl}/images/ckc-woodworks-shop-overview.jpg`;

// Describe only confirmed business details; add services and project-specific
// schema when the full site's corresponding visible pages are published.
export const siteStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": `${siteUrl}/#organization`,
      name: siteName,
      url: `${siteUrl}/`,
      telephone: "+1-314-383-8222",
      email: "scromer@ckcwoodworks.com",
      image: socialImage,
      description:
        "CKC Woodworks in St. Louis. Contact our shop while our new website is being built, or explore our residential division, Moulding Saint Louis.",
      address: {
        "@type": "PostalAddress",
        streetAddress: "1750 Salzman",
        addressLocality: "St. Louis",
        addressRegion: "MO",
        addressCountry: "US",
      },
      subOrganization: {
        "@type": "Organization",
        "@id": "https://mouldingstl.com/#business",
        name: "Moulding Saint Louis",
        url: "https://mouldingstl.com/",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: siteName,
      url: `${siteUrl}/`,
      inLanguage: "en-US",
      publisher: { "@id": `${siteUrl}/#organization` },
    },
  ],
};
