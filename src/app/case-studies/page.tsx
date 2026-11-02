import type { Metadata } from "next";
import { CaseStudyGrid } from "@/components/CaseStudyGrid";
import { Counter, Reveal } from "@/components/motion";
import { ButtonLink, Container, Eyebrow } from "@/components/SiteChrome";
import { getCaseStudies, toSummary } from "@/lib/case-studies";

export const metadata: Metadata = {
  title: "HubSpot case studies",
  description:
    "HubSpot optimization case studies: pipeline cleanup, CRM migrations, deduplication, integrations, lead scoring, workflow repair and AI-agent rollouts, each with before/after AI-readiness scores.",
};

export default function CaseStudiesPage() {
  const items = getCaseStudies().map(toSummary);
  const industries = new Set(items.map((i) => i.industry)).size;
  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div className="glow absolute inset-0" />
        <div className="grid-bg absolute inset-0" />
        <Container className="relative py-16 sm:py-20">
          <Reveal>
            <Eyebrow>Case studies</Eyebrow>
            <h1 className="mt-5 max-w-3xl font-display text-5xl leading-[1.05] tracking-tight text-balance sm:text-6xl">
              HubSpot case studies, <span className="gradient-text">scored for AI readiness</span>
            </h1>
            <p className="mt-5 max-w-2xl text-muted">
              Pipeline cleanups, migrations, deduplication, integrations and agent rollouts. Every engagement shows the
              outcome metric and the AI-readiness score before and after, so you can see what changed underneath.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-8 flex flex-wrap gap-6 font-mono text-sm text-muted">
              <span>
                <Counter value={items.length} className="text-text" /> engagements
              </span>
              <span>
                <Counter value={industries} className="text-text" /> industries
              </span>
              <span>
                <Counter value={6} className="text-text" /> HubSpot hubs
              </span>
            </div>
          </Reveal>
        </Container>
      </section>

      <Container className="py-12">
        <CaseStudyGrid items={items} />
        <Reveal>
          <div className="relative mt-20 overflow-hidden rounded-3xl border border-line p-8 sm:flex sm:items-center sm:justify-between">
            <div className="glow absolute inset-0" />
            <div className="relative">
              <h2 className="font-display text-3xl">Frustrated you&apos;re not seeing ROI from HubSpot?</h2>
              <p className="mt-2 text-muted">Run the audit and get your own before score in minutes.</p>
            </div>
            <ButtonLink href="/audit" className="relative mt-5 sm:mt-0">
              Run the free audit
            </ButtonLink>
          </div>
        </Reveal>
      </Container>
    </>
  );
}
