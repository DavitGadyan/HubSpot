---
title: "68 Broken Workflows Fixed and 142 Cut to 61 So Automation Could Be Trusted Again"
client: "Precision components manufacturer"
industry: "Manufacturing & Industry"
size: "11-50 Employees"
hubs: ["Sales", "Operations"]
useCases: ["governance", "foundation-data"]
metrics:
  - { value: "68", label: "broken workflows fixed" }
  - { value: "142 → 61", label: "active workflows" }
  - { value: "100%", label: "workflows with an owner and description" }
readiness: { before: 30, after: 82 }
stack: ["Sales Hub Professional", "Operations Hub Professional", "Workflow audit", "Documentation", "Monitoring"]
status: published
sample: true
featured: true
date: "2025-03-24"
summary: "Years of automation had piled up until workflows fought each other over the same properties. We traced every one, fixed what mattered, deleted what did not, and wrote the governance that stops it happening again."
---

## Challenge

142 workflows were active. 68 were erroring, several overwrote the same lifecycle stage, and one from 2021 was still assigning leads to a rep who had left. Reps had stopped trusting anything automated and were updating records by hand "just in case".

## Approach

- Exported every workflow with enrolment, error and last-edit data, and traced each one's trigger, properties touched and downstream reports.
- Grouped them into keep, fix, merge and delete with the operations lead.
- Fixed 68, merged 23 into 9, and deleted 58 that had no enrolments in a year or duplicated another.
- Wrote a description with owner, purpose and test record for every surviving workflow, and set a monthly review with an error dashboard.
- Reassigned ownership rules from departed users to a rotation.

## Results

- 68 broken workflows fixed; 142 cut to 61 active, all documented.
- Lifecycle stage is now set by one workflow instead of four.
- Error count is on a dashboard reviewed monthly, and has stayed at zero.

## AI-readiness impact

Readiness went from 30 to 82. Workflow health and documentation were the two worst checks. Now a field drives a list, the list feeds one workflow, and the result can be explained, which is what AI routing needs underneath it.
