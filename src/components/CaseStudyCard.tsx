import Link from "next/link";
import type { CaseStudy } from "@/lib/case-studies";
import { USE_CASE_BY_ID } from "@/lib/audit/rubric";

export function CaseStudyCard({ cs }: { cs: Pick<CaseStudy, "slug" | "title" | "industry" | "hubs" | "useCases" | "metrics" | "status" | "image" | "client"> }) {
  const lead = cs.metrics[0];
  return (
    <Link
      href={`/case-studies/${cs.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-colors hover:border-muted/60"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-surface-2">
        {cs.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cs.image}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover opacity-80 transition-[opacity,transform] duration-300 group-hover:scale-[1.02] group-hover:opacity-100"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-xs uppercase tracking-widest text-muted">
            Case study in progress
          </div>
        )}
        {cs.status === "draft" && (
          <span className="absolute left-3 top-3 rounded-full bg-warn px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-black">
            Draft
          </span>
        )}
        {lead && (
          <div className="absolute bottom-3 left-3 rounded-lg bg-bg/85 px-3 py-1.5 backdrop-blur">
            <span className="font-display text-lg leading-none">{lead.value}</span>
            <span className="ml-2 text-xs text-muted">{lead.label}</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="font-mono text-[11px] uppercase tracking-wider text-muted">
          {cs.industry} · {cs.hubs.map((h) => `${h} Hub`).join(" | ")}
        </p>
        <h3 className="text-base font-medium leading-snug text-balance">{cs.title}</h3>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
          {cs.useCases.map((u) => (
            <span key={u} className="rounded-full border border-line px-2 py-0.5 text-[11px] text-muted">
              {USE_CASE_BY_ID[u]?.name ?? u}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
