import { countWhere, optional, sample, type HubSpotApi } from "../hubspot/client";
import type { CheckStatus, Finding, ScanStats } from "./types";

export interface StepResult {
  stats: ScanStats;
  findings: Finding[];
}

export interface ScanStep {
  key: string;
  label: string;
  run(api: HubSpotApi): Promise<StepResult>;
}

const DAY = 86_400_000;
const fmt = (n: number) => n.toLocaleString("en-US");
const pct = (part: number, whole: number) => (whole ? Math.round((part / whole) * 1000) / 10 : 0);

/** Lower bad% is better. pass below warnAt, warn up to failAt, fail above. */
export function statusFromBadPct(badPct: number, warnAt: number, failAt: number): CheckStatus {
  if (badPct <= warnAt) return "pass";
  if (badPct <= failAt) return "warn";
  return "fail";
}

const scan = (checkId: string, status: CheckStatus, evidence: string, metric?: number): Finding => ({
  checkId,
  status,
  source: "scan",
  evidence,
  metric,
});

function normalizeLabel(s: string) {
  return s
    .toLowerCase()
    .replace(/\b(the|a|an|of|copy|new|old|v\d+|\d+)\b/g, "")
    .replace(/[^a-z]/g, "");
}

export function duplicateRate(keys: (string | null | undefined)[]) {
  const counts = new Map<string, number>();
  for (const k of keys) {
    if (!k) continue;
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  let dupRecords = 0;
  for (const c of counts.values()) if (c > 1) dupRecords += c - 1;
  const considered = [...counts.values()].reduce((a, b) => a + b, 0);
  return { dupRecords, considered, pct: pct(dupRecords, considered) };
}

export function topSubjects(subjects: (string | null)[], n = 8): string[] {
  const counts = new Map<string, { label: string; n: number }>();
  for (const s of subjects) {
    if (!s) continue;
    const key = s.toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim().slice(0, 60);
    if (key.length < 4) continue;
    const prev = counts.get(key);
    counts.set(key, { label: prev?.label ?? s.trim().slice(0, 100), n: (prev?.n ?? 0) + 1 });
  }
  return [...counts.values()]
    .sort((a, b) => b.n - a.n)
    .slice(0, n)
    .map((x) => x.label);
}

// ---------------------------------------------------------------------------

const contactsStep: ScanStep = {
  key: "contacts",
  label: "Contacts, lifecycle and ownership",
  async run(api): Promise<StepResult> {
    const total = await countWhere(api, "contacts");
    if (total === 0) {
      return { stats: { contacts: 0 }, findings: [] };
    }
    const noLifecycle = await countWhere(api, "contacts", [
      { propertyName: "lifecyclestage", operator: "NOT_HAS_PROPERTY" },
    ]);
    const noOwner = await countWhere(api, "contacts", [
      { propertyName: "hubspot_owner_id", operator: "NOT_HAS_PROPERTY" },
    ]);
    const noCompany = await countWhere(api, "contacts", [
      { propertyName: "associatedcompanyid", operator: "NOT_HAS_PROPERTY" },
    ]);
    const cutoff = String(Date.now() - 90 * DAY);
    const cold = await countWhere(api, "contacts", [
      { propertyName: "notes_last_updated", operator: "LT", value: cutoff },
    ]);

    // Owners that were deactivated but still own records.
    const archived = await api.get<{ results: { id: string }[] }>("/crm/v3/owners?archived=true&limit=100");
    const archivedIds = archived.results.map((o) => o.id).slice(0, 100);
    const orphaned = archivedIds.length
      ? await countWhere(api, "contacts", [{ propertyName: "hubspot_owner_id", operator: "IN", values: archivedIds }])
      : 0;

    const rows = await sample(api, "contacts", ["firstname", "lastname", "email", "company"], 1000);
    const dup = duplicateRate(
      rows.map((r) =>
        r.firstname && r.lastname
          ? `${r.firstname}|${r.lastname}|${(r.company ?? r.email?.split("@")[1] ?? "").toLowerCase()}`.toLowerCase()
          : null,
      ),
    );

    const lifecyclePct = pct(noLifecycle, total);
    const ownerBad = noOwner + orphaned;
    const ownerPct = pct(ownerBad, total);
    const noCompanyPct = pct(noCompany, total);

    return {
      stats: {
        contacts: total,
        contactsNoLifecycle: noLifecycle,
        contactsNoOwner: noOwner,
        contactsOrphanedOwner: orphaned,
        contactsNoCompany: noCompany,
        contactsCold90d: cold,
        contactDuplicatePctSample: dup.pct,
      },
      findings: [
        scan(
          "lifecycle-standardized",
          statusFromBadPct(lifecyclePct, 2, 10),
          `${lifecyclePct}% of ${fmt(total)} contacts have no lifecycle stage.`,
          lifecyclePct,
        ),
        scan(
          "owner-populated",
          statusFromBadPct(ownerPct, 2, 10),
          `${fmt(noOwner)} contacts have no owner and ${fmt(orphaned)} are owned by deactivated users (${ownerPct}% of ${fmt(total)}).`,
          ownerPct,
        ),
        scan(
          "contact-company-links",
          statusFromBadPct(noCompanyPct, 10, 30),
          `${noCompanyPct}% of contacts are not associated with any company.`,
          noCompanyPct,
        ),
        scan(
          "no-duplicate-contacts",
          statusFromBadPct(dup.pct, 1, 5),
          `${dup.pct}% of the ${fmt(rows.length)} most recent contacts look like duplicates (same name and company).`,
          dup.pct,
        ),
        scan(
          "cold-lead-list",
          cold > 0 ? "warn" : "unknown",
          `${fmt(cold)} contacts have had no activity for 90+ days — the right starting pool for the Prospecting Agent once open-deal contacts are excluded.`,
          cold,
        ),
      ],
    };
  },
};

const companiesStep: ScanStep = {
  key: "companies",
  label: "Companies, industry and ICP fields",
  async run(api): Promise<StepResult> {
    const total = await countWhere(api, "companies");
    if (total === 0) return { stats: { companies: 0 }, findings: [] };
    const rows = await sample(api, "companies", ["domain", "industry", "annualrevenue", "numberofemployees"], 1000);
    const dup = duplicateRate(rows.map((r) => r.domain?.toLowerCase().replace(/^www\./, "") ?? null));

    const industryProp = await optional(() =>
      api.get<{ type: string; fieldType: string }>("/crm/v3/properties/companies/industry"),
    );
    const industryIsFreeText = industryProp ? industryProp.type === "string" : false;
    const withIndustry = rows.filter((r) => r.industry).length;
    const industryCoverage = pct(withIndustry, rows.length);
    const distinctIndustries = new Set(rows.map((r) => r.industry?.toLowerCase().trim()).filter(Boolean)).size;

    const icpFilled = rows.filter((r) => r.industry && (r.annualrevenue || r.numberofemployees)).length;
    const icpCoverage = pct(icpFilled, rows.length);

    const industryStatus: CheckStatus = industryIsFreeText
      ? "fail"
      : statusFromBadPct(100 - industryCoverage, 20, 50);

    return {
      stats: {
        companies: total,
        companyDuplicatePctSample: dup.pct,
        industryCoveragePct: industryCoverage,
        industryDistinctValues: distinctIndustries,
        industryFieldType: industryProp?.type ?? "unknown",
        icpFieldCoveragePct: icpCoverage,
      },
      findings: [
        scan(
          "no-duplicate-companies",
          statusFromBadPct(dup.pct, 1, 5),
          `${dup.pct}% of the ${fmt(rows.length)} most recent companies share a domain with another company.`,
          dup.pct,
        ),
        scan(
          "industry-standardized",
          industryStatus,
          `Industry is ${industryIsFreeText ? "a free-text field" : "a picklist"}, filled on ${industryCoverage}% of sampled companies, with ${distinctIndustries} distinct values.`,
          industryCoverage,
        ),
        scan(
          "icp-defined",
          statusFromBadPct(100 - icpCoverage, 25, 60),
          `Only ${icpCoverage}% of sampled companies have industry plus revenue or headcount — the fields ICP filters depend on.`,
          icpCoverage,
        ),
      ],
    };
  },
};

const dealsStep: ScanStep = {
  key: "deals",
  label: "Deals and buying committees",
  async run(api): Promise<StepResult> {
    const open = await countWhere(api, "deals", [{ propertyName: "hs_is_closed", operator: "EQ", value: "false" }]);
    if (open === 0) return { stats: { openDeals: 0 }, findings: [] };
    const openNoContacts = await countWhere(api, "deals", [
      { propertyName: "hs_is_closed", operator: "EQ", value: "false" },
      { propertyName: "num_associated_contacts", operator: "EQ", value: "0" },
    ]);
    const p = pct(openNoContacts, open);
    return {
      stats: { openDeals: open, openDealsNoContacts: openNoContacts },
      findings: [
        scan(
          "deal-contact-links",
          statusFromBadPct(p, 5, 20),
          `${fmt(openNoContacts)} of ${fmt(open)} open deals (${p}%) have no associated contacts.`,
          p,
        ),
      ],
    };
  },
};

type Prop = { name: string; label: string; description?: string; hubspotDefined?: boolean; archived?: boolean };

const propertiesStep: ScanStep = {
  key: "properties",
  label: "Property definitions",
  async run(api): Promise<StepResult> {
    const [contactProps, companyProps] = await Promise.all([
      api.get<{ results: Prop[] }>("/crm/v3/properties/contacts"),
      api.get<{ results: Prop[] }>("/crm/v3/properties/companies"),
    ]);
    const custom = [...contactProps.results, ...companyProps.results].filter((p) => !p.hubspotDefined && !p.archived);
    const noDescription = custom.filter((p) => !p.description?.trim()).length;

    const seen = new Map<string, string>();
    const nearDuplicates: string[] = [];
    for (const p of custom) {
      const k = normalizeLabel(p.label);
      if (!k) continue;
      if (seen.has(k)) nearDuplicates.push(`${seen.get(k)} / ${p.label}`);
      else seen.set(k, p.label);
    }
    const undocumentedPct = pct(noDescription, custom.length);
    const status: CheckStatus =
      custom.length === 0
        ? "pass"
        : nearDuplicates.length > 5 || undocumentedPct > 70
          ? "fail"
          : nearDuplicates.length > 0 || undocumentedPct > 30
            ? "warn"
            : "pass";
    return {
      stats: {
        customProperties: custom.length,
        customPropertiesNoDescription: noDescription,
        nearDuplicatePropertyPairs: nearDuplicates.slice(0, 10),
      },
      findings: [
        scan(
          "field-meaning",
          status,
          `${fmt(custom.length)} custom properties: ${undocumentedPct}% have no description and ${nearDuplicates.length} label pairs look like duplicates${
            nearDuplicates.length ? ` (e.g. ${nearDuplicates.slice(0, 2).join("; ")})` : ""
          }.`,
          undocumentedPct,
        ),
      ],
    };
  },
};

const accessStep: ScanStep = {
  key: "access",
  label: "Users and permissions",
  async run(api): Promise<StepResult> {
    const users = await optional(() =>
      api.get<{ results: { superAdmin?: boolean; roleIds?: string[] }[] }>("/settings/v3/users/?limit=100"),
    );
    if (!users) return { stats: {}, findings: [] };
    const supers = users.results.filter((u) => u.superAdmin).length;
    return {
      stats: { users: users.results.length, superAdmins: supers },
      findings: [
        scan(
          "super-admin",
          supers > 0 ? "pass" : "fail",
          `${supers} of ${users.results.length} users are Super Admins.`,
          supers,
        ),
      ],
    };
  },
};

const serviceStep: ScanStep = {
  key: "service",
  label: "Service pipelines and top tickets",
  async run(api): Promise<StepResult> {
    const pipelines = await optional(() => api.get<{ results: unknown[] }>("/crm/v3/pipelines/tickets"));
    if (!pipelines) return { stats: {}, findings: [] };
    const tickets = await optional(() => sample(api, "tickets", ["subject"], 400));
    const subjects = topSubjects((tickets ?? []).map((t) => t.subject));
    return {
      stats: { ticketPipelines: pipelines.results.length, ticketsSampled: tickets?.length ?? 0, topTicketSubjects: subjects },
      findings: [
        scan(
          "service-pipeline",
          pipelines.results.length > 0 && (tickets?.length ?? 0) > 0 ? "pass" : pipelines.results.length > 0 ? "warn" : "fail",
          `${pipelines.results.length} ticket pipeline(s); ${fmt(tickets?.length ?? 0)} recent tickets sampled.`,
          pipelines.results.length,
        ),
      ],
    };
  },
};

const contentStep: ScanStep = {
  key: "content",
  label: "Blog content",
  async run(api): Promise<StepResult> {
    const posts = await optional(() =>
      api.get<{ total?: number; results: unknown[] }>("/cms/v3/blogs/posts?state=PUBLISHED&limit=100"),
    );
    if (!posts) return { stats: {}, findings: [] };
    const n = posts.total ?? posts.results.length;
    return {
      stats: { publishedBlogPosts: n },
      findings: [
        scan(
          "remix-sources",
          n >= 10 ? "pass" : n >= 3 ? "warn" : "fail",
          `${fmt(n)} published blog posts available as remix sources.`,
          n,
        ),
      ],
    };
  },
};

type Flow = { id: string; isEnabled?: boolean; name?: string; description?: string; updatedAt?: string };

const workflowsStep: ScanStep = {
  key: "workflows",
  label: "Workflows",
  async run(api): Promise<StepResult> {
    const flows = await optional(() => api.get<{ results: Flow[] }>("/automation/v4/flows?limit=100"));
    if (!flows) return { stats: {}, findings: [] };
    const total = flows.results.length;
    if (total === 0) return { stats: { workflows: 0 }, findings: [] };
    const enabled = flows.results.filter((f) => f.isEnabled).length;
    const stale = flows.results.filter(
      (f) => f.isEnabled && f.updatedAt && Date.now() - Date.parse(f.updatedAt) > 365 * DAY,
    ).length;
    const disabledPct = pct(total - enabled, total);
    const hasDescriptionField = flows.results.some((f) => "description" in f);
    const undocumented = flows.results.filter((f) => !f.description?.trim()).length;

    const findings: Finding[] = [
      scan(
        "workflow-health",
        disabledPct > 40 || stale > 10 ? "fail" : disabledPct > 15 || stale > 0 ? "warn" : "pass",
        `${fmt(total)} workflows: ${fmt(total - enabled)} switched off (${disabledPct}%) and ${fmt(stale)} active ones untouched for a year.`,
        disabledPct,
      ),
    ];
    if (hasDescriptionField) {
      const p = pct(undocumented, total);
      findings.push(
        scan("workflow-docs", statusFromBadPct(p, 20, 60), `${p}% of workflows have no description.`, p),
      );
    }
    return {
      stats: { workflows: total, workflowsEnabled: enabled, workflowsStaleActive: stale },
      findings,
    };
  },
};

export const SCAN_STEPS: ScanStep[] = [
  contactsStep,
  companiesStep,
  dealsStep,
  propertiesStep,
  accessStep,
  serviceStep,
  contentStep,
  workflowsStep,
];
