"use client";

import { useState, useTransition } from "react";
import { submitQuiz } from "@/app/audit/actions";
import type { QuizAnswer } from "@/lib/audit/types";
import { inputCls } from "./ConnectForm";

type Section = {
  id: string;
  name: string;
  summary: string;
  questions: { id: string; title: string; question: string }[];
};

const OPTIONS: { value: QuizAnswer; label: string }[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "unsure", label: "Not sure" },
];

export function QuizStepper({ sections }: { sections: Section[] }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, QuizAnswer>>({});
  const [lead, setLead] = useState({ email: "", name: "", company: "" });
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  const total = sections.reduce((a, s) => a + s.questions.length, 0);
  const answered = Object.keys(answers).length;
  const isLead = step === sections.length;
  const section = sections[step];
  const sectionDone = section ? section.questions.every((q) => answers[q.id]) : true;

  function go(next: number) {
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(undefined);
    startTransition(async () => {
      const res = await submitQuiz({ answers, lead });
      if (res?.error) setError(res.error);
    });
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between gap-4 font-mono text-xs text-muted">
        <span>
          {isLead ? "Last step" : `Section ${step + 1} of ${sections.length}`} · {answered}/{total} answered
        </span>
      </div>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-line" aria-hidden>
        <div className="h-full bg-accent transition-[width] duration-300" style={{ width: `${(answered / total) * 100}%` }} />
      </div>

      {!isLead && section && (
        <div key={section.id} className="fade-up">
          <h1 className="mt-10 font-display text-4xl">{section.name}</h1>
          <p className="mt-3 text-muted">{section.summary}</p>
          <ol className="mt-8 grid gap-4">
            {section.questions.map((q) => (
              <li key={q.id} className="rounded-2xl border border-line p-5">
                <fieldset>
                  <legend className="font-medium">{q.title}</legend>
                  <p className="mt-1 text-sm text-muted">{q.question}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {OPTIONS.map((o) => {
                      const active = answers[q.id] === o.value;
                      return (
                        <label
                          key={o.value}
                          className={`cursor-pointer rounded-full border px-4 py-1.5 text-sm transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent ${
                            active ? "border-accent bg-accent text-accent-ink" : "border-line text-muted hover:border-muted hover:text-text"
                          }`}
                        >
                          <input
                            type="radio"
                            name={q.id}
                            value={o.value}
                            checked={active}
                            onChange={() => setAnswers((a) => ({ ...a, [q.id]: o.value }))}
                            className="sr-only"
                          />
                          {o.label}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => go(step - 1)}
              disabled={step === 0}
              className="rounded-full border border-line px-5 py-2.5 text-sm disabled:opacity-30"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => go(step + 1)}
              className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-accent-ink transition-transform active:scale-[0.97]"
            >
              {sectionDone ? "Continue" : "Skip section"}
            </button>
          </div>
        </div>
      )}

      {isLead && (
        <form onSubmit={submit} className="fade-up">
          <h1 className="mt-10 font-display text-4xl">Where should we send your results?</h1>
          <p className="mt-3 text-muted">
            You&apos;ll see your score and plan immediately on the next page. We&apos;ll also email you the link.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <input
              required
              type="email"
              placeholder="Work email"
              autoComplete="email"
              value={lead.email}
              onChange={(e) => setLead({ ...lead, email: e.target.value })}
              className={`${inputCls} sm:col-span-2`}
            />
            <input placeholder="Name" autoComplete="name" value={lead.name} onChange={(e) => setLead({ ...lead, name: e.target.value })} className={inputCls} />
            <input
              placeholder="Company"
              autoComplete="organization"
              value={lead.company}
              onChange={(e) => setLead({ ...lead, company: e.target.value })}
              className={inputCls}
            />
          </div>
          {error && (
            <p role="alert" className="mt-4 text-sm text-bad">
              {error}
            </p>
          )}
          <div className="mt-8 flex items-center justify-between gap-3">
            <button type="button" onClick={() => go(step - 1)} className="rounded-full border border-line px-5 py-2.5 text-sm">
              Back
            </button>
            <button
              disabled={pending || answered === 0}
              className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-accent-ink transition-transform active:scale-[0.97] disabled:opacity-60"
            >
              {pending ? "Analyzing your portal…" : "See my results"}
            </button>
          </div>
          {pending && <p className="mt-4 text-right text-xs text-muted">Writing your optimization plan. This takes up to a minute.</p>}
        </form>
      )}
    </div>
  );
}
