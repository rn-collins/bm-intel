import type { Priority, RecommendedAction } from "./types";

export function calculatePriorityScore(
  businessImpact: number,
  legalComplexity: number,
  urgency: number
): number {
  return businessImpact + legalComplexity + urgency; // max 15
}

export function getPriorityLabel(score: number): Priority {
  if (score >= 13) return "Critical";
  if (score >= 9)  return "High";
  if (score >= 5)  return "Medium";
  return "Low";
}

export function getRecommendedAction(
  priority: Priority,
  outsideCounsel: boolean
): RecommendedAction {
  if (priority === "Critical")                 return "Immediate Action";
  if (priority === "High" && outsideCounsel)   return "Outside Counsel Review";
  if (priority === "High")                     return "Add to Playbook";
  if (priority === "Medium")                   return "Monitor";
  return "Monitor";
}

export function getAlertLevel(priority: Priority): import("./types").AlertLevel {
  switch (priority) {
    case "Critical": return "Executive Attention";
    case "High":     return "Action Recommended";
    case "Medium":   return "Monitor";
    default:         return "FYI";
  }
}

// Data freshness: returns human-readable delta between dateFound and datePublished
export function freshnessLabel(dateFound: string, datePublished?: string): string {
  if (!datePublished) return "Publication date unknown";
  const found = new Date(dateFound).getTime();
  const pub   = new Date(datePublished).getTime();
  const days  = Math.round((found - pub) / (1000 * 60 * 60 * 24));
  if (days <= 0)  return "Same day as publication";
  if (days === 1) return "1 day after publication";
  if (days < 7)   return `${days} days after publication`;
  if (days < 30)  return `${Math.round(days / 7)} week(s) after publication`;
  return `${Math.round(days / 30)} month(s) after publication`;
}
