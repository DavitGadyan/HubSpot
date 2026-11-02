import Link from "next/link";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { HeroMockup } from "@/components/HeroMockup";
import { Counter, Item, Reveal, Stagger, Tilt } from "@/components/motion";
import { ButtonLink, Container, Eyebrow } from "@/components/SiteChrome";
import { bookingHref } from "@/config/site";
import { CHECKS, USE_CASES } from "@/lib/audit/rubric";
import { getCaseStudies, toSummary } from "@/lib/case-studies";

const QUIET_FAILURES = [
  { icon: "⌘", title: "Fields that don't mean one thing", body: "Lead source, lead status and lifecycle get patched over the years. AI learns the shortcut, not the business rule." },
  { icon: "⛓", title: "Relationships that are technically there", body: "Contacts on duplicate companies, deals without the buying committee. AI summaries miss the account story." },
  { icon: "◷", title: "Lifecycle data nobody trusts", body: "Stale or overwritten stages turn into confident, wrong routing and scoring." },
  { icon: "◐", title: "Different answers for different roles", body: "AI only sees what permissions expose. Sales and marketing get different insights from the same record." },
  { icon: "◎", title: "No owner, no metrics", body: "No one reviews the agent and usage is counted instead of outcomes, so momentum fades within weeks." },
  { icon: "⚡", title: "On everywhere, on day one", body: "Fully autonomous outreach, untested support answers, every channel at once. Trust is lost fast." },
];

const AGENTS = [
  { id: "customer-agent", label: "Service Hub", line: "Resolve tier-1 tickets from your knowledge base, then escalate to a human on frustration or after two failed attempts." },
  { id: "prospecting-agent", label: "Sales Hub", line: "Personalised outreach to dormant leads, run semi-autonomously with daily caps and a human review queue." },
  { id: "content-agent", label: "Marketing Hub", line: "Remix your best-performing posts into LinkedIn, social and email, always reviewed against your brand voice." },
] as const;

const STEPS = [
  { t: "Assess", d: "Answer 30 plain-language checks, or connect HubSpot so we measure them: duplicates, blank owners, lifecycle coverage, association gaps, property sprawl, workflow health." },
  { t: "Score", d: "Each use case gets a 0–100 readiness score weighted by severity, plus the specific evidence behind every gap." },
  { t: "Optimize", d: "Claude turns findings into a prioritized plan: the first step inside HubSpot, the risk if it's wrong, and whether you or an expert should own it." },
  { t: "Ship", d: "Results land on a private, shareable page. Bring it to a strategy call and we execute the Do Now list first." },
];

const MARQUEE = [
  "Sales Hub", "Marketing Hub", "Service Hub", "Content Hub", "Operations Hub", "Data Hub",
  "Breeze Customer Agent", "Breeze Prospecting Agent", "Breeze Content Agent", "Breeze Intelligence",
  "Salesforce migration", "NetSuite sync", "Shopify", "Jira", "Typeform", "Claude",
];

export default function Home() {
  const featured = getCaseStudies().filter((c) => c.status === "published").slice(0, 3).map(toSummary);
  const scanned = CHECKS.filter((c) => c.detector).length;

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="glow absolute inset-0" />
        <div className="grid-bg absolute inset-0" />
        <Container className="relative grid items-center gap-14 py-20 sm:py-28 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <Reveal>
              <Eyebrow>HubSpot optimization · AI-ready</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="mt-6 font-display text-5xl leading-[1.02] tracking-tight text-balance sm:text-7xl">
                Frustrated your HubSpot AI agents <span className="gradient-text">quietly get it wrong?</span>
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-xl text-lg text-muted text-pretty">
                Breeze agents keep producing confident output from messy fields, weak associations and stale lifecycle
                data. HubAIOps finds what yours will get wrong before your customers do, then fixes it in 30 days.
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-9 flex flex-wrap gap-3">
                <ButtonLink href="/audit" size="lg">
                  Run the free AI-readiness audit
                </ButtonLink>
                <ButtonLink href={bookingHref()} variant="ghost" size="lg">
                  Claim a free strategy session
                </ButtonLink>
              </div>
            </Reveal>
            <Reveal delay={0.32}>
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-muted">
                <li>✓ 5-minute self-assessment</li>
                <li>✓ 2-minute read-only portal scan</li>
                <li>✓ No contact data stored</li>
              </ul>
            </Reveal>
          </div>
          <HeroMockup />
        </Container>
      </section>

      {/* ---------- Marquee ---------- */}
      <section className="border-b border-line py-6">
        <div className="marquee overflow-hidden">
          <div className="marquee-track">
            {[...MARQUEE, ...MARQUEE].map((m, i) => (
              <span key={i} className="glass whitespace-nowrap rounded-full px-4 py-1.5 text-sm text-muted">
                {m}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Stats ---------- */}
      <section>
        <Container className="py-16">
          <Stagger className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {[
              { v: USE_CASES.length, s: "", l: "AI use cases scored" },
              { v: CHECKS.length, s: "", l: "readiness checks" },
              { v: scanned, s: "", l: "measured live from your portal" },
              { v: 30, s: " days", l: "to first results" },
            ].map((x) => (
              <Item key={x.l} className="bg-bg p-7">
                <p className="font-display text-5xl">
                  <Counter value={x.v} suffix={x.s} />
                </p>
                <p className="mt-2 text-sm text-muted">{x.l}</p>
              </Item>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* ---------- Problem ---------- */}
      <section>
        <Container className="py-16">
          <Reveal>
            <Eyebrow>Why agents underperform</Eyebrow>
            <h2 className="mt-5 max-w-2xl font-display text-4xl leading-tight text-balance sm:text-5xl">
              The wrong HubSpot setup bleeds revenue. AI makes it bleed <span className="gradient-text">faster</span>.
            </h2>
          </Reveal>
          <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {QUIET_FAILURES.map((f, i) => (
              <Item key={f.title}>
                <Tilt className="card h-full p-6">
                  <div className="flex items-center justify-between">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-accent/30 to-accent-2/10 text-lg text-accent-2">
                      {f.icon}
                    </span>
                    <span className="font-mono text-xs text-muted">0{i + 1}</span>
                  </div>
                  <h3 className="mt-5 font-medium">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
                </Tilt>
              </Item>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* ---------- Process ---------- */}
      <section className="relative overflow-hidden border-y border-line bg-surface/40">
        <div className="blob drift right-0 top-0 h-80 w-80 bg-accent-3/60" />
        <Container className="relative grid gap-12 py-20 lg:grid-cols-[1fr_1.25fr]">
          <Reveal>
            <Eyebrow>How it works</Eyebrow>
            <h2 className="mt-5 font-display text-4xl leading-tight text-balance sm:text-5xl">
              See results in 30 days. Foundation first, then one agent at a time.
            </h2>
            <p className="mt-5 text-muted">
              We check {USE_CASES.length} areas: four foundations every agent reads from, then each agent&apos;s own
              guardrails. You get a score per area, the evidence, and a Do Now / Do Next / Do Later plan.
            </p>
            <ButtonLink href="/use-cases" variant="ghost" className="mt-8">
              Explore the use cases
            </ButtonLink>
            <div className="card mt-10 overflow-hidden p-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/site/team-review.jpg"
                alt="A consultant and a client reviewing a CRM pipeline dashboard together"
                loading="lazy"
                className="aspect-[16/10] w-full object-cover"
              />
            </div>
          </Reveal>
          <Stagger className="grid gap-4">
            {STEPS.map((s, i) => (
              <Item key={s.t}>
                <div className="card flex gap-5 p-5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-accent to-accent-2 font-mono text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-medium">{s.t}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{s.d}</p>
                  </div>
                </div>
              </Item>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* ---------- Agents ---------- */}
      <section>
        <Container className="py-20">
          <Reveal>
            <Eyebrow>The three Breeze agents</Eyebrow>
            <h2 className="mt-5 font-display text-4xl leading-tight sm:text-5xl">What happens when HubSpot AI actually works</h2>
          </Reveal>
          <Stagger className="mt-10 grid gap-5 md:grid-cols-3">
            {AGENTS.map((a) => (
              <Item key={a.id}>
                <Link href={`/use-cases/${a.id}`} className="card group block h-full p-6">
                  <p className="font-mono text-xs uppercase tracking-wider text-accent-2">{a.label}</p>
                  <h3 className="mt-3 font-display text-3xl">{USE_CASES.find((u) => u.id === a.id)!.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{a.line}</p>
                  <span className="mt-6 inline-block text-sm text-accent-2 transition-transform group-hover:translate-x-1">
                    What we check →
                  </span>
                </Link>
              </Item>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* ---------- Comparison ---------- */}
      <section className="border-y border-line bg-surface/40">
        <Container className="py-20">
          <Reveal>
            <h2 className="font-display text-4xl sm:text-5xl">
              Typical agencies <span className="text-muted">vs</span> <span className="gradient-text">HubAIOps</span>
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <Reveal className="card p-6">
              <p className="font-mono text-xs uppercase tracking-wider text-muted">Typical agencies</p>
              <ul className="mt-4 grid gap-3 text-sm text-muted">
                <li>✕ Turn agents on, then clean data later</li>
                <li>✕ Report usage, not pipeline, deflection or hours saved</li>
                <li>✕ Project-manager bottleneck, freelancers behind the curtain</li>
                <li>✕ Long contracts, no owner after launch</li>
              </ul>
            </Reveal>
            <Reveal delay={0.1} className="card border-accent/40 p-6">
              <p className="font-mono text-xs uppercase tracking-wider text-accent-2">HubAIOps</p>
              <ul className="mt-4 grid gap-3 text-sm">
                <li>✓ Audit and foundation fixes before any agent goes live</li>
                <li>✓ Outcome metrics defined per agent, reported weekly</li>
                <li>✓ One consultant end to end, HubSpot and AI engineering in-house</li>
                <li>✓ Month-to-month, with a named AI owner trained on your side</li>
              </ul>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ---------- Case studies ---------- */}
      {featured.length > 0 && (
        <section>
          <Container className="py-20">
            <Reveal className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <Eyebrow>Case studies</Eyebrow>
                <h2 className="mt-5 font-display text-4xl sm:text-5xl">HubSpot problems, measured before and after</h2>
              </div>
              <ButtonLink href="/case-studies" variant="ghost">
                All case studies
              </ButtonLink>
            </Reveal>
            <Stagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((cs) => (
                <Item key={cs.slug}>
                  <CaseStudyCard cs={cs} />
                </Item>
              ))}
            </Stagger>
          </Container>
        </section>
      )}

      {/* ---------- Final CTA ---------- */}
      <section>
        <Container className="py-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-line px-6 py-16 text-center sm:px-12">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/site/strategy-session.jpg"
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover opacity-25"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-bg/60 via-bg/80 to-bg" />
              <div className="glow absolute inset-0" />
              <div className="grid-bg absolute inset-0" />
              <div className="relative">
                <h2 className="mx-auto max-w-2xl font-display text-4xl leading-tight text-balance sm:text-6xl">
                  Know what your agents will get wrong <span className="gradient-text">before your customers do.</span>
                </h2>
                <p className="mx-auto mt-5 max-w-xl text-muted">
                  The free session includes a diagnosis of your portal, three tailored fixes, and an honest read on
                  whether you can do it yourself.
                </p>
                <div className="mt-9 flex flex-wrap justify-center gap-3">
                  <ButtonLink href="/audit" size="lg">
                    Start the free audit
                  </ButtonLink>
                  <ButtonLink href={bookingHref()} variant="ghost" size="lg">
                    Book a strategy session
                  </ButtonLink>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
