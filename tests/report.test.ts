import { describe, expect, it } from "vitest";
import { templateReport } from "@/lib/ai/fallback";
import { optimize } from "@/lib/ai/optimize";
import { AiReportSchema } from "@/lib/ai/schema";
import { CHECKS } from "@/lib/audit/rubric";
import { quizToFindings, scoreAudit } from "@/lib/audit/score";
import { decrypt, encrypt } from "@/lib/hubspot/crypto";
import { signState, verifyState } from "@/lib/hubspot/oauth";

const findings = quizToFindings(Object.fromEntries(CHECKS.map((c, i) => [c.id, i % 3 === 0 ? "no" : "yes"])));
const scores = scoreAudit(findings);

describe("template report", () => {
  it("matches the AI report schema and covers every area", () => {
    const r = templateReport(findings, scores);
    expect(AiReportSchema.safeParse(r).success).toBe(true);
    expect(r.perUseCase.map((u) => u.useCase)).toEqual(scores.perUseCase.map((s) => s.useCase));
    expect(r.perUseCase.flatMap((u) => u.fixes).length).toBeGreaterThan(0);
  });
  it("optimize falls back without an API key", async () => {
    const prev = process.env.ANTHROPIC_API_KEY;
    delete process.env.ANTHROPIC_API_KEY;
    delete process.env.ANTHROPIC_AUTH_TOKEN;
    const r = await optimize(findings, scores);
    expect(r.generatedBy).toBe("template");
    process.env.ANTHROPIC_API_KEY = prev;
  });
});

describe("security helpers", () => {
  it("encrypts and decrypts tokens", () => {
    process.env.TOKEN_ENC_KEY = "test-key";
    const c = encrypt("secret-token");
    expect(c).not.toContain("secret-token");
    expect(decrypt(c)).toBe("secret-token");
  });
  it("rejects tampered OAuth state", () => {
    process.env.TOKEN_ENC_KEY = "test-key";
    const s = signState("audit123");
    expect(verifyState(s)).toBe("audit123");
    expect(verifyState(s.replace("audit123", "audit999"))).toBeNull();
    expect(verifyState(null)).toBeNull();
  });
});
