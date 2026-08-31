"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Category, Jurisdiction } from "@/lib/types";

const JURISDICTIONS: Jurisdiction[] = ["US","UK","EU","DE","PL","CZ","NL","CH","UAE","Global"];
const CATEGORIES: Category[] = [
  "Franchise / Market Entry",
  "Brand / IP Protection",
  "Post-Brexit Supply Chain / Import Compliance",
  "Real Estate / Site Acquisition",
  "Supply Chain / Quality Control",
  "Delivery Platforms",
  "Labor / Employment",
  "Food Compliance / Labeling",
  "Data / AI / Privacy",
  "Advertising / Consumer Protection",
  "M&A / JV / Investor Diligence Readiness",
  "Crisis / Reputation Monitoring",
  "Competitor / Market Intelligence",
];

const SCORE_LABELS: Record<number, string> = {
  1:"1 — Minimal", 2:"2 — Low", 3:"3 — Moderate", 4:"4 — High", 5:"5 — Critical"
};

const SCORE_GUIDE = [
  {
    key:"businessImpactScore", label:"Business Impact",
    what:"How much could this issue affect Burgermeister's expansion plans, timeline, or costs?",
    scale:[
      "1 — Minimal: unlikely to affect expansion",
      "2 — Low: minor friction, manageable",
      "3 — Moderate: meaningful delay or added cost",
      "4 — High: significant risk to market entry",
      "5 — Critical: could block market entry or create major liability",
    ]
  },
  {
    key:"legalComplexityScore", label:"Legal Complexity",
    what:"How much legal expertise is required to address this issue?",
    scale:[
      "1 — Checklist item: no specialist needed",
      "2 — Low: standard legal review sufficient",
      "3 — Moderate: a lawyer should review it",
      "4 — High: specialist legal input required",
      "5 — Specialist required: dedicated expert counsel needed",
    ]
  },
  {
    key:"urgencyScore", label:"Urgency",
    what:"How time-sensitive is this issue?",
    scale:[
      "1 — Monitor: no immediate action needed",
      "2 — Low: address in planning phase",
      "3 — Pre-launch: resolve before entering this market",
      "4 — High: time-sensitive, address soon",
      "5 — Immediate: a deadline is live or obligation already triggered",
    ]
  },
  {
    key:"confidenceScore", label:"Confidence (Source Reliability)",
    what:"How reliable is the source? Confidence does not affect the Priority Score — it tells you how much weight to give the signal.",
    scale:[
      "1 — Weak signal: unverified or speculative",
      "2 — Low: informal or secondary source",
      "3 — Moderate: reputable secondary (law firm alert, industry body)",
      "4 — High: established secondary or official guidance",
      "5 — Primary law: a statute, regulation, or official government publication",
    ]
  },
];

function calcPriority(b: number, l: number, u: number) {
  const score = b + l + u;
  if (score >= 13) return { score, label:"Critical", color:"text-[#7B0000]", bg:"border-[#7B0000] bg-[#FDF0F0]" };
  if (score >= 9)  return { score, label:"High",     color:"text-[#8B4513]", bg:"border-[#8B4513] bg-[#FFF8F0]" };
  if (score >= 5)  return { score, label:"Medium",   color:"text-[#2F5496]", bg:"border-[#2F5496] bg-[#F0F4FB]" };
  return { score, label:"Low", color:"text-[#375623]", bg:"border-[#375623] bg-[#F0F7F0]" };
}

export default function AdminPage() {
  const router = useRouter();
  const [dashboardSecret, setDashboardSecret] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showGuide, setShowGuide] = useState(false);

  const [form, setForm] = useState({
    title:"", summary:"", sourceUrl:"", sourceName:"",
    sourceTier:1 as 1|2|3|4,
    dateFound:new Date().toISOString().split("T")[0],
    datePublished:"",
    jurisdiction:"Global" as Jurisdiction,
    category:"Franchise / Market Entry" as Category,
    businessImpactScore:3, legalComplexityScore:3,
    urgencyScore:3, confidenceScore:3,
    outsideCounselNeeded:false, notes:"", sendAlert:false,
  });

  useEffect(() => {
    const existing = window.sessionStorage.getItem("bm-dashboard-secret");
    if (existing) {
      setDashboardSecret(existing);
      setUnlocked(true);
    }
  }, []);

  function unlockDashboard() {
    const secret = dashboardSecret.trim();
    if (!secret) {
      setError("Enter the dashboard access key.");
      return;
    }
    window.sessionStorage.setItem("bm-dashboard-secret", secret);
    setUnlocked(true);
    setError("");
  }

  const priority = calcPriority(form.businessImpactScore, form.legalComplexityScore, form.urgencyScore);
  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit() {
    if (!form.title || !form.summary || !form.sourceUrl || !form.sourceName) {
      setError("Title, summary, source URL, and source name are all required.");
      return;
    }
    setSaving(true); setError("");
    try {
      const res = await fetch("/api/signals", {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "x-dashboard-secret":dashboardSecret,
        },
        body:JSON.stringify({
          ...form,
          dateFound:new Date(form.dateFound).toISOString(),
          datePublished:form.datePublished ? new Date(form.datePublished).toISOString() : undefined,
        }),
      });
      if (res.status === 401) {
        window.sessionStorage.removeItem("bm-dashboard-secret");
        setUnlocked(false);
        throw new Error("Access key rejected. Re-enter the current dashboard key.");
      }
      if (!res.ok) throw new Error(await res.text());
      setSuccess(true);
      setTimeout(() => router.push("/signals"), 1500);
    } catch(e) { setError(String(e)); }
    finally { setSaving(false); }
  }

  if (!unlocked) {
    return (
      <div className="max-w-md mx-auto mt-12 bg-white rounded-lg border border-[#E0DDD6] p-6 shadow-sm">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#B8842A] mb-2">Operator workspace</p>
        <h1 className="text-2xl font-bold text-[#1E3651]">Unlock signal operations</h1>
        <p className="text-sm text-[#666] mt-2 leading-relaxed">
          Public intelligence remains readable. Creating, changing, or deleting signals requires the private dashboard access key.
        </p>
        <label htmlFor="dashboard-secret" className="block text-xs font-bold text-[#1E3651] uppercase tracking-wider mt-5 mb-1">
          Dashboard access key
        </label>
        <input
          id="dashboard-secret"
          type="password"
          autoComplete="current-password"
          value={dashboardSecret}
          onChange={(event) => setDashboardSecret(event.target.value)}
          onKeyDown={(event) => { if (event.key === "Enter") unlockDashboard(); }}
          className="w-full border border-[#E0DDD6] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#B8842A]"
        />
        {error && <p role="alert" className="text-sm text-[#7B0000] bg-[#FDF0F0] px-3 py-2 rounded mt-3">{error}</p>}
        <button
          type="button"
          onClick={unlockDashboard}
          className="w-full mt-4 py-3 rounded-lg font-bold text-sm bg-[#1E3651] text-white hover:bg-[#B8842A] transition-colors"
        >
          Unlock operator workspace
        </button>
        <p className="text-[11px] text-[#888] mt-3">The key is kept only in this browser tab and is never embedded in the site.</p>

        <div className="mt-8 pt-6 border-t border-[#E0DDD6] text-sm text-[#444] leading-relaxed space-y-4">
          <div>
            <h2 className="text-base font-bold text-[#1E3651] mb-1">What sits behind this key</h2>
            <p>
              The operator workspace is the editorial side of the tracker. It is where a new
              legal or regulatory development gets entered as a signal, scored on the four
              dimensions the public pages display, assigned a jurisdiction and category, and
              moved through review states as the position firms up. It also holds the source
              register that decides which official feeds are watched and how often.
            </p>
          </div>
          <div>
            <h2 className="text-base font-bold text-[#1E3651] mb-1">Why scoring is done here rather than in public</h2>
            <p>
              Every signal carries four scores &mdash; business impact, legal complexity,
              urgency, and confidence &mdash; and the flag for whether outside counsel should
              confirm it before anyone acts. Those are editorial judgements, and they change as
              a story develops. Keeping the write path behind a key means the published record
              moves deliberately, with one hand on it, rather than drifting.
            </p>
          </div>
          <div>
            <h2 className="text-base font-bold text-[#1E3651] mb-1">How a signal gets from a source to a page</h2>
            <p>
              A development is picked up from one of the monitored authorities on the source
              register, checked against the primary document rather than the reporting about it,
              and written up as a summary that states what changed and who it binds. It is then
              given a jurisdiction and a category, scored on the four dimensions, and marked for
              outside counsel if acting on it would turn on a lawyer&apos;s judgement. Only after
              that does it appear on the public pages, which is why the register moves in
              considered steps rather than continuously.
            </p>
          </div>
          <div>
            <h2 className="text-base font-bold text-[#1E3651] mb-1">Everything readable is already public</h2>
            <p>
              No analysis is hidden behind this gate. The full signal set, with scores, source
              links and jurisdictions, is on the{" "}
              <a href="/signals" className="text-[#B8842A] font-semibold hover:underline">signals</a>{" "}
              page, and the register of monitored authorities is on the{" "}
              <a href="/sources" className="text-[#B8842A] font-semibold hover:underline">sources</a>{" "}
              page. The{" "}
              <a href="/" className="text-[#B8842A] font-semibold hover:underline">overview</a>{" "}
              summarises where the risk currently concentrates across the four markets. If you
              arrived here looking for the research, those three pages are the whole of it.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1E3651]">Add Signal</h1>
        <p className="text-sm text-[#666] mt-1 leading-relaxed">
          Log a new legal or regulatory development. Fill in the title, summary, source, and jurisdiction, then score the risk using the sliders. The Priority Score calculates automatically. Optionally send a Slack and email alert when you save.
        </p>
      </div>

      {/* Scoring guide toggle */}
      <div className="bg-white border border-[#E0DDD6] rounded-lg overflow-hidden">
        <button onClick={() => setShowGuide(o => !o)}
          className="w-full flex items-center justify-between px-5 py-3 text-sm font-bold text-[#1E3651] hover:bg-[#F6F3EC] transition-colors">
          <span>📊 Scoring guide — how to fill in the risk scores</span>
          <span className="text-[#B8842A] text-lg">{showGuide ? "−" : "+"}</span>
        </button>
        {showGuide && (
          <div className="border-t border-[#E0DDD6] px-5 py-4 space-y-4">
            <p className="text-xs text-[#555]">
              <strong>Priority Score</strong> = Business Impact + Legal Complexity + Urgency (max 15). Critical = 13–15. High = 9–12. Medium = 5–8. Low = 1–4. Confidence is separate — it reflects source reliability and does not affect the score.
            </p>
            {SCORE_GUIDE.map((g) => (
              <div key={g.key}>
                <p className="text-xs font-bold text-[#1E3651] mb-1">{g.label}</p>
                <p className="text-xs text-[#666] mb-2">{g.what}</p>
                <ul className="space-y-0.5">
                  {g.scale.map((s) => <li key={s} className="text-[11px] text-[#555] pl-2 border-l-2 border-[#E0DDD6]">{s}</li>)}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Live priority score */}
      <div className={`rounded-lg border-l-4 p-4 ${priority.bg}`}>
        <p className="text-xs font-semibold uppercase tracking-widest text-[#666]">Live Priority Score</p>
        <p className={`text-3xl font-bold mt-1 ${priority.color}`}>{priority.score}/15 — {priority.label}</p>
        <p className="text-xs text-[#888] mt-1">Updates as you move the sliders below. Score = Business Impact + Legal Complexity + Urgency.</p>
      </div>

      <div className="bg-white rounded-lg border border-[#E0DDD6] p-6 space-y-5">
        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-[#1E3651] uppercase tracking-wider mb-1">
            Title <span className="text-[#7B0000]">*</span>
          </label>
          <p className="text-[11px] text-[#888] mb-1">A short, specific description of the legal or regulatory issue.</p>
          <input type="text" value={form.title} onChange={(e) => set("title", e.target.value)}
            placeholder="e.g. FDA Menu Labeling — 20-Location Chain Trigger (21 C.F.R. § 101.11)"
            className="w-full border border-[#E0DDD6] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#B8842A]" />
        </div>

        {/* Summary */}
        <div>
          <label className="block text-xs font-bold text-[#1E3651] uppercase tracking-wider mb-1">
            Summary <span className="text-[#7B0000]">*</span>
          </label>
          <p className="text-[11px] text-[#888] mb-1">What is the issue, what triggers it, and why does it matter for Burgermeister&apos;s expansion?</p>
          <textarea value={form.summary} onChange={(e) => set("summary", e.target.value)}
            rows={3} placeholder="FDA requires calorie and nutrition disclosure on menus for chain restaurants with 20 or more locations under the same name..."
            className="w-full border border-[#E0DDD6] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#B8842A] resize-none" />
        </div>

        {/* Source */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#1E3651] uppercase tracking-wider mb-1">Source URL <span className="text-[#7B0000]">*</span></label>
            <p className="text-[11px] text-[#888] mb-1">Direct link to the statute, regulation, or publication.</p>
            <input type="url" value={form.sourceUrl} onChange={(e) => set("sourceUrl", e.target.value)}
              placeholder="https://www.fda.gov/..."
              className="w-full border border-[#E0DDD6] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#B8842A]" />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#1E3651] uppercase tracking-wider mb-1">Source Name <span className="text-[#7B0000]">*</span></label>
            <p className="text-[11px] text-[#888] mb-1">Name of the source as it should appear in citations.</p>
            <input type="text" value={form.sourceName} onChange={(e) => set("sourceName", e.target.value)}
              placeholder="FDA — Menu Labeling Requirements"
              className="w-full border border-[#E0DDD6] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#B8842A]" />
          </div>
        </div>

        {/* Tier + Jurisdiction + Category */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#1E3651] uppercase tracking-wider mb-1">Source Tier</label>
            <p className="text-[11px] text-[#888] mb-1">T1 = statute/regulation. T2 = law firm/association. T3 = trade press.</p>
            <select value={form.sourceTier} onChange={(e) => set("sourceTier", parseInt(e.target.value))}
              className="w-full border border-[#E0DDD6] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#B8842A] bg-white">
              <option value={1}>Tier 1 — Primary Legal (statute, regulation, official guidance)</option>
              <option value={2}>Tier 2 — Secondary (law firm alert, professional association)</option>
              <option value={3}>Tier 3 — Business Intelligence (trade press, company announcement)</option>
              <option value={4}>Tier 4 — Weak Signal (informal, unverified)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-[#1E3651] uppercase tracking-wider mb-1">Jurisdiction</label>
            <p className="text-[11px] text-[#888] mb-1">Which market does this apply to?</p>
            <select value={form.jurisdiction} onChange={(e) => set("jurisdiction", e.target.value)}
              className="w-full border border-[#E0DDD6] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#B8842A] bg-white">
              {JURISDICTIONS.map((j) => <option key={j} value={j}>{j === "US" ? "US — United States" : j === "UK" ? "UK — United Kingdom" : j === "EU" ? "EU — European Union" : j === "DE" ? "DE — Germany" : j === "PL" ? "PL — Poland" : j === "CZ" ? "CZ — Czech Republic" : j === "NL" ? "NL — Netherlands" : j === "CH" ? "CH — Switzerland" : j === "UAE" ? "UAE — United Arab Emirates" : "Global — Multiple Markets"}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-[#1E3651] uppercase tracking-wider mb-1">Category</label>
            <p className="text-[11px] text-[#888] mb-1">Which area of law or business does this cover?</p>
            <select value={form.category} onChange={(e) => set("category", e.target.value)}
              className="w-full border border-[#E0DDD6] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#B8842A] bg-white">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#1E3651] uppercase tracking-wider mb-1">Date Found</label>
            <p className="text-[11px] text-[#888] mb-1">When you added this signal to the dashboard.</p>
            <input type="date" value={form.dateFound} onChange={(e) => set("dateFound", e.target.value)}
              className="w-full border border-[#E0DDD6] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#B8842A]" />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#1E3651] uppercase tracking-wider mb-1">Date Published (if known)</label>
            <p className="text-[11px] text-[#888] mb-1">When the source originally published this information. Used to calculate signal currency.</p>
            <input type="date" value={form.datePublished} onChange={(e) => set("datePublished", e.target.value)}
              className="w-full border border-[#E0DDD6] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#B8842A]" />
          </div>
        </div>

        {/* Scores */}
        <div className="space-y-4">
          <div>
            <p className="text-xs font-bold text-[#1E3651] uppercase tracking-wider">Risk Scores (1–5)</p>
            <p className="text-[11px] text-[#888] mt-1">Move each slider to score the signal. Priority Score = Business Impact + Legal Complexity + Urgency. Open the scoring guide above if you need help.</p>
          </div>
          {SCORE_GUIDE.map(({ key, label, what }) => (
            <div key={key}>
              <div className="flex justify-between mb-1">
                <div>
                  <label className="text-xs font-semibold text-[#444]">{label}</label>
                  <p className="text-[10px] text-[#aaa]">{what}</p>
                </div>
                <span className="text-xs text-[#B8842A] font-bold ml-4 flex-shrink-0">{SCORE_LABELS[form[key as keyof typeof form] as number]}</span>
              </div>
              <input type="range" min={1} max={5} step={1}
                value={form[key as keyof typeof form] as number}
                onChange={(e) => set(key, parseInt(e.target.value))}
                className="w-full accent-[#B8842A]" />
            </div>
          ))}
        </div>

        {/* OC */}
        <div className="flex items-start gap-3 p-3 bg-[#F6F3EC] rounded-lg">
          <button type="button"
            onClick={() => set("outsideCounselNeeded", !form.outsideCounselNeeded)}
            className={`relative mt-0.5 inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${form.outsideCounselNeeded ? "bg-[#7B0000]" : "bg-[#ddd]"}`}>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.outsideCounselNeeded ? "translate-x-6" : "translate-x-1"}`} />
          </button>
          <div>
            <label className="text-sm font-semibold text-[#1E3651]">Outside Counsel Required</label>
            <p className="text-[11px] text-[#666] mt-0.5">Turn this on if this signal involves a legal issue that must be reviewed and confirmed by an attorney before any action is taken. It will be flagged with ⚠️ throughout the dashboard.</p>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-bold text-[#1E3651] uppercase tracking-wider mb-1">Citation & Practice Notes (optional)</label>
          <p className="text-[11px] text-[#888] mb-1">Specific statute, regulation, or case citation, plus any practical notes on timing, sequencing, or related obligations. Example: &ldquo;16 C.F.R. § 436.2(f) — must be completed before any franchise sales activity in the U.S.&rdquo;</p>
          <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)}
            rows={2} placeholder="16 C.F.R. § 436.2(f) — must be completed before any franchise sales activity in the U.S."
            className="w-full border border-[#E0DDD6] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#B8842A] resize-none font-mono" />
        </div>

        {/* Alert */}
        <div className="flex items-start gap-3 p-3 bg-[#F6F3EC] rounded-lg border-t border-[#E0DDD6]">
          <button type="button"
            onClick={() => set("sendAlert", !form.sendAlert)}
            className={`relative mt-0.5 inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${form.sendAlert ? "bg-[#1E3651]" : "bg-[#ddd]"}`}>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.sendAlert ? "translate-x-6" : "translate-x-1"}`} />
          </button>
          <div>
            <label className="text-sm font-semibold text-[#1E3651]">Send Slack + Email Alert on Save</label>
            <p className="text-[11px] text-[#666] mt-0.5">Sends a formatted alert to the #all-AI-alerts Slack channel and to rayven.nikkita.collins@gmail.com immediately when the signal is saved.</p>
          </div>
        </div>

        {error && <p className="text-sm text-[#7B0000] bg-[#FDF0F0] px-3 py-2 rounded">{error}</p>}

        <button onClick={handleSubmit} disabled={saving || success}
          className={`w-full py-3 rounded-lg font-bold text-sm transition-colors ${
            success ? "bg-[#375623] text-white" :
            saving  ? "bg-[#ccc] text-[#888] cursor-not-allowed" :
                      "bg-[#1E3651] text-white hover:bg-[#B8842A]"
          }`}>
          {success ? "✓ Signal saved — redirecting to signals..." : saving ? "Saving..." : "Save Signal"}
        </button>
      </div>
    </div>
  );
}
