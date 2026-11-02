import "server-only";
import { Resend } from "resend";
import { site } from "@/config/site";

export async function sendReportEmail(to: string, auditId: string, score: number) {
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) return;
  const url = `${site.url}/audit/${auditId}`;
  try {
    await new Resend(process.env.RESEND_API_KEY).emails.send({
      from: process.env.EMAIL_FROM,
      to,
      subject: `Your HubSpot AI readiness score: ${score}/100`,
      text: `Your HubSpot AI-readiness results are ready.\n\nScore: ${score}/100\nFull report and action plan: ${url}\n\n${site.name}`,
    });
  } catch (e) {
    console.error("sendReportEmail failed", e);
  }
}
