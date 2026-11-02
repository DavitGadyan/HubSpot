import Link from "next/link";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { ScoreBar, ScoreGauge, StatusPill } from "@/components/Score";
import { ButtonLink, Container, Eyebrow } from "@/components/SiteChrome";
import { USE_CASES } from "@/lib/audit/rubric";
import { getCaseStudies } from "@/lib/case-studies";

const QUIET_FAILURES = [
  {
    title: "Fields that don't mean one thing",
    body: "Lead source, lead status and lifecycle get patched over the years. AI learns the shortcut, not the business rule.",
  },
  {
    title: "Relationships that are technically there",
    body: "Contacts on duplicate companies, deals without the buying committee. AI summaries miss the account story.",
  },
  {
    title: "Lifecycle data nobody trusts",
    body: "Stale or overwritten stages turn into confident, wrong routing and scoring.",
  },
  {
    title: "Different answers for different roles",
    body: "AI only sees what permissions expose. Sales and marketing get different insights from the same record.",
  },
  {
    title: "No owner, no metrics",
    body: "No one reviews the agent and usage is counted instead of outcomes, so momentum fades within weeks.",
  },
  {
    title: "On everywhere, on day one",
    body: "Fully autonomous outreach, untested support answers, every channel at once. Trust is lost fast.",
  },
];

const AGENTS = [
  { id: "customer-agent", label: "Service", line: "Resolve tier-1 tickets from your knowledge base, then escalate to a human on frustration or after two failed attempts." },
  { id: "prospecting-agent", label: "Sales", line: "Personalised outreach to dormant leads, run semi-autonomously with daily caps and a human review queue." },
  { id: "content-agent", label: "Marketing", line: "Remix your best-performing posts into LinkedIn, social and email, always reviewed against your brand voice." },
] as const;

const EXAMPLE = [
  { name: "Data foundation", score: 42 },
  { name: "Permissions & seats", score: 83 },
  { name: "Customer Agent", score: 58 },
  { name: "Governance", score: 35 },
];

function ExampleReport() {
  return (
    <div aria-hidden className="fade-up hidden rounded-3xl border border-line bg-surface/80 p-6 shadow-2xl shadow-black/40 lg:block">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[11px] uppercase tracking-wider text-muted">Example report</p>
        <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] text-muted">Live scan</span>
      </div>
      <div className="mt-5 flex items-center gap-6">
        <ScoreGauge score={54} size={120} />
        <div className="grid flex-1 gap-3">
          {EXAMPLE.map((e) => (
            <div key={e.name}>
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-muted">{e.name}</span>
                <span className="tabular-nums">{e.score}</span>
              </div>
              <ScoreBar score={e.score} />
            </div>
          ))}
        </div>
      </div>
      <ul className="mt-6 grid gap-2 text-sm">
        <li className="flex items-center justify-between gap-3 rounded-xl border border-line bg-bg px-3 py-2.5">
          <span>31% of contacts have no owner</span>
          <StatusPill status="fail" />
        </li>
        <li className="flex items-center justify-between gap-3 rounded-xl border border-line bg-bg px-3 py-2.5">
          <span>Industry is free text, 47 variants</span>
          <StatusPill status="fail" />
        </li>
        <li className="flex items-center justify-between gap-3 rounded-xl border border-line bg-bg px-3 py-2.5">
          <span>Escalation on negative sentiment</span>
          <StatusPill status="pass" />
        </li>
      </ul>
    </div>
  );
}

export default function Home() {
  const featured = getCaseStudies().filter((c) => c.status === "published").slice(0, 3);

  return (
    <>
      <section className="glow border-b border-line">
        <Container className="grid items-center gap-14 py-20 sm:py-28 lg:grid-cols-[1.25fr_1fr]">
          <div className="fade-up max-w-3xl">
            <Eyebrow>HubSpot Breeze AI readiness</Eyebrow>
            <h1 className="mt-5 font-display text-5xl leading-[1.02] tracking-tight text-balance sm:text-7xl">
              AI in HubSpot doesn&apos;t fail loudly. <em className="text-accent">It fails quietly.</em>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted text-pretty">
              Agents keep producing confident output from messy fields, weak associations and stale lifecycle data.
              Find out what yours will get wrong before you switch them on, with a free readiness audit, a read-only
              portal scan and an AI-written optimization plan for every use case.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/audit">Run the free audit</ButtonLink>
              <ButtonLink href="/case-studies" variant="ghost">
                See case studies
              </ButtonLink>
            </div>
            <p className="mt-5 font-mono text-xs text-muted">5-minute self-assessment, or a 2-minute read-only HubSpot scan</p>
          </div>
          <ExampleReport />
        </Container>
      </section>

      <section>
        <Container className="py-20">
          <Eyebrow>Why agents underperform</Eyebrow>
          <h2 className="mt-4 max-w-2xl font-display text-4xl leading-tight text-balance">
            The six foundation problems behind most failed HubSpot AI rollouts
          </h2>
          <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {QUIET_FAILURES.map((f, i) => (
              <div key={f.title} className="bg-bg p-6">
                <span className="font-mono text-xs text-accent">0{i + 1}</span>
                <h3 className="mt-3 font-medium">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-surface/40">
        <Container className="grid gap-12 py-20 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <Eyebrow>How the audit works</Eyebrow>
            <h2 className="mt-4 font-display text-4xl leading-tight text-balance">Foundation first, then one agent at a time</h2>
            <p className="mt-4 text-muted">
              We check {USE_CASES.length} areas: four foundation areas that every agent depends on, then each agent&apos;s
              own guardrails. You get a score per area, the evidence behind it, and a Do Now / Do Next / Do Later plan.
            </p>
            <ButtonLink href="/use-cases" variant="ghost" className="mt-8">
              Explore the use cases
            </ButtonLink>
          </div>
          <ol className="grid gap-4">
            {[
              ["Assess", "Answer 30 plain-language checks, or connect HubSpot so we measure them for you: duplicates, blank owners, lifecycle coverage, association gaps, property sprawl, workflow health."],
              ["Score", "Each use case gets a 0–100 readiness score weighted by severity, plus the specific evidence behind every gap."],
              ["Optimize", "Claude turns the findings into a prioritized plan: the first step inside HubSpot, the risk if it's wrong, and whether you or an expert should own it."],
              ["Ship", "Results land on a private, shareable page you can send to your team, or bring to a call."],
            ].map(([t, d], i) => (
              <li key={t} className="flex gap-5 rounded-2xl border border-line bg-bg p-5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line font-mono text-sm text-accent">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-medium">{t}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section>
        <Container className="py-20">
          <Eyebrow>The three Breeze agents</Eyebrow>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {AGENTS.map((a) => (
              <Link
                key={a.id}
                href={`/use-cases/${a.id}`}
                className="group rounded-2xl border border-line p-6 transition-colors hover:border-accent/60"
              >
                <p className="font-mono text-xs uppercase tracking-wider text-muted">{a.label}</p>
                <h3 className="mt-3 font-display text-2xl">{USE_CASES.find((u) => u.id === a.id)!.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{a.line}</p>
                <span className="mt-6 inline-block text-sm text-accent transition-transform group-hover:translate-x-1">
                  What we check →
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {featured.length > 0 && (
        <section className="border-t border-line">
          <Container className="py-20">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <Eyebrow>Case studies</Eyebrow>
                <h2 className="mt-4 font-display text-4xl">Foundation work, measured</h2>
              </div>
              <ButtonLink href="/case-studies" variant="ghost">
                All case studies
              </ButtonLink>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((cs) => (
                <CaseStudyCard key={cs.slug} cs={cs} />
              ))}
            </div>
          </Container>
        </section>
      )}

      <section>
        <Container className="py-8">
          <div className="glow rounded-3xl border border-line px-6 py-14 text-center sm:px-12">
            <h2 className="mx-auto max-w-2xl font-display text-4xl leading-tight text-balance sm:text-5xl">
              Know what your agents will get wrong before your customers do.
            </h2>
            <ButtonLink href="/audit" className="mt-8">
              Start the free audit
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
