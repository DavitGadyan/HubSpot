import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { AnimatedRing, Item, Reveal, Stagger } from "@/components/motion";
import { ButtonLink, Container, Eyebrow } from "@/components/SiteChrome";
import { USE_CASE_BY_ID } from "@/lib/audit/rubric";
import { getCaseStudies, getCaseStudy, toSummary } from "@/lib/case-studies";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getCaseStudies().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const cs = getCaseStudy((await params).slug);
  return cs
    ? { title: cs.title, description: cs.summary || cs.body.slice(0, 160), robots: cs.status === "draft" ? { index: false } : undefined }
    : {};
}

export default async function CaseStudyPage({ params }: Params) {
  const cs = getCaseStudy((await params).slug);
  if (!cs) notFound();
  const related = getCaseStudies()
    .filter((c) => c.slug !== cs.slug && c.status === "published" && c.useCases.some((u) => cs.useCases.includes(u)))
    .slice(0, 3)
    .map(toSummary);

  return (
    <article>
      <div className="relative overflow-hidden border-b border-line">
        <div className="glow absolute inset-0" />
        <div className="grid-bg absolute inset-0" />
        <Container className="relative py-14 sm:py-20">
          <Reveal>
            <Link href="/case-studies" className="text-sm text-muted hover:text-text">
              ← All case studies
            </Link>
            {cs.status === "draft" && (
              <p className="ml-4 inline-block rounded-full bg-warn px-3 py-1 font-mono text-xs font-bold uppercase text-black">
                Draft: hidden in production
              </p>
            )}
          </Reveal>
          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <Reveal delay={0.05} className="max-w-4xl">
              <Eyebrow>
                {cs.industry} · {cs.size} · {cs.hubs.map((h) => `${h} Hub`).join(" | ")}
              </Eyebrow>
              <h1 className="mt-5 font-display text-4xl leading-[1.08] tracking-tight text-balance sm:text-6xl">{cs.title}</h1>
              {cs.summary && <p className="mt-5 max-w-2xl text-lg text-muted text-pretty">{cs.summary}</p>}
              <p className="mt-4 text-sm text-muted">{cs.client}</p>
            </Reveal>
            {cs.readiness && (
              <Reveal delay={0.15} className="glass flex items-center gap-5 rounded-3xl p-5">
                <div className="text-center">
                  <AnimatedRing score={cs.readiness.before} size={96} color="var(--bad)" />
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-muted">Before</p>
                </div>
                <span className="text-2xl text-muted">→</span>
                <div className="text-center">
                  <AnimatedRing score={cs.readiness.after} size={96} color="var(--ok)" />
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-muted">After</p>
                </div>
              </Reveal>
            )}
          </div>
          {cs.metrics.length > 0 && (
            <Stagger className="mt-10 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-3">
              {cs.metrics.map((m) => (
                <Item key={m.label} className="bg-bg p-6">
                  <p className="font-display text-4xl tabular-nums">{m.value}</p>
                  <p className="mt-1 text-sm text-muted">{m.label}</p>
                </Item>
              ))}
            </Stagger>
          )}
        </Container>
      </div>

      <Container className="grid gap-12 py-12 lg:grid-cols-[1fr_300px]">
        <Reveal className="prose-case max-w-2xl">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{cs.body}</ReactMarkdown>
          {cs.sample && (
            <p className="mt-10 rounded-xl border border-line bg-surface p-4 text-xs text-muted">
              Representative engagement. Industry, size and figures describe a typical HubAIOps project of this kind;
              client identity is withheld.
            </p>
          )}
        </Reveal>
        <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
          <Reveal delay={0.1} className="card p-5">
            <p className="font-mono text-xs uppercase tracking-wider text-muted">Unlocks</p>
            <ul className="mt-3 flex flex-col gap-2 text-sm">
              {cs.useCases.map((u) => (
                <li key={u}>
                  <Link href={`/use-cases/${u}`} className="text-accent-2 hover:underline">
                    {USE_CASE_BY_ID[u]?.name ?? u}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-5 font-mono text-xs uppercase tracking-wider text-muted">Stack</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {cs.stack.map((s) => (
                <span key={s} className="rounded-full border border-line px-2 py-0.5 text-xs text-muted">
                  {s}
                </span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.15} className="card bg-gradient-to-br from-accent/15 to-accent-3/10 p-5">
            <p className="font-medium">Same problem in your portal?</p>
            <p className="mt-1 text-sm text-muted">Get your own before score in five minutes.</p>
            <ButtonLink href="/audit" className="mt-4 w-full">
              Run the free audit
            </ButtonLink>
          </Reveal>
        </aside>
      </Container>

      {related.length > 0 && (
        <Container className="border-t border-line pt-14">
          <Reveal>
            <h2 className="font-display text-3xl">Related work</h2>
          </Reveal>
          <Stagger className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <Item key={r.slug}>
                <CaseStudyCard cs={r} />
              </Item>
            ))}
          </Stagger>
        </Container>
      )}
    </article>
  );
}
