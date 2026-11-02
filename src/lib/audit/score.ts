import { CHECKS, CHECKS_BY_ID, USE_CASES } from "./rubric";
import type { AuditScores, Band, CheckStatus, Finding, QuizAnswer, UseCaseScore } from "./types";

const STATUS_VALUE: Record<CheckStatus, number> = { pass: 1, warn: 0.5, fail: 0, unknown: 0.5 };

export function quizToFindings(answers: Record<string, QuizAnswer>): Finding[] {
  return Object.entries(answers)
    .filter(([id]) => CHECKS_BY_ID[id])
    .map(([checkId, a]) => ({
      checkId,
      source: "quiz" as const,
      status: a === "yes" ? "pass" : a === "no" ? "fail" : "warn",
      evidence: a === "unsure" ? "Answered \"not sure\" in the self-assessment." : undefined,
    }));
}

/** Merge findings; scan evidence wins over self-reported answers for the same check. */
export function mergeFindings(...lists: Finding[][]): Finding[] {
  const byId = new Map<string, Finding>();
  for (const list of lists) {
    for (const f of list) {
      const prev = byId.get(f.checkId);
      if (!prev || (f.source === "scan" && f.status !== "unknown") || prev.status === "unknown") {
        byId.set(f.checkId, f);
      }
    }
  }
  return CHECKS.map((c) => byId.get(c.id)).filter((f): f is Finding => Boolean(f));
}

/** A gap is any check that did not pass (fail, or unsure/warn), per the playbook's "count your No's". */
export function isGap(status: CheckStatus) {
  return status === "fail" || status === "warn";
}

export function bandFor(gaps: number): Band {
  if (gaps <= 2) return "strong";
  if (gaps <= 6) return "notable";
  return "expert";
}

export const BAND_COPY: Record<Band, { label: string; text: string }> = {
  strong: {
    label: "Strong shape",
    text: "You may be able to handle implementation on your own with careful execution. Start with Tier 1 this week and test before scaling.",
  },
  notable: {
    label: "Notable gaps",
    text: "You have real gaps. Expert guidance would save significant time and reduce the risk of agents scaling bad data.",
  },
  expert: {
    label: "Foundation first",
    text: "Turning agents on now would amplify problems. Fix the foundation before deploying — this is where expert support pays for itself.",
  },
};

export function scoreAudit(findings: Finding[]): AuditScores {
  const byId = new Map(findings.map((f) => [f.checkId, f]));
  const perUseCase: UseCaseScore[] = [];

  for (const uc of USE_CASES) {
    const checks = CHECKS.filter((c) => c.useCase === uc.id && byId.has(c.id));
    if (checks.length === 0) continue;
    let num = 0;
    let den = 0;
    let gaps = 0;
    let passed = 0;
    for (const c of checks) {
      const s = byId.get(c.id)!.status;
      num += STATUS_VALUE[s] * c.severity;
      den += c.severity;
      if (isGap(s)) gaps++;
      if (s === "pass") passed++;
    }
    perUseCase.push({
      useCase: uc.id,
      score: Math.round((num / den) * 100),
      gaps,
      passed,
      total: checks.length,
    });
  }

  let wNum = 0;
  let wDen = 0;
  for (const s of perUseCase) {
    const w = USE_CASES.find((u) => u.id === s.useCase)!.weight;
    wNum += s.score * w;
    wDen += w;
  }
  const gaps = perUseCase.reduce((a, s) => a + s.gaps, 0);
  return {
    overall: wDen ? Math.round(wNum / wDen) : 0,
    gaps,
    band: bandFor(gaps),
    perUseCase,
  };
}
