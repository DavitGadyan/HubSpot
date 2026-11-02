---
title: "Custom Integration Captures Every Field From a Lead Marketplace, Doubling First-Response Speed"
client: "Specialty lender"
industry: "Financial Services"
size: "11-50 Employees"
hubs: ["Marketing", "Sales"]
useCases: ["foundation-data", "prospecting-agent"]
metrics:
  - { value: "12 → 34", label: "lead fields captured per lead" }
  - { value: "2x", label: "faster first response" }
  - { value: "100%", label: "leads with a trusted source" }
readiness: { before: 41, after: 84 }
stack: ["Marketing Hub Professional", "Sales Hub Professional", "Custom API integration", "Lead routing workflows", "Lead scoring"]
engagement: "Custom API integration & routing"
duration: "4 weeks"
status: published
sample: true
featured: false
date: "2025-11-17"
summary: "A lead marketplace sent rich data that the native connector dropped on the floor. A custom integration captured all of it, so routing and scoring finally had something to work with."
---

## Challenge

The company bought leads from a marketplace. The native connector created a contact with a name and email and discarded the other 22 fields: loan amount, timeline, property type, credit band. Reps called every lead cold because nothing was in the CRM.

## Approach

- Built a custom integration from the marketplace API to HubSpot, mapping all 34 fields to properties with controlled values.
- Set original source and lead source automatically on creation, so attribution is never manual.
- Routed leads by loan amount and state to the right rep within two minutes, with an SMS and email sequence on assignment.
- Added a fit score from the captured fields and a weekly report of lead quality by marketplace campaign.

## Results

- 34 fields captured per lead, up from 12.
- First response time halved; reps call with the context in front of them.
- Marketplace spend is now judged on funded loans, not lead count.

## AI-readiness impact

Readiness rose from 41 to 84. ICP fields are populated on every lead, source is trusted, and the Prospecting Agent can be pointed at unconverted marketplace leads from 90+ days ago with a 50-per-day cap.
