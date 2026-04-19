import { Badge } from "@/components/ui/badge"

export default function HackathonDoc() {
  return (
    <div className="space-y-8 pb-12">
      <header className="space-y-2">
        <Badge variant="outline" className="rounded-none uppercase tracking-[0.2em] text-[10px] font-black border-primary text-primary px-2">
          Hackathon Scope
        </Badge>
        <h1 className="text-3xl font-black tracking-tighter uppercase italic text-foreground">Clear Edge — Hack PRD</h1>
        <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
           <span>2-Hour Build Cycle</span>
           <div className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
           <span>Crustdata API v1.0</span>
        </div>
      </header>

      <section className="space-y-4">
        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Objective</div>
        <div className="space-y-4 text-sm leading-relaxed font-medium">
          <p>A single-input intelligence tool. Enter a company domain. Return a structured brief covering competitive landscape and growth position — sourced live from Crustdata.</p>
          <div className="p-4 border-2 border-primary/20 bg-primary/5 font-bold italic text-foreground/80 text-xs">
            "Know your market in seconds — without opening a single browser tab."
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">In Scope Pillars</div>
        <div className="grid grid-cols-1 gap-2">
          {[
            { pillar: "Competitor Analysis", status: "YES", color: "text-primary", reason: "Crustdata covers 80% natively." },
            { pillar: "Growth Analysis", status: "YES", color: "text-primary", reason: "Hiring signals + role distribution." },
            { pillar: "Product Analysis", status: "NO", color: "text-muted-foreground/40", reason: "Requires external news/trends APIs." },
            { pillar: "Customer Understanding", status: "NO", color: "text-muted-foreground/40", reason: "Requires G2/Reddit scraping." }
          ].map(item => (
            <div key={item.pillar} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-2 bg-card gap-2">
               <div className="flex items-center gap-3">
                 <div className={`w-2 h-2 ${item.status === 'YES' ? 'bg-primary' : 'bg-muted-foreground/20'}`} />
                 <span className={`text-[11px] font-black uppercase tracking-wider ${item.color}`}>{item.pillar}</span>
               </div>
               <div className="text-[10px] font-medium text-muted-foreground italic">{item.reason}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">The Flow</div>
        <ol className="grid grid-cols-1 gap-4">
          {[
             "Domain input & localStorage persistence",
             "Crustdata enrichment & taxonomy matching",
             "Gemini-powered competitor verification",
             "Landscape synthesis & growth inference",
             "Tabbed intelligence output"
          ].map((step, i) => (
            <li key={i} className="flex gap-4 items-start">
               <span className="text-xl font-black italic tracking-tighter text-primary/30 leading-none">{i+1}</span>
               <span className="text-[11px] font-black uppercase tracking-widest pt-1">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <footer className="pt-8 border-t-2">
        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4 text-center">Success Criteria</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
           {[
             "Live API Link",
             "3+ Competitors",
             "Analyst Summaries",
             "GTM Inference",
             "Clean Shadcn UI",
             "Fast Response"
           ].map(item => (
             <div key={item} className="p-2 border border-border bg-muted/20 text-[9px] font-black uppercase tracking-widest text-center">
               {item}
             </div>
           ))}
        </div>
      </footer>
    </div>
  )
}
