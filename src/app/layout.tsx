import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { site } from "@/config/site";
import "./globals.css";

const sans = Geist({ variable: "--font-sans", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });
const display = Instrument_Serif({ variable: "--font-display", subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name}: Is your HubSpot ready for AI agents?`, template: `%s | ${site.name}` },
  description: site.description,
  openGraph: { siteName: site.name, type: "website" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${mono.variable} ${display.variable} min-h-dvh flex flex-col`}>
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
