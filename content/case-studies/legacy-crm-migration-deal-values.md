---
title: "Migrating 70K Records From a Legacy CRM While Fixing $9.2M in Mis-Valued Deals"
client: "Specialty chemicals manufacturer"
industry: "Manufacturing & Industry"
size: "11-50 Employees"
hubs: ["Sales"]
useCases: ["foundation-data", "governance"]
metrics:
  - { value: "70K", label: "records migrated" }
  - { value: "$9.2M", label: "in deal values corrected" }
  - { value: "11 → 1", label: "fields meaning 'order value'" }
readiness: { before: 24, after: 80 }
stack: ["Sales Hub Professional", "SugarCRM export", "Data transformation scripts", "Import mapping", "Validation reports"]
status: published
sample: true
featured: false
date: "2025-09-02"
summary: "Eleven fields had been used for order value over fifteen years, in three currencies and two units. Fixing that before the migration made the new pipeline report true revenue on day one."
---

## Challenge

A fifteen-year-old legacy CRM held 70,000 records. "Order value" existed in eleven custom fields, some in euros, some per kilogram. Pipeline reports in the old system were off by millions, and a straight migration would have carried the mess into HubSpot.

## Approach

- Profiled every field: fill rate, distinct values, last used. 140 of 210 fields were archived.
- Reconciled the eleven value fields into one, normalised to USD and total order value, with the transformation logged per record.
- Validated 1,200 deals against the ERP before import; corrected $9.2M of mis-valued deals.
- Migrated in two waves with a validation report after each: counts, sums and a sample of 100 records checked by hand.
- Wrote property descriptions and an owner for every migrated field.

## Results

- 70,000 records in HubSpot with one trusted value field.
- Pipeline value now matches the ERP within 1%.
- Property count cut by two-thirds, every survivor documented.

## AI-readiness impact

Readiness rose from 24 to 80. Field meaning was the critical failure, and it was fixed before the data arrived. AI deal summaries and forecasts now read one number, not eleven.
