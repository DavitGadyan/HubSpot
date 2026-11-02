export type UseCaseId =
  | "foundation-data"
  | "foundation-access"
  | "foundation-knowledge"
  | "customer-agent"
  | "prospecting-agent"
  | "content-agent"
  | "governance";

export type Tier = "now" | "next" | "later";
export type CheckStatus = "pass" | "warn" | "fail" | "unknown";
export type QuizAnswer = "yes" | "no" | "unsure";
export type FindingSource = "quiz" | "scan";

/** Keys of detectors that can evaluate a check from a live HubSpot portal. */
export type DetectorKey =
  | "lifecycleCoverage"
  | "ownerCoverage"
  | "industryStandardized"
  | "duplicateContacts"
  | "duplicateCompanies"
  | "propertyHygiene"
  | "contactCompanyAssociation"
  | "dealContactAssociation"
  | "superAdminPresent"
  | "ticketPipelines"
  | "coldLeadPool"
  | "icpFieldCoverage"
  | "blogSources"
  | "workflowHealth"
  | "workflowDocumentation";

export interface Check {
  id: string;
  useCase: UseCaseId;
  title: string;
  /** The question asked in the self-assessment quiz. Phrased so "yes" = healthy. */
  question: string;
  /** What breaks when this is wrong (shown on results + fed to the optimizer). */
  why: string;
  /** Concrete first step to fix it. */
  firstStep: string;
  severity: 1 | 2 | 3;
  tier: Tier;
  owner: "you" | "expert";
  detector?: DetectorKey;
}

export interface UseCase {
  id: UseCaseId;
  name: string;
  short: string;
  hub: string;
  weight: number;
  summary: string;
  failureModes: string[];
}

export interface Finding {
  checkId: string;
  status: CheckStatus;
  source: FindingSource;
  /** Human-readable evidence, e.g. "38% of 4,210 contacts have no owner". Never raw PII. */
  evidence?: string;
  metric?: number;
}

export interface UseCaseScore {
  useCase: UseCaseId;
  score: number;
  gaps: number;
  passed: number;
  total: number;
}

export type Band = "strong" | "notable" | "expert";

export interface AuditScores {
  overall: number;
  gaps: number;
  band: Band;
  perUseCase: UseCaseScore[];
}

/** Aggregate, PII-free statistics captured by a portal scan. */
export type ScanStats = Record<string, number | string | string[]>;
