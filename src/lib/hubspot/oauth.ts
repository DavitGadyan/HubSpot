import { createHmac, timingSafeEqual } from "crypto";

const AUTH_URL = "https://app.hubspot.com/oauth/authorize";
const TOKEN_URL = "https://api.hubapi.com/oauth/v1/token";

/** Read-only scopes required for the core scan. */
export const REQUIRED_SCOPES = [
  "oauth",
  "crm.objects.contacts.read",
  "crm.objects.companies.read",
  "crm.objects.deals.read",
  "crm.objects.owners.read",
  "crm.schemas.contacts.read",
  "crm.schemas.companies.read",
];

/** Granted when the portal's tier supports them; the scan degrades gracefully without. */
export const OPTIONAL_SCOPES = ["tickets", "automation", "content", "settings.users.read"];

export function hubspotConfigured() {
  return Boolean(
    process.env.HUBSPOT_CLIENT_ID && process.env.HUBSPOT_CLIENT_SECRET && process.env.HUBSPOT_REDIRECT_URI,
  );
}

function stateSecret() {
  return process.env.TOKEN_ENC_KEY ?? process.env.HUBSPOT_CLIENT_SECRET ?? "";
}

/** Signed state binds the OAuth round-trip to an audit id (CSRF protection). */
export function signState(auditId: string): string {
  const sig = createHmac("sha256", stateSecret()).update(auditId).digest("base64url");
  return `${auditId}.${sig}`;
}

export function verifyState(state: string | null): string | null {
  if (!state) return null;
  const [auditId, sig] = state.split(".");
  if (!auditId || !sig) return null;
  const expected = createHmac("sha256", stateSecret()).update(auditId).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b) ? auditId : null;
}

export function authorizeUrl(auditId: string): string {
  const u = new URL(AUTH_URL);
  u.searchParams.set("client_id", process.env.HUBSPOT_CLIENT_ID!);
  u.searchParams.set("redirect_uri", process.env.HUBSPOT_REDIRECT_URI!);
  u.searchParams.set("scope", REQUIRED_SCOPES.join(" "));
  u.searchParams.set("optional_scope", OPTIONAL_SCOPES.join(" "));
  u.searchParams.set("state", signState(auditId));
  return u.toString();
}

export interface TokenSet {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

async function tokenRequest(params: Record<string, string>): Promise<TokenSet> {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.HUBSPOT_CLIENT_ID!,
      client_secret: process.env.HUBSPOT_CLIENT_SECRET!,
      ...params,
    }),
  });
  if (!res.ok) throw new Error(`HubSpot token request failed: ${res.status} ${await res.text()}`);
  return res.json();
}

export function exchangeCode(code: string) {
  return tokenRequest({
    grant_type: "authorization_code",
    redirect_uri: process.env.HUBSPOT_REDIRECT_URI!,
    code,
  });
}

export function refreshToken(refresh: string) {
  return tokenRequest({ grant_type: "refresh_token", refresh_token: refresh });
}

export async function tokenInfo(accessToken: string): Promise<{ hub_id: number; scopes: string[] }> {
  const res = await fetch(`https://api.hubapi.com/oauth/v1/access-tokens/${accessToken}`);
  if (!res.ok) throw new Error(`HubSpot token info failed: ${res.status}`);
  return res.json();
}
