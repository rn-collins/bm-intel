import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <p className="text-6xl font-bold text-[#E0DDD6] mb-4">404</p>
      <h1 className="text-xl font-bold text-[#1E3651] mb-2">Page not found</h1>
      <p className="text-sm text-[#666] mb-8">This signal or page doesn&apos;t exist.</p>
      <Link href="/" className="bg-[#1E3651] text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-[#B8842A] transition-colors">
        Back to Overview
      </Link>
    </div>
  );
}
