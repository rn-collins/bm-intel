import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: {
    default: "Burgermeister Expansion Intel",
    template: "%s | Burgermeister Expansion Intel",
  },
  description: "Legal and regulatory intelligence for Burgermeister international expansion. Not legal advice.",
  openGraph: {
    title: "Burgermeister Expansion Intel",
    description: "Legal and regulatory intelligence for Burgermeister international expansion. Not legal advice.",
    url: "https://bm-intel-ivory.vercel.app",
    siteName: "Burgermeister Expansion Intel",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Burgermeister Expansion Intel",
    description: "Legal and regulatory intelligence for Burgermeister international expansion. Not legal advice.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-[#F6F3EC] text-[#1C1B1F] antialiased">
        <Nav />
        <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8">
          {children}
        </main>
        <footer className="text-center text-xs text-[#999] py-4 border-t border-[#E0DDD6]">
          Burgermeister Expansion Intel · Built by RN Collins · Aloha AI Consulting · Not Legal Advice ·{" "}<a href="mailto:collins.ra@northeastern.edu" className="hover:text-[#B8842A] transition-colors">collins.ra@northeastern.edu</a>{" "}·{" "}<a href="https://linkedin.com/in/rn-collins" target="_blank" rel="noopener noreferrer" className="hover:text-[#B8842A] transition-colors">linkedin.com/in/rn-collins</a>
        </footer>
      </body>
    </html>
  );
}
