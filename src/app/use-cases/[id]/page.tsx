import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { ButtonLink, Container, Eyebrow } from "@/components/SiteChrome";
import { USE_CASES, USE_CASE_BY_ID, checksFor } from "@/lib/audit/rubric";
import type { UseCaseId } from "@/lib/audit/types";
import { matchCaseStudies } from "@/lib/case-studies";

type Params = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return USE_CASES.map((u) => ({ id: u.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const uc = USE_CASE_BY_ID[(await params).id as UseCaseId];
  return uc ? { title: uc.name, description: uc.summary } : {};
}

const TIER = { now: "Do now", next: "Do next", later: "Do later" } as const;

export default async function UseCasePage({ params }: Params) {
  const id = (await params).id as UseCaseId;
  const uc = USE_CASE_BY_ID[id];
  if (!uc) notFound();
  const checks = checksFor(id);
  const cases = matchCaseStudies([id], 3);

  return (
    <Container className="py-16 sm:py-20">
      <Link href="/use-cases" className="text-sm text-muted hover:text-text">
        ← All use cases
      </Link>
      <div className="mt-6 max-w-3xl">
        <Eyebrow>{uc.hub}</Eyebrow>
        <h1 className="mt-4 font-display text-5xl leading-[1.05] tracking-tight">{uc.name}</h1>
        <p className="mt-5 text-lg text-muted text-pretty">{uc.summary}</p>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[280px_1fr]">
        <div>
          <h2 className="font-mono text-xs uppercase tracking-wider text-muted">What breaks</h2>
          <ul className="mt-4 flex flex-col gap-3">
            {uc.failureModes.map((f) => (
              <li key={f} className="border-l-2 border-bad/60 pl-3 text-sm">
                {f}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-mono text-xs uppercase tracking-wider text-muted">What we check</h2>
          <ul className="mt-4 grid gap-3">
            {checks.map((c) => (
              <li key={c.id} className="rounded-2xl border border-line p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-medium">{c.title}</h3>
                  <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] uppercase text-muted">
                    {TIER[c.tier]}
                  </span>
                  {c.detector && (
                    <span className="rounded-full border border-accent/40 px-2 py-0.5 font-mono text-[10px] uppercase text-accent">
                      Auto-checked by scan
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-muted">{c.why}</p>
                <p className="mt-3 text-sm">
                  <span className="text-muted">First step: </span>
                  {c.firstStep}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {cases.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-3xl">Related case studies</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cases.map((cs) => (
              <CaseStudyCard key={cs.slug} cs={cs} />
            ))}
          </div>
        </section>
      )}

      <div className="mt-16">
        <ButtonLink href="/audit">Audit my {uc.name.toLowerCase()}</ButtonLink>
      </div>
    </Container>
  );
}
