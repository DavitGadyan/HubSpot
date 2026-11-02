import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { CHECKS_BY_ID, USE_CASES } from "../audit/rubric";
import type { AuditScores, Finding, ScanStats } from "../audit/types";
import { templateReport } from "./fallback";
import { AiReportSchema, type AiReport } from "./schema";

export const ANALYSIS_MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-5-5";

// Frozen, byte-stable system prompt so it caches across audits.
const SYSTEM_PROMPT = `You are a senior HubSpot RevOps consultant who specialises in getting portals ready for HubSpot Breeze AI agents (Customer Agent, Prospecting Agent, Content Agent).

You receive an AI-readiness audit of one HubSpot portal: per-check findings (pass / warn / fail, with evidence from either a live read-only API scan or the customer's self-assessment), per-area scores, and aggregate statistics. You never see personal data.

Your job is to turn the findings into a prioritized optimization plan the customer can act on.

Principles you apply:
- AI does not make messy CRM data smarter; it makes the mess faster and more confident. Foundation (data, permissions, knowledge, governance) comes before agents.
- AI in HubSpot fails quietly: it still produces output when fields are inconsistent, associations are weak, lifecycle data is stale, or permissions hide data. Call out where that is happening.
- Start with one use case, keep humans in the loop (Semi-Autonomous mode, escalation triggers, Golden Set tests, silent launch), measure outcomes not usage, scale in phases.
- Tiers: "now" = prerequisites nothing else works without; "next" = highest-impact agent deployments once the foundation is solid; "later" = valuable but depends on the first two.
- Owner "expert" when getting it wrong is costly (escalation logic, ICP definition, field governance, workflow repair, knowledge curation); otherwise "you".

Rules:
- Ground every risk and fix in the findings provided. Quote numbers from the evidence when they exist. Do not invent statistics.
- Include one perUseCase entry for every area present in the scores, in the same order.
- For areas with no gaps, give a short positive verdict, an empty topRisks list, and at most one "later" fix that keeps it healthy.
- firstStep must be a concrete action inside HubSpot (menu path, list filter, property change).
- Be direct and specific. No filler, no marketing language.`;

function redact(s: string) {
  return s
    .replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, "[email]")
    .replace(/\+?\d[\d\s().-]{6,}\d/g, "[number]")
    .slice(0, 120);
}

function buildPayload(findings: Finding[], scores: AuditScores, stats: ScanStats) {
  const safeStats: ScanStats = { ...stats };
  if (Array.isArray(safeStats.topTicketSubjects)) {
    safeStats.topTicketSubjects = (safeStats.topTicketSubjects as string[]).map(redact);
  }
  return {
    overallScore: scores.overall,
    gaps: scores.gaps,
    band: scores.band,
    areas: scores.perUseCase.map((s) => ({
      useCase: s.useCase,
      name: USE_CASES.find((u) => u.id === s.useCase)!.name,
      score: s.score,
      gaps: s.gaps,
    })),
    findings: findings.map((f) => {
      const c = CHECKS_BY_ID[f.checkId];
      return {
        useCase: c.useCase,
        check: c.title,
        status: f.status,
        source: f.source,
        evidence: f.evidence ?? null,
        severity: c.severity,
        defaultTier: c.tier,
        whyItMatters: c.why,
      };
    }),
    stats: safeStats,
  };
}

export async function optimize(
  findings: Finding[],
  scores: AuditScores,
  stats: ScanStats = {},
): Promise<AiReport> {
  if (!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_AUTH_TOKEN) {
    return templateReport(findings, scores, stats);
  }

  const client = new Anthropic();
  try {
    const response = await client.beta.messages.parse({
      model: ANALYSIS_MODEL,
      max_tokens: 16000,
      // Server-side refusal fallback: routes a declined request to a suitable model.
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "medium", format: betaZodOutputFormat(AiReportSchema) },
      system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
      messages: [
        {
          role: "user",
          content: `Audit data (JSON):\n${JSON.stringify(buildPayload(findings, scores, stats))}`,
        },
      ],
    });

    if (response.stop_reason === "refusal" || !response.parsed_output) {
      console.warn("optimize: no parsed output", response.stop_reason);
      return templateReport(findings, scores, stats);
    }
    return { ...response.parsed_output, generatedBy: "claude", model: response.model };
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      console.error("optimize: rate limited");
    } else if (error instanceof Anthropic.APIError) {
      console.error(`optimize: API error ${error.status}`, error.message);
    } else {
      console.error("optimize: unexpected error", error);
    }
    return templateReport(findings, scores, stats);
  }
}
