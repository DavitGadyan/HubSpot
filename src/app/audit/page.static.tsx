import type { Metadata } from "next";
import { HeroMockup } from "@/components/HeroMockup";
import { Reveal } from "@/components/motion";
import { ButtonLink, Container, Eyebrow } from "@/components/SiteChrome";
import { bookingHref } from "@/config/site";
import { CHECKS, USE_CASES } from "@/lib/audit/rubric";

/**
 * Static-site variant of /audit (GitHub Pages build). The full audit app needs a
 * server, so here it is presented as a private beta behind sign-in.
 */
export const metadata: Metadata = {
  title: "HubSpot AI-readiness audit (private beta)",
  description: "The HubAIOps audit scores your HubSpot portal across 7 AI use cases. Currently available to clients by request.",
};

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "";

export default function AuditGatePage() {
  const scanned = CHECKS.filter((c) => c.detector).length;
  return (
    <section className="relative overflow-hidden">
      <div className="glow absolute inset-0" />
      <div className="grid-bg absolute inset-0" />
      <Container className="relative grid items-center gap-14 py-16 sm:py-24 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <Reveal>
            <Eyebrow>Private beta · clients only</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="mt-5 font-display text-5xl leading-[1.05] tracking-tight text-balance sm:text-6xl">
              The AI-readiness audit is <span className="gradient-text">sign-in only</span> for now
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-5 max-w-xl text-lg text-muted text-pretty">
              {CHECKS.length} checks across {USE_CASES.length} use cases, {scanned} of them measured live from your portal
              through a read-only HubSpot connection, and a Claude-written Do Now / Do Next / Do Later plan. We run it
              with you during the first strategy session.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={bookingHref()} size="lg">
                Request access
              </ButtonLink>
              {APP_URL ? (
                <ButtonLink href={`${APP_URL}/audit`} variant="ghost" size="lg">
                  Sign in
                </ButtonLink>
              ) : (
                <span className="glass inline-flex cursor-not-allowed items-center rounded-full px-7 py-3.5 text-base text-muted">
                  Sign in · coming soon
                </span>
              )}
            </div>
          </Reveal>
          <Reveal delay={0.32}>
            <ul className="mt-8 grid gap-2 text-sm text-muted">
              <li>✓ Read-only HubSpot scopes; tokens deleted after the scan</li>
              <li>✓ Only counts and percentages are stored, never contact records</li>
              <li>✓ Results on a private, shareable page</li>
            </ul>
          </Reveal>
        </div>
        <HeroMockup />
      </Container>
    </section>
  );
}
