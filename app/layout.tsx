import type { Metadata } from "next";
import { Cormorant_Garamond, Zilla_Slab } from "next/font/google";
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
  metadataBase: new URL("https://ckc.mouldingstl.com"),
  title: "Coming Soon",
  description: "The CKC website is coming soon.",
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
    </html>
  );
}
