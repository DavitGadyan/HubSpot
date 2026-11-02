import { describe, expect, it } from "vitest";
import { SCAN_STEPS, duplicateRate, statusFromBadPct, topSubjects } from "@/lib/audit/detectors";
import { CHECKS_BY_ID } from "@/lib/audit/rubric";
import { HubSpotError, type HubSpotApi } from "@/lib/hubspot/client";

type Body = { filterGroups?: { filters: { propertyName: string; operator: string }[] }[]; limit: number; after?: string };

/** A fake portal: counts are keyed by the first filter's property name. */
function fakeApi(opts: {
  totals: Record<string, Record<string, number>>;
  rows?: Record<string, Record<string, string | null>[]>;
  get?: Record<string, unknown>;
}): HubSpotApi {
  return {
    async get(path) {
      for (const [prefix, value] of Object.entries(opts.get ?? {})) if (path.startsWith(prefix)) return value as never;
      throw new HubSpotError(403, "missing scope");
    },
    async post(path, body) {
      const object = path.split("/")[4];
      const b = body as Body;
      const key = b.filterGroups?.[0].filters.map((f) => f.propertyName).join("+") ?? "_all";
      const total = opts.totals[object]?.[key] ?? 0;
      if (b.limit === 1) return { total, results: [] } as never;
      return { total, results: (opts.rows?.[object] ?? []).map((properties, i) => ({ id: String(i), properties })) } as never;
    },
  };
}

const step = (k: string) => SCAN_STEPS.find((s) => s.key === k)!;

describe("helpers", () => {
  it("statusFromBadPct", () => {
    expect(statusFromBadPct(1, 2, 10)).toBe("pass");
    expect(statusFromBadPct(5, 2, 10)).toBe("warn");
    expect(statusFromBadPct(11, 2, 10)).toBe("fail");
  });
  it("duplicateRate counts extra copies", () => {
    expect(duplicateRate(["a", "a", "a", "b", null])).toEqual({ dupRecords: 2, considered: 4, pct: 50 });
  });
  it("topSubjects groups near-identical subjects", () => {
    expect(topSubjects(["Reset password", "reset password!", "Invoice copy", "Reset Password"])[0]).toBe("Reset password");
  });
});

describe("contacts step", () => {
  it("flags blank owners, orphaned owners and missing lifecycle", async () => {
    const api = fakeApi({
      totals: {
        contacts: { _all: 1000, lifecyclestage: 150, hubspot_owner_id: 100, associatedcompanyid: 50, notes_last_updated: 400 },
      },
      get: { "/crm/v3/owners": { results: [] } },
      rows: { contacts: [{ firstname: "Ana", lastname: "Lee", email: "a@x.com", company: "X" }] },
    });
    const { findings, stats } = await step("contacts").run(api);
    const by = Object.fromEntries(findings.map((f) => [f.checkId, f]));
    expect(by["lifecycle-standardized"].status).toBe("fail"); // 15%
    expect(by["owner-populated"].status).toBe("warn"); // 10%
    expect(by["contact-company-links"].status).toBe("pass"); // 5%
    expect(by["cold-lead-list"].metric).toBe(400);
    expect(stats.contacts).toBe(1000);
    for (const f of findings) expect(CHECKS_BY_ID[f.checkId]).toBeDefined();
  });
  it("returns no findings for an empty portal", async () => {
    const { findings } = await step("contacts").run(fakeApi({ totals: {} }));
    expect(findings).toHaveLength(0);
  });
});

describe("companies step", () => {
  it("detects duplicate domains and free-text industry", async () => {
    const rows = [
      { domain: "acme.com", industry: "SaaS", annualrevenue: "1", numberofemployees: null },
      { domain: "www.acme.com", industry: "software", annualrevenue: null, numberofemployees: null },
      { domain: "b.com", industry: null, annualrevenue: null, numberofemployees: null },
    ];
    const api = fakeApi({
      totals: { companies: { _all: 3 } },
      rows: { companies: rows },
      get: { "/crm/v3/properties/companies/industry": { type: "string", fieldType: "text" } },
    });
    const { findings } = await step("companies").run(api);
    const by = Object.fromEntries(findings.map((f) => [f.checkId, f]));
    expect(by["no-duplicate-companies"].status).toBe("fail");
    expect(by["industry-standardized"].status).toBe("fail");
  });
});

describe("optional-scope steps", () => {
  it("skip cleanly when the scope is not granted", async () => {
    for (const k of ["access", "service", "content", "workflows"]) {
      const r = await step(k).run(fakeApi({ totals: {} }));
      expect(r.findings).toHaveLength(0);
    }
  });
  it("workflow health uses enabled state", async () => {
    const api = fakeApi({
      totals: {},
      get: {
        "/automation/v4/flows": {
          results: [
            { id: "1", isEnabled: true, description: "owner: ops", updatedAt: new Date().toISOString() },
            { id: "2", isEnabled: false, description: "" },
          ],
        },
      },
    });
    const { findings } = await step("workflows").run(api);
    expect(findings.find((f) => f.checkId === "workflow-health")!.status).toBe("fail"); // 50% off
    expect(findings.find((f) => f.checkId === "workflow-docs")).toBeDefined();
  });
});
