"use client";

import { useActionState } from "react";
import { startScan } from "@/app/audit/actions";

export const inputCls =
  "w-full rounded-lg border border-line bg-bg px-3 py-2.5 text-sm text-text outline-none placeholder:text-muted/60 focus:border-accent";

export function ConnectForm() {
  const [state, action, pending] = useActionState(startScan, undefined);
  return (
    <form action={action} className="grid gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="email" type="email" required placeholder="Work email" autoComplete="email" className={inputCls} />
        <input name="company" placeholder="Company" autoComplete="organization" className={inputCls} />
      </div>
      {state?.error && (
        <p role="alert" className="text-sm text-bad">
          {state.error}
        </p>
      )}
      <button
        disabled={pending}
        className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-ink transition-transform active:scale-[0.97] disabled:opacity-60"
      >
        {pending ? "Redirecting to HubSpot…" : "Connect HubSpot (read-only)"}
      </button>
    </form>
  );
}
