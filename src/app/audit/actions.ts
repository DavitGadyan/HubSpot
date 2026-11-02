"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getStore } from "@/db/store";
import { CHECKS_BY_ID } from "@/lib/audit/rubric";
import { createQuizAudit, createScanAudit } from "@/lib/audit/service";
import type { AuditScores, QuizAnswer } from "@/lib/audit/types";
import { sendReportEmail } from "@/lib/email";
import { authorizeUrl, hubspotConfigured } from "@/lib/hubspot/oauth";

const Lead = z.object({
  email: z.string().trim().email("Enter a valid work email"),
  name: z.string().trim().max(120).optional(),
  company: z.string().trim().max(160).optional(),
  website: z.string().trim().max(200).optional(),
});

const Answers = z
  .record(z.string(), z.enum(["yes", "no", "unsure"]))
  .refine((a) => Object.keys(a).every((k) => CHECKS_BY_ID[k]), "Unknown check");

export type ActionState = { error?: string } | undefined;

export async function submitQuiz(input: { answers: Record<string, QuizAnswer>; lead: z.input<typeof Lead> }): Promise<ActionState> {
  const lead = Lead.safeParse(input.lead);
  if (!lead.success) return { error: lead.error.issues[0].message };
  const answers = Answers.safeParse(input.answers);
  if (!answers.success || Object.keys(answers.data).length === 0) return { error: "Please answer at least one question." };

  const id = await createQuizAudit(answers.data, lead.data);
  const audit = await getStore().getAudit(id);
  await sendReportEmail(lead.data.email, id, (audit?.scores as AuditScores | null)?.overall ?? 0);
  redirect(`/audit/${id}`);
}

export async function startScan(_prev: ActionState, form: FormData): Promise<ActionState> {
  if (!hubspotConfigured()) return { error: "The HubSpot connection isn't configured on this site yet." };
  const lead = Lead.safeParse({
    email: form.get("email"),
    name: form.get("name") || undefined,
    company: form.get("company") || undefined,
  });
  if (!lead.success) return { error: lead.error.issues[0].message };
  const id = await createScanAudit(lead.data);
  redirect(authorizeUrl(id));
}
