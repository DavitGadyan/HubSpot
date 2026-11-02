---
title: "Migrating 110K Records From Salesforce While Rebuilding Five Pipelines From Scratch"
client: "Membership and events organization"
industry: "Lifestyle & Consumer"
size: "11-50 Employees"
hubs: ["Sales", "Service"]
useCases: ["foundation-data", "foundation-access", "governance"]
metrics:
  - { value: "110K", label: "records migrated" }
  - { value: "5", label: "pipelines rebuilt" }
  - { value: "0", label: "leads lost during cutover" }
readiness: { before: 28, after: 84 }
stack: ["Sales Hub Enterprise", "Service Hub Professional", "Salesforce export API", "Custom objects", "Import mapping"]
status: published
sample: true
featured: true
date: "2026-06-21"
summary: "A decade of Salesforce customization had to become a clean HubSpot portal without a day of downtime for sales. We migrated in waves, deduplicated on the way in, and rebuilt only the pipelines the team still used."
---

## Challenge

Ten years of Salesforce had produced 180 custom fields, eleven record types and reports nobody could explain. The organization wanted HubSpot for its marketing and service tools, but the sales team could not stop selling during the move.

## Approach

- Inventoried every Salesforce field and kept 64 of 180. Each surviving field got a HubSpot property with a written description and an owner.
- Migrated in three waves (companies, contacts, then deals and activities) with a two-week parallel-run window where both systems were live.
- Deduplicated during import by email and domain, merging 3,100 contacts and 740 companies before they ever hit HubSpot.
- Rebuilt five pipelines (membership, sponsorship, events, partnerships, renewals) with stage criteria, and retired six legacy ones.
- Set up permission sets per team so sales, events and service see the same records with the right edit rights.

## Results

- 110,000 records migrated with activity history, 0 leads lost during cutover.
- Five pipelines live on day one with reps trained by role.
- Custom fields cut by 64%, every remaining one documented.

## AI-readiness impact

Readiness went from 28 to 84. Permissions were aligned across teams, lifecycle stages were set at import, and property sprawl was fixed before it could confuse AI. The portal was ready for a Customer Agent on member support within the first month.
