import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AutoRefresh } from "@/components/AutoRefresh";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { ScanRunner } from "@/components/ScanRunner";
import { ScoreBar, ScoreGauge, StatusPill, scoreColor } from "@/components/Score";
import { ButtonLink, Container, Eyebrow } from "@/components/SiteChrome";
import { bookingHref } from "@/config/site";
import type { Fix } from "@/lib/ai/schema";
import { SCAN_STEPS } from "@/lib/audit/detectors";
import { CHECKS_BY_ID, USE_CASE_BY_ID } from "@/lib/audit/rubric";
import { BAND_COPY } from "@/lib/audit/score";
import { getAuditView } from "@/lib/audit/service";
import type { UseCaseId } from "@/lib/audit/types";
import { matchCaseStudies } from "@/lib/case-studies";

type Params = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const a = await getAuditView((await params).id);
  return {
    title: a?.scores ? `AI readiness ${a.scores.overall}/100` : "AI readiness results",
    robots: { index: false, follow: false },
  };
}

const TIERS = [
  { key: "now", label: "Do now", hint: "Prerequisites. Nothing else works without them." },
  { key: "next", label: "Do next", hint: "Highest-impact agent deployments once the foundation holds." },
  { key: "later", label: "Do later", hint: "Valuable, but depends on the first two tiers." },
] as const;

export default async function ResultsPage({ params }: Params) {
  const { id } = await params;
  const audit = await getAuditView(id);
  if (!audit) notFound();

  if (audit.status === "scanning") {
    return (
      <Container className="py-16">
        <ScanRunner auditId={id} steps={SCAN_STEPS.map((s) => s.label)} />
      </Container>
    );
  }
  if (audit.status === "pending" && audit.mode !== "quiz") {
    return (
      <Container className="py-20 text-center">
        <h1 className="font-display text-4xl">Waiting for the HubSpot connection</h1>
        <p className="mt-3 text-muted">Finish connecting HubSpot, or start again.</p>
        <ButtonLink href="/audit" className="mt-8">
          Back to the audit
        </ButtonLink>
      </Container>
    );
  }
  if (audit.status === "error") {
    return (
      <Container className="py-20 text-center">
        <h1 className="font-display text-4xl">Something went wrong</h1>
        <p className="mt-3 text-muted">{audit.error ?? "The audit could not be completed."}</p>
        <ButtonLink href="/audit" className="mt-8">
          Try again
        </ButtonLink>
      </Container>
    );
  }
  if (!audit.scores || !audit.report) {
    return (
      <Container className="py-20 text-center">
        <AutoRefresh />
        <h1 className="font-display text-4xl">Writing your optimization plan…</h1>
        <p className="mt-3 text-muted">This page updates automatically.</p>
      </Container>
    );
  }

  const { scores, report, findings } = audit;
  const band = BAND_COPY[scores.band];
  const weakest = [...scores.perUseCase].sort((a, b) => a.score - b.score).map((s) => s.useCase);
  const cases = matchCaseStudies(weakest, 3);
  const reportByUseCase = new Map(report.perUseCase.map((r) => [r.useCase, r]));
  const allFixes: (Fix & { useCase: UseCaseId })[] = report.perUseCase.flatMap((r) =>
    r.fixes.map((f) => ({ ...f, useCase: r.useCase as UseCaseId })),
  );
  const scanned = findings.some((f) => f.source === "scan");

  return (
    <>
      <section className="glow border-b border-line">
        <Container className="grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1fr_auto]">
          <div className="fade-up">
            <Eyebrow>
              AI readiness report{audit.company ? ` · ${audit.company}` : ""} · {scanned ? "Live portal scan" : "Self-assessment"}
            </Eyebrow>
            <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.05] tracking-tight text-balance sm:text-6xl">
              {report.headline}
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-muted text-pretty">{report.summary}</p>
            <div className="mt-6 inline-flex flex-wrap items-center gap-3 rounded-full border border-line px-4 py-2 text-sm">
              <span className="font-medium" style={{ color: scoreColor(scores.overall) }}>
                {band.label}
              </span>
              <span className="text-muted">
                {scores.gaps} gap{scores.gaps === 1 ? "" : "s"} found
              </span>
            </div>
          </div>
          <div className="justify-self-center">
            <ScoreGauge score={scores.overall} size={200} />
          </div>
        </Container>
      </section>

      <Container className="py-14">
        <h2 className="font-display text-3xl">Readiness by use case</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {scores.perUseCase.map((s) => (
            <a key={s.useCase} href={`#${s.useCase}`} className="rounded-2xl border border-line p-5 transition-colors hover:border-muted/60">
              <p className="text-sm text-muted">{USE_CASE_BY_ID[s.useCase].name}</p>
              <p className="mt-2 font-display text-4xl tabular-nums" style={{ color: scoreColor(s.score) }}>
                {s.score}
              </p>
              <div className="mt-3">
                <ScoreBar score={s.score} />
              </div>
              <p className="mt-3 font-mono text-[11px] text-muted">
                {s.passed}/{s.total} passed · {s.gaps} gap{s.gaps === 1 ? "" : "s"}
              </p>
            </a>
          ))}
        </div>
      </Container>

      <section className="border-y border-line bg-surface/40">
        <Container className="py-14">
          <Eyebrow>Optimization plan</Eyebrow>
          <h2 className="mt-3 font-display text-3xl">What to fix, in order</h2>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {TIERS.map((t) => {
              const fixes = allFixes.filter((f) => f.tier === t.key);
              return (
                <div key={t.key} className="flex flex-col gap-3">
                  <div>
                    <h3 className="font-medium">{t.label}</h3>
                    <p className="text-xs text-muted">{t.hint}</p>
                  </div>
                  {fixes.length === 0 && <p className="rounded-xl border border-dashed border-line p-4 text-sm text-muted">Nothing here.</p>}
                  {fixes.map((f, i) => (
                    <div key={`${f.useCase}-${i}`} className="rounded-xl border border-line bg-bg p-4">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-muted">{USE_CASE_BY_ID[f.useCase]?.short}</p>
                      <p className="mt-1 font-medium leading-snug">{f.action}</p>
                      <p className="mt-2 text-sm text-muted">
                        <span className="text-text">First step:</span> {f.firstStep}
                      </p>
                      <p className="mt-2 text-sm text-muted">
                        <span className="text-bad">Risk if wrong:</span> {f.riskIfWrong}
                      </p>
                      <div className="mt-3 flex gap-2 font-mono text-[10px] uppercase">
                        <span className={`rounded-full border px-2 py-0.5 ${f.owner === "expert" ? "border-accent/40 text-accent" : "border-line text-muted"}`}>
                          {f.owner === "expert" ? "Expert recommended" : "You"}
                        </span>
                        <span className="rounded-full border border-line px-2 py-0.5 text-muted">{f.effort}</span>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <Container className="py-14">
        <h2 className="font-display text-3xl">Findings and evidence</h2>
        <div className="mt-8 grid gap-10">
          {scores.perUseCase.map((s) => {
            const r = reportByUseCase.get(s.useCase);
            const items = findings.filter((f) => CHECKS_BY_ID[f.checkId]?.useCase === s.useCase);
            return (
              <section key={s.useCase} id={s.useCase} className="scroll-mt-24">
                <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-3">
                  <h3 className="font-display text-2xl">{USE_CASE_BY_ID[s.useCase].name}</h3>
                  <span className="font-mono text-sm tabular-nums" style={{ color: scoreColor(s.score) }}>
                    {s.score}/100
                  </span>
                </div>
                {r && <p className="mt-4 text-muted">{r.verdict}</p>}
                {r && r.topRisks.length > 0 && (
                  <ul className="mt-4 grid gap-2">
                    {r.topRisks.map((risk) => (
                      <li key={risk} className="border-l-2 border-bad/60 pl-3 text-sm">
                        {risk}
                      </li>
                    ))}
                  </ul>
                )}
                <ul className="mt-5 grid gap-2">
                  {items.map((f) => {
                    const c = CHECKS_BY_ID[f.checkId];
                    return (
                      <li key={f.checkId} className="flex items-start justify-between gap-4 rounded-xl border border-line px-4 py-3">
                        <div>
                          <p className="text-sm font-medium">{c.title}</p>
                          {f.evidence && <p className="mt-0.5 text-sm text-muted">{f.evidence}</p>}
                          <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted/70">
                            {f.source === "scan" ? "Measured by scan" : "Self-reported"}
                          </p>
                        </div>
                        <StatusPill status={f.status} />
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      </Container>

      {(report.goldenSetSuggestions.length > 0 || report.icpSuggestion) && (
        <Container className="grid gap-5 pb-14 md:grid-cols-2">
          {report.goldenSetSuggestions.length > 0 && (
            <div className="rounded-2xl border border-line p-6">
              <h3 className="font-medium">Start your Golden Set with these</h3>
              <p className="mt-1 text-sm text-muted">Run each through Customer Agent Preview mode before launch. Test mode is free.</p>
              <ol className="mt-4 list-decimal space-y-1.5 pl-5 text-sm">
                {report.goldenSetSuggestions.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ol>
            </div>
          )}
          {report.icpSuggestion && (
            <div className="rounded-2xl border border-line p-6">
              <h3 className="font-medium">Tightening your ICP</h3>
              <p className="mt-3 text-sm text-muted">{report.icpSuggestion}</p>
            </div>
          )}
        </Container>
      )}

      {cases.length > 0 && (
        <Container className="border-t border-line py-14">
          <h2 className="font-display text-3xl">Similar problems, solved</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cases.map((cs) => (
              <CaseStudyCard key={cs.slug} cs={cs} />
            ))}
          </div>
        </Container>
      )}

      <Container>
        <div className="glow rounded-3xl border border-line px-6 py-12 sm:px-12">
          <Eyebrow>Your smartest next move</Eyebrow>
          <p className="mt-4 max-w-3xl font-display text-3xl leading-tight text-balance sm:text-4xl">{report.nextStep}</p>
          <p className="mt-4 max-w-2xl text-muted">{band.text}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={bookingHref()}>Book a free 30-minute review</ButtonLink>
            {!scanned && (
              <ButtonLink href="/audit" variant="ghost">
                Get exact numbers with a live scan
              </ButtonLink>
            )}
          </div>
          <p className="mt-6 font-mono text-[11px] text-muted">
            Plan written by {report.generatedBy === "claude" ? "Claude" : "our rubric"} · Share this page: only people with the link can see it.
          </p>
        </div>
      </Container>
    </>
  );
}
