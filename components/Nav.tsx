"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/",        label: "Overview"   },
  { href: "/signals", label: "Signals"    },
  { href: "/sources", label: "Sources"    },
  { href: "/admin",   label: "Add Signal" },
];

export default function Nav() {
  const path = usePathname();

  function handleContact() {
    const el = document.getElementById("ca-modal-bm");
    if (el) el.style.display = "flex";
  }

  return (
    <>
      <div className="w-full bg-[#1E3651] text-white text-center text-xs py-2 px-4 font-medium tracking-wide">
        ⚖️ Not legal advice — issue-spotting and regulatory intelligence only · Items marked &quot;Outside Counsel: Yes&quot; require attorney confirmation before action
      </div>
      <nav aria-label="Main navigation" className="w-full bg-white border-b border-[#E0DDD6] px-6 py-0 flex items-center justify-between">
        <div className="flex items-center gap-2 py-3">
          <span className="text-[#1E3651] font-bold text-base tracking-tight">Burgermeister</span>
          <span className="text-[#B8842A] font-bold text-base tracking-tight">Expansion Intel</span>
        </div>
        <div className="flex items-center gap-1">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                path === n.href
                  ? "border-[#B8842A] text-[#1E3651]"
                  : "border-transparent text-[#666] hover:text-[#1E3651]"
              }`}>
              {n.label}
            </Link>
          ))}
          <button
            onClick={handleContact}
            title="Contact the Architect"
            className="ml-3 px-4 py-1.5 rounded-full text-xs font-bold transition-all border bg-[#F6F3EC] text-[#1E3651] border-[#E0DDD6] hover:bg-[#B8842A] hover:text-white hover:border-[#B8842A]">
            Contact the Architect
          </button>
        </div>
      </nav>
    </>
  );
}
