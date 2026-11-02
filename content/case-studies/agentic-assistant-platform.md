---
title: "An Agentic AI Platform with Custom Tools and MCP: Research, Calendar, Email and Contact Capture"
client: "S1mple.ai platform"
industry: "Technology & Software"
size: "Undisclosed"
hubs: ["Service", "Sales"]
useCases: ["customer-agent", "governance"]
metrics:
  - { value: "4 tools", label: "web research, calendar, email and trend detection" }
  - { value: "MCP", label: "plug-in connectors to client systems" }
stack: ["LangChain", "OpenAI GPT-4o", "MCP", "React", "n8n", "Gmail API", "Google Calendar API"]
status: published
featured: false
date: "2025-07-04"
image: "https://davitgadyan.github.io/portfolio_app/images/portfolio/s1mpleai.png"
sourceUrl: "https://davitgadyan.github.io/portfolio_app/portfolio/project-33/"
---

## Challenge

Off-the-shelf assistants could not reach the client's own systems or follow their rules. They needed an agent that acted inside their tools, with each capability added deliberately.

## Approach

- Built an agent platform on LangChain with custom tools and MCP support that plug into client data and management systems.
- Shipped tools for web research (Apify), calendar create/update/delete, Gmail sending and Google Trends detection.
- Built a low-code companion in n8n that also captures contacts to a sheet and drafts social posts, published as a reusable workflow.

## Results

- One assistant handling research, scheduling, email and contact capture through scoped tools, with a video demo published.

## How this applies to HubSpot AI

Agents earn trust one capability at a time. The same scoped-tool approach applies to HubSpot's Customer Agent authenticated actions (for example "check order status"): add one action, test it, monitor it, then expand.
