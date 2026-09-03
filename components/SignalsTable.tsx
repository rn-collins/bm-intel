"use client";
import { useState, useMemo } from "react";
import type { Signal, Jurisdiction, Category, Priority } from "@/lib/types";
import PriorityBadge from "./PriorityBadge";
import Link from "next/link";

const JURISDICTIONS: Jurisdiction[] = ["US","UK","EU","DE","PL","CZ","NL","CH","UAE","Global"];
const PRIORITIES: Priority[] = ["Critical","High","Medium","Low"];

export default function SignalsTable({ signals }: { signals: Signal[] }) {
  const [search, setSearch]         = useState("");
  const [jur, setJur]               = useState<string>("All");
  const [pri, setPri]               = useState<string>("All");
  const [oc, setOc]                 = useState<string>("All");
  const [status, setStatus]         = useState<string>("All");

  const categories = useMemo(() => {
    const cats = Array.from(new Set(signals.map((s) => s.category)));
    return cats.sort();
  }, [signals]);

  const [cat, setCat] = useState<string>("All");

  const filtered = useMemo(() => {
    return signals.filter((s) => {
      if (search && !s.title.toLowerCase().includes(search.toLowerCase()) &&
          !s.summary.toLowerCase().includes(search.toLowerCase())) return false;
      if (jur !== "All" && s.jurisdiction !== jur) return false;
      if (pri !== "All" && s.priorityLabel !== pri) return false;
      if (cat !== "All" && s.category !== cat) return false;
      if (oc === "Yes" && !s.outsideCounselNeeded) return false;
      if (oc === "No"  &&  s.outsideCounselNeeded) return false;
      if (status !== "All" && s.status !== status) return false;
      return true;
    });
  }, [signals, search, jur, pri, cat, oc, status]);

  const PRI_COLOR: Record<string, string> = {
    Critical: "text-[#7B0000] font-bold",
    High:     "text-[#8B4513] font-bold",
    Medium:   "text-[#2F5496]",
    Low:      "text-[#375623]",
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-lg border border-[#E0DDD6] p-4">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <input
            type="text"
            aria-label="Search signals"
            placeholder="Search signals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="col-span-2 border border-[#E0DDD6] rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#8A6218]"
          />
          <select aria-label="Filter by jurisdiction" value={jur} onChange={(e) => setJur(e.target.value)}
            className="border border-[#E0DDD6] rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#8A6218] bg-white">
            <option value="All">All Jurisdictions</option>
            {JURISDICTIONS.map((j) => <option key={j} value={j}>{j}</option>)}
          </select>
          <select aria-label="Filter by priority" value={pri} onChange={(e) => setPri(e.target.value)}
            className="border border-[#E0DDD6] rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#8A6218] bg-white">
            <option value="All">All Priorities</option>
            {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <select aria-label="Filter by whether outside counsel is needed" value={oc} onChange={(e) => setOc(e.target.value)}
            className="border border-[#E0DDD6] rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#8A6218] bg-white">
            <option value="All">Outside Counsel: All</option>
            <option value="Yes">OC Needed</option>
            <option value="No">OC Not Needed</option>
          </select>
          <select aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)}
            className="border border-[#E0DDD6] rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#8A6218] bg-white">
            <option value="All">All Statuses</option>
            {["New","Needs Review","Monitor","Add to Playbook","Outside Counsel","Executive Briefing","Closed"].map((s) =>
              <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="mt-3">
          <select aria-label="Filter by category" value={cat} onChange={(e) => setCat(e.target.value)}
            className="border border-[#E0DDD6] rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#8A6218] bg-white w-full md:w-auto">
            <option value="All">All Categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <span className="ml-3 text-xs text-[#6E6E6E]">{filtered.length} of {signals.length} signals</span>
          {(search || jur !== "All" || pri !== "All" || cat !== "All" || oc !== "All" || status !== "All") && (
            <button onClick={() => { setSearch(""); setJur("All"); setPri("All"); setCat("All"); setOc("All"); setStatus("All"); }}
              className="ml-3 text-xs text-[#8A6218] font-semibold hover:underline">
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-[#E0DDD6] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#1E3651] text-white text-xs">
                <th className="text-left px-4 py-3 font-semibold">Signal</th>
                <th className="text-left px-4 py-3 font-semibold w-24">Jurisdiction</th>
                <th className="text-left px-4 py-3 font-semibold w-28">Priority</th>
                <th className="text-left px-4 py-3 font-semibold w-20">Score</th>
                <th className="text-left px-4 py-3 font-semibold w-24">OC?</th>
                <th className="text-left px-4 py-3 font-semibold w-28">Status</th>
                <th className="text-left px-4 py-3 font-semibold w-24">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-[#6E6E6E] text-sm">
                    No signals match your filters.
                  </td>
                </tr>
              )}
              {filtered.map((s, i) => (
                <tr key={s.id} className={`border-t border-[#F0EDE8] hover:bg-[#FDFBF8] transition-colors ${i % 2 === 0 ? "" : "bg-[#FAFAF8]"}`}>
                  <td className="px-4 py-3">
                    <Link href={`/signals/${s.id}`} className="block">
                      <p className="font-semibold text-[#1E3651] hover:text-[#8A6218] transition-colors leading-snug">{s.title}</p>
                      <p className="text-xs text-[#6E6E6E] mt-0.5 line-clamp-1">{s.category}</p>
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-[#F6F3EC] px-2 py-0.5 rounded font-medium">{s.jurisdiction}</span>
                  </td>
                  <td className="px-4 py-3">
                    <PriorityBadge priority={s.priorityLabel} />
                  </td>
                  <td className={`px-4 py-3 text-sm ${PRI_COLOR[s.priorityLabel]}`}>
                    {s.priorityScore}/15
                  </td>
                  <td className="px-4 py-3">
                    {s.outsideCounselNeeded
                      ? <span className="text-xs bg-[#FDF0F0] text-[#7B0000] px-2 py-0.5 rounded font-bold">Yes ⚠️</span>
                      : <span className="text-xs text-[#6E6E6E]">No</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-[#666]">{s.status}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#6E6E6E]">
                    {new Date(s.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
