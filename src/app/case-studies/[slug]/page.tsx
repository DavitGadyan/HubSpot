import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { ButtonLink, Container, Eyebrow } from "@/components/SiteChrome";
import { USE_CASE_BY_ID } from "@/lib/audit/rubric";
import { getCaseStudies, getCaseStudy } from "@/lib/case-studies";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getCaseStudies().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const cs = getCaseStudy((await params).slug);
  return cs ? { title: cs.title, description: cs.body.slice(0, 160), robots: cs.status === "draft" ? { index: false } : undefined } : {};
}

export default async function CaseStudyPage({ params }: Params) {
  const cs = getCaseStudy((await params).slug);
  if (!cs) notFound();
  const related = getCaseStudies()
    .filter((c) => c.slug !== cs.slug && c.status === "published" && c.useCases.some((u) => cs.useCases.includes(u)))
    .slice(0, 3);

  return (
    <article>
      <div className="glow border-b border-line">
        <Container className="py-14 sm:py-20">
          <Link href="/case-studies" className="text-sm text-muted hover:text-text">
            ← All case studies
          </Link>
          {cs.status === "draft" && (
            <p className="mt-6 inline-block rounded-full bg-warn px-3 py-1 font-mono text-xs font-bold uppercase text-black">
              Draft: hidden in production
            </p>
          )}
          <div className="mt-6 max-w-4xl">
            <Eyebrow>
              {cs.industry} · {cs.hubs.map((h) => `${h} Hub`).join(" | ")}
            </Eyebrow>
            <h1 className="mt-4 font-display text-4xl leading-[1.08] tracking-tight text-balance sm:text-6xl">{cs.title}</h1>
            <p className="mt-4 text-muted">
              {cs.client}
              {cs.size && cs.size !== "Undisclosed" ? ` · ${cs.size}` : ""}
            </p>
          </div>
          {cs.metrics.length > 0 && (
            <dl className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
              {cs.metrics.map((m) => (
                <div key={m.label} className="bg-bg p-6">
                  <dt className="font-display text-3xl tabular-nums">{m.value}</dt>
                  <dd className="mt-1 text-sm text-muted">{m.label}</dd>
                </div>
              ))}
            </dl>
          )}
        </Container>
      </div>

      <Container className="grid gap-12 py-12 lg:grid-cols-[1fr_280px]">
        <div className="prose-case max-w-2xl">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{cs.body}</ReactMarkdown>
        </div>
        <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-line p-5">
            <p className="font-mono text-xs uppercase tracking-wider text-muted">Unlocks</p>
            <ul className="mt-3 flex flex-col gap-2 text-sm">
              {cs.useCases.map((u) => (
                <li key={u}>
                  <Link href={`/use-cases/${u}`} className="text-accent hover:underline">
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
            {cs.sourceUrl && (
              <a href={cs.sourceUrl} className="mt-5 inline-block text-sm text-muted underline-offset-4 hover:text-text hover:underline">
                Original project write-up ↗
              </a>
            )}
          </div>
          <div className="rounded-2xl border border-line bg-surface p-5">
            <p className="font-medium">Is your portal ready?</p>
            <p className="mt-1 text-sm text-muted">Check the same foundations in your own HubSpot.</p>
            <ButtonLink href="/audit" className="mt-4 w-full">
              Run the free audit
            </ButtonLink>
          </div>
        </aside>
      </Container>

      {related.length > 0 && (
        <Container className="border-t border-line pt-14">
          <h2 className="font-display text-3xl">Related work</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <CaseStudyCard key={r.slug} cs={r} />
            ))}
          </div>
        </Container>
      )}
    </article>
  );
}
