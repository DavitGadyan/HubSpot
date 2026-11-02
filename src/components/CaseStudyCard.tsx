import Link from "next/link";
import type { CaseStudySummary } from "@/lib/case-studies";
import { USE_CASE_BY_ID } from "@/lib/audit/rubric";

const HUB_COLORS: Record<string, string> = {
  Sales: "from-accent to-accent-2",
  Marketing: "from-accent-3 to-accent",
  Service: "from-accent-2 to-ok",
  Content: "from-accent-3 to-accent-2",
  Operations: "from-accent to-accent-3",
  Data: "from-accent-2 to-accent-3",
};

export function CaseStudyCard({ cs }: { cs: CaseStudySummary }) {
  const lead = cs.metrics[0];
  const grad = HUB_COLORS[cs.hubs[0]] ?? "from-accent to-accent-2";
  return (
    <Link href={`/case-studies/${cs.slug}`} className="card group flex flex-col overflow-hidden">
      <div className="relative aspect-[16/9] overflow-hidden bg-surface-2">
        {cs.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cs.image} alt="" loading="lazy" className="h-full w-full object-cover opacity-80 transition-[opacity,transform] duration-300 group-hover:scale-[1.03] group-hover:opacity-100" />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${grad} opacity-25 transition-opacity duration-300 group-hover:opacity-40`} />
        )}
        <div className="grid-bg absolute inset-0 opacity-60" />
        <div className="absolute left-4 top-4 flex gap-1.5">
          {cs.hubs.map((h) => (
            <span key={h} className="rounded-full bg-bg/70 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-text backdrop-blur">
              {h} Hub
            </span>
          ))}
        </div>
        {cs.status === "draft" && (
          <span className="absolute right-4 top-4 rounded-full bg-warn px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-black">
            Draft
          </span>
        )}
        {lead && (
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
            <div>
              <span className="font-display text-4xl leading-none text-white drop-shadow">{lead.value}</span>
              <p className="mt-1 text-xs text-text/80">{lead.label}</p>
            </div>
            {cs.readiness && (
              <div className="glass rounded-xl px-3 py-2 text-right">
                <p className="font-mono text-[9px] uppercase tracking-wider text-muted">AI readiness</p>
                <p className="font-mono text-sm">
                  <span className="text-bad">{cs.readiness.before}</span>
                  <span className="text-muted"> → </span>
                  <span className="text-ok">{cs.readiness.after}</span>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="font-mono text-[11px] uppercase tracking-wider text-muted">
          {cs.industry} · {cs.size}
        </p>
        <h3 className="text-base font-medium leading-snug text-balance">{cs.title}</h3>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
          {cs.useCases.slice(0, 3).map((u) => (
            <span key={u} className="rounded-full border border-line px-2 py-0.5 text-[11px] text-muted">
              {USE_CASE_BY_ID[u]?.name ?? u}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
