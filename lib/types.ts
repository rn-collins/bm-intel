// ─── Enums / Unions ───────────────────────────────────────────────────────────

export type Jurisdiction =
  | "US" | "UK" | "EU" | "DE" | "PL" | "CZ" | "NL" | "CH" | "UAE" | "Global";

export type Category =
  | "Franchise / Market Entry"
  | "Brand / IP Protection"
  | "Post-Brexit Supply Chain / Import Compliance"
  | "Real Estate / Site Acquisition"
  | "Supply Chain / Quality Control"
  | "Delivery Platforms"
  | "Labor / Employment"
  | "Food Compliance / Labeling"
  | "Data / AI / Privacy"
  | "Advertising / Consumer Protection"
  | "M&A / JV / Investor Diligence Readiness"
  | "Crisis / Reputation Monitoring"
  | "Competitor / Market Intelligence";

export type Priority   = "Critical" | "High" | "Medium" | "Low";
export type SourceTier = 1 | 2 | 3 | 4;
export type SignalStatus =
  | "New"
  | "Needs Review"
  | "Monitor"
  | "Add to Playbook"
  | "Outside Counsel"
  | "Executive Briefing"
  | "Closed"
  | "Archived";

export type RecommendedAction =
  | "Immediate Action"
  | "Outside Counsel Review"
  | "Add to Playbook"
  | "Executive Briefing"
  | "Monitor";

export type AlertLevel =
  | "FYI"
  | "Monitor"
  | "Action Recommended"
  | "Outside Counsel Review"
  | "Executive Attention";

export type AlertChannel = "slack" | "email";

export type UpdateFrequency = "daily" | "weekly" | "monthly" | "manual";

// ─── Source ───────────────────────────────────────────────────────────────────

export interface Source {
  id: string;
  name: string;
  url: string;
  jurisdiction: Jurisdiction;
  category: Category;
  tier: SourceTier;
  updateFrequency: UpdateFrequency;
  lastChecked?: string;   // ISO timestamp
  notes?: string;
  createdAt: string;      // ISO timestamp
}

// ─── Signal ───────────────────────────────────────────────────────────────────

export interface Signal {
  id: string;
  title: string;
  summary: string;
  sourceUrl: string;
  sourceName: string;
  sourceTier: SourceTier;

  dateFound: string;       // ISO — when we ingested it
  datePublished?: string;  // ISO — when the source published it (may differ)

  jurisdiction: Jurisdiction;
  category: Category;
  subcategory?: string;

  // Scoring inputs (each 1–5)
  businessImpactScore: number;
  legalComplexityScore: number;
  urgencyScore: number;
  confidenceScore: number;

  // Derived
  priorityScore: number;          // businessImpact + legalComplexity + urgency (max 15)
  priorityLabel: Priority;
  recommendedAction: RecommendedAction;

  outsideCounselNeeded: boolean;
  assignedOwner?: string;
  status: SignalStatus;
  notes?: string;
  alertSent: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Alert Record ─────────────────────────────────────────────────────────────

export interface AlertRecord {
  id: string;
  signalId: string;
  channels: AlertChannel[];
  recipients?: string[];
  sentAt: string;
  alertLevel: AlertLevel;
  messagePreview: string;   // first 200 chars
}

// ─── Dashboard Stats (for home page) ─────────────────────────────────────────

export interface DashboardStats {
  totalSignals: number;
  critical: number;
  high: number;
  needsOutsideCounsel: number;
  newThisWeek: number;
  byCategory: Record<string, number>;
  byJurisdiction: Record<string, number>;
}

// ─── Create / Update payloads ─────────────────────────────────────────────────

export type CreateSignalInput = Omit<
  Signal,
  | "id"
  | "priorityScore"
  | "priorityLabel"
  | "recommendedAction"
  | "status"
  | "alertSent"
  | "createdAt"
  | "updatedAt"
>;

export type CreateSourceInput = Omit<Source, "id" | "createdAt">;
