import type { Metadata } from "next";
import { Cormorant_Garamond, Zilla_Slab } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
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
  metadataBase: new URL("https://ckcwoodworks.com"),
  title: "CKC Woodworks | A New Website Is Coming Soon",
  description:
    "A new chapter. The same craft. A fresh CKC Woodworks website is on the way. Contact our St. Louis team at 314-383-8222 or explore Moulding Saint Louis.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "CKC Woodworks | A New Chapter. The Same Craft.",
    description: "Our new website is coming soon. Our team is ready to help with your next project.",
    url: "/",
    siteName: "CKC Woodworks",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
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
      <body>{children}</body>
      <GoogleAnalytics gaId="G-WLYT8DJC9P" />
    </html>
  );
}
