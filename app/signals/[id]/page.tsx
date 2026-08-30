import { getSignal } from "@/lib/signals";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PriorityBadge from "@/components/PriorityBadge";
import Link from "next/link";
import { freshnessLabel } from "@/lib/scoring";

export const revalidate = 60;
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const signal = await getSignal(id);
  if (!signal) return { title: "Signal Not Found" };

  const description =
    signal.summary?.slice(0, 200) ??
    `A tracked ${signal.jurisdiction} legal and regulatory signal, scored for business impact, legal complexity, urgency and confidence.`;

  // og:image and twitter:image come from the sibling opengraph-image.tsx, which
  // renders this signal's own jurisdiction, category and priority — so a shared
  // link shows the signal, not one generic site card. Next injects those tags
  // from the file convention; setting them here as well would duplicate them.
  return {
    title: signal.title,
    description,
    alternates: { canonical: `/signals/${id}` },
    openGraph: {
      title: signal.title,
      description,
      url: `/signals/${id}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: signal.title,
      description,
    },
  };
}


const SCORE_MEANING: Record<string, Record<number, string>> = {
  businessImpactScore: {
    1:"Minimal — unlikely to affect expansion timeline or costs",
    2:"Low — minor friction, manageable without specialist help",
    3:"Moderate — could cause meaningful delay or added cost",
    4:"High — significant risk to market entry speed or budget",
    5:"Critical — could block market entry entirely or create major liability",
  },
  legalComplexityScore: {
    1:"Checklist item — can be handled internally without specialist counsel",
    2:"Low complexity — standard legal review sufficient",
    3:"Moderate — a lawyer should review this before action",
    4:"High — specialist legal input required",
    5:"Specialist required — dedicated expert counsel in this area of law",
  },
  urgencyScore: {
    1:"Monitor — no immediate action needed, track for developments",
    2:"Low urgency — address in planning phase",
    3:"Plan before launch — must be resolved before entering this market",
    4:"High urgency — time-sensitive, should be addressed soon",
    5:"Immediate — a deadline is live or the obligation is already triggered",
  },
  confidenceScore: {
    1:"Weak signal — unverified or speculative",
    2:"Low confidence — informal or secondary source",
    3:"Moderate — reputable secondary source (law firm alert, industry body)",
    4:"High — well-established secondary source or official guidance",
    5:"Primary law — a statute, regulation, or official government publication",
  },
};

const ACTION_MEANING: Record<string, string> = {
  "Immediate Action":      "A legal deadline is live or an obligation is already triggered. Act now.",
  "Outside Counsel Review":"Flag this for your attorney before taking any action. Do not proceed without legal confirmation.",
  "Add to Playbook":       "Document this in your market-entry checklist. Address it as part of launch preparation.",
  "Executive Briefing":    "Escalate to leadership. This signal has strategic implications beyond day-to-day legal ops.",
  "Monitor":               "No immediate action required. Track for regulatory or legal developments.",
};

const STATUS_COLORS: Record<string, string> = {
  "New":               "bg-[#F0F4FB] text-[#2F5496]",
  "Needs Review":      "bg-[#FFF8F0] text-[#8B4513]",
  "Monitor":           "bg-[#F6F3EC] text-[#666]",
  "Add to Playbook":   "bg-[#F0F7F0] text-[#375623]",
  "Outside Counsel":   "bg-[#FDF0F0] text-[#7B0000]",
  "Executive Briefing":"bg-[#1E3651] text-white",
  "Closed":            "bg-[#eee] text-[#999]",
  "Archived":          "bg-[#eee] text-[#999]",
};

const TIER_MEANING: Record<number, string> = {
  1:"Primary legal source — a statute, regulation, or official government publication. Highest reliability.",
  2:"Reputable secondary source — a law firm advisory, professional association, or established industry body.",
  3:"Business intelligence — a company announcement, trade publication, or press report. Used for context only, not legal conclusions.",
  4:"Weak signal — informal or unverified. Treat with caution.",
};

export default async function SignalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const signal = await getSignal(id);
  if (!signal) notFound();

  const freshness = freshnessLabel(signal.dateFound, signal.datePublished);
  const daysSince = Math.round((Date.now() - new Date(signal.dateFound).getTime()) / (1000*60*60*24));

  return (
    <div className="max-w-4xl space-y-5">
      <Link href="/signals" className="text-xs text-[#B8842A] font-semibold hover:underline">
        ← Back to all signals
      </Link>

      {/* Header */}
      <div className="bg-white rounded-lg border border-[#E0DDD6] p-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h1 className="text-xl font-bold text-[#1E3651] leading-snug">{signal.title}</h1>
          <PriorityBadge priority={signal.priorityLabel} />
        </div>
        <p className="text-sm text-[#444] leading-relaxed mb-4">{signal.summary}</p>
        <div className="flex flex-wrap gap-2 text-xs font-medium">
          <span className="bg-[#F6F3EC] border border-[#E0DDD6] px-3 py-1 rounded-full text-[#444]">
            📍 {signal.jurisdiction === "US" ? "United States" : signal.jurisdiction === "UK" ? "United Kingdom" : signal.jurisdiction === "EU" ? "European Union" : signal.jurisdiction === "DE" ? "Germany" : signal.jurisdiction === "PL" ? "Poland" : signal.jurisdiction}
          </span>
          <span className="bg-[#F6F3EC] border border-[#E0DDD6] px-3 py-1 rounded-full text-[#444]">
            {signal.category}
          </span>
          <span className={`px-3 py-1 rounded-full ${STATUS_COLORS[signal.status] ?? "bg-[#F6F3EC] text-[#444]"}`}>
            Status: {signal.status}
          </span>
          {signal.outsideCounselNeeded && (
            <span className="bg-[#FDF0F0] text-[#7B0000] border border-[#f5c0c0] px-3 py-1 rounded-full font-bold">
              ⚠️ Outside Counsel Required
            </span>
          )}
        </div>
      </div>

      {/* Recommended Action — prominent */}
      <div className={`rounded-lg border-l-4 p-5 ${
        signal.priorityLabel === "Critical" ? "border-[#7B0000] bg-[#FDF0F0]" :
        signal.priorityLabel === "High"     ? "border-[#8B4513] bg-[#FFF8F0]" :
        signal.priorityLabel === "Medium"   ? "border-[#2F5496] bg-[#F0F4FB]" :
                                              "border-[#375623] bg-[#F0F7F0]"
      }`}>
        <p className="text-xs font-bold uppercase tracking-widest text-[#666] mb-1">Recommended Action</p>
        <p className="text-lg font-bold text-[#1E3651] mb-1">{signal.recommendedAction}</p>
        <p className="text-sm text-[#555]">{ACTION_MEANING[signal.recommendedAction] ?? ""}</p>
        {signal.outsideCounselNeeded && (
          <p className="text-xs text-[#7B0000] font-semibold mt-2">
            ⚠️ This signal is marked Outside Counsel Required — do not take action without attorney confirmation.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Risk Scores */}
        <div className="bg-white rounded-lg border border-[#E0DDD6] p-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#666] mb-1">Risk Scores</h2>
          <p className="text-xs text-[#888] mb-4">
            Priority Score = Business Impact + Legal Complexity + Urgency. Maximum is 15.
            Confidence is not included in the score — it reflects how reliable the source is.
          </p>
          <div className="space-y-4">
            {[
              { key:"businessImpactScore",  label:"Business Impact"  },
              { key:"legalComplexityScore", label:"Legal Complexity"  },
              { key:"urgencyScore",         label:"Urgency"           },
              { key:"confidenceScore",      label:"Confidence (source reliability)" },
            ].map(({ key, label }) => {
              const val = signal[key as keyof typeof signal] as number;
              const meaning = SCORE_MEANING[key]?.[val] ?? "";
              return (
                <div key={key}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-semibold text-[#444]">{label}</span>
                    <span className="text-xs font-bold text-[#B8842A]">{val}/5</span>
                  </div>
                  <div className="h-2 bg-[#F6F3EC] rounded-full mb-1">
                    <div className="h-2 bg-[#B8842A] rounded-full" style={{ width:`${(val/5)*100}%` }} />
                  </div>
                  <p className="text-[11px] text-[#666] leading-relaxed">{meaning}</p>
                </div>
              );
            })}
            <div className="pt-3 border-t border-[#F6F3EC]">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-[#1E3651]">Total Priority Score</span>
                <span className="text-xl font-bold text-[#1E3651]">{signal.priorityScore}/15</span>
              </div>
              <p className="text-xs text-[#888] mt-1">
                {signal.priorityScore >= 13 ? "Critical — address immediately" :
                 signal.priorityScore >= 9  ? "High — plan before launch" :
                 signal.priorityScore >= 5  ? "Medium — monitor and build into playbook" :
                                              "Low — informational, track for developments"}
              </p>
            </div>
          </div>
        </div>

        {/* Source + Currency + Notes */}
        <div className="space-y-4">
          {/* Source */}
          <div className="bg-white rounded-lg border border-[#E0DDD6] p-5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#666] mb-3">Source</h2>
            <a href={signal.sourceUrl} target="_blank" rel="noopener noreferrer"
              className="text-sm text-[#B8842A] hover:underline font-bold block mb-1">
              {signal.sourceName} →
            </a>
            <p className="text-xs font-semibold text-[#444] mb-1">Tier {signal.sourceTier} Source</p>
            <p className="text-xs text-[#666] leading-relaxed">{TIER_MEANING[signal.sourceTier]}</p>
          </div>

          {/* Signal Currency */}
          <div className="bg-white rounded-lg border border-[#E0DDD6] p-5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#666] mb-1">Signal Currency</h2>
            <p className="text-xs text-[#888] mb-3">
              How current is this signal? The gap between when it was published and when it was added here tells you whether you&apos;re looking at breaking news or established law.
            </p>
            <p className="text-sm font-semibold text-[#1E3651] mb-1">{freshness}</p>
            <p className="text-xs text-[#888]">
              Added to dashboard: {new Date(signal.dateFound).toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})}
              {" "}({daysSince === 0 ? "today" : daysSince === 1 ? "1 day ago" : `${daysSince} days ago`})
            </p>
            {signal.datePublished && (
              <p className="text-xs text-[#888] mt-0.5">
                Originally published: {new Date(signal.datePublished).toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})}
              </p>
            )}
          </div>

          {/* Citation & Practice Notes */}
          {signal.notes && (
            <div className="bg-white rounded-lg border border-[#E0DDD6] p-5">
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#666] mb-1">Citation & Practice Notes</h2>
              <p className="text-xs text-[#888] mb-2">
                Specific statute, regulation, or case law supporting this signal, plus practical notes on sequencing, timing, or related obligations.
              </p>
              <p className="text-xs text-[#444] leading-relaxed font-mono bg-[#F6F3EC] p-3 rounded">{signal.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Legal disclaimer */}
      <div className="bg-[#FDF0F0] border border-[#f5c0c0] rounded-lg p-4 text-xs text-[#7B0000]">
        <strong>Not legal advice.</strong> This signal is an issue-spotting and regulatory intelligence product. It identifies legal and regulatory risks and recommends next steps based on publicly available information. It does not constitute legal advice and should not be relied upon as such. Items marked &quot;Outside Counsel Required&quot; must be reviewed by a qualified attorney before any action is taken.
      </div>
    </div>
  );
}
