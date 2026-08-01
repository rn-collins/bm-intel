import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import ContactArchitectModal from "@/components/ContactArchitectModal";

export const metadata: Metadata = {
  title: {
    default: "Burgermeister Expansion Intel",
    template: "%s | Burgermeister Expansion Intel",
  },
  description: "Burgermeister Expansion Intel tracks legal and regulatory risk signals across US, UK, Germany, and Poland for international market entry. Built by RN Collins.",
  openGraph: {
    title: "Burgermeister Expansion Intel | RN Collins",
    description: "Burgermeister Expansion Intel tracks legal and regulatory risk signals across US, UK, Germany, and Poland for international market entry. Built by RN Collins.",
    url: "https://bm-intel-ivory.vercel.app",
    siteName: "Burgermeister Expansion Intel",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Burgermeister Expansion Intel | RN Collins",
    description: "Burgermeister Expansion Intel tracks legal and regulatory risk signals across US, UK, Germany, and Poland for international market entry. Built by RN Collins.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <script defer src="/_vercel/insights/script.js"></script>
        <script defer src="/_vercel/speed-insights/script.js"></script>
        <script dangerouslySetInnerHTML={{__html: `(function(){var p=new URLSearchParams(location.search),u={};['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].forEach(function(k){if(p.get(k))u[k]=p.get(k);});if(Object.keys(u).length)sessionStorage.setItem('rn_utm',JSON.stringify(u));window._getUTM=function(){try{return JSON.parse(sessionStorage.getItem('rn_utm')||'{}')}catch(e){return{}}};window.addEventListener('load',function(){fetch('/api/track',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({event:'page_view',source:'bm-intel-ivory',referrer:document.referrer||'direct',utm:window._getUTM()})}).catch(function(){});});var ms=[25,50,75,90],fired={};window.addEventListener('scroll',function(){var h=document.body.scrollHeight-window.innerHeight;if(h<=0)return;var pct=Math.round((window.scrollY/h)*100);ms.forEach(function(m){if(pct>=m&&!fired[m]){fired[m]=1;fetch('/api/track',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({event:'scroll_depth',source:'bm-intel-ivory',depth:m+'%'})}).catch(function(){});}});},{passive:true});})()`}} />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({'@context':'https://schema.org','@graph':[{'@type':'Person','@id':'https://rn-portfolio-khaki.vercel.app/#rn-collins','name':'RN Collins','jobTitle':'AI Educator & Consultant','url':'https://rn-portfolio-khaki.vercel.app','sameAs':['https://linkedin.com/in/rn-collins']},{'@type':'WebPage','name':'Burgermeister Expansion Intel — RN Collins','url':'https://bm-intel-ivory.vercel.app','author':{'@id':'https://rn-portfolio-khaki.vercel.app/#rn-collins'}}]})}} />
      </head>
      <body className="min-h-full flex flex-col bg-[#F6F3EC] text-[#1C1B1F] antialiased">
        <Nav />
        <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8">
          {children}
        </main>
        <footer className="text-center text-xs text-[#999] py-4 border-t border-[#E0DDD6]">
          Burgermeister Expansion Intel · Built by RN Collins · Aloha AI Consulting · Not Legal Advice ·{" "}<a href="https://linkedin.com/in/rn-collins" target="_blank" rel="noopener noreferrer" className="hover:text-[#B8842A] transition-colors">linkedin.com/in/rn-collins</a>
        </footer>

      <ContactArchitectModal />
      </body>
    </html>
  );
}
