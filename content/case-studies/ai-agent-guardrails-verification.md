---
title: "Multi-Agent Review with Verification Checks and Human-Ready Reports for a Law Firm"
client: "Law firm (due diligence)"
industry: "Legal & Compliance"
size: "Undisclosed"
hubs: ["Operations"]
useCases: ["governance", "customer-agent"]
metrics:
  - { value: "5", label: "automated verification checks per document" }
  - { value: "External API", label: "validation of business identifiers" }
  - { value: "Word", label: "review reports generated automatically" }
stack: ["LangChain", "LangGraph", "Google Gemini", "Multi-agent workflows", "Python"]
status: published
featured: false
date: "2024-08-06"
image: "https://davitgadyan.github.io/portfolio_app/images/portfolio/gemini_langgraph.png"
sourceUrl: "https://davitgadyan.github.io/portfolio_app/portfolio/project-28/"
---

## Challenge

A due-diligence review API relied on hard-coded prompts and could not verify its own output. Lawyers needed AI they could trust and configure, not a black box.

## Approach

- Architected a LangChain + LangGraph multi-agent pipeline on Google Gemini's long context window.
- Added verification checks for cross-references, page numbers, party addresses, signature blocks and ABN/ACN formatting.
- Validated business identifiers against an external API instead of trusting the model.
- Replaced hard-coded prompts with user-defined questions and a configurable number of recommendations.

## Results

- Long contracts processed end to end, with checks the team defines.
- Ready-to-use Word review reports for human sign-off.

## How this applies to HubSpot AI

This is the governance pattern every HubSpot agent rollout needs: the agent's work is checked against rules and external truth, and a human approves before anything leaves the building. It maps directly to Semi-Autonomous mode, escalation triggers and Golden Set testing.
