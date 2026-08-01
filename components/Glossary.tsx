"use client";
import { useState } from "react";

const TERMS = [
  {
    term: "Signal",
    def: "A specific legal or regulatory development that Burgermeister's expansion team should be aware of. Each signal identifies an issue, explains why it matters, scores its risk level, and recommends a next step.",
  },
  {
    term: "Priority Score (out of 15)",
    def: "The sum of three scores: Business Impact + Legal Complexity + Urgency. Maximum is 15. Critical = 13–15 (address immediately). High = 9–12 (plan before launch). Medium = 5–8 (monitor). Low = 1–4 (informational).",
  },
  {
    term: "Business Impact (1–5)",
    def: "How much this issue could affect Burgermeister's expansion plans, timeline, or costs. 1 = minimal effect. 3 = meaningful delay or added cost. 5 = could block market entry entirely or create major liability.",
  },
  {
    term: "Legal Complexity (1–5)",
    def: "How much legal expertise is required to address this issue. 1 = a checklist item anyone can handle. 3 = a lawyer should review it. 5 = a specialist attorney in this area is required.",
  },
  {
    term: "Urgency (1–5)",
    def: "How time-sensitive this issue is. 1 = monitor, no immediate action needed. 3 = should be addressed before launching in the relevant market. 5 = needs attention right now — a deadline is imminent or the issue is already live.",
  },
  {
    term: "Confidence (1–5)",
    def: "How reliable the underlying source is. 1 = weak signal, unverified. 3 = reputable secondary source such as a law firm alert or industry association. 5 = primary law — a statute, regulation, or official government publication. Confidence does not affect the Priority Score; it tells you how much weight to give the signal.",
  },
  {
    term: "Outside Counsel (OC)",
    def: "Signals marked 'Outside Counsel Required' involve legal issues that must be reviewed and confirmed by a qualified attorney before any action is taken. This tool identifies the issue; a lawyer resolves it.",
  },
  {
    term: "Recommended Action",
    def: "Immediate Action = address this now, a deadline or live obligation is at stake. Outside Counsel Review = flag for your attorney before proceeding. Add to Playbook = document this in your market-entry checklist. Executive Briefing = escalate to leadership. Monitor = track for developments, no immediate action needed.",
  },
  {
    term: "Signal Currency",
    def: "The gap between when this signal was published by its source and when it was added to this dashboard. A signal published 6 months ago and added today may reflect a law already in effect — the gap tells you whether you are acting on breaking news or established law.",
  },
  {
    term: "Source Tier",
    def: "Tier 1 = primary legal/regulatory source: a statute, regulation, official government publication, or court decision. This is the highest confidence. Tier 2 = reputable secondary source: a law firm advisory, professional association, or established industry body. Tier 3 = business intelligence: a company announcement, trade publication, or press report. Legal conclusions are only drawn from Tier 1 or Tier 2 sources.",
  },
  {
    term: "Citation & Practice Notes",
    def: "The specific statute, regulation, or case law that supports the signal's legal claim, plus any practical notes about timing, sequencing, or related obligations. For example: '16 C.F.R. § 436.2(f) — must be completed before any franchise sales activity in the U.S.'",
  },
  {
    term: "Jurisdiction",
    def: "The country or region where this legal issue applies. US = United States. UK = United Kingdom. EU = European Union generally. DE = Germany. PL = Poland. CZ = Czech Republic. NL = Netherlands. CH = Switzerland. UAE = United Arab Emirates. Global = applies across multiple markets.",
  },
  {
    term: "Not Legal Advice",
    def: "This dashboard is an issue-spotting and regulatory intelligence tool. It identifies legal and regulatory risks, provides context, and recommends next steps — but it does not constitute legal advice and should not be relied upon as such. All signals marked 'Outside Counsel Required' must be reviewed by a qualified attorney before action is taken.",
  },
];

export default function Glossary() {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white border border-[#E0DDD6] rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-3 text-sm font-bold text-[#1E3651] hover:bg-[#F6F3EC] transition-colors"
      >
        <span>📖 How to read this dashboard — terms and definitions</span>
        <span className="text-[#B8842A] text-lg">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="border-t border-[#E0DDD6] px-5 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {TERMS.map(({ term, def }) => (
            <div key={term} className="space-y-1">
              <p className="text-xs font-bold text-[#1E3651] uppercase tracking-wide">{term}</p>
              <p className="text-xs text-[#555] leading-relaxed">{def}</p>
            </div>
          ))}
          <div className="md:col-span-2 mt-2 pt-3 border-t border-[#F0EDE8]">
            <p className="text-[10px] text-[#aaa]">
              ⚖️ Not legal advice. This dashboard is a legal/regulatory intelligence and issue-spotting tool. It does not constitute legal advice and should not be relied upon as such. Items marked &quot;Outside Counsel Required&quot; require attorney confirmation before any action is taken.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
