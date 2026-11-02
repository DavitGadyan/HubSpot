import type { Metadata } from "next";
import { CaseStudyGrid } from "@/components/CaseStudyGrid";
import { ButtonLink, Container, Eyebrow } from "@/components/SiteChrome";
import { getCaseStudies } from "@/lib/case-studies";

export const metadata: Metadata = {
  title: "Case studies",
  description: "HubSpot data, AI agent and automation work: duplicates, industry standardization, attribution, lead scoring and agent guardrails.",
};

export default function CaseStudiesPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const items = getCaseStudies().map(({ body, ...rest }) => rest);
  return (
    <Container className="py-16 sm:py-20">
      <Eyebrow>Case studies</Eyebrow>
      <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[1.05] tracking-tight text-balance sm:text-6xl">
        The foundation work AI agents depend on
      </h1>
      <p className="mt-5 max-w-2xl text-muted">
        Clean data, trusted fields, connected systems and guardrails, delivered for real clients. Every number below
        comes from the project itself. Filter by industry, HubSpot product or the AI use case it unlocks.
      </p>
      <div className="mt-12">
        <CaseStudyGrid items={items} />
      </div>
      <div className="mt-20 flex flex-col items-start gap-4 rounded-2xl border border-line bg-surface p-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-3xl">Not seeing ROI from HubSpot AI?</h2>
          <p className="mt-2 text-muted">Run the audit and get your own results page in minutes.</p>
        </div>
        <ButtonLink href="/audit">Run the free audit</ButtonLink>
      </div>
    </Container>
  );
}
