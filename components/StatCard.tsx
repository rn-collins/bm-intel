interface StatCardProps {
  label: string;
  value: number | string;
  sublabel?: string;
  accent?: "red" | "orange" | "navy" | "gold" | "green";
}

const ACCENTS = {
  red:    "border-[#7B0000] bg-[#FDF0F0]",
  orange: "border-[#8B4513] bg-[#FFF8F0]",
  navy:   "border-[#1E3651] bg-white",
  gold:   "border-[#8A6218] bg-white",
  green:  "border-[#375623] bg-[#F0F7F0]",
};

const VALUE_COLORS = {
  red:    "text-[#7B0000]",
  orange: "text-[#8B4513]",
  navy:   "text-[#1E3651]",
  gold:   "text-[#8A6218]",
  green:  "text-[#375623]",
};

export default function StatCard({ label, value, sublabel, accent = "navy" }: StatCardProps) {
  return (
    <div className={`rounded-lg border-l-4 p-5 shadow-sm ${ACCENTS[accent]}`}>
      <p className="text-xs font-semibold uppercase tracking-widest text-[#666] mb-1">{label}</p>
      <p className={`text-4xl font-bold ${VALUE_COLORS[accent]}`}>{value}</p>
      {sublabel && <p className="text-xs text-[#6E6E6E] mt-1">{sublabel}</p>}
    </div>
  );
}
