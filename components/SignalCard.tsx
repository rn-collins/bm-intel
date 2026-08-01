import type { Signal } from "@/lib/types";
import PriorityBadge from "./PriorityBadge";
import Link from "next/link";

export default function SignalCard({ signal }: { signal: Signal }) {
  return (
    <Link href={`/signals/${signal.id}`} className="block group">
      <div className="bg-white rounded-lg border border-[#E0DDD6] p-4 hover:border-[#B8842A] hover:shadow-sm transition-all">
        <div className="flex items-start justify-between gap-3 mb-2">
          <p className="text-sm font-semibold text-[#1E3651] group-hover:text-[#B8842A] transition-colors leading-snug">
            {signal.title}
          </p>
          <PriorityBadge priority={signal.priorityLabel} />
        </div>
        <p className="text-xs text-[#666] line-clamp-2 mb-3">{signal.summary}</p>
        <div className="flex items-center gap-3 text-[10px] text-[#888] font-medium">
          <span className="bg-[#F6F3EC] px-2 py-0.5 rounded">{signal.jurisdiction}</span>
          <span className="bg-[#F6F3EC] px-2 py-0.5 rounded truncate max-w-[160px]">{signal.category}</span>
          {signal.outsideCounselNeeded && (
            <span className="bg-[#FDF0F0] text-[#7B0000] px-2 py-0.5 rounded">OC needed</span>
          )}
          <span className="ml-auto">
            {new Date(signal.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
          </span>
        </div>
      </div>
    </Link>
  );
}
