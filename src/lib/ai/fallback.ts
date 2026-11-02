import { CHECKS_BY_ID, USE_CASE_BY_ID } from "../audit/rubric";
import { BAND_COPY, isGap } from "../audit/score";
import type { AuditScores, Finding, ScanStats, Tier } from "../audit/types";
import type { AiReport } from "./schema";

const TIER_ORDER: Record<Tier, number> = { now: 0, next: 1, later: 2 };

/** Deterministic report used when Claude is unavailable. Built only from rubric text + findings. */
export function templateReport(findings: Finding[], scores: AuditScores, stats: ScanStats = {}): AiReport {
  const gapsByUseCase = new Map<string, Finding[]>();
  for (const f of findings) {
    if (!isGap(f.status)) continue;
    const uc = CHECKS_BY_ID[f.checkId].useCase;
    gapsByUseCase.set(uc, [...(gapsByUseCase.get(uc) ?? []), f]);
  }

  const perUseCase = scores.perUseCase.map((s) => {
    const gaps = (gapsByUseCase.get(s.useCase) ?? [])
      .map((f) => ({ f, c: CHECKS_BY_ID[f.checkId] }))
      .sort((a, b) => b.c.severity - a.c.severity || TIER_ORDER[a.c.tier] - TIER_ORDER[b.c.tier]);
    const name = USE_CASE_BY_ID[s.useCase].name;
    return {
      useCase: s.useCase,
      verdict:
        s.gaps === 0
          ? `${name} looks ready: every check passed.`
          : `${name} scores ${s.score}/100 with ${s.gaps} gap${s.gaps > 1 ? "s" : ""} to close before AI relies on it.`,
      topRisks: gaps.slice(0, 3).map(({ f, c }) => (f.evidence ? `${f.evidence} — ${c.why}` : c.why)),
      fixes: gaps.slice(0, 4).map(({ c }) => ({
        action: c.title,
        firstStep: c.firstStep,
        riskIfWrong: c.why,
        owner: c.owner,
        effort: c.severity === 3 ? ("days" as const) : ("hours" as const),
        tier: c.tier,
      })),
    };
  });

  const weakest = [...scores.perUseCase].sort((a, b) => a.score - b.score)[0];
  const subjects = Array.isArray(stats.topTicketSubjects) ? (stats.topTicketSubjects as string[]) : [];

  return {
    generatedBy: "template",
    headline: `AI readiness ${scores.overall}/100 — ${BAND_COPY[scores.band].label.toLowerCase()}`,
    summary: `${scores.gaps} gap${scores.gaps === 1 ? "" : "s"} found across ${scores.perUseCase.length} areas. ${BAND_COPY[scores.band].text}${
      weakest ? ` Start with ${USE_CASE_BY_ID[weakest.useCase].name.toLowerCase()} (${weakest.score}/100).` : ""
    }`,
    perUseCase,
    goldenSetSuggestions: subjects.slice(0, 8),
    icpSuggestion: "",
    nextStep:
      scores.band === "strong"
        ? "Work through the Do Now list this week, then pilot one agent on a low-traffic channel."
        : "Book a review of the Do Now list before switching any agent on.",
  };
}
