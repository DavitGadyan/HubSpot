import "server-only";
import { nanoid } from "nanoid";
import { getStore, type AuditRow } from "@/db/store";
import { optimize } from "../ai/optimize";
import type { AiReport } from "../ai/schema";
import { createHubSpotApi } from "../hubspot/client";
import { decrypt, encrypt } from "../hubspot/crypto";
import { refreshToken } from "../hubspot/oauth";
import { SCAN_STEPS } from "./detectors";
import { mergeFindings, quizToFindings, scoreAudit } from "./score";
import type { AuditScores, Finding, QuizAnswer, ScanStats } from "./types";

export interface LeadInput {
  email: string;
  name?: string;
  company?: string;
  website?: string;
}

export interface AuditView {
  id: string;
  status: string;
  mode: string;
  createdAt: Date;
  company: string | null;
  findings: Finding[];
  scores: AuditScores | null;
  report: AiReport | null;
  stats: ScanStats;
  error: string | null;
}

async function upsertLead(lead?: LeadInput): Promise<string | null> {
  if (!lead?.email) return null;
  const id = nanoid(12);
  await getStore().createLead({
    id,
    email: lead.email.trim().toLowerCase(),
    name: lead.name?.trim() || null,
    company: lead.company?.trim() || null,
    website: lead.website?.trim() || null,
  });
  return id;
}

async function analyze(auditId: string, findings: Finding[], stats: ScanStats) {
  const store = getStore();
  const scores = scoreAudit(findings);
  await store.updateAudit(auditId, { findings, scores, stats, status: "analyzing" });
  const report = await optimize(findings, scores, stats);
  await store.updateAudit(auditId, { aiReport: report, status: "ready" });
}

/** Quiz-only audit: score + AI report synchronously. */
export async function createQuizAudit(answers: Record<string, QuizAnswer>, lead?: LeadInput) {
  const id = nanoid(16);
  const leadId = await upsertLead(lead);
  await getStore().createAudit({
    id,
    leadId,
    mode: "quiz",
    status: "pending",
    quizAnswers: answers,
    findings: null,
    stats: null,
    scores: null,
    aiReport: null,
    portalId: null,
    error: null,
  });
  await analyze(id, quizToFindings(answers), {});
  return id;
}

/** Start an audit that will be filled by a portal scan (optionally merged with quiz answers). */
export async function createScanAudit(lead?: LeadInput, answers?: Record<string, QuizAnswer>) {
  const id = nanoid(16);
  const leadId = await upsertLead(lead);
  await getStore().createAudit({
    id,
    leadId,
    mode: answers && Object.keys(answers).length ? "both" : "scan",
    status: "pending",
    quizAnswers: answers ?? null,
    findings: null,
    stats: null,
    scores: null,
    aiReport: null,
    portalId: null,
    error: null,
  });
  return id;
}

export async function saveConnection(
  auditId: string,
  portalId: string,
  tokens: { access_token: string; refresh_token: string; expires_in: number },
  scopes: string[],
) {
  const store = getStore();
  await store.saveConnection({
    auditId,
    portalId,
    encAccessToken: encrypt(tokens.access_token),
    encRefreshToken: encrypt(tokens.refresh_token),
    expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
    scopes: scopes.join(" "),
  });
  await store.updateAudit(auditId, { portalId, status: "scanning" });
  await store.saveScanJob({ auditId, step: 0, status: "running", partial: { stats: {}, findings: [] }, error: null });
}

async function accessToken(auditId: string): Promise<string> {
  const store = getStore();
  const conn = await store.getConnection(auditId);
  if (!conn) throw new Error("HubSpot connection not found (already finished or expired)");
  if (conn.expiresAt.getTime() - Date.now() > 60_000) return decrypt(conn.encAccessToken);
  const fresh = await refreshToken(decrypt(conn.encRefreshToken));
  await store.saveConnection({
    ...conn,
    encAccessToken: encrypt(fresh.access_token),
    encRefreshToken: encrypt(fresh.refresh_token),
    expiresAt: new Date(Date.now() + fresh.expires_in * 1000),
  });
  return fresh.access_token;
}

export interface ScanProgress {
  status: "running" | "done" | "error";
  step: number;
  total: number;
  label: string;
  error?: string | null;
}

/**
 * Advance the scan by one step. Called repeatedly by the client so each
 * invocation stays well inside serverless time limits.
 */
export async function advanceScan(auditId: string): Promise<ScanProgress> {
  const store = getStore();
  const job = await store.getScanJob(auditId);
  const total = SCAN_STEPS.length;
  if (!job) return { status: "error", step: 0, total, label: "", error: "Scan not found" };
  if (job.status !== "running") {
    return { status: job.status as ScanProgress["status"], step: job.step, total, label: "Done", error: job.error };
  }

  const partial = (job.partial ?? { stats: {}, findings: [] }) as { stats: ScanStats; findings: Finding[] };
  const step = SCAN_STEPS[job.step];

  try {
    const api = createHubSpotApi(await accessToken(auditId));
    const result = await step.run(api);
    partial.stats = { ...partial.stats, ...result.stats };
    partial.findings = [...partial.findings, ...result.findings];
  } catch (e) {
    // A failing step should not sink the whole audit: record and continue.
    console.error(`scan step ${step.key} failed`, e);
    partial.stats = { ...partial.stats, [`error_${step.key}`]: e instanceof Error ? e.message : "failed" };
  }

  const next = job.step + 1;
  if (next < total) {
    await store.saveScanJob({ auditId, step: next, status: "running", partial, error: null });
    return { status: "running", step: next, total, label: SCAN_STEPS[next].label };
  }

  // Final step: merge with quiz answers, delete tokens, analyze.
  await store.deleteConnection(auditId);
  const audit = await store.getAudit(auditId);
  const quiz = audit?.quizAnswers ? quizToFindings(audit.quizAnswers as Record<string, QuizAnswer>) : [];
  const findings = mergeFindings(quiz, partial.findings);
  await store.saveScanJob({ auditId, step: total, status: "done", partial, error: null });
  try {
    await analyze(auditId, findings, partial.stats);
  } catch (e) {
    await store.updateAudit(auditId, { status: "error", error: e instanceof Error ? e.message : "analysis failed" });
    return { status: "error", step: total, total, label: "", error: "Analysis failed" };
  }
  return { status: "done", step: total, total, label: "Done" };
}

export function toView(row: AuditRow, company: string | null = null): AuditView {
  return {
    id: row.id,
    status: row.status,
    mode: row.mode,
    createdAt: row.createdAt,
    company,
    findings: (row.findings as Finding[] | null) ?? [],
    scores: (row.scores as AuditScores | null) ?? null,
    report: (row.aiReport as AiReport | null) ?? null,
    stats: (row.stats as ScanStats | null) ?? {},
    error: row.error,
  };
}

export async function getAuditView(id: string): Promise<AuditView | null> {
  const store = getStore();
  const row = await store.getAudit(id);
  if (!row) return null;
  let company: string | null = null;
  if (row.leadId) {
    company = (await store.getLead(row.leadId))?.company ?? null;
  }
  return toView(row, company);
}
