import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import shopPhoto from "../public/images/ckc-woodworks-shop-overview.jpg";
import residentialLogo from "../public/images/moulding-saint-louis-logo.png";

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      {diagonal ? <path d="M6 18 18 6M6 6h12v12" /> : <path d="M4 12h15m-6-6 6 6-6 6" />}
    </svg>
  );
}

function ContactIcon({ kind }: { kind: "phone" | "email" | "location" }) {
  const paths: Record<typeof kind, ReactNode> = {
    phone: <path d="m8 3 3 5-3 2c1 3 3 5 6 6l2-3 5 3c0 3-2 5-5 4C9 18 5 14 3 7 2 4 5 2 8 3Z" />,
    email: <><rect x="3" y="5" width="18" height="14" rx="1" /><path d="m3 6 9 7 9-7" /></>,
    location: <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">{paths[kind]}</svg>;
}

function ShopPhoto() {
  return (
    <figure className="craft-panel">
      <div className="craft-panel-top"><span>A CLOSER LOOK</span><span>01 / CKC</span></div>
      <Image className="shop-photo" src={shopPhoto} alt="A view across the CKC Woodworks shop in St. Louis, with woodworking equipment, custom cabinetry, and workbenches." sizes="(max-width: 760px) 90vw, (max-width: 1600px) 38vw, 560px" placeholder="blur" preload />
      <figcaption className="craft-panel-bottom"><span>The same care.<br /><em>A fresh perspective.</em></span><span className="craft-cross" aria-hidden="true">+</span></figcaption>
    </figure>
  );
}

export default function Home() {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="site-header">
        <Link className="wordmark" href="/" aria-label="CKC Woodworks home"><span className="wordmark-ckc">CKC<span className="brand-dot">.</span></span><span className="wordmark-description">WOODWORKS<br /><span>ST. LOUIS, MISSOURI</span></span></Link>
        <a className="header-contact" href="tel:+13143838222"><span>Have a project in mind?</span> Let&apos;s talk <Arrow diagonal /></a>
      </header>
      <main id="main-content">
        <section className="hero" aria-labelledby="launch-heading">
          <div className="hero-copy">
            <p className="eyebrow"><span className="status-dot" /> A NEW WEBSITE IS COMING SOON</p>
            <h1 id="launch-heading">A new chapter.<br /><em>The same craft.</em></h1>
            <p className="hero-description">We&apos;re crafting a fresh online experience for CKC Woodworks. A better way to explore our work, find inspiration, and bring your next project to life.</p>
            <p className="hero-reassurance">Our website is getting an update. Our team is ready to help.</p>
            <div className="hero-actions">
              <a className="button button-primary" href="tel:+13143838222">Let&apos;s talk about your project <Arrow /></a>
              <a className="text-link" href="mailto:scromer@ckcwoodworks.com">Email our team <Arrow diagonal /></a>
            </div>
          </div>
          <ShopPhoto />
        </section>
        <section className="contact-section" aria-labelledby="contact-heading">
          <div className="section-intro"><h2 id="contact-heading">Good work starts with a conversation.</h2><p>Let&apos;s make something great together.</p></div>
          <div className="contact-grid">
            <a className="contact-card" href="tel:+13143838222"><ContactIcon kind="phone" /><div><span className="contact-label">GIVE US A CALL</span><span className="contact-value">314-383-8222</span></div><Arrow diagonal /></a>
            <a className="contact-card" href="mailto:scromer@ckcwoodworks.com"><ContactIcon kind="email" /><div><span className="contact-label">DROP US A NOTE</span><span className="contact-value contact-email">scromer@ckcwoodworks.com</span></div><Arrow diagonal /></a>
            <a className="contact-card" href="https://www.google.com/maps/search/?api=1&query=1750+Salzman+St.+Louis+MO" target="_blank" rel="noopener noreferrer"><ContactIcon kind="location" /><div><span className="contact-label">FIND US IN ST. LOUIS</span><address className="contact-value">1750 Salzman<br />St. Louis, MO</address></div><Arrow diagonal /><span className="sr-only"> (opens Google Maps in a new tab)</span></a>
          </div>
        </section>
        <section className="residential-section" aria-labelledby="residential-heading">
          <Image className="residential-logo" src={residentialLogo} alt="Moulding Saint Louis — Made in Wood" sizes="150px" />
          <div className="residential-copy"><p className="eyebrow">MEET OUR NEW RESIDENTIAL DIVISION</p><h2 id="residential-heading">Moulding Saint Louis</h2><p>While you wait, explore the website for our new residential division, Moulding Saint Louis. Your next idea might start there.</p></div>
          <a className="button button-residential" href="https://mouldingstl.com/" target="_blank" rel="noopener noreferrer">Explore Moulding Saint Louis <Arrow diagonal /><span className="sr-only"> (opens in a new tab)</span></a>
        </section>
      </main>
      <footer className="site-footer"><span>CKC Woodworks</span><span>Thoughtfully made. Right here in St. Louis.</span><a href="mailto:scromer@ckcwoodworks.com">Stay in touch <Arrow diagonal /></a></footer>
    </div>
  );
}
