---
title: "Machine-Learning Deduplication That Finds the Same Customer Recorded Many Times"
client: "Research data team"
industry: "Research & Public Sector"
size: "Undisclosed"
hubs: ["Data", "Operations"]
useCases: ["foundation-data"]
metrics:
  - { value: "ML", label: "dedupe model trained on labelled pairs" }
  - { value: "JedAI rejected", label: "on compute cost after benchmarking" }
stack: ["Python", "dedupe", "Active-learning labelling", "Benchmarking"]
status: published
featured: false
date: "2021-06-30"
image: "https://davitgadyan.github.io/portfolio_app/images/portfolio/entity-resolution.jpg"
sourceUrl: "https://davitgadyan.github.io/portfolio_app/portfolio/project-4/"
---

## Challenge

The same real-world customer had been recorded several times, across and within datasets, with slightly different names and addresses. Exact-match rules missed most of them, and every downstream analysis double-counted.

## Approach

- Benchmarked the open-source JedAI toolkit and rejected it because compute time was too high.
- Selected the ML-based `dedupe` library and trained it on a labelled set of matching and non-matching pairs using active learning.
- Analysed the output to confirm match quality before it was adopted.

## Results

- A trained entity-resolution model accepted as the deduplication solution, validated by output analysis.

## How this applies to HubSpot AI

HubSpot merges contacts by exact email, but real duplicates hide behind different emails, misspelled names and companies created twice under different domains. Duplicates split activity history, so AI summaries miss conversations and agents email the same person twice. Fuzzy, model-based matching finds what native duplicate tools miss, before AI reads the records.
