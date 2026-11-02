import type { Metadata } from "next";
import { QuizStepper } from "@/components/QuizStepper";
import { Container } from "@/components/SiteChrome";
import { CHECKS, USE_CASES } from "@/lib/audit/rubric";

export const metadata: Metadata = { title: "AI-readiness self-assessment" };
export const maxDuration = 60;

export default function QuizPage() {
  const sections = USE_CASES.map((u) => ({
    id: u.id,
    name: u.name,
    summary: u.summary,
    questions: CHECKS.filter((c) => c.useCase === u.id).map((c) => ({ id: c.id, title: c.title, question: c.question })),
  }));
  return (
    <Container className="py-12 sm:py-16">
      <QuizStepper sections={sections} />
    </Container>
  );
}
