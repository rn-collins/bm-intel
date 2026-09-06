import type { Metadata } from "next";
import { listSources } from "@/lib/sources";
import { correctUrl } from "@/lib/url-corrections";

export const revalidate = 60;

const SOURCES_DESC =
  "The register of official and industry authorities this tracker monitors, tiered by reliability and checked on a set cadence.";

export const metadata: Metadata = {
  title: "Source Library",
  description: SOURCES_DESC,
  alternates: { canonical: "/sources" },
  openGraph: {
    title: "Source Library | Burgermeister Expansion Intel",
    description: SOURCES_DESC,
    url: "/sources",
    type: "website",
    images: [{
      url: "/og/sources.png",
      width: 1200,
      height: 630,
      alt: "Source register — the authorities this tracker watches.",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Source Library | Burgermeister Expansion Intel",
    description: SOURCES_DESC,
    images: ["/og/sources.png"],
  },
};

const TIER_CONFIG = {
  1: { label: "Tier 1 — Primary Legal Source",    bg: "bg-[#1E3651]", text: "text-white" },
  2: { label: "Tier 2 — Reputable Secondary",     bg: "bg-[#8A6218]", text: "text-white" },
  3: { label: "Tier 3 — Business Intelligence",   bg: "bg-[#F6F3EC]", text: "text-[#666]" },
  4: { label: "Tier 4 — Weak Signal",             bg: "bg-[#eee]",    text: "text-[#6A6A6A]" },
};

const FREQ_COLOR: Record<string, string> = {
  daily:   "text-[#7B0000] font-semibold",
  weekly:  "text-[#8B4513] font-semibold",
  monthly: "text-[#2F5496]",
  manual:  "text-[#6E6E6E]",
};

export default async function SourcesPage() {
  const sources = await listSources();

  const byTier = [1, 2, 3, 4].map((tier) => ({
    tier,
    sources: sources.filter((s) => s.tier === tier),
  })).filter((g) => g.sources.length > 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#1E3651]">Source Library</h1>
        <p className="text-sm text-[#666] mt-1">
          {sources.length} monitored sources across U.S., UK, EU, and global jurisdictions ·
          Tier 1 = primary legal/regulatory · Tier 2 = reputable secondary · Tier 3 = business intelligence
        </p>
      </div>

      {/* Tier legend */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(TIER_CONFIG).map(([tier, cfg]) => (
          <span key={tier} className={`text-xs px-3 py-1.5 rounded-full font-semibold ${cfg.bg} ${cfg.text}`}>
            {cfg.label}
          </span>
        ))}
      </div>

      {byTier.map(({ tier, sources: tierSources }) => {
        const cfg = TIER_CONFIG[tier as keyof typeof TIER_CONFIG];
        return (
          <div key={tier}>
            <div className={`inline-block text-xs px-3 py-1 rounded font-bold mb-4 ${cfg.bg} ${cfg.text}`}>
              {cfg.label} ({tierSources.length})
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {tierSources.map((source) => (
                <div key={source.id} className="bg-white rounded-lg border border-[#E0DDD6] p-4 hover:border-[#8A6218] hover:shadow-sm transition-all">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <a
                      href={correctUrl(source.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-bold text-[#1E3651] hover:text-[#8A6218] transition-colors leading-snug"
                    >
                      {source.name} →
                    </a>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full flex-shrink-0 font-semibold ${cfg.bg} ${cfg.text}`}>
                      T{tier}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-[10px] text-[#6E6E6E]">
                    <span className="bg-[#F6F3EC] px-2 py-0.5 rounded">{source.jurisdiction}</span>
                    <span className="bg-[#F6F3EC] px-2 py-0.5 rounded truncate max-w-[200px]">{source.category}</span>
                    <span className={`${FREQ_COLOR[source.updateFrequency]}`}>
                      Monitor: {source.updateFrequency}
                    </span>
                  </div>
                  {source.notes && (
                    <p className="text-xs text-[#666] mt-2 leading-relaxed">{source.notes}</p>
                  )}
                  {source.lastChecked && (
                    <p className="text-[10px] text-[#6E6E6E] mt-1">
                      Last checked: {new Date(source.lastChecked).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <div className="bg-[#F6F3EC] border border-[#E0DDD6] rounded-lg p-4 text-xs text-[#666]">
        <strong className="text-[#1E3651]">Source hierarchy:</strong> Tier 1 sources are primary legal and regulatory authorities (statutes, regulations, official government guidance). Tier 2 are reputable secondary sources (law firm advisories, professional associations). Tier 3 are business intelligence sources (company announcements, trade press). All legal claims in signals are sourced to Tier 1 or Tier 2 where possible. Tier 3 sources are used for business context only, never for legal conclusions.
      </div>
    </div>
  );
}
