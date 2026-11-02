"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";
import type { CaseStudySummary } from "@/lib/case-studies";
import { USE_CASES } from "@/lib/audit/rubric";
import { CaseStudyCard } from "./CaseStudyCard";

const SIZE_ORDER = ["2-10 Employees", "11-50 Employees", "51-200 Employees", "201-500 Employees", "500+ Employees"];

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
    <label className="flex min-w-0 flex-1 flex-col gap-1 text-xs text-muted">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-line bg-bg px-3 py-2 text-sm text-text outline-none transition-colors focus:border-accent"
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

export function CaseStudyGrid({ items }: { items: CaseStudySummary[] }) {
  const reduce = useReducedMotion();
  const [industry, setIndustry] = useState("");
  const [size, setSize] = useState("");
  const [hub, setHub] = useState("");
  const [useCase, setUseCase] = useState("");

  const industries = useMemo(() => [...new Set(items.map((i) => i.industry))].sort(), [items]);
  const sizes = useMemo(
    () => [...new Set(items.map((i) => i.size))].sort((a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b)),
    [items],
  );
  const hubs = useMemo(() => [...new Set(items.flatMap((i) => i.hubs))].sort(), [items]);

  const filtered = items.filter(
    (i) =>
      (!industry || i.industry === industry) &&
      (!size || i.size === size) &&
      (!hub || i.hubs.includes(hub)) &&
      (!useCase || i.useCases.includes(useCase as CaseStudySummary["useCases"][number])),
  );
  const active = [industry, size, hub, useCase].filter(Boolean).length;

  return (
    <div>
      <div className="glass sticky top-20 z-10 grid gap-3 rounded-2xl p-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto] lg:items-end">
        <Select label="Industry" value={industry} onChange={setIndustry} options={industries.map((v) => ({ value: v, label: v }))} />
        <Select label="Company size" value={size} onChange={setSize} options={sizes.map((v) => ({ value: v, label: v }))} />
        <Select label="HubSpot product" value={hub} onChange={setHub} options={hubs.map((v) => ({ value: v, label: `${v} Hub` }))} />
        <Select label="AI use case" value={useCase} onChange={setUseCase} options={USE_CASES.map((u) => ({ value: u.id, label: u.name }))} />
        <div className="flex items-center justify-between gap-3 text-xs text-muted sm:col-span-2 lg:col-span-1 lg:pb-2">
          <span aria-live="polite">
            {filtered.length} of {items.length}
          </span>
          {active > 0 && (
            <button
              type="button"
              onClick={() => {
                setIndustry("");
                setSize("");
                setHub("");
                setUseCase("");
              }}
              className="text-accent-2 hover:underline"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <motion.div layout className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((cs, i) => (
            <motion.div
              key={cs.slug}
              layout
              initial={reduce ? false : { opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1], delay: Math.min(i, 8) * 0.04 }}
            >
              <CaseStudyCard cs={cs} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      {filtered.length === 0 && <p className="mt-12 text-center text-muted">No case studies match these filters yet.</p>}
    </div>
  );
}
