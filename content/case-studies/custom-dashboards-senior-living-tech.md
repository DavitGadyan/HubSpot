---
title: "Custom Dashboards Cut Monthly Reporting From Two Days to Three Hours for a Senior-Living SaaS"
client: "Senior-living technology company"
industry: "Technology & Software"
size: "11-50 Employees"
hubs: ["Marketing", "Sales"]
useCases: ["governance", "foundation-data"]
metrics:
  - { value: "2 days → 3 hrs", label: "monthly reporting time" }
  - { value: "14", label: "custom reports replacing spreadsheets" }
  - { value: "100%", label: "closed-won revenue attributed to a source" }
readiness: { before: 44, after: 82 }
stack: ["Marketing Hub Professional", "Sales Hub Professional", "Custom report builder", "Attribution reports", "Calculated properties"]
status: published
sample: true
featured: false
date: "2026-08-02"
summary: "Marketing and sales each exported HubSpot to spreadsheets and argued about whose numbers were right. One set of definitions and fourteen reports ended the argument."
---

## Challenge

The marketing lead spent two days a month assembling a board report from HubSpot exports. Sales had their own version. The numbers never matched because *lead source*, *MQL* and *opportunity* meant different things in each team's spreadsheet.

This is the first AI failure mode in practice: fields that do not mean one thing. No AI scoring could be trusted on top of it.

## Approach

- Wrote one definition for each funnel stage and each source value, approved by both teams, and encoded them as lifecycle stage rules and a controlled lead-source picklist.
- Backfilled original source on 9,800 contacts using form, campaign and import history.
- Built 14 custom reports: funnel by source, velocity by stage, revenue attribution, rep activity, and campaign ROI, grouped into three dashboards for board, marketing and sales.
- Replaced manual revenue tallies with calculated properties on closed-won deals.

## Results

- Monthly reporting dropped from two working days to about three hours of review.
- 100% of closed-won revenue is attributed to a first-touch source, up from 61%.
- Board, marketing and sales now read the same dashboard.

## AI-readiness impact

Readiness rose from 44 to 82. The lifecycle and source definitions are now stable enough for Breeze lead scoring and for outcome metrics per agent, which is the governance check most portals fail.
