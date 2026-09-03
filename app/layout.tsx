import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import ContactArchitectModal from "@/components/ContactArchitectModal";

// Vercel appended "-ivory" because the plain name was taken: bm-intel.vercel.app
// is a DIFFERENT deployment. Every absolute URL below must keep the -ivory host.
export const SITE_URL = "https://bm-intel-ivory.vercel.app";

const DESCRIPTION =
  "Independent tracking of legal and regulatory risk signals across the US, UK, Germany and Poland for international market entry, scored by severity and sourced to official guidance. Published under RN Collins' own byline.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Burgermeister Expansion Intel",
    template: "%s | Burgermeister Expansion Intel",
  },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "Burgermeister Expansion Intel",
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "Burgermeister Expansion Intel",
    type: "website",
    images: [{
      url: "/og/index.png",
      width: 1200,
      height: 630,
      alt: "Burgermeister Expansion Intel — legal and regulatory risk across four markets, with a severity ladder.",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Burgermeister Expansion Intel",
    description: DESCRIPTION,
    images: ["/og/index.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inconsolata:wght@400;500;600&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
        />
        <script defer src="/_vercel/insights/script.js"></script>
        <script defer src="/_vercel/speed-insights/script.js"></script>
        <script dangerouslySetInnerHTML={{__html: `(function(){var p=new URLSearchParams(location.search),u={};['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].forEach(function(k){if(p.get(k))u[k]=p.get(k);});if(Object.keys(u).length)sessionStorage.setItem('rn_utm',JSON.stringify(u));window._getUTM=function(){try{return JSON.parse(sessionStorage.getItem('rn_utm')||'{}')}catch(e){return{}}};window.addEventListener('load',function(){fetch('/api/track',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({event:'page_view',source:'bm-intel-ivory',referrer:document.referrer||'direct',utm:window._getUTM()})}).catch(function(){});});var ms=[25,50,75,90],fired={};window.addEventListener('scroll',function(){var h=document.body.scrollHeight-window.innerHeight;if(h<=0)return;var pct=Math.round((window.scrollY/h)*100);ms.forEach(function(m){if(pct>=m&&!fired[m]){fired[m]=1;fetch('/api/track',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({event:'scroll_depth',source:'bm-intel-ivory',depth:m+'%'})}).catch(function(){});}});},{passive:true});})()`}} />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({'@context':'https://schema.org','@graph':[{'@type':'Person','@id':'https://rn-portfolio-khaki.vercel.app/#rn-collins','name':'RN Collins','jobTitle':'AI Educator & Consultant','url':'https://rn-portfolio-khaki.vercel.app','sameAs':['https://linkedin.com/in/rn-collins']},{'@type':'WebPage','name':'Burgermeister Expansion Intel — RN Collins','url':'https://bm-intel-ivory.vercel.app','author':{'@id':'https://rn-portfolio-khaki.vercel.app/#rn-collins'}}]})}} />
      </head>
      <body className="min-h-full flex flex-col bg-[#FCFCFB] text-[#17181B] antialiased">
        <Nav />
        <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8">
          {children}
        </main>
        <footer className="text-center text-xs text-[#999] py-4 border-t border-[#E0DDD6]">
          Burgermeister Expansion Intel · Not Legal Advice · Built by{" "}<a href="https://aloha-ai-consulting.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:text-[#B8842A] transition-colors">Aloha AI</a>. Explore all AI tools and projects at{" "}<a href="https://rn-portfolio-khaki.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:text-[#B8842A] transition-colors">RN Builds</a>.
        </footer>

      <ContactArchitectModal />
      </body>
    </html>
  );
}
