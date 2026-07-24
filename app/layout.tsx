import type { Metadata } from "next";
import { Sora, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";
import { rootGraph } from "@/lib/schema";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { JsonLd } from "@/components/ui/JsonLd";

// Self-hosted via next/font — zero render-blocking font requests.
const sora = Sora({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-sora",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.brand} — ${site.tagline}`,
    template: `%s | ${site.brand}`,
  },
  description: site.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${inter.variable} ${plexMono.variable}`}
    >
      <body>
        <JsonLd data={rootGraph()} />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
