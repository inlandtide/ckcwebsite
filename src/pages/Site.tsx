import { type ReactNode, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import ContactForm from "../components/ContactForm";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Mail,
  Menu,
  MapPin,
  Plus,
  Phone,
  X,
} from "lucide-react";

const assets = {
  logoPrimary: "/media/ckc-horizontal-primary-aged-copper-transparent_1567f15b.svg",
  logoStacked: "/media/ckc-stacked-primary-aged-copper-transparent_3d07704b.svg",
  logoInverted: "/media/ckc-stacked-inverted-aged-copper-transparent_9a21edc2.svg",
  mouldingStLouisLogo: "/media/moulding-saint-louis-logo_4f99afb1.svg",
  mouldingStLouisFooterLogo: "/media/moulding-saint-louis-logo-footer_f0cfaa46.svg",
  midAmericaCarpentersLogo: "/media/mid-america-carpenters-regional-council-logo_e751a11d.png",
  homeHero: "/media/ckc-home-hero-micds_045eaf1f.webp",
  micdsCommons: "/media/micds-commons-people-removed_7b3a9bf7.png",
  micdsReception: "/media/img-1864_a9977b58.jpg",
  micdsClassroom: "/media/img-1863_8e9a1548.jpg",
  micdsCorridor: "/media/img-1870_2e2a4583.jpg",
  micdsHallway: "/media/img-1871_26c75e5e.jpg",
  micdsBench: "/media/img-1872_b8f2b558.jpg",
  micdsLounge: "/media/img-1911_ff0eed24.jpg",
  micdsLoungeWide: "/media/img-1912_c7d20516.jpg",
  retailFixtureOne: "/media/project-p-105903_83ff2435.jpg",
  retailFixtureTwo: "/media/project-p-105912_9318c820.jpg",
  retailFixtureThree: "/media/project-p-105926_873b0560.jpg",
  retailFixtureShop: "/media/ckc-retail-fixture-shop_6979d202.webp",
  shopProduction: "/media/ckc-shop-production_0345d4ba.webp",
  shopOverview: "/media/ckc-shop-overview_7745b818.webp",
  shopCnc: "/media/ckc-shop-cnc_55063989.jpg",
  retailFixtureComposite: "/media/ckc-retail-fixtures-composite_98c40586.png",
  kendraScottHatBar: "/media/kendra-scott-hat-back-bar_16dab244.png",
  kendraScottFixtureOne: "/media/kendra-scott-fixture-one_8bc14b2a.webp",
  kendraScottFixtureTwo: "/media/kendra-scott-fixture-two_0f8ea988.webp",
  retailFixturesHero: "/media/kendra-scott-retail-fixtures-hero-wide_f74192aa.webp",
  commercialEnvironmentOne: "/media/commercial-environments-01_99918991.jpg",
  commercialEnvironmentTwo: "/media/commercial-environments-02_2efefda5.webp",
  commercialEnvironmentThree: "/media/commercial-environments-03_8461ac5e.webp",
  commercialEnvironmentFour: "/media/commercial-environments-04_153d8ec2.webp",
  commercialEnvironmentFive: "/media/commercial-environments-05_8684bea2.webp",
  commercialEnvironmentSix: "/media/commercial-environments-06_c1db879e.jpg",
  commercialEnvironmentSeven: "/media/commercial-environments-07_5aef4b2d.jpg",
  commercialEnvironmentEight: "/media/commercial-environments-08_8d431197.jpg",
  commercialEnvironmentHero: "/media/commercial-environments-hero-original_086df75f.png",
  architecturalWoodworkHero: "/media/energizer-interior-04-hero-wide_fcb40e7c.webp",
  cabinetryCaseworkTwo: "/media/cabinetry-casework-02_9709c7f4.jpg",
  cabinetryCaseworkGrayCabinets: "/media/cabinetry-casework-gray-cabinets_b60518da.jpg",
  cabinetryCaseworkHero: "/media/cabinetry-casework-gallery-hero_1370ce69.jpg",
  cabinetryCaseworkWideHero: "/media/cabinetry-casework-03-hero-wide_37404444.webp",
  cabinetryCaseworkServiceHero: "/media/cabinetry-casework-02-service-hero-wide_a7493f0b.webp",
  cabinetryCaseworkLobbyDisplay: "/media/cabinetry-casework-lobby-display_5907a875.webp",
  homeCabinetryCasework: "/media/kendra-scott-fixture-two_0f8ea988.webp",
  healthcareOne: "/media/healthcare-01_f4299d21.jpg",
  healthcareThree: "/media/healthcare-03_ac77825c.jpg",
  stLouisChildrensAquariumOne: "/media/st-louis-childrens-aquarium-01_ec89b304.webp",
  stLouisChildrensAquariumTwo: "/media/st-louis-childrens-aquarium-02_514fdafb.jpg",
  stLouisChildrensAquariumThree: "/media/st-louis-childrens-aquarium-03_0ab769ca.webp",
  healthcareHero: "/media/st-louis-childrens-aquarium-hero-wide-people-removed_ab24df45.webp",
  healthcareReceptionOne: "/media/healthcare-reception-01_6123ae47.webp",
  healthcareReceptionTwo: "/media/healthcare-reception-02_aa8ea161.webp",
  energizerInteriorOne: "/media/energizer-interior-01_86e380b2.jpg",
  energizerInteriorTwo: "/media/energizer-interior-02_590c937b.jpg",
  energizerInteriorThree: "/media/energizer-interior-03_cfc294dd.jpg",
  energizerInteriorFour: "/media/energizer-interior-04_4c2dc819.jpg",
  enterpriseCenterSuiteOne: "/media/enterprise-center-suite-01_b0665fc8.webp",
  enterpriseCenterSuiteTwo: "/media/enterprise-center-suite-02_99958c7c.webp",
  enterpriseCenterSuiteThree: "/media/enterprise-center-suite-03_c4a9df4b.webp",
  awiCertification: "/media/awi-logo-supplied_93b4bf76.png",
  qcpCertification: "/media/qcp-logo-supplied_6c1cefe3.png",
  serviceMillwork: "/media/img-1913_a0d80be8.jpg",
  serviceCasework: "/media/img-1870_2e2a4583.jpg",
  serviceFixtures: "/media/project-p-105926_873b0560.jpg",
  commercialFixturesServiceHero: "/media/kendra-scott-fixture-two-service-hero-wide_33e5ecab.webp",
  serviceCountertops: "/media/project-p-105939_be470785.jpg",
  serviceCnc: "/media/img-1867_d4186b85.jpg",
  serviceCncHero: "/media/ckc-cnc-panel-processing-moulding-stl_28b513f9.jpg",
  serviceFinishes: "/media/finishing-craftsman-varnishing-wood_d0e8658e.webp",
  serviceCoordination: "/media/img-1872_b8f2b558.jpg",
};

type GalleryImage = {
  src: string;
  alt: string;
  label: string;
  shape: string;
};

type GalleryProject = {
  title: string;
  cover: string;
  alt: string;
  images: GalleryImage[];
};

type LogoPlaceholder = {
  name: string;
  monogram: string;
  treatment: "serif" | "sans" | "wide" | "round";
};

type ClientLogo = {
  name: string;
  src: string;
  featured?: boolean;
};

const portfolioLogos: ClientLogo[] = [
  { name: "Mercy Hospital", src: "/media/mercy-monochrome-detail_f8e352c8.svg" },
  { name: "SSM Health Cardinal Glennon Children’s Hospital", src: "/media/cardinal-glennon-official.svg" },
  { name: "St. Louis Children’s Hospital", src: "/media/st-louis-childrens-hospital-official.svg" },
  { name: "CHANEL", src: "/media/chanel_7712e037.svg" },
  { name: "Kendra Scott", src: "/media/kendra-scott_b74a77cc.svg" },
  { name: "MICDS", src: "/media/micds_22f6d495.png" },
  { name: "Levi’s", src: "/media/levis_a17148d1.svg" },
  { name: "Missouri Botanical Garden", src: "/media/missouri-botanical-garden_e0b71354.svg" },
  { name: "SSM Health", src: "/media/ssm-health-wordmark-official.svg" },
  { name: "BJC HealthCare", src: "/media/bjc-healthcare_6152c128.svg" },
  { name: "Neiman Marcus", src: "/media/neiman-marcus_e90b2fb8.svg" },
  { name: "St. Louis Cardinals", src: "/media/st-louis-cardinals-team-cap-on-light_6dd7b743.svg" },
  { name: "Enterprise Center", src: "/media/enterprise-center-logo-vertical-monochrome-white-e_4257861a.svg" },
  { name: "Washington University School of Medicine", src: "/media/washu-medicine-official.svg" },
  { name: "Ameren Missouri", src: "/media/ameren-missouri-monochrome-clean_8ea9c149.png" },
  { name: "FlightSafety International", src: "/media/flight-safety-international-black_cdde1cba.png" },
];

const partnerLogos: LogoPlaceholder[] = [
  { name: "Arc Studio", monogram: "AS", treatment: "serif" },
  { name: "Cedar & Co.", monogram: "CC", treatment: "wide" },
  { name: "Buildline", monogram: "B", treatment: "sans" },
  { name: "Northstar", monogram: "N", treatment: "round" },
  { name: "Precision Works", monogram: "PW", treatment: "serif" },
  { name: "Mason Street", monogram: "MS", treatment: "wide" },
  { name: "Grain & Steel", monogram: "GS", treatment: "sans" },
  { name: "Atlas", monogram: "A", treatment: "round" },
  { name: "Studio 47", monogram: "47", treatment: "serif" },
  { name: "Oak + Iron", monogram: "OI", treatment: "wide" },
  { name: "Forward", monogram: "F", treatment: "sans" },
  { name: "Bluebird", monogram: "BB", treatment: "round" },
  { name: "Collective", monogram: "CO", treatment: "serif" },
  { name: "Foundry Co.", monogram: "FC", treatment: "wide" },
  { name: "Goodline", monogram: "G", treatment: "sans" },
  { name: "Made Here", monogram: "MH", treatment: "round" },
];

const galleryProjects: GalleryProject[] = [
  {
    title: "Education",
    cover: assets.micdsCommons,
    alt: "CKC millwork across education spaces.",
    images: [
      { src: assets.micdsCommons, alt: "Wood slat ceiling and custom millwork in an education commons.", label: "Education", shape: "gallery-item--wide" },
      { src: assets.micdsClassroom, alt: "Custom wood millwork in a learning space.", label: "Education", shape: "" },
      { src: assets.micdsLoungeWide, alt: "Custom wall panels and wood ceiling in a gathering space.", label: "Education", shape: "gallery-item--wide" },
      { src: assets.micdsReception, alt: "Custom wood ceiling and millwork in a commercial interior.", label: "Education", shape: "gallery-item--tall" },
      { src: assets.micdsCorridor, alt: "Custom millwork in an interior corridor.", label: "Education", shape: "" },
      { src: assets.micdsHallway, alt: "Wood wall panels and doors in an education hallway.", label: "Education", shape: "gallery-item--wide" },
      { src: assets.micdsLounge, alt: "Custom wall paneling and wood ceiling in an education lounge.", label: "Education", shape: "" },
      { src: assets.micdsBench, alt: "CKC detailed wood millwork in an interior corridor.", label: "Education", shape: "gallery-item--wide" },
    ],
  },
  {
    title: "Healthcare",
    cover: assets.healthcareHero,
    alt: "St. Louis Children’s Hospital aquarium feature with curved custom casework and glass partition.",
    images: [
      { src: assets.healthcareThree, alt: "DePaul hospital lobby with custom curved wood wall panels and architectural millwork.", label: "Healthcare", shape: "gallery-item--wide" },
      { src: assets.healthcareOne, alt: "Hospital skylight lobby with custom wall paneling and seating details.", label: "Healthcare", shape: "" },
      { src: assets.stLouisChildrensAquariumOne, alt: "St. Louis Children’s Hospital custom curved casework surrounding a pediatric aquarium feature.", label: "St. Louis Children’s", shape: "" },
      { src: assets.stLouisChildrensAquariumTwo, alt: "St. Louis Children’s Hospital curved reception casework framing a finished aquarium feature.", label: "St. Louis Children’s", shape: "gallery-item--wide" },
      { src: assets.stLouisChildrensAquariumThree, alt: "St. Louis Children’s Hospital custom aquarium casework in a pediatric outpatient environment.", label: "St. Louis Children’s", shape: "" },
      { src: assets.healthcareReceptionOne, alt: "Healthcare reception desk with custom curved white solid-surface top and light wood casework.", label: "Healthcare", shape: "gallery-item--wide" },
      { src: assets.healthcareReceptionTwo, alt: "Healthcare reception desk with custom curved white solid-surface top and light wood casework.", label: "Healthcare", shape: "" },
    ],
  },
  {
    title: "Retail Fixtures",
    cover: assets.retailFixturesHero,
    alt: "Kendra Scott retail fixture with custom dark wood display cabinetry and integrated glass shelving.",
    images: [
      { src: assets.retailFixtureOne, alt: "CKC custom retail fixture with curved wood detail.", label: "Retail Fixtures", shape: "gallery-item--wide" },
      { src: assets.retailFixtureTwo, alt: "CKC commercial retail fixture with rounded wood paneling.", label: "Retail Fixtures", shape: "" },
      { src: assets.retailFixtureThree, alt: "CKC retail counter with curved millwork.", label: "Retail Fixtures", shape: "gallery-item--wide" },
      { src: assets.retailFixtureShop, alt: "CKC shop-built curved retail display fixture in progress.", label: "Retail Fixtures", shape: "" },
      { src: assets.retailFixtureComposite, alt: "Three finished views of a CKC retail eyewear display fixture.", label: "Retail Fixtures", shape: "gallery-item--retail-composite" },
      { src: assets.kendraScottHatBar, alt: "Kendra Scott retail fixture with stained wood shelving and display cabinetry.", label: "Kendra Scott", shape: "gallery-item--wide" },
      { src: assets.kendraScottFixtureOne, alt: "Kendra Scott retail fixture in progress with custom stained wood cabinetry and display shelving.", label: "Kendra Scott", shape: "" },
      { src: assets.kendraScottFixtureTwo, alt: "Kendra Scott stained wood retail display fixture with integrated glass shelving.", label: "Kendra Scott", shape: "gallery-item--wide" },
    ],
  },
  {
    title: "Architectural Woodwork",
    cover: assets.architecturalWoodworkHero,
    alt: "Custom light-oak stair, railings, wall panels, and curved platform in a commercial interior.",
    images: [
      { src: assets.commercialEnvironmentOne, alt: "Custom branded reception feature in a commercial office environment.", label: "Architectural Woodwork", shape: "gallery-item--wide" },
      { src: assets.commercialEnvironmentTwo, alt: "Double-height commercial lobby with custom wood trusses and slatted screens.", label: "Architectural Woodwork", shape: "" },
      { src: assets.commercialEnvironmentThree, alt: "Commercial lobby with custom wood screens and built-in seating.", label: "Architectural Woodwork", shape: "gallery-item--wide" },
      { src: assets.commercialEnvironmentFour, alt: "Commercial hospitality bar with custom wood paneling and millwork.", label: "Architectural Woodwork", shape: "" },
      { src: assets.commercialEnvironmentFive, alt: "Commercial lounge and bar with a wood ceiling, millwork, and feature pendants.", label: "Architectural Woodwork", shape: "gallery-item--wide" },
      { src: assets.commercialEnvironmentSix, alt: "Levi's retail corridor with custom cedar wall panels.", label: "Architectural Woodwork", shape: "" },
      { src: assets.commercialEnvironmentSeven, alt: "Levi's retail store with custom wood checkout and display millwork.", label: "Architectural Woodwork", shape: "gallery-item--wide" },
      { src: assets.commercialEnvironmentEight, alt: "Retail service counter with custom textured cabinetry and display features.", label: "Architectural Woodwork", shape: "" },
      { src: assets.energizerInteriorOne, alt: "Commercial interior with custom wood ceiling framing and reception details.", label: "Architectural Woodwork", shape: "gallery-item--wide" },
      { src: assets.energizerInteriorTwo, alt: "Commercial collaborative space with a custom curved table and integrated millwork.", label: "Architectural Woodwork", shape: "" },
      { src: assets.energizerInteriorThree, alt: "Commercial interior stair with a custom curved wood platform and painted millwork.", label: "Architectural Woodwork", shape: "gallery-item--wide" },
      { src: assets.energizerInteriorFour, alt: "Commercial interior with custom wood stair, landing, and integrated guardrail detail.", label: "Architectural Woodwork", shape: "" },
    ],
  },
  {
    title: "Cabinetry & Casework",
    cover: assets.cabinetryCaseworkWideHero,
    alt: "Custom painted cabinetry, counters, display panels, and millwork in a finished hospitality interior.",
    images: [
      { src: assets.cabinetryCaseworkGrayCabinets, alt: "Custom gray commercial cabinetry and casework with quartz countertops.", label: "Cabinetry & Casework", shape: "gallery-item--wide" },
      { src: assets.cabinetryCaseworkTwo, alt: "Integrated painted casework and built-ins in a hospitality interior.", label: "Cabinetry & Casework", shape: "" },
      { src: assets.cabinetryCaseworkLobbyDisplay, alt: "Custom painted cabinetry and display casework in a finished hospitality interior.", label: "Cabinetry & Casework", shape: "gallery-item--wide" },
      { src: assets.enterpriseCenterSuiteOne, alt: "Hospitality suite with custom service counter millwork overlooking the arena.", label: "Cabinetry & Casework", shape: "" },
      { src: assets.enterpriseCenterSuiteTwo, alt: "Hospitality suite with custom cabinetry, bar counter, and service millwork.", label: "Cabinetry & Casework", shape: "gallery-item--wide" },
      { src: assets.enterpriseCenterSuiteThree, alt: "Hospitality suite with custom bar, wainscoting, and counter details.", label: "Cabinetry & Casework", shape: "" },
    ],
  },
  {
    title: "CKC Shop",
    cover: assets.shopOverview,
    alt: "Overview of the CKC Woodworks shop floor in St. Louis.",
    images: [
      { src: assets.shopOverview, alt: "Wide view of the CKC Woodworks production floor.", label: "CKC Shop", shape: "gallery-item--wide" },
      { src: assets.shopCnc, alt: "CKC CNC panel-processing equipment in the shop.", label: "CKC Shop", shape: "" },
      { src: assets.shopProduction, alt: "Custom commercial millwork and casework in production at CKC Woodworks.", label: "CKC Shop", shape: "gallery-item--wide" },
    ],
  },];

const galleryImages: GalleryImage[] = galleryProjects.flatMap((project) => project.images);

type ServiceDefinition = {
  slug: string;
  title: string;
  heroLine: string;
  heroAccent: string;
  cardCopy: string;
  overview: string;
  scope: string[];
  image: string;
  alt: string;
  heroImage?: string;
  heroAlt?: string;
};

type TeamMember = {
  name: string;
  role: string;
};

const serviceCatalog: ServiceDefinition[] = [
  {
    slug: "architectural-millwork",
    title: "Architectural millwork",
    heroLine: "Millwork that",
    heroAccent: "sets the room.",
    cardCopy: "Feature walls, panels, screens, and wood elements that set the character of a room.",
    overview: "Feature walls, panel systems, screens, ceiling details, and integrated wood elements built around the architecture of the space.",
    scope: ["Wall panels & feature walls", "Screens & slatted systems", "Ceiling & architectural details"],
    image: assets.serviceMillwork,
    alt: "CKC custom wall paneling and wood ceiling in a commercial gathering space.",
  },
  {
    slug: "custom-cabinetry-casework",
    title: "Custom cabinetry & casework",
    heroLine: "Built around",
    heroAccent: "the workday.",
    cardCopy: "Cabinetry, built-ins, workstations, and storage built around the realities of the project.",
    overview: "Custom cabinetry, storage, workstations, and built-ins that bring material quality and practical order to commercial interiors.",
    scope: ["Custom cabinetry", "Built-ins & storage", "Workstations & support spaces"],
    image: assets.cabinetryCaseworkGrayCabinets,
    alt: "CKC custom upper and lower cabinetry, drawers, sink, and countertop in a commercial workroom.",
    heroImage: assets.cabinetryCaseworkServiceHero,
    heroAlt: "Custom painted cabinetry, built-ins, fireplace surround, and display millwork in a finished hospitality interior.",
  },
  {
    slug: "commercial-fixtures",
    title: "Commercial fixtures",
    heroLine: "Fixtures with",
    heroAccent: "a point of view.",
    cardCopy: "Service counters, retail displays, branded fixtures, and purpose-built point-of-use elements.",
    overview: "Reception desks, service counters, display systems, and branded point-of-use elements for hospitality, retail, healthcare, and workplace settings.",
    scope: ["Reception & service counters", "Retail displays", "Branded commercial fixtures"],
    image: assets.serviceFixtures,
    alt: "CKC custom commercial fixture with curved wood detailing.",
    heroImage: assets.commercialFixturesServiceHero,
    heroAlt: "Custom dark-wood retail display fixture with illuminated glass shelving and integrated cabinetry.",
  },
  {
    slug: "cnc-machining",
    title: "CNC machining",
    heroLine: "Precision at",
    heroAccent: "production scale.",
    cardCopy: "CNC-cut panels, components, and repeatable parts made for exact geometry and efficient custom fabrication.",
    overview: "CNC-cut panels, components, and repeatable parts that support exact geometry, efficient fabrication, and ambitious custom work.",
    scope: ["CNC-cut panels", "Precision components", "Repeatable custom parts"],
    image: assets.serviceCnc,
    alt: "CKC precision wood ceiling and millwork in an education commons.",
    heroImage: assets.serviceCncHero,
    heroAlt: "CKC commercial CNC panel-processing equipment in the St. Louis shop.",
  },
  {
    slug: "countertops-specialty-shapes",
    title: "Countertops & specialty shapes",
    heroLine: "A custom surface,",
    heroAccent: "precisely made.",
    cardCopy: "Custom countertops, shaped work surfaces, curved profiles, and one-off components made to carry the detail.",
    overview: "Custom countertops, shaped work surfaces, curved profiles, and one-off components made to carry the material intent through the details.",
    scope: ["Custom countertops", "Curved & specialty profiles", "One-off shaped components"],
    image: assets.healthcareReceptionOne,
    alt: "CKC curved white solid-surface reception counter and shaped base in a healthcare interior.",
  },
  {
    slug: "custom-finishes-veneer",
    title: "Finishing",
    heroLine: "The finish is",
    heroAccent: "part of the work.",
    cardCopy: "Stain development, color matching, and protective finishes with a close eye on wood character.",
    overview: "Stain development, color matching, and protective finishes that bring out material character and stand up to use.",
    scope: ["Stain & color development", "Color matching", "Protective finish systems"],
    image: assets.serviceFinishes,
    alt: "Craftsman applying a clear wood finish with a brush in a workshop.",
  },
  {
    slug: "shop-drawings-design-assist",
    title: "Shop drawings & design assist",
    heroLine: "Clarity before",
    heroAccent: "fabrication.",
    cardCopy: "Drawing review, material input, and early coordination to turn architectural intent into buildable woodwork.",
    overview: "Drawing review, material input, and early scope coordination that help turn architectural intent into buildable woodwork.",
    scope: ["Shop drawing coordination", "Material review", "Scope & detail alignment"],
    image: assets.shopOverview,
    alt: "CKC production shop with fabricated millwork in progress.",
  },
];

const teamGroups: Array<{ title: string; members: TeamMember[] }> = [
  {
    title: "Leadership",
    members: [
      { name: "Nancy Blaha", role: "President" },
      { name: "Tim Hebel", role: "CFO" },
      { name: "Ryan Hall", role: "CRO" },
      { name: "Dan Stampfl", role: "Plant Manager" },
      { name: "Jason Pennington", role: "Sr. CNC Programmer" },
    ],
  },
  {
    title: "Project management",
    members: [
      { name: "John Ruengert", role: "Sr. Project Manager" },
      { name: "Josh Lanfersieck", role: "Project Manager" },
    ],
  },
  {
    title: "Estimating & production",
    members: [
      { name: "JB Higginbotham", role: "Lead Estimator" },
      { name: "Tyler Hampton", role: "Estimator" },
    ],
  },
];

const navItems = [
  ["About", "/about"],
  ["Services", "/services"],
  ["Portfolio", "/portfolio"],
  ["Gallery", "/gallery"],
  ["Careers", "/careers"],
  ["Contact", "/contact"],
] as const;

function scrollToInquiry() {
  const target = document.getElementById("inquiry");
  if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
}

function usePageTop() {
  const [location] = useLocation();
  useEffect(() => {
    if (!location.includes("#")) window.scrollTo(0, 0);
  }, [location]);
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesMenuOpen, setServicesMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    setMenuOpen(false);
    setServicesMenuOpen(false);
  }, [location]);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="brand-mark" aria-label="CKC Woodworks home">
          <img src={assets.logoPrimary} alt="CKC Woodworks" />
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map(([label, href]) => label === "Services" ? (
            <div className="services-nav" key={href}>
              <Link href={href} className={location.startsWith("/services") ? "is-active" : ""}>Services</Link>
              <button type="button" className="services-nav__toggle" aria-label="Toggle Services menu" aria-expanded={servicesMenuOpen} onClick={() => setServicesMenuOpen((open) => !open)}><ChevronDown aria-hidden="true" /></button>
              {servicesMenuOpen && (
                <div className="services-nav__menu" aria-label="Services navigation">
                  <Link href="/services" className="services-nav__all">All services <ArrowUpRight aria-hidden="true" /></Link>
                  <div className="services-nav__list">
                    {serviceCatalog.map((service) => <Link href={`/services/${service.slug}`} key={service.slug}>{service.title}</Link>)}
                  </div>
                </div>
              )}
            </div>
          ) : <Link key={href} href={href} className={location === href ? "is-active" : ""}>{label}</Link>)}
        </nav>
        <Link href="/contact" className="header-cta">
          Start a project <ArrowUpRight aria-hidden="true" />
        </Link>
        <button className="menu-button" type="button" aria-label="Open navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
      {menuOpen && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          <Link href="/">Home</Link>
          {navItems.map(([label, href]) => label === "Services" ? (
            <div className="mobile-services" key={href}>
              <button type="button" className="mobile-services__toggle" aria-expanded={servicesMenuOpen} onClick={() => setServicesMenuOpen((open) => !open)}>Services <ChevronDown aria-hidden="true" /></button>
              {servicesMenuOpen && <div className="mobile-services__links">
                <Link href="/services" className="mobile-services__all">All services <ArrowUpRight aria-hidden="true" /></Link>
                {serviceCatalog.map((service) => <Link href={`/services/${service.slug}`} key={service.slug}>{service.title}</Link>)}
              </div>}
            </div>
          ) : <Link key={href} href={href}>{label}</Link>)}
          <Link href="/contact">Start a project <ArrowUpRight aria-hidden="true" /></Link>
        </nav>
      )}
    </header>
  );
}

function InquiryBand() {
  return (
    <section className="inquiry-band" id="inquiry">
      <div className="inquiry-band__body">
        <div className="inquiry-band__copy">
          <Eyebrow>Start a project</Eyebrow>
          <h2>The next build<br /><em>starts here.</em></h2>
          <a className="inquiry-link" href="mailto:info@ckcwoodworks.com?subject=CKC%20Woodworks%20Project%20Inquiry">
            <span>Start the conversation</span>
            <strong>info@ckcwoodworks.com</strong>
            <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
        <ContactForm variant="dark" formLocation="footer" />
      </div>
    </section>
  );
}

function Footer({ concise = false }: { concise?: boolean }) {
  return (
    <footer className="site-footer">
      <div className="site-footer__top">
        <img src={assets.logoInverted} alt="CKC Woodworks" className="footer-logo" />
        <p>{concise ? "Commercial woodwork, cabinetry, and fabrication." : "Commercial millwork, cabinetry, and custom fabrication for spaces that have to work."}</p>
        <a className="footer-residential" href="https://mouldingstl.com/" target="_blank" rel="noreferrer" aria-label="Visit Moulding Saint Louis">
          <img src={assets.mouldingStLouisFooterLogo} alt="Moulding Saint Louis" />
          <span>Explore our residential division</span>
        </a>
      </div>
      <div className="site-footer__bottom">
        <span>St. Louis, Missouri</span>
        <span>Union shop · AWI &amp; QCP certified</span>
        <a href="mailto:info@ckcwoodworks.com">info@ckcwoodworks.com</a>
        <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Back to top <ArrowUpRight aria-hidden="true" /></button>
      </div>
    </footer>
  );
}

function Layout({ children, showSectionRules = true, concise = false }: { children: ReactNode; showSectionRules?: boolean; concise?: boolean }) {
  usePageTop();
  return <div className="ckc-site"><Header /><main>{children}</main>{showSectionRules && <SectionRule />}<InquiryBand />{showSectionRules && <SectionRule />}<Footer concise={concise} /></div>;
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow"><span>{children}</span></p>;
}

function SectionRule() {
  return <div className="section-rule" aria-hidden="true" />;
}

export function HomePage() {
  return (
    <Layout concise>
      <section className="union-band" aria-label="CKC Woodworks union credentials">
        <span>Proudly union</span><span>St. Louis since 1978</span><span>AWI Standards</span>
      </section>
      <section className="home-hero">
        <img src={assets.homeHero} alt="CKC custom architectural woodwork in a bright library interior." className="home-hero__image" />
        <div className="home-hero__veil" />
        <div className="home-hero__content">
          <Eyebrow>Custom commercial woodwork</Eyebrow>
          <h1>Made for the rooms<br /><em>people remember.</em></h1>
          <p>Commercial woodwork, cabinetry, and interiors.</p>
          <div className="hero-actions">
            <Link href="/gallery" className="button button--bone">Selected work <ArrowDownRight aria-hidden="true" /></Link>
            <Link href="/services" className="text-link">Our capabilities <ArrowRight aria-hidden="true" /></Link>
          </div>
        </div>
        <div className="home-hero__meta"><span>St. Louis, Missouri</span><span>Est. 1978</span><span>Commercial interiors</span></div>
      </section>
      <SectionRule />

      <section className="home-work section-shell">
        <div className="section-heading section-heading--home-work">
          <h2>A sense of <em>place.</em></h2>
        </div>
        <div className="home-work__grid home-work__grid--expanded">
          <article className="project-tile project-tile--large"><img src={assets.micdsLounge} alt="CKC custom wall paneling and wood ceiling in an education lounge." /><div><span>Education</span><Link href="/gallery" aria-label="View education work"><ArrowUpRight aria-hidden="true" /></Link></div></article>
          <article className="project-tile"><img src={assets.enterpriseCenterSuiteTwo} alt="Enterprise Center suite with custom hospitality millwork and service counter details." /><div><span>Luxury Suites</span><Link href="/gallery" aria-label="View luxury suites work"><ArrowUpRight aria-hidden="true" /></Link></div></article>
          <article className="project-tile"><img src={assets.homeCabinetryCasework} alt="CKC custom cabinetry and casework in a finished retail interior." /><div><span>Cabinetry &amp; casework</span><Link href="/gallery" aria-label="View cabinetry and casework"><ArrowUpRight aria-hidden="true" /></Link></div></article>
          <article className="project-tile"><img src={assets.commercialEnvironmentHero} alt="CKC architectural woodwork in a finished commercial interior." /><div><span>Architectural woodwork</span><Link href="/gallery" aria-label="View architectural woodwork"><ArrowUpRight aria-hidden="true" /></Link></div></article>
          <article className="project-tile"><img src={assets.stLouisChildrensAquariumTwo} alt="St. Louis Children’s Hospital curved reception casework framing a finished aquarium feature." /><div><span>Healthcare</span><Link href="/gallery" aria-label="View healthcare work"><ArrowUpRight aria-hidden="true" /></Link></div></article>
          <article className="project-tile"><img src={assets.micdsHallway} alt="CKC wood wall panels and doors in an education hallway." /><div><span>Interiors</span><Link href="/gallery" aria-label="View additional interior work"><ArrowUpRight aria-hidden="true" /></Link></div></article>
        </div>
      </section>
      <SectionRule />

      <section className="home-services section-shell section-shell--olive">
        <div className="home-services__intro"><Eyebrow>Capabilities</Eyebrow><h2>Built<br /><em>to last.</em></h2></div>
        <div className="home-services__list">
          {serviceCatalog.slice(0, 4).map((service) => <Link href={`/services/${service.slug}`} key={service.slug} className="capability-row"><div><h3>{service.title}</h3></div><ArrowUpRight aria-hidden="true" /></Link>)}
        </div>
      </section>
      <SectionRule />
      <section className="quality-standards section-shell" aria-labelledby="quality-standards-title">
        <div className="quality-standards__heading">
          <Eyebrow>Quality standards</Eyebrow>
          <h2 id="quality-standards-title">Built to<br /><em>standard.</em></h2>
        </div>
        <div className="quality-standards__content">
          <div className="quality-standards__cards">
            <article><figure><img src={assets.awiCertification} alt="Architectural Woodwork Institute logo" /></figure><div><h3>AWI Certified</h3></div></article>
            <article><figure><img src={assets.qcpCertification} alt="AWI Quality Certification Program logo" /></figure><div><h3>QCP Certified</h3></div></article>
          </div>
        </div>
      </section>
      <SectionRule />
      <section className="why-ckc section-shell" aria-labelledby="why-ckc-title">
        <div className="why-ckc__heading">
          <Eyebrow>Why work with CKC</Eyebrow>
          <h2 id="why-ckc-title">The work matters.<br /><em>The relationship does, too.</em></h2>
        </div>
        <div className="why-ckc__content">
          <p>Clients come to CKC for seasoned expertise, dependable quality, and the kind of communication that keeps a project moving.</p>
          <div className="why-ckc__points">
            <article><h3>Quality that holds up</h3><p>Commercial woodwork made with care for the details people see—and the performance they depend on.</p></article>
            <article><h3>Service that stays close</h3><p>Clear, responsive coordination from the first conversation through fabrication and finish.</p></article>
            <article><h3>Experience that delivers</h3><p>40+ years of commercial know-how brought to each scope, material, and decision.</p></article>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export function AboutPage() {
  return (
    <Layout>
      <section className="page-hero page-hero--about">
        <div className="page-hero__copy"><Eyebrow>Crafted in St. Louis</Eyebrow><h1>Built on experience.<br /><em>Made for what’s next.</em></h1><p>CKC is the premier cabinetry and millwork shop in St. Louis—an established commercial partner with more than four decades of practical know-how.</p></div>
        <figure className="page-hero__image"><img src={assets.shopOverview} alt="Elevated view across the CKC Woodworks production floor in St. Louis." /><figcaption>Inside the CKC shop / St. Louis</figcaption></figure>
      </section>
      <SectionRule />

      <section className="heritage-panel section-shell">
        <div className="heritage-panel__year">1978<span>—</span>2026</div>
        <div><Eyebrow>Our foundation</Eyebrow><h2>A commercial woodshop<br />with <em>real staying power.</em></h2><p>CKC Woodworks has spent 40+ years shaping the spaces where people work, gather, learn, and receive care. That history informs every practical decision—from material selection and shop planning to the final finish.</p></div>
      </section>
      <SectionRule />

      <section className="credentials-section section-shell">
        <Eyebrow>Credentials</Eyebrow>
        <div className="credentials-grid">
          <article><h3>Union shop</h3><p>A skilled union team with the craft discipline and jobsite readiness commercial work requires.</p></article>
          <article><h3>AWI certified</h3><p>Standards-led workmanship for architectural woodwork that has to meet demanding project expectations.</p></article>
          <article><h3>QCP certified</h3><p>Quality control woven into the process, from shop drawings through fabrication and finish.</p></article>
        </div>
      </section>
      <SectionRule />

      <section className="union-affiliation section-shell">
        <figure className="union-affiliation__logo"><img src={assets.midAmericaCarpentersLogo} alt="Mid-America Carpenters Regional Council logo." /></figure>
        <div><Eyebrow>Union craftsmanship</Eyebrow><h2>Proudly <em>union.</em></h2></div>
        <p>CKC is a proud Mid-America Carpenters union shop. The Regional Council represents more than 58,000 trained professionals across Missouri and the Midwest.</p>
      </section>
      <SectionRule />

      <section className="team-section section-shell" aria-labelledby="team-title">
        <div className="team-section__heading"><Eyebrow>Leadership & team</Eyebrow><h2 id="team-title">The people<br /><em>behind CKC.</em></h2></div>
        <div className="team-groups">
          {teamGroups.map((group) => <section className="team-group" key={group.title} aria-labelledby={`team-${group.title.replace(/[^a-z]+/gi, "-").toLowerCase()}`}><h3 id={`team-${group.title.replace(/[^a-z]+/gi, "-").toLowerCase()}`}>{group.title}</h3><div className={`team-grid ${group.title === "Leadership" ? "team-grid--leadership" : "team-grid--compact"}`}>{group.members.map((member) => <article className="team-card" key={member.name}><figure><div className="team-card__silhouette" aria-hidden="true"><svg viewBox="0 0 240 270" focusable="false"><circle cx="120" cy="79" r="47" /><path d="M28 256c3-72 39-111 92-111s89 39 92 111H28Z" /></svg></div><figcaption><span>{member.role}</span><h4>{member.name}</h4></figcaption></figure></article>)}</div></section>)}
        </div>
      </section>
      <SectionRule />

      <section className="careers-panel section-shell" aria-labelledby="careers-title">
        <div><Eyebrow>Careers</Eyebrow><h2 id="careers-title">Build your<br /><em>career with CKC.</em></h2></div>
        <Link href="/careers" className="careers-opening careers-opening--link"><div><span>Current opening</span><h3>Bench Hand /<br />Cabinet Maker</h3><p>Join an experienced team producing custom commercial cabinetry, casework, and architectural woodwork in St. Louis.</p></div><span className="careers-opening__email">View opening <ArrowUpRight aria-hidden="true" /></span></Link>
      </section>
      <SectionRule />

      <section className="relationship-panel section-shell">
        <div>
          <Eyebrow>The CKC difference</Eyebrow>
          <h2>Quality work.<br /><em>Better working relationships.</em></h2>
        </div>
        <div className="relationship-panel__content">
          <div className="relationship-panel__copy">
            <p>Clients choose CKC for the way the work is managed as much as the way it is made. More than four decades of commercial experience has taught us that the right details are only part of a successful project.</p>
            <p>Our team listens early, communicates directly, and stays close to the decisions that matter—from scope and material intent to shop drawings, fabrication, and finish. That steady involvement brings clarity to the process and confidence to everyone depending on the work.</p>
          </div>
          <div className="relationship-panel__principles">
            <article><h3>Responsive service</h3><p>Direct answers, clear expectations, and a team that treats every conversation as part of the job.</p></article>
            <article><h3>Practical expertise</h3><p>Knowledge earned across commercial scopes, complex details, and the realities of a working space.</p></article>
            <article><h3>Long-term accountability</h3><p>Work we are proud to stand behind—and relationships clients return to for the next project.</p></article>
          </div>
        </div>
      </section>
      <SectionRule />

      <section className="about-image-spread section-shell">
        <figure className="about-image-spread__feature"><img src={assets.micdsCommons} alt="CKC wood ceiling and wall millwork in an education commons." /></figure>
        <div className="about-image-spread__copy"><Eyebrow>What lasts</Eyebrow><p>The best commercial woodwork feels inevitable. It supports the people using a space, carries the architecture forward, and holds up to the real demands of the day.</p><Link href="/services" className="button button--olive">Explore capabilities <ArrowRight aria-hidden="true" /></Link></div>
        <figure className="about-image-spread__detail"><img src={assets.micdsCorridor} alt="CKC wood millwork detail in a commercial interior corridor." /></figure>
      </section>
      <SectionRule />

      <section className="residential-division section-shell" aria-labelledby="residential-division-title">
        <a className="residential-division__logo" href="https://mouldingstl.com/" target="_blank" rel="noreferrer" aria-label="Visit Moulding Saint Louis"><img src={assets.mouldingStLouisLogo} alt="Moulding Saint Louis — Made in Wood" /><ArrowUpRight aria-hidden="true" /></a>
        <div><Eyebrow>Meet our residential division</Eyebrow><h2 id="residential-division-title">Moulding<br /><em>Saint Louis.</em></h2></div>
        <div className="residential-division__copy"><p>Explore the residential side of our craft.</p><a className="text-link" href="https://mouldingstl.com/" target="_blank" rel="noreferrer">Visit Moulding Saint Louis <ArrowUpRight aria-hidden="true" /></a></div>
      </section>
    </Layout>
  );
}

export function CareersPage() {
  return (
    <Layout>
      <section className="page-hero page-hero--careers">
        <div className="page-hero__copy"><Eyebrow>Careers at CKC</Eyebrow><h1>Build work<br />that <em>stands up.</em></h1><p>Join a St. Louis commercial woodshop where quality, experience, and a well-made piece still matter.</p></div>
        <figure className="page-hero__image"><img src={assets.shopProduction} alt="Custom commercial millwork and casework in production at CKC Woodworks." /><figcaption>Inside the CKC shop / St. Louis</figcaption></figure>
      </section>
      <SectionRule />

      <section className="careers-listing section-shell" aria-labelledby="current-opening-title">
        <div className="careers-listing__heading"><Eyebrow>Current opportunity</Eyebrow><h2 id="current-opening-title">Bench Hand /<br /><em>Cabinet Maker</em></h2></div>
        <article className="careers-listing__opening"><p>CKC is looking for a bench hand / cabinet maker to help produce custom commercial cabinetry, casework, and architectural woodwork in our St. Louis shop.</p><div className="careers-listing__details"><div><span>Role</span><strong>Shop-based fabrication</strong></div><div><span>Contact</span><a href="mailto:info@ckcwoodworks.com?subject=Bench%20Hand%20Cabinet%20Maker%20Inquiry">info@ckcwoodworks.com <ArrowUpRight aria-hidden="true" /></a></div></div></article>
      </section>
    </Layout>
  );
}

const serviceCards = serviceCatalog;

export function ServicesPage() {
  return (
    <Layout>
      <section className="page-hero page-hero--services">
        <figure className="page-hero__image"><img src={assets.micdsCommons} alt="CKC architectural wood ceiling and wall millwork in an education commons." /><figcaption>Commercial capability</figcaption></figure>
        <div className="page-hero__copy"><Eyebrow>Commercial capability</Eyebrow><h1>The right layer.<br /><em>Built the right way.</em></h1><p>CKC combines the material intelligence of a custom woodshop with the rigor of commercial fabrication and finish work.</p></div>
      </section>
      <SectionRule />

      <section className="services-ledger section-shell">
        <Eyebrow>What CKC makes</Eyebrow>
        <div className="services-ledger__grid">
          {serviceCards.map((service) => <Link href={`/services/${service.slug}`} key={service.slug} className="service-card"><div className="service-card__meta service-card__meta--icon"><ArrowUpRight aria-hidden="true" /></div><h2>{service.title}</h2><p>{service.cardCopy}</p><figure><img src={service.image} alt={service.alt} /></figure></Link>)}
          <Link href="/contact" className="service-card service-card--cta"><div className="service-card__meta service-card__meta--icon"><ArrowUpRight aria-hidden="true" /></div><h2>Contact<br /><em>us.</em></h2><p>Have a commercial woodwork scope in mind? Send CKC a note to begin the conversation.</p><span className="service-card__email">info@ckcwoodworks.com</span></Link>
        </div>
      </section>
      <SectionRule />

      <section className="process-section section-shell section-shell--bone">
        <div><Eyebrow>How we work</Eyebrow><h2>Clarity at every<br /><em>critical point.</em></h2></div>
        <ol className="process-list">
          <li><div><h3>Align</h3><p>Review the drawings, material intent, schedule, and conditions that shape the work.</p></div></li>
          <li><div><h3>Coordinate</h3><p>Bring scope, field conditions, shop drawings, and finish expectations into focus.</p></div></li>
          <li><div><h3>Fabricate</h3><p>Build with care for fit, finish, repetition, and the hard-working reality of the space.</p></div></li>
          <li><div><h3>Finish</h3><p>Complete the final shop details with a clear focus on material quality and consistency.</p></div></li>
        </ol>
      </section>
    </Layout>
  );
}

function ServiceDetailPage({ slug }: { slug: string }) {
  const service = serviceCatalog.find((item) => item.slug === slug);
  if (!service) return <NotFoundPage />;
  const currentIndex = serviceCatalog.findIndex((item) => item.slug === slug);
  const nextService = serviceCatalog[(currentIndex + 1) % serviceCatalog.length];

  return (
    <Layout>
      <section className="page-hero page-hero--services service-page-hero">
        <figure className="page-hero__image"><img src={service.heroImage ?? service.image} alt={service.heroAlt ?? service.alt} /><figcaption>{service.title}</figcaption></figure>
        <div className="page-hero__copy"><Eyebrow>{service.title}</Eyebrow><h1>{service.heroLine}<br /><em>{service.heroAccent}</em></h1><p>{service.cardCopy}</p><Link href="/contact" className="text-link">Discuss this scope <ArrowUpRight aria-hidden="true" /></Link></div>
      </section>
      <SectionRule />

      <section className="service-page-summary section-shell">
        <div><Eyebrow>Service scope</Eyebrow><h2>{service.title}<br /><em>with the details resolved.</em></h2></div>
        <div className="service-page-summary__content"><p>{service.overview}</p><ul>{service.scope.map((item) => <li key={item}>{item}</li>)}</ul></div>
      </section>
      <SectionRule />

      <section className="service-page-next section-shell section-shell--olive">
        <Eyebrow>Explore more</Eyebrow>
        <div><p>Next service</p><Link href={`/services/${nextService.slug}`}>{nextService.title}<ArrowRight aria-hidden="true" /></Link><Link href="/services" className="text-link">All services <ArrowUpRight aria-hidden="true" /></Link></div>
      </section>
    </Layout>
  );
}

export function ArchitecturalMillworkPage() { return <ServiceDetailPage slug="architectural-millwork" />; }
export function CabinetryCaseworkPage() { return <ServiceDetailPage slug="custom-cabinetry-casework" />; }
export function CommercialFixturesPage() { return <ServiceDetailPage slug="commercial-fixtures" />; }
export function CncMachiningPage() { return <ServiceDetailPage slug="cnc-machining" />; }
export function CountertopsSpecialtyShapesPage() { return <ServiceDetailPage slug="countertops-specialty-shapes" />; }
export function CustomFinishesVeneerPage() { return <ServiceDetailPage slug="custom-finishes-veneer" />; }
export function ShopDrawingsDesignAssistPage() { return <ServiceDetailPage slug="shop-drawings-design-assist" />; }

function LogoWall({ logos, kind }: { logos: Array<LogoPlaceholder | ClientLogo>; kind: "Client" | "Partner" }) {
  return <div className="logo-wall">{logos.map((logo, index) => {
    const isOfficialLogo = "src" in logo;
    const isCkcSignoff = isOfficialLogo && logo.featured;
    const isEnterpriseCenter = isOfficialLogo && logo.name === "Enterprise Center";
    const isWashuMedicine = isOfficialLogo && logo.name === "Washington University School of Medicine";
    const isHospitalLogo = isOfficialLogo && ["SSM Health Cardinal Glennon Children’s Hospital", "St. Louis Children’s Hospital"].includes(logo.name);
    const retainsLightIconDetail = isOfficialLogo && ["Enterprise Center", "Mercy Hospital", "Washington University School of Medicine"].includes(logo.name);
    return <article key={logo.name} className={`logo-card ${isOfficialLogo ? "logo-card--official" : `logo-card--${logo.treatment}`} ${isCkcSignoff ? "logo-card--more" : ""} ${isEnterpriseCenter ? "logo-card--enterprise" : ""} ${isWashuMedicine ? "logo-card--washu" : ""} ${isHospitalLogo ? "logo-card--hospital" : ""} ${retainsLightIconDetail ? "logo-card--detail" : ""}`}>{isOfficialLogo ? <><img className="logo-card__image" src={logo.src} alt={isCkcSignoff ? "CKC Woodworks logo" : `${logo.name} logo`} />{isCkcSignoff && <h2>And many<br /><em>more!</em></h2>}</> : <><div className="logo-card__mark">{logo.monogram}</div><h2>{logo.name}</h2></>}</article>;
  })}</div>;
}

export function PortfolioPage() {
  return (
    <Layout>
      <section className="logo-page section-shell">
        <div className="logo-page__heading logo-page__heading--portfolio"><h1>Client<br /><em>portfolio.</em></h1></div>
        <LogoWall logos={portfolioLogos} kind="Client" />
      </section>
    </Layout>
  );
}

// Archived from public navigation and routing; preserve for future reactivation.
export function PartnersPage() {
  return (
    <Layout>
      <section className="logo-page logo-page--partners section-shell">
        <div className="logo-page__heading"><Eyebrow>Our partners</Eyebrow><h1>Built with<br /><em>good company.</em></h1><p>Temporary logo placeholders</p></div>
        <LogoWall logos={partnerLogos} kind="Partner" />
      </section>
    </Layout>
  );
}

export function ContactPage() {
  return (
    <Layout>
      <section className="contact-hero">
        <figure className="contact-hero__image"><img src={assets.micdsLoungeWide} alt="CKC commercial interior woodwork in a gathering space." /><figcaption>CKC Woodworks / St. Louis</figcaption></figure>
        <div className="contact-hero__copy">
          <Eyebrow>Start a conversation</Eyebrow>
          <h1>Let’s make<br /><em>something lasting.</em></h1>
          <p>Send the project type, scope, and materials you have in mind. We will be in touch.</p>
          <a className="contact-hero__email" href="mailto:info@ckcwoodworks.com?subject=CKC%20Woodworks%20Project%20Inquiry">info@ckcwoodworks.com <ArrowUpRight aria-hidden="true" /></a>
          <ContactForm variant="dark" formLocation="contact-page" />
        </div>
      </section>
      <SectionRule />
      <section className="contact-details section-shell">
        <Eyebrow>Find CKC</Eyebrow>
        <div className="contact-details__grid">
          <article><Mail aria-hidden="true" /><span>Email</span><a href="mailto:info@ckcwoodworks.com">info@ckcwoodworks.com</a></article>
          <article><Phone aria-hidden="true" /><span>Phone</span><a href="tel:3143838222">314-383-8222</a></article>
          <article><MapPin aria-hidden="true" /><span>Visit</span><a href="https://maps.google.com/?q=1750+Salzman+Ave+St+Louis+MO+63133" target="_blank" rel="noreferrer">1750 Salzman Ave<br />St. Louis, Missouri 63133 <ArrowUpRight aria-hidden="true" /></a></article>
        </div>
      </section>
    </Layout>
  );
}

function galleryProjectIndexFromLocation(location: string) {
  const query = typeof window === "undefined"
    ? location.split("?", 2)[1]?.split("#", 1)[0] ?? ""
    : window.location.search.slice(1);
  const collection = new URLSearchParams(query).get("collection");
  const index = galleryProjects.findIndex((project) => project.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") === collection);
  return index === -1 ? 0 : index;
}

export function GalleryPage() {
  const [location] = useLocation();
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [activeImage, setActiveImage] = useState<GalleryImage | null>(null);
  useEffect(() => {
    setActiveProjectIndex(galleryProjectIndexFromLocation(location));
  }, [location]);
  const activeProject = galleryProjects[activeProjectIndex];
  function selectProject(index: number, returnToWork = false) {
    setActiveProjectIndex(index);
    setActiveImage(null);
    if (returnToWork) {
      requestAnimationFrame(() => document.getElementById("gallery-work")?.scrollIntoView({ behavior: "smooth", block: "start" }));
    }
  }
  function moveImage(direction: -1 | 1) {
    if (!activeImage) return;
    const activeImageIndex = galleryImages.findIndex((image) => image.src === activeImage.src);
    setActiveImage(galleryImages[(activeImageIndex + direction + galleryImages.length) % galleryImages.length]);
  }
  return (
    <Layout showSectionRules={false}>
      <section className={`gallery-hero ${activeProject.title === "Cabinetry & Casework" ? "gallery-hero--cabinetry" : ""}`}>
        {activeProject.title === "Cabinetry & Casework" && <img src={activeProject.cover} alt="" aria-hidden="true" className="gallery-hero__backdrop" />}
        <img src={activeProject.cover} alt={activeProject.alt} className="gallery-hero__image" />
        <div className="gallery-hero__veil" />
        <div className="gallery-hero__content">
          <Eyebrow>Project gallery</Eyebrow>
          <h1>{activeProject.title}<br /><em>gallery.</em></h1>
          <p>Selected CKC work.</p>
        </div>
        <div className="gallery-hero__label">CKC portfolio photography</div>
      </section>
      <section className="gallery-project-nav section-shell" aria-label="Select gallery project">
        {galleryProjects.map((project, index) => <button key={project.title} type="button" className={activeProjectIndex === index ? "is-active" : ""} onClick={() => selectProject(index)} aria-pressed={activeProjectIndex === index}><img src={project.cover} alt="" /><strong>{project.title}</strong><ArrowUpRight aria-hidden="true" /></button>)}
      </section>
      <section id="gallery-work" className="gallery-grid-section section-shell">
        <div className="gallery-grid-section__heading"><Eyebrow>{activeProject.title}</Eyebrow><span>Project gallery</span></div>
        <div className="gallery-grid">
          {activeProject.images.map((image) => <button key={image.src} className={`gallery-item ${image.shape}`} type="button" onClick={() => setActiveImage(image)}><img src={image.src} alt={image.alt} /><span>{image.label}</span><Plus aria-hidden="true" /></button>)}
        </div>
      </section>
      <section className="gallery-roll section-shell section-shell--olive" aria-labelledby="gallery-roll-title">
        <div className="gallery-roll__heading">
          <Eyebrow>Explore the work</Eyebrow>
          <h2 id="gallery-roll-title">Find the right<br /><em>project type.</em></h2>
        </div>
        <div className="gallery-roll__links">
          {galleryProjects.map((project, index) => <button key={project.title} type="button" className={activeProjectIndex === index ? "is-active" : ""} onClick={() => selectProject(index, true)} aria-pressed={activeProjectIndex === index}><span>{project.title}</span><ArrowUpRight aria-hidden="true" /></button>)}
        </div>
      </section>
      {activeImage && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={activeImage.label}>
          <button type="button" className="lightbox__close" onClick={() => setActiveImage(null)} aria-label="Close image"><X aria-hidden="true" /></button>
          <button type="button" className="lightbox__previous" onClick={() => moveImage(-1)} aria-label="Previous image"><ArrowLeft aria-hidden="true" /></button>
          <figure><img src={activeImage.src} alt={activeImage.alt} /><figcaption>{activeImage.label}</figcaption></figure>
          <button type="button" className="lightbox__next" onClick={() => moveImage(1)} aria-label="Next image"><ArrowRight aria-hidden="true" /></button>
        </div>
      )}
    </Layout>
  );
}

export function NotFoundPage() {
  return <Layout><section className="not-found section-shell"><Eyebrow>404</Eyebrow><h1>This room isn’t<br /><em>on the plan.</em></h1><Link href="/" className="button button--olive">Back to CKC <ArrowRight aria-hidden="true" /></Link></section></Layout>;
}
