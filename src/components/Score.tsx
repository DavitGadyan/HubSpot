import type { CheckStatus } from "@/lib/audit/types";

export function scoreColor(score: number) {
  if (score >= 75) return "var(--ok)";
  if (score >= 50) return "var(--warn)";
  return "var(--bad)";
}

export function ScoreGauge({ score, size = 160, label = "readiness" }: { score: number; size?: number; label?: string }) {
  const stroke = size * 0.075;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (Math.max(0, Math.min(100, score)) / 100) * c;
  return (
    <div className="relative" style={{ width: size, height: size }} role="img" aria-label={`Score ${score} out of 100`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={scoreColor(score)}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display tabular-nums" style={{ fontSize: size * 0.32, lineHeight: 1 }}>
          {score}
        </span>
        <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">{label}</span>
      </div>
    </div>
  );
}

export function ScoreBar({ score }: { score: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
      <div className="h-full rounded-full" style={{ width: `${score}%`, background: scoreColor(score) }} />
    </div>
  );
}

const STATUS: Record<CheckStatus, { label: string; cls: string }> = {
  pass: { label: "Pass", cls: "text-ok border-ok/30 bg-ok/10" },
  warn: { label: "Check", cls: "text-warn border-warn/30 bg-warn/10" },
  fail: { label: "Gap", cls: "text-bad border-bad/30 bg-bad/10" },
  unknown: { label: "Unknown", cls: "text-muted border-line bg-surface-2" },
};

export function StatusPill({ status }: { status: CheckStatus }) {
  const s = STATUS[status];
  return (
    <span className={`inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider ${s.cls}`}>
      {s.label}
    </span>
  );
}
