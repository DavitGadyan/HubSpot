import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { site } from "@/config/site";
import "./globals.css";

// Primary typeface is PP Neue Montreal, loaded via @font-face from /public/fonts (see globals.css).
// Inter is the fallback until the licensed files are added.
const fallback = Inter({ variable: "--font-fallback", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name}: Is your HubSpot ready for AI agents?`, template: `%s | ${site.name}` },
  description: site.description,
  openGraph: { siteName: site.name, type: "website" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fallback.variable} ${mono.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
