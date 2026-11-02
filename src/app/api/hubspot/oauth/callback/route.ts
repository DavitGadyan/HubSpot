import { NextResponse, type NextRequest } from "next/server";
import { saveConnection } from "@/lib/audit/service";
import { exchangeCode, tokenInfo, verifyState } from "@/lib/hubspot/oauth";
import { getStore } from "@/db/store";

export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const auditId = verifyState(url.searchParams.get("state"));
  const code = url.searchParams.get("code");
  const fail = (msg: string) => NextResponse.redirect(new URL(`/audit?error=${encodeURIComponent(msg)}`, url));

  if (!auditId) return fail("Invalid or expired connection request. Please try again.");
  if (url.searchParams.get("error") || !code) return fail("HubSpot connection was cancelled.");
  const audit = await getStore().getAudit(auditId);
  if (!audit || audit.status !== "pending") return fail("This audit was already connected. Start a new one.");

  try {
    const tokens = await exchangeCode(code);
    const info = await tokenInfo(tokens.access_token);
    await saveConnection(auditId, String(info.hub_id), tokens, info.scopes ?? []);
  } catch (e) {
    console.error("oauth callback failed", e);
    return fail("We couldn't connect to HubSpot. Please try again.");
  }
  return NextResponse.redirect(new URL(`/audit/${auditId}`, url));
}
