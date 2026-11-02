---
title: "8,412 Duplicate Records Merged Plus a Two-Way NetSuite Sync for an Education Publisher"
client: "Educational assessments publisher"
industry: "Education & Nonprofit"
size: "51-200 Employees"
hubs: ["Sales", "Marketing", "Operations"]
useCases: ["foundation-data", "governance"]
metrics:
  - { value: "8,412", label: "duplicate records merged" }
  - { value: "2-way", label: "NetSuite ↔ HubSpot sync" }
  - { value: "99.6%", label: "customer records matched" }
readiness: { before: 26, after: 86 }
stack: ["Operations Hub Professional", "NetSuite", "Data sync", "Custom object: District hierarchy", "Dedupe scripts"]
status: published
sample: true
featured: true
date: "2026-05-11"
summary: "Schools, districts and billing accounts existed three times each. We merged the duplicates, modelled the district hierarchy, and synced NetSuite so finance and sales stop reconciling by hand."
---

## Challenge

Each school had been created separately by marketing imports, sales reps and a one-way NetSuite push. The same district appeared as "Springfield USD", "Springfield Unified" and a NetSuite customer ID. Account-level reporting was impossible and AI summaries would have been wrong by construction: the relationships were technically present, but told a third of the story.

## Approach

- Matched records across the three sources by domain, NCES ID and fuzzy name, with a manual review queue for the 4% of ambiguous matches.
- Merged 8,412 duplicates across contacts and companies, preserving activity history and deal associations.
- Built a *District → School → Contact* hierarchy with a custom object and parent–child company associations, so a deal at a district rolls up correctly.
- Configured a two-way NetSuite sync: customers and invoices into HubSpot, closed-won deals and billing contacts into NetSuite, with NetSuite as the system of record for billing.
- Added duplicate prevention: required email on forms, domain-based company association, and a weekly duplicate report owned by RevOps.

## Results

- 8,412 duplicates gone and 99.6% of customers matched to a single NetSuite account.
- Finance stopped reconciling invoices against HubSpot by hand.
- Renewal reports now roll up by district for the first time.

## AI-readiness impact

Readiness climbed from 26 to 86. Associations now tell the whole account story, which is what Breeze account summaries and a Prospecting Agent targeting districts need.
