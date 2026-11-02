---
title: "Jira Tickets Created From HubSpot Deals So Engineering and Sales Work One Record for an InsurTech"
client: "Commercial insurance platform"
industry: "Financial Services"
size: "51-200 Employees"
hubs: ["Sales", "Service"]
useCases: ["governance", "foundation-data", "customer-agent"]
metrics:
  - { value: "100%", label: "implementation handoffs automated" }
  - { value: "3 → 1", label: "places a customer request lives" }
  - { value: "61%", label: "faster onboarding, signed to live" }
readiness: { before: 37, after: 79 }
stack: ["Sales Hub Professional", "Service Hub Professional", "Jira Cloud integration", "Workflows", "Custom properties"]
status: published
sample: true
featured: false
date: "2026-03-18"
summary: "Closed-won deals were re-typed into Jira by hand and sales never saw engineering status. A workflow-driven Jira integration put both teams on one record."
---

## Challenge

When a deal closed, an account manager emailed engineering, who created a Jira epic by hand. Sales had no idea whether the customer was live. Customers asked support, support asked engineering, and the answer lived in three systems.

## Approach

- Connected Jira to HubSpot and created an epic automatically on closed-won, pre-filled from deal properties (carrier lines, integration type, go-live date).
- Synced Jira status back to a deal property and a ticket, so account managers and support see progress without leaving HubSpot.
- Built a multi-pipeline setup: new business, renewals and implementations, each with its own stages and SLAs.
- Standardised the properties engineering depends on (integration type, data format) into picklists so nothing is free text.

## Results

- 100% of implementation handoffs created in Jira automatically, with no re-typing.
- Signed-to-live time down 61% in the first quarter.
- A customer's status is one record, visible to sales, support and engineering.

## AI-readiness impact

Readiness rose from 37 to 79. With implementation status on the ticket and knowledge articles written for the top questions, the support team piloted the Customer Agent on "where is my integration?" questions, which were a third of their volume.
