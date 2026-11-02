---
title: "Virgil HealthCare AI: Health-Plan Selection and Underwriting Cut From Days to Minutes Under HIPAA"
client: "Virgil.ai, with broker partner One Health"
industry: "Healthcare & Insurance"
size: "11-50 Employees"
hubs: ["Service", "Sales", "Operations"]
useCases: ["customer-agent", "governance", "foundation-access", "foundation-knowledge"]
metrics:
  - { value: "Days → minutes", label: "underwriting turnaround" }
  - { value: "Automated", label: "medication price and coverage lookup across plans" }
  - { value: "HIPAA", label: "secure storage and transfer of all AI and data" }
stack: ["LangChain", "FastAPI", "OpenAI reasoning model", "MCP tools", "Docker", "Kubernetes", "AWS", "HIPAA-compliant data handling"]
status: published
sample: false
featured: true
date: "2026-02-03"
summary: "Choosing a US health plan is a cumbersome task for most applicants. Virgil HealthCare AI onboards the applicant, checks whether their medications are covered by each plan, and completes underwriting in minutes instead of days, with every byte handled under HIPAA."
image: "https://davitgadyan.github.io/portfolio_app/images/portfolio/virgilai.jpg"
sourceUrl: "https://davitgadyan.github.io/portfolio_app/portfolio/project-34/"
---

## Challenge

Selecting a healthcare plan is one of the most confusing tasks a US consumer faces: dozens of plans, each with its own formulary, deductibles and underwriting questions. One Health, a broker agency, collaborated with our team to remove that friction. Brokers were spending hours per applicant looking up medication prices plan by plan, and underwriting took days of back-and-forth before anyone could enrol.

## Approach

- Built Virgil as an agentic AI system on LangChain and FastAPI, with an OpenAI reasoning model as the backbone and custom tools exposed through MCP, so each capability is a scoped, testable action rather than a single prompt.
- Automated the hardest manual task: an efficient medication price lookup that checks whether an applicant's prescriptions are covered by each candidate plan, and at what cost.
- Automated underwriting so the applicant's answers and documents are evaluated in minutes, with a human broker reviewing edge cases rather than every file.
- Designed the whole system for HIPAA: encrypted storage and transfer, least-privilege access, and no protected health information in prompts beyond what the task needs.
- Deployed on AWS with Docker and Kubernetes so onboarding scales with demand.

## Results

- Underwriting reduced from days to minutes.
- Medication coverage and price lookup automated across plans, instead of hours of manual checking per applicant.
- A large potential user base and far easier experience than market standards made the product a viable option for the broker's clients.

## AI-readiness impact

This is the governance pattern we bring to HubSpot agent rollouts: one capability at a time, each exposed as a scoped tool; humans in the loop on the decisions that matter; and data handling designed for the regulation before the first user, not after. The same discipline applies to a Breeze Customer Agent with authenticated actions on sensitive customer data.
