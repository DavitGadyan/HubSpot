"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Progress = { status: "running" | "done" | "error"; step: number; total: number; label: string; error?: string | null };

export function ScanRunner({ auditId, steps }: { auditId: string; steps: string[] }) {
  const router = useRouter();
  const [p, setP] = useState<Progress>({ status: "running", step: 0, total: steps.length, label: steps[0] });
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    (async () => {
      for (let i = 0; i < steps.length + 1; i++) {
        const res = await fetch(`/api/scan/${auditId}`, { method: "POST" });
        const next: Progress = await res.json();
        setP(next);
        if (next.status !== "running") break;
      }
      router.refresh();
    })().catch(() => setP((x) => ({ ...x, status: "error", error: "Connection lost. Refresh to resume." })));
  }, [auditId, router, steps.length]);

  const analyzing = p.step >= steps.length && p.status === "running";
  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-line bg-surface p-8" aria-live="polite">
      <p className="font-mono text-xs uppercase tracking-wider text-accent">Scanning your portal</p>
      <h1 className="mt-3 font-display text-4xl">{p.status === "error" ? "Scan interrupted" : "Reading HubSpot (read-only)"}</h1>
      <ol className="mt-8 grid gap-3">
        {steps.map((s, i) => {
          const done = i < p.step;
          const active = i === p.step && p.status === "running";
          return (
            <li key={s} className="flex items-center gap-3 text-sm">
              <span
                className={`grid h-5 w-5 place-items-center rounded-full border text-[10px] ${
                  done ? "border-ok bg-ok text-black" : active ? "animate-pulse border-accent" : "border-line"
                }`}
              >
                {done ? "✓" : ""}
              </span>
              <span className={done ? "text-text" : active ? "text-text" : "text-muted"}>{s}</span>
            </li>
          );
        })}
        <li className="flex items-center gap-3 text-sm">
          <span className={`grid h-5 w-5 place-items-center rounded-full border ${analyzing ? "animate-pulse border-accent" : "border-line"}`} />
          <span className={analyzing ? "text-text" : "text-muted"}>Writing your AI optimization plan</span>
        </li>
      </ol>
      {p.error && <p className="mt-6 text-sm text-bad">{p.error}</p>}
    </div>
  );
}
