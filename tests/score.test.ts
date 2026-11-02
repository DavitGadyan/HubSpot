import { describe, expect, it } from "vitest";
import { CHECKS } from "@/lib/audit/rubric";
import { bandFor, mergeFindings, quizToFindings, scoreAudit } from "@/lib/audit/score";
import type { Finding, QuizAnswer } from "@/lib/audit/types";

const all = (a: QuizAnswer) => Object.fromEntries(CHECKS.map((c) => [c.id, a]));

describe("bands follow the playbook thresholds", () => {
  it.each([
    [0, "strong"],
    [2, "strong"],
    [3, "notable"],
    [6, "notable"],
    [7, "expert"],
  ])("%i gaps -> %s", (gaps, band) => expect(bandFor(gaps)).toBe(band));
});

describe("scoreAudit", () => {
  it("all yes = 100 and no gaps", () => {
    const s = scoreAudit(quizToFindings(all("yes")));
    expect(s.overall).toBe(100);
    expect(s.gaps).toBe(0);
    expect(s.band).toBe("strong");
    expect(s.perUseCase).toHaveLength(7);
  });
  it("all no = 0 and every check is a gap", () => {
    const s = scoreAudit(quizToFindings(all("no")));
    expect(s.overall).toBe(0);
    expect(s.gaps).toBe(CHECKS.length);
    expect(s.band).toBe("expert");
  });
  it("unsure counts as a half-credit gap", () => {
    const s = scoreAudit(quizToFindings(all("unsure")));
    expect(s.overall).toBe(50);
    expect(s.gaps).toBe(CHECKS.length);
  });
  it("weights by severity", () => {
    const answers = all("yes");
    const sev3 = CHECKS.find((c) => c.useCase === "foundation-data" && c.severity === 3)!;
    const sev1 = CHECKS.find((c) => c.useCase === "foundation-data" && c.severity === 1)!;
    const a = scoreAudit(quizToFindings({ ...answers, [sev3.id]: "no" }));
    const b = scoreAudit(quizToFindings({ ...answers, [sev1.id]: "no" }));
    const score = (s: typeof a) => s.perUseCase.find((u) => u.useCase === "foundation-data")!.score;
    expect(score(a)).toBeLessThan(score(b));
  });
  it("ignores unknown check ids", () => {
    expect(quizToFindings({ nope: "no" })).toHaveLength(0);
  });
});

describe("mergeFindings", () => {
  it("scan evidence wins over self-report", () => {
    const quiz: Finding[] = [{ checkId: "owner-populated", status: "pass", source: "quiz" }];
    const scan: Finding[] = [{ checkId: "owner-populated", status: "fail", source: "scan", evidence: "38% blank" }];
    const [f] = mergeFindings(quiz, scan);
    expect(f.status).toBe("fail");
    expect(f.source).toBe("scan");
  });
  it("an unknown scan result does not override a quiz answer", () => {
    const quiz: Finding[] = [{ checkId: "cold-lead-list", status: "pass", source: "quiz" }];
    const scan: Finding[] = [{ checkId: "cold-lead-list", status: "unknown", source: "scan" }];
    expect(mergeFindings(quiz, scan)[0].status).toBe("pass");
  });
});
