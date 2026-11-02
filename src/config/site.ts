/** Brand + contact settings. Change these to rebrand the whole site. */
export const site = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? "HubAIOps",
  tagline: "HubSpot optimization, AI-readiness audits and Breeze agent implementation",
  description:
    "HubAIOps gets HubSpot portals ready for AI. Free AI-readiness audit, read-only portal scan, and a prioritized optimization plan for every Breeze agent use case.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  owner: "HubAIOps",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
  bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL ?? "",
  /** Small footnote shown under case studies. Set to "" to hide it. */
  caseStudyDisclosure:
    "Client names are withheld. Where a client has not approved public disclosure, figures are representative of HubAIOps engagements of that type.",
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
