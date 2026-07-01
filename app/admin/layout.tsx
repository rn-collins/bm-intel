import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Signal",
  description: "Log a new legal or regulatory signal for Burgermeister's expansion intelligence dashboard.",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
