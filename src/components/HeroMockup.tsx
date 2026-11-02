"use client";

import { motion, useReducedMotion } from "motion/react";
import { AnimatedRing, GrowBar } from "./motion";
import { StatusPill } from "./Score";

const AREAS = [
  { name: "Data foundation", score: 42, color: "var(--bad)" },
  { name: "Permissions & seats", score: 83, color: "var(--ok)" },
  { name: "Customer Agent", score: 58, color: "var(--warn)" },
  { name: "Governance", score: 35, color: "var(--bad)" },
];

const FINDINGS = [
  { text: "31% of contacts have no owner", status: "fail" as const },
  { text: "Industry is free text · 47 variants", status: "fail" as const },
  { text: "Escalation on negative sentiment", status: "pass" as const },
];

export function HeroMockup() {
  const reduce = useReducedMotion();
  return (
    <div className="relative" style={{ perspective: 1200 }}>
      <div className="blob drift -left-10 -top-10 h-56 w-56 bg-accent" />
      <div className="blob drift -bottom-12 -right-8 h-64 w-64 bg-accent-3" style={{ animationDelay: "-6s" }} />

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 28, rotateX: 8 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1], delay: 0.15 }}
        className="glass float relative rounded-3xl p-5 shadow-2xl shadow-accent/20 sm:p-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-bad/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-warn/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-ok/70" />
          </div>
          <span className="pulse-ring relative rounded-full border border-accent-2/40 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent-2">
            Live scan
          </span>
        </div>

        <div className="mt-5 flex items-center gap-6">
          <AnimatedRing score={54} size={124} color="var(--warn)" />
          <div className="grid flex-1 gap-3">
            {AREAS.map((a, i) => (
              <div key={a.name}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-muted">{a.name}</span>
                  <span className="tabular-nums">{a.score}</span>
                </div>
                <GrowBar pct={a.score} color={a.color} delay={0.4 + i * 0.12} />
              </div>
            ))}
          </div>
        </div>

        <ul className="mt-6 grid gap-2 text-sm">
          {FINDINGS.map((f, i) => (
            <motion.li
              key={f.text}
              initial={reduce ? false : { opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 + i * 0.15, duration: 0.45 }}
              className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-bg/60 px-3 py-2.5"
            >
              <span>{f.text}</span>
              <StatusPill status={f.status} />
            </motion.li>
          ))}
        </ul>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="mt-5 flex items-center justify-between rounded-xl bg-gradient-to-r from-accent/20 to-accent-2/10 px-4 py-3 text-xs"
        >
          <span className="text-muted">Plan generated · 11 fixes · 4 do-now</span>
          <span className="font-medium text-accent-2">View plan →</span>
        </motion.div>
      </motion.div>

      <motion.div
        initial={reduce ? false : { opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
        className="glass absolute -bottom-6 -left-4 hidden items-center gap-3 rounded-2xl px-4 py-3 text-sm shadow-xl sm:flex"
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-ok/20 text-ok">✓</span>
        <div>
          <p className="font-medium">Tokens deleted</p>
          <p className="text-xs text-muted">Read-only scan finished in 1m 48s</p>
        </div>
      </motion.div>
    </div>
  );
}
