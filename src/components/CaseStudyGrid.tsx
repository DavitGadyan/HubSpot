"use client";

import { useMemo, useState } from "react";
import type { CaseStudy } from "@/lib/case-studies";
import { USE_CASES } from "@/lib/audit/rubric";
import { CaseStudyCard } from "./CaseStudyCard";

type Item = Omit<CaseStudy, "body">;

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex min-w-0 flex-1 flex-col gap-1 text-xs text-muted sm:max-w-56">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-line bg-surface px-3 py-2 text-sm text-text outline-none focus:border-accent"
      >
        <option value="">All</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function CaseStudyGrid({ items }: { items: Item[] }) {
  const [industry, setIndustry] = useState("");
  const [hub, setHub] = useState("");
  const [useCase, setUseCase] = useState("");

  const industries = useMemo(() => [...new Set(items.map((i) => i.industry))].sort(), [items]);
  const hubs = useMemo(() => [...new Set(items.flatMap((i) => i.hubs))].sort(), [items]);

  const filtered = items.filter(
    (i) =>
      (!industry || i.industry === industry) &&
      (!hub || i.hubs.includes(hub)) &&
      (!useCase || i.useCases.includes(useCase as Item["useCases"][number])),
  );

  return (
    <div>
      <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface/60 p-4 sm:flex-row sm:items-end">
        <Select label="Industry" value={industry} onChange={setIndustry} options={industries.map((v) => ({ value: v, label: v }))} />
        <Select label="HubSpot product" value={hub} onChange={setHub} options={hubs.map((v) => ({ value: v, label: `${v} Hub` }))} />
        <Select
          label="AI use case"
          value={useCase}
          onChange={setUseCase}
          options={USE_CASES.map((u) => ({ value: u.id, label: u.name }))}
        />
        <p className="text-xs text-muted sm:ml-auto sm:pb-2" aria-live="polite">
          {filtered.length} of {items.length}
        </p>
      </div>
      {filtered.length ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((cs) => (
            <CaseStudyCard key={cs.slug} cs={cs} />
          ))}
        </div>
      ) : (
        <p className="mt-12 text-center text-muted">No case studies match these filters yet.</p>
      )}
    </div>
  );
}
