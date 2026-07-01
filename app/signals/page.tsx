import type { Metadata } from "next";
import { listSignals } from "@/lib/signals";
import SignalsTable from "@/components/SignalsTable";
import Glossary from "@/components/Glossary";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "All Signals",
  description: "Browse, filter, and search all legal and regulatory signals for Burgermeister's international expansion.",
};

export default async function SignalsPage() {
  const signals = await listSignals({ limit: 200 });
  const critical = signals.filter(s => s.priorityLabel === "Critical").length;
  const high = signals.filter(s => s.priorityLabel === "High").length;
  const oc = signals.filter(s => s.outsideCounselNeeded).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1E3651]">All Signals</h1>
        <p className="text-sm text-[#666] mt-1 leading-relaxed">
          A signal is a specific legal or regulatory issue that Burgermeister&apos;s expansion team should monitor or act on.
          Each signal has been researched, sourced to primary legal authorities where possible, and scored by business impact,
          legal complexity, and urgency. <strong>{critical} Critical</strong> · <strong>{high} High</strong> · <strong>{oc} requiring outside counsel</strong> · {signals.length} total.
        </p>
      </div>

      <Glossary />

      <SignalsTable signals={signals} />
    </div>
  );
}
