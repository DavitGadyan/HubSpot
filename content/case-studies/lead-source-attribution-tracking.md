---
title: "Every Enquiry Traced to the Click That Paid for It: 0 of 3 → 3 of 3 Conversion Routes Measured"
client: "B2B services firm"
industry: "Marketing & B2B Services"
size: "Undisclosed"
hubs: ["Marketing", "Data"]
useCases: ["foundation-data", "governance"]
metrics:
  - { value: "0 → 3 of 3", label: "enquiry routes measured" }
  - { value: "1 → 116", label: "indexable pages" }
  - { value: "11.58 → 1.21 MB", label: "page weight" }
stack: ["GA4", "Google Tag Manager", "Google Ads click-ID capture", "Python", "FastAPI", "PostgreSQL", "Playwright"]
status: published
featured: true
date: "2026-08-29"
image: "https://davitgadyan.github.io/portfolio_app/images/portfolio/ai-marketing-card.png"
sourceUrl: "https://davitgadyan.github.io/portfolio_app/portfolio/project-38/"
---

## Challenge

Analytics was installed and reporting, so nobody suspected a problem. But every way a buyer actually made contact (an off-site form handler, scroll-only buttons, LinkedIn and WhatsApp links) bypassed it completely. The business knew its traffic but could not answer the only question that matters: *which source produced customers?*

That is exactly the **"lead source data nobody trusts"** problem that breaks AI scoring and routing in a CRM. If source is wrong at capture, every downstream model learns from a guess.

## Approach

- Audited every conversion route and reported plainly what was and was not being counted.
- Instrumented each route as a GA4 key event through Tag Manager, including off-site forms and DM links.
- Captured the Google Ads click ID (gclid/gbraid/wbraid) with each enquiry so a lead traces to the exact paid click.
- Automated verification with Playwright so every event is proven to fire, not assumed.

## Results

- Enquiry routes measured went from **0 of 3 to 3 of 3**.
- Google ad click ID captured on enquiries, so spend can be judged on customers rather than clicks.
- Page weight cut from **11.58 MB to 1.21 MB** (one image 6.67 MB → 102 KB).
- Pages search engines could index: **1 → 116**, with schema rewritten for search and AI answer engines.

## How this applies to HubSpot AI

The same method fixes original-source and lead-source properties in HubSpot before they feed AI lead scoring, Breeze Intelligence ICP filters or attribution reports: trace every capture route, write the source at the moment of conversion, and prove it with test records before any agent depends on it.
