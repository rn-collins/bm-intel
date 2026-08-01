import type { Priority } from "@/lib/types";

const CONFIG: Record<Priority, { bg: string; text: string; label: string }> = {
  Critical: { bg: "bg-[#FDF0F0]", text: "text-[#7B0000]", label: "🔴 Critical"  },
  High:     { bg: "bg-[#FFF8F0]", text: "text-[#8B4513]", label: "🟠 High"      },
  Medium:   { bg: "bg-[#F0F4FB]", text: "text-[#2F5496]", label: "🟡 Medium"    },
  Low:      { bg: "bg-[#F0F7F0]", text: "text-[#375623]", label: "🟢 Low"       },
};

export default function PriorityBadge({ priority }: { priority: Priority }) {
  const c = CONFIG[priority];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
}
