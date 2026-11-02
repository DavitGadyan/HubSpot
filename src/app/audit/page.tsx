import type { Metadata } from "next";
import { ConnectForm } from "@/components/ConnectForm";
import { ButtonLink, Container, Eyebrow } from "@/components/SiteChrome";
import { CHECKS } from "@/lib/audit/rubric";
import { hubspotConfigured } from "@/lib/hubspot/oauth";

export const metadata: Metadata = {
  title: "Free HubSpot AI-readiness audit",
  description: "Self-assessment or read-only HubSpot scan, scored per use case with an AI-written optimization plan.",
};

export default async function AuditPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const scanned = CHECKS.filter((c) => c.detector).length;
  return (
    <Container className="py-16 sm:py-20">
      <Eyebrow>Free audit</Eyebrow>
      <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[1.05] tracking-tight text-balance sm:text-6xl">
        How ready is your HubSpot for AI agents?
      </h1>
      <p className="mt-5 max-w-2xl text-muted">
        Pick how you want to be assessed. Both end on the same results page: a score per use case, the evidence, and
        a prioritized plan.
      </p>
      {error && (
        <p role="alert" className="mt-6 rounded-xl border border-bad/40 bg-bad/10 px-4 py-3 text-sm text-bad">
          {error}
        </p>
      )}

      <div className="mt-12 grid gap-5 lg:grid-cols-2">
        <section className="flex flex-col rounded-3xl border border-line p-7">
          <p className="font-mono text-xs uppercase tracking-wider text-muted">Option 1 · 5 minutes</p>
          <h2 className="mt-3 font-display text-3xl">Self-assessment</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {CHECKS.length} yes/no questions across data, permissions, knowledge, the three Breeze agents and governance.
            No HubSpot access needed.
          </p>
          <ul className="mt-6 flex flex-col gap-2 text-sm">
            <li>✓ Works for any HubSpot tier</li>
            <li>✓ &quot;Not sure&quot; is a valid answer, and it counts as a gap</li>
          </ul>
          <ButtonLink href="/audit/quiz" className="mt-auto self-start pt-2.5">
            Start the self-assessment
          </ButtonLink>
        </section>

        <section className="flex flex-col rounded-3xl border border-accent/40 bg-surface p-7">
          <p className="font-mono text-xs uppercase tracking-wider text-accent">Option 2 · 2 minutes · most accurate</p>
          <h2 className="mt-3 font-display text-3xl">Connect HubSpot</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            A read-only scan measures {scanned} checks directly: lifecycle and owner coverage, duplicates, contact–company
            and deal–contact associations, property sprawl, industry standardization, ICP field coverage, ticket
            pipelines, blog sources and workflow health.
          </p>
          <ul className="mt-6 flex flex-col gap-2 text-sm text-muted">
            <li>• Read-only scopes. We never write to your portal.</li>
            <li>• Only counts and percentages are stored. No contact records.</li>
            <li>• Access tokens are deleted when the scan finishes.</li>
          </ul>
          <div className="mt-6">
            {hubspotConfigured() ? (
              <ConnectForm />
            ) : (
              <p className="rounded-xl border border-line px-4 py-3 text-sm text-muted">
                The live scan isn&apos;t enabled on this deployment yet. Use the self-assessment for now.
              </p>
            )}
          </div>
        </section>
      </div>
    </Container>
  );
}
