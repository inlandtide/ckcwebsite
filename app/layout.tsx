import type { Metadata } from "next";
import { Cormorant_Garamond, Zilla_Slab } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import {
  siteUrl,
  siteName,
  siteTitle,
  siteDescription,
  socialImage,
  siteStructuredData,
} from "./data/seo";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const zilla = Zilla_Slab({
  subsets: ["latin"],
  variable: "--font-zilla",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: siteTitle, template: `%s | ${siteName}` },
  description: siteDescription,
  alternates: { canonical: "/" },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: "/",
    siteName,
    locale: "en_US",
    type: "website",
    images: [{
      url: socialImage,
      alt: "CKC Woodworks shop in St. Louis, Missouri",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [{ url: socialImage, alt: "CKC Woodworks shop in St. Louis, Missouri" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const fontClassName = [cormorant.variable, zilla.variable].join(" ");

  return (
    <html lang="en" className={fontClassName}>
      <body>
        {children}
        <script
          id="ckc-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(siteStructuredData).replace(/</g, "\\u003c"),
          }}
        />
      </body>
      <GoogleAnalytics gaId="G-WLYT8DJC9P" />
    </html>
  );
}
