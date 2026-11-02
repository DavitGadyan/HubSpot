import Link from "next/link";
import { Container } from "@/components/SiteChrome";
import { getStore } from "@/db/store";
import type { AuditScores } from "@/lib/audit/types";
import { getCaseStudies } from "@/lib/case-studies";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin", robots: { index: false } };

export default async function AdminPage() {
  const store = getStore();
  const [audits, leads] = await Promise.all([store.listAudits(), store.listLeads()]);
  const leadById = new Map(leads.map((l) => [l.id, l]));
  const drafts = getCaseStudies().filter((c) => c.status === "draft");

  return (
    <Container className="py-12">
      <h1 className="font-display text-4xl">Admin</h1>
      <p className="mt-2 text-sm text-muted">
        {leads.length} leads · {audits.length} audits · {drafts.length} draft case studies (edit in <code>content/case-studies/</code>, set
        <code> status: published</code>)
      </p>
      <div className="mt-8 overflow-x-auto rounded-2xl border border-line">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-surface font-mono text-[11px] uppercase tracking-wider text-muted">
            <tr>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Lead</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Mode</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3">Gaps</th>
            </tr>
          </thead>
          <tbody>
            {audits.map((a) => {
              const lead = a.leadId ? leadById.get(a.leadId) : undefined;
              const s = a.scores as AuditScores | null;
              return (
                <tr key={a.id} className="border-t border-line">
                  <td className="px-4 py-3 text-muted">{a.createdAt.toISOString().slice(0, 16).replace("T", " ")}</td>
                  <td className="px-4 py-3">{lead?.email ?? "—"}</td>
                  <td className="px-4 py-3">{lead?.company ?? "—"}</td>
                  <td className="px-4 py-3">{a.mode}</td>
                  <td className="px-4 py-3">{a.status}</td>
                  <td className="px-4 py-3 tabular-nums">
                    <Link href={`/audit/${a.id}`} className="text-accent hover:underline">
                      {s?.overall ?? "—"}
                    </Link>
                  </td>
                  <td className="px-4 py-3 tabular-nums">{s?.gaps ?? "—"}</td>
                </tr>
              );
            })}
            {audits.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted">
                  No audits yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Container>
  );
}
