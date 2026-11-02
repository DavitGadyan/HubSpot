import type { Metadata } from "next";
import Link from "next/link";
import { Container, Eyebrow } from "@/components/SiteChrome";
import { USE_CASES, checksFor } from "@/lib/audit/rubric";

export const metadata: Metadata = { title: "Use cases", description: "What we audit and optimize for each HubSpot AI use case." };

export default function UseCasesPage() {
  return (
    <Container className="py-16 sm:py-20">
      <Eyebrow>Use cases</Eyebrow>
      <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[1.05] tracking-tight text-balance">
        Seven areas, one order of operations
      </h1>
      <p className="mt-5 max-w-2xl text-muted">
        The first four are foundations every agent reads from. The last three are what you switch on once they hold.
      </p>
      <div className="mt-12 grid gap-4">
        {USE_CASES.map((u, i) => (
          <Link
            key={u.id}
            href={`/use-cases/${u.id}`}
            className="group grid gap-4 rounded-2xl border border-line p-6 transition-colors hover:border-accent/60 sm:grid-cols-[3rem_1fr_auto] sm:items-center"
          >
            <span className="font-mono text-sm text-accent">0{i + 1}</span>
            <div>
              <h2 className="font-display text-2xl">{u.name}</h2>
              <p className="mt-1 max-w-2xl text-sm text-muted">{u.summary}</p>
            </div>
            <span className="font-mono text-xs text-muted">{checksFor(u.id).length} checks →</span>
          </Link>
        ))}
      </div>
    </Container>
  );
}
