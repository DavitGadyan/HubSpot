import { z } from "zod";

export const FixSchema = z.object({
  action: z.string().describe("Short imperative action, e.g. 'Merge duplicate companies by domain'"),
  firstStep: z.string().describe("The very first concrete step inside HubSpot"),
  riskIfWrong: z.string().describe("What goes wrong if this is skipped or done badly"),
  owner: z.enum(["you", "expert"]),
  effort: z.enum(["hours", "days", "weeks"]),
  tier: z.enum(["now", "next", "later"]),
});

export const UseCaseReportSchema = z.object({
  useCase: z.enum([
    "foundation-data",
    "foundation-access",
    "foundation-knowledge",
    "customer-agent",
    "prospecting-agent",
    "content-agent",
    "governance",
  ]),
  verdict: z.string().describe("One sentence: is this use case ready for AI, and why"),
  topRisks: z.array(z.string()).describe("1-3 risks grounded in the findings"),
  fixes: z.array(FixSchema).describe("1-4 prioritized fixes"),
});

export const AiReportSchema = z.object({
  headline: z.string().describe("A specific, plain-language headline for this portal's AI readiness (max ~12 words)"),
  summary: z.string().describe("2-4 sentence executive summary grounded in the findings"),
  perUseCase: z.array(UseCaseReportSchema),
  goldenSetSuggestions: z
    .array(z.string())
    .describe("Up to 8 customer questions to include in the Customer Agent Golden Set test"),
  icpSuggestion: z.string().describe("One or two sentences on how to tighten ICP targeting, or empty string"),
  nextStep: z.string().describe("The single smartest next move"),
});

export type AiReport = z.infer<typeof AiReportSchema> & {
  generatedBy: "claude" | "template";
  model?: string;
};
export type Fix = z.infer<typeof FixSchema>;
