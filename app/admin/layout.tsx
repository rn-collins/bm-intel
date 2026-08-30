import type { Metadata } from "next";

const ADMIN_DESC =
  "The operator workspace where signals are entered, scored and moved through review. Access is key-gated; all of the published analysis itself is public.";

export const metadata: Metadata = {
  title: "Operator Workspace",
  description: ADMIN_DESC,
  alternates: { canonical: "/admin" },
  openGraph: {
    title: "Operator Workspace | Burgermeister Expansion Intel",
    description: ADMIN_DESC,
    url: "/admin",
    type: "website",
    images: [{
      url: "/og/admin.png",
      width: 1200,
      height: 630,
      alt: "Operator workspace — the editorial side of the tracker.",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Operator Workspace | Burgermeister Expansion Intel",
    description: ADMIN_DESC,
    images: ["/og/admin.png"],
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
