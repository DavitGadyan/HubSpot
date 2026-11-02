---
title: "AI Lead Scoring and Churn Detection Connected to HubSpot, Monday and Zoho Through MCP"
client: "S1mple.ai platform"
industry: "Technology & Software"
size: "Undisclosed"
hubs: ["Sales", "Marketing", "Data"]
useCases: ["prospecting-agent", "foundation-data"]
metrics:
  - { value: "3 CRMs", label: "HubSpot, Monday and Zoho connected via MCP" }
  - { value: "2 models", label: "repeat-conversion score + churn risk" }
stack: ["Next.js", "FastAPI", "LangChain", "MCP servers", "HubSpot", "PostgreSQL", "Supabase", "Kubernetes"]
status: published
featured: true
date: "2026-03-28"
image: "https://davitgadyan.github.io/portfolio_app/images/portfolio/aileadscores.png"
sourceUrl: "https://davitgadyan.github.io/portfolio_app/portfolio/project-35/"
---

## Challenge

Marketing effort was spread evenly across the database. The goal was to concentrate it on the customers most likely to convert again, and to catch accounts at risk of churning while there was still time to act, using data that lived across several CRMs and databases.

## Approach

- Built MCP server connectors into **HubSpot**, Monday and Zoho, plus Postgres, MySQL, Supabase and MongoDB, so the AI reads one consistent view of the customer instead of disconnected silos.
- Designed an AI lead-scoring engine that ranks leads by repeat-conversion likelihood.
- Added churn-risk detection to flag accounts for targeted retention campaigns.
- Shipped a Next.js dashboard on a FastAPI + LangChain backend, scaled on Kubernetes.

## Results

- Leads scored by repeat-conversion likelihood, with churn risk flagged for targeted, high-impact campaigns.
- One scoring layer across three CRMs and four databases.

## How this applies to HubSpot AI

Scoring is only as good as the fields under it. This project is the template for a Prospecting Agent pilot: unify the data first, score on signals that mean one thing, and send outreach only to the segment the model is confident about, starting with dormant leads rather than active deals.
