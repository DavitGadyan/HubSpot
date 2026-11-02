/** Brand + contact settings. Change these to rebrand the whole site. */
export const site = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? "Gadyan AI Ops",
  tagline: "HubSpot AI readiness, audits and agent implementation",
  description:
    "Find out whether your HubSpot portal is ready for Breeze AI agents. Free AI-readiness audit, live portal scan and a prioritized optimization plan for every use case.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  owner: "David Gadyan",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
  bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL ?? "",
  portfolioUrl: "https://davitgadyan.github.io/portfolio_app/",
  nav: [
    { href: "/audit", label: "Free audit" },
    { href: "/use-cases", label: "Use cases" },
    { href: "/case-studies", label: "Case studies" },
  ],
};

export function bookingHref() {
  if (site.bookingUrl) return site.bookingUrl;
  if (site.email) return `mailto:${site.email}?subject=${encodeURIComponent("HubSpot AI readiness review")}`;
  return "/audit";
}
