---
title: "Standardizing Industry on Unlabelled Company Records with BERT and GPT-4"
client: "Economic research team"
industry: "Research & Public Sector"
size: "Undisclosed"
hubs: ["Data", "Sales"]
useCases: ["foundation-data", "prospecting-agent"]
metrics:
  - { value: "NAICS / SIC", label: "industry codes inferred at scale" }
  - { value: "0", label: "manual annotation for the training set" }
  - { value: "BERT", label: "beat SVM and Random Forest baselines" }
stack: ["Python", "BERT", "GPT-4 few-shot labelling", "Fuzzy matching", "Geospatial matching"]
status: published
featured: true
date: "2024-08-08"
image: "https://davitgadyan.github.io/portfolio_app/images/portfolio/bert_nyc_orgs.png"
sourceUrl: "https://davitgadyan.github.io/portfolio_app/portfolio/project-27/"
---

## Challenge

Thousands of firms had only a name, owner and address, with no industry label. Without a reliable industry field, the records could not be segmented, routed or analysed.

## Approach

- Matched firms against reference registries by fuzzy name and location matching to recover known NAICS/SIC codes.
- Expanded the labelled set with GPT-4 few-shot labelling instead of manual annotation.
- Trained a BERT classifier, compared against SVM and Random Forest baselines, and optimised for accuracy and inference cost.
- Added QA controls (random manual review of matches and predictions) and delivered a replication package.

## Results

- Industry codes predicted at scale for previously unlabelled firms, with QA review and a reproducible pipeline.

## How this applies to HubSpot AI

"Standardize the Industry field" is on every Breeze readiness checklist because ICP filters and routing depend on it. The same pipeline maps free-text industry values and fills blanks on HubSpot companies, so the Prospecting Agent targets a real segment instead of "SaaS", "Software" and "software co" as three different markets.
