import { getSignalStats, listSignals } from "@/lib/signals";
import StatCard from "@/components/StatCard";
import SignalCard from "@/components/SignalCard";
import Glossary from "@/components/Glossary";
import Link from "next/link";

export const revalidate = 60;

export default async function HomePage() {
  const [stats, allSignals] = await Promise.all([
    getSignalStats(),
    listSignals({ limit: 100 }),
  ]);

  const topSignals = allSignals
    .filter((s) => s.priorityLabel === "Critical" || s.priorityLabel === "High")
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .slice(0, 6);

  return (
    <div className="space-y-8">

      {/* Legal disclaimer */}
      <div className="bg-[#FFF8E7] border-l-4 border-[#B8842A] rounded-r p-3 text-[13px] text-[#5A4000]">
        <strong>Note:</strong> This tool is for informational purposes only and does not constitute legal advice. Consult a qualified legal professional before making decisions.
      </div>

      {/* Header + what this is */}
      <div className="bg-white rounded-lg border border-[#E0DDD6] p-6">
        <h1 className="text-2xl font-bold text-[#1E3651] mb-2">Burgermeister Expansion Intelligence</h1>
        <p className="text-sm text-[#444] leading-relaxed mb-3">
          This dashboard tracks legal and regulatory risks relevant to Burgermeister&apos;s international expansion across the U.S., UK, Germany, Poland, and future markets. Each <strong>signal</strong> is a specific legal issue — a law, regulation, compliance obligation, or strategic risk — scored by how much it could affect the business, how legally complex it is, and how urgently it needs attention.
        </p>
        <p className="text-sm text-[#444] leading-relaxed">
          <strong>How to use it:</strong> Start with the Critical and High signals below. Click any signal for the full analysis, source citations, recommended action, and whether outside counsel is required. Use the Signals page to filter by jurisdiction, category, or priority. Use Add Signal to log new developments as they arise.
        </p>
      </div>

      {/* Glossary */}
      <Glossary />

      {/* Stat cards */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#666] mb-3">Dashboard Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard label="Total Signals" value={stats.totalSignals} sublabel="across all markets" accent="navy" />
          <StatCard label="Critical" value={stats.critical} sublabel="address immediately" accent="red" />
          <StatCard label="High Priority" value={stats.high} sublabel="plan before launch" accent="orange" />
          <StatCard label="Outside Counsel" value={stats.needsOutsideCounsel} sublabel="require attorney review" accent="gold" />
          <StatCard label="New This Week" value={stats.newThisWeek} sublabel="added in last 7 days" accent="green" />
        </div>
      </div>

      {/* Priority scoring legend */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label:"🔴 Critical (13–15)", desc:"Address immediately. A deadline is live or a legal obligation is already triggered.", bg:"bg-[#FDF0F0]", border:"border-[#7B0000]" },
          { label:"🟠 High (9–12)",      desc:"Plan before launching in this market. Real risk if unaddressed at entry.", bg:"bg-[#FFF8F0]", border:"border-[#8B4513]" },
          { label:"🟡 Medium (5–8)",     desc:"Monitor and build into your market-entry playbook.", bg:"bg-[#F0F4FB]", border:"border-[#2F5496]" },
          { label:"🟢 Low (1–4)",        desc:"Informational. Track but no immediate action needed.", bg:"bg-[#F0F7F0]", border:"border-[#375623]" },
        ].map((p) => (
          <div key={p.label} className={`rounded-lg border-l-4 p-3 ${p.bg} ${p.border}`}>
            <p className="text-xs font-bold text-[#1C1B1F] mb-1">{p.label}</p>
            <p className="text-[11px] text-[#555] leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>

      {/* Critical + High signals */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-bold text-[#1E3651]">Critical & High Priority Signals</h2>
            <p className="text-xs text-[#666] mt-0.5">These signals require action before or during market entry. Click any signal to see the full analysis and recommended next step.</p>
          </div>
          <Link href="/signals" className="text-xs text-[#B8842A] font-semibold hover:underline flex-shrink-0 ml-4">
            View all {stats.totalSignals} signals →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {topSignals.map((signal) => (
            <SignalCard key={signal.id} signal={signal} />
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/signals" className="block bg-white rounded-lg border border-[#E0DDD6] p-5 hover:border-[#B8842A] hover:shadow-sm transition-all">
          <p className="font-bold text-[#1E3651] mb-1">📋 All Signals</p>
          <p className="text-xs text-[#666] leading-relaxed">Browse, filter, and search all {stats.totalSignals} signals by jurisdiction, category, priority, and outside counsel need. Sortable and searchable.</p>
        </Link>
        <Link href="/sources" className="block bg-white rounded-lg border border-[#E0DDD6] p-5 hover:border-[#B8842A] hover:shadow-sm transition-all">
          <p className="font-bold text-[#1E3651] mb-1">📚 Source Library</p>
          <p className="text-xs text-[#666] leading-relaxed">17 monitored legal sources — primary statutes, government guidance, and secondary authorities — with direct links and monitoring frequency.</p>
        </Link>
        <Link href="/admin" className="block bg-white rounded-lg border border-[#E0DDD6] p-5 hover:border-[#B8842A] hover:shadow-sm transition-all">
          <p className="font-bold text-[#1E3651] mb-1">➕ Add Signal</p>
          <p className="text-xs text-[#666] leading-relaxed">Log a new legal or regulatory development. The priority score calculates automatically as you enter the risk scores. Optionally send a Slack and email alert.</p>
        </Link>
      </div>

      {/* Related Tools */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#666] mb-3">Related Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="https://transform-observatory.vercel.app" target="_blank" rel="noopener noreferrer" className="block bg-white rounded-lg border border-[#E0DDD6] p-5 hover:border-[#B8842A] hover:shadow-sm transition-all">
            <p className="font-bold text-[#1E3651] mb-1">Transform Drug Market Transition Observatory</p>
            <p className="text-xs text-[#666] leading-relaxed">A market-intelligence observatory tracking drug-policy market transitions — the same signal-scoring approach applied to a different regulatory space.</p>
          </a>
          <a href="https://creator-brand-evidence.vercel.app" target="_blank" rel="noopener noreferrer" className="block bg-white rounded-lg border border-[#E0DDD6] p-5 hover:border-[#B8842A] hover:shadow-sm transition-all">
            <p className="font-bold text-[#1E3651] mb-1">Evidence·Studio</p>
            <p className="text-xs text-[#666] leading-relaxed">Evidence-based brand and creator strategy for trust-sensitive markets — governance and disclosure, not guesswork.</p>
          </a>
        </div>
      </div>

<div style={{textAlign:'center',padding:'.75rem 1rem',fontSize:'.7rem',borderTop:'1px solid rgba(0,0,0,.1)',marginTop:'2rem'}}>
  Built by <a href="https://rn-portfolio-khaki.vercel.app" target="_blank" rel="noopener"
  style={{color:'#1B7A68',textDecoration:'none'}}>RN Builds</a> — explore all AI tools and projects.
</div>
  </div>
  );
}
