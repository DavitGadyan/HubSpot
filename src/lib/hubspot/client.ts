/** Minimal read-only HubSpot API surface used by the detectors (easy to fake in tests). */
export interface HubSpotApi {
  get<T = unknown>(path: string): Promise<T>;
  post<T = unknown>(path: string, body: unknown): Promise<T>;
}

export class HubSpotError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

const BASE = "https://api.hubapi.com";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function createHubSpotApi(accessToken: string): HubSpotApi {
  async function call<T>(method: "GET" | "POST", path: string, body?: unknown, attempt = 0): Promise<T> {
    const res = await fetch(`${BASE}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
    });
    if (res.status === 429 && attempt < 4) {
      const retry = Number(res.headers.get("retry-after")) || 1;
      await sleep(retry * 1000 * (attempt + 1));
      return call<T>(method, path, body, attempt + 1);
    }
    if (!res.ok) throw new HubSpotError(res.status, `${method} ${path} -> ${res.status}`);
    return res.json() as Promise<T>;
  }
  return {
    get: (path) => call("GET", path),
    post: (path, body) => call("POST", path, body),
  };
}

// ---------- helpers shared by detectors ----------

export type Filter = { propertyName: string; operator: string; value?: string; values?: string[] };

export interface SearchResponse<P = Record<string, string | null>> {
  total: number;
  results: { id: string; properties: P }[];
  paging?: { next?: { after: string } };
}

/** Count records matching all filters (one search call, limit 1). */
export async function countWhere(api: HubSpotApi, object: string, filters: Filter[] = []): Promise<number> {
  const body: Record<string, unknown> = { limit: 1, properties: ["hs_object_id"] };
  if (filters.length) body.filterGroups = [{ filters }];
  const res = await api.post<SearchResponse>(`/crm/v3/objects/${object}/search`, body);
  return res.total ?? 0;
}

/** Sample the most recently created records (up to `max`, 200 per page). */
export async function sample(
  api: HubSpotApi,
  object: string,
  properties: string[],
  max = 1000,
  filters: Filter[] = [],
): Promise<Record<string, string | null>[]> {
  const out: Record<string, string | null>[] = [];
  let after: string | undefined;
  while (out.length < max) {
    const body: Record<string, unknown> = {
      limit: Math.min(200, max - out.length),
      properties,
      sorts: [{ propertyName: "createdate", direction: "DESCENDING" }],
    };
    if (filters.length) body.filterGroups = [{ filters }];
    if (after) body.after = after;
    const res = await api.post<SearchResponse>(`/crm/v3/objects/${object}/search`, body);
    out.push(...res.results.map((r) => r.properties));
    after = res.paging?.next?.after;
    if (!after || res.results.length === 0) break;
  }
  return out;
}

/** Run a call that needs an optional scope; return null when the portal didn't grant it. */
export async function optional<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch (e) {
    if (e instanceof HubSpotError && [401, 403, 404].includes(e.status)) return null;
    throw e;
  }
}
