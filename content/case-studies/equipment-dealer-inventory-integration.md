---
title: "An Equipment Sales CRM With a Live Inventory API and Prospecting Guardrails for a Dealer"
client: "Heavy equipment dealer"
industry: "Logistics & Operations"
size: "11-50 Employees"
hubs: ["Sales"]
useCases: ["foundation-data", "prospecting-agent", "governance"]
metrics:
  - { value: "2,300", label: "inventory records synced daily" }
  - { value: "100%", label: "quotes tied to a real unit" }
  - { value: "50/day", label: "outreach cap with human review" }
readiness: { before: 36, after: 82 }
stack: ["Sales Hub Professional", "Custom object: Units", "Inventory API integration", "Sequences", "Breeze Prospecting Agent"]
engagement: "Inventory integration & Prospecting Agent"
duration: "6 weeks"
status: published
sample: true
featured: false
date: "2025-09-30"
summary: "Reps quoted from a PDF inventory list that was always a week old. A custom Units object synced from the inventory system put live stock on every deal, and gave the Prospecting Agent something true to say."
---

## Challenge

Sales reps sold equipment from a weekly PDF. By the time a quote went out, the unit was often sold. Follow-ups with past buyers were manual and inconsistent, and the company wanted to use AI outreach without embarrassing itself.

## Approach

- Built a *Units* custom object synced nightly from the inventory API: model, hours, location, price, status.
- Associated units to deals and quotes so every quote references a real, available unit.
- Created a cold-lead list of past buyers with no activity in 90 days and no open deal.
- Configured the Prospecting Agent in semi-autonomous mode on that list, with a 50-per-day cap, Brand Voice set from the best rep's emails, and the first 20 drafts reviewed before anything sent.

## Results

- 2,300 inventory records synced daily; no more quoting sold units.
- 100% of quotes tied to an available unit.
- Outreach runs at a controlled 50 per day with a human approving each email.

## AI-readiness impact

Readiness went from 36 to 82. The Prospecting Agent checks (ICP fields, semi-autonomous mode, send cap, cold-lead list) all pass, and the agent references live inventory rather than a stale PDF.
