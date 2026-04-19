import { Badge } from "@/components/ui/badge"

export default function VisionDoc() {
  return (
    <div className="space-y-8 pb-12">
      <header className="space-y-2">
        <Badge variant="outline" className="rounded-none uppercase tracking-[0.2em] text-[10px] font-black border-primary text-primary px-2">
          Product Roadmap
        </Badge>
        <h1 className="text-3xl font-black tracking-tighter uppercase italic text-foreground">Clear Edge — Vision</h1>
        <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5">
          <p className="text-muted-foreground font-bold italic text-sm">
            "Always informed, always one step ahead — for every company, at any stage."
          </p>
        </div>
      </header>

      <section className="space-y-4">
        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">The Problem</div>
        <div className="space-y-4 text-sm leading-relaxed font-medium">
          <p>Running a business means making constant decisions. Which direction should your product go? Is your market growing or shrinking? What are your competitors quietly building? Are your customers happy — or already looking elsewhere?</p>
          <p>Right now, answering these questions is either expensive, manual, or both.</p>
          <p>Large companies hire analysts, subscribe to Gartner, and run quarterly research cycles — and still miss things. Startups and growing companies — the ones who need this intelligence the most — are flying mostly blind.</p>
          <div className="p-4 border-2 border-destructive/20 bg-destructive/5 font-bold uppercase tracking-tight text-destructive/80 text-xs">
            Result: Most businesses are always reacting.
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">The Solution</div>
        <div className="space-y-4 text-sm leading-relaxed font-medium">
          <p className="font-bold text-foreground underline underline-offset-4 decoration-primary decoration-2">Clear Edge is a business introspection platform.</p>
          <p>You give it your company domain. It assembles everything you need to know to move forward with confidence — not a dashboard of raw numbers, but a structured intelligence brief that directly answers the questions driving your biggest decisions.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {[
              "Product Relevance & Demand",
              "Growth Strategy Intelligence",
              "Competitor Movement Tracking",
              "Customer Sentiment & Needs"
            ].map(item => (
              <div key={item} className="flex items-center gap-3 p-3 border-2 bg-card">
                <div className="w-1.5 h-1.5 bg-primary" />
                <span className="text-[11px] font-black uppercase tracking-wider">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Technical Pillars</div>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-black uppercase tracking-tight italic">1. Product Analysis</h3>
            <p className="text-xs text-muted-foreground italic">Understand where your product stands in the market — and where it's headed.</p>
            <ul className="grid grid-cols-1 gap-1 text-[11px] font-bold uppercase tracking-wide text-muted-foreground/80">
              <li>+ Demand signal tracking</li>
              <li>+ Industry trajectory</li>
              <li>+ Trend alerts</li>
              <li>+ Forward-looking indicators</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-black uppercase tracking-tight italic">2. Growth Analysis</h3>
            <p className="text-xs text-muted-foreground italic">Know what growth strategies are working in your space — specifically for you.</p>
            <ul className="grid grid-cols-1 gap-1 text-[11px] font-bold uppercase tracking-wide text-muted-foreground/80">
              <li>+ Growth motion classification</li>
              <li>+ Channel benchmarking</li>
              <li>+ Ad intelligence</li>
              <li>+ Growth recommendations</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-black uppercase tracking-tight italic">3. Competitor Analysis</h3>
            <p className="text-xs text-muted-foreground italic">A live, structured brief on every competitor — their moves and builds.</p>
            <ul className="grid grid-cols-1 gap-1 text-[11px] font-bold uppercase tracking-wide text-muted-foreground/80">
              <li>+ Automatic competitor discovery</li>
              <li>+ Funding and growth tracking</li>
              <li>+ Product direction intelligence</li>
              <li>+ Differentiation map</li>
            </ul>
          </div>
        </div>
      </section>

      <footer className="pt-8 border-t-2">
        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4 text-center">The North Star</div>
        <p className="text-center font-bold italic text-foreground leading-relaxed">
          "A founder at a 20-person startup should have access to the same quality of market intelligence that a Fortune 500 company gets from a team of analysts."
        </p>
      </footer>
    </div>
  )
}
