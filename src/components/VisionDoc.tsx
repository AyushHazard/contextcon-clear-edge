export default function VisionDoc() {
  return (
    <>
      <h1 className="text-2xl font-bold text-white">Clear Edge — Product Vision</h1>

      <blockquote className="border-l-4 border-indigo-500 pl-4 italic text-gray-300">
        Always informed, always one step ahead — for every company, at any stage.
      </blockquote>

      <h2 className="text-base font-semibold text-indigo-400 border-b border-gray-800 pb-1 mt-4">The Problem</h2>
      <p>Running a business means making constant decisions. Which direction should your product go? Is your market growing or shrinking? What are your competitors quietly building? Are your customers happy — or already looking elsewhere?</p>
      <p>Right now, answering these questions is either expensive, manual, or both.</p>
      <p>Large companies hire analysts, subscribe to Gartner, and run quarterly research cycles — and still miss things. Startups and growing companies — the ones who need this intelligence the most — are flying mostly blind. They're making critical decisions on gut feel, stale data, or a few hours of frantic Googling before a board meeting.</p>
      <p>The tools that exist today solve narrow slices. One tracks competitors. Another tracks SEO. Another tracks reviews. But no single product assembles the full picture — and none of them tell you what to <em>do</em> with it. Companies end up stitching together 5–6 tools, paying enterprise prices, and still lacking the synthesis that turns data into a decision.</p>
      <p><strong className="text-white">The result:</strong> Most businesses are always reacting. They find out a competitor launched a new feature when a customer mentions it. They realise their market is shifting when growth stalls. They discover what their customers actually need when it's already too late to act.</p>

      <h2 className="text-base font-semibold text-indigo-400 border-b border-gray-800 pb-1 mt-4">The Solution</h2>
      <p><strong className="text-white">Clear Edge is a business introspection platform.</strong></p>
      <p>You give it your company domain. It assembles everything you need to know to move forward with confidence — not a dashboard of raw numbers, but a structured intelligence brief that directly answers the questions driving your biggest decisions.</p>
      <p>The brief covers four areas every business leader is always asking about:</p>
      <ul className="list-disc list-outside pl-5 space-y-1">
        <li>Is my product still relevant and in demand?</li>
        <li>What growth strategies are actually working in my space?</li>
        <li>What are my competitors doing and how do I stack up?</li>
        <li>Who are my customers really, and what do they need?</li>
      </ul>
      <p>Clear Edge monitors your market continuously and keeps your brief up to date — so you're never caught off guard by a competitor move, a market shift, or a change in customer sentiment.</p>

      <h2 className="text-base font-semibold text-indigo-400 border-b border-gray-800 pb-1 mt-4">Features</h2>

      <h3 className="text-sm font-semibold text-gray-200 mt-3">1. Product Analysis</h3>
      <p className="text-gray-500 text-xs italic">Understand where your product stands in the market — and where it's headed.</p>
      <ul className="list-disc list-outside pl-5 space-y-1">
        <li>Demand signal tracking — is search and market interest in your category growing, flat, or declining?</li>
        <li>Industry trajectory — are new companies entering your space, and where is investment flowing?</li>
        <li>Trend alerts — regulatory changes, technology shifts, or news developments that could affect your product's relevance</li>
        <li>Forward-looking indicators — leading signals (funding activity, hiring trends, new entrant velocity) that show where the market is going before it gets there</li>
      </ul>

      <h3 className="text-sm font-semibold text-gray-200 mt-3">2. Growth Analysis</h3>
      <p className="text-gray-500 text-xs italic">Know what growth strategies are working in your space — not generically, but for companies like yours.</p>
      <ul className="list-disc list-outside pl-5 space-y-1">
        <li>Growth motion classification — for each competitor, Clear Edge infers their primary growth strategy (content-led, paid, outbound sales, product-led, community) from observable signals</li>
        <li>Channel benchmarking — which acquisition channels are driving the fastest-growing companies in your niche</li>
        <li>Ad intelligence — what competitors are actively running in paid channels, and what messaging and angles they're betting on</li>
        <li>Growth recommendations — based on your stage, niche, and what's working for comparable companies, Clear Edge recommends the highest-leverage channel to focus on</li>
      </ul>

      <h3 className="text-sm font-semibold text-gray-200 mt-3">3. Competitor Analysis</h3>
      <p className="text-gray-500 text-xs italic">A live, structured brief on every competitor — who they are, how they're moving, and what they're building next.</p>
      <ul className="list-disc list-outside pl-5 space-y-1">
        <li>Automatic competitor discovery — Clear Edge identifies your full competitive landscape from your domain alone</li>
        <li>Funding and growth tracking — total raised, last round, investor tier, headcount growth, revenue estimates, web traffic trends</li>
        <li>Product direction intelligence — what competitors are building next, inferred from their hiring patterns and recent news</li>
        <li>Differentiation map — a clear breakdown of what each competitor does that you don't, what you do that they don't, and where you directly overlap</li>
        <li>Velocity scoring — how fast each competitor is moving across product, hiring, and market presence</li>
      </ul>

      <h3 className="text-sm font-semibold text-gray-200 mt-3">4. Customer Understanding</h3>
      <p className="text-gray-500 text-xs italic">Know your customer better than they know themselves — their sentiment, their needs, and how to reach them.</p>
      <ul className="list-disc list-outside pl-5 space-y-1">
        <li>Sentiment tracking — how customers feel about your product and your competitors' products, aggregated from reviews, community posts, and social mentions</li>
        <li>Unmet needs mapping — recurring complaints and feature requests across your category, surfaced from public reviews and community discussions</li>
        <li>Buyer persona — a synthesised profile of who your customer actually is: their role, company stage, core frustrations, what they celebrate, and how they make buying decisions</li>
        <li>Channel intelligence — where your audience actually spends time and which channels are most effective for reaching them</li>
        <li>Reaction modelling — given the synthesised persona, how would your customers likely react to specific changes: a price increase, a new enterprise tier, a major feature addition, or a product pivot</li>
      </ul>

      <h2 className="text-base font-semibold text-indigo-400 border-b border-gray-800 pb-1 mt-4">Technical Overview</h2>

      <h3 className="text-sm font-semibold text-gray-200 mt-3">The Core Approach</h3>
      <p>Clear Edge works by assembling and interpreting signals that already exist publicly — data that's always been available but never been connected and synthesised in one place. The platform has two layers: a <strong className="text-white">data layer</strong> that collects structured signals from multiple sources, and an <strong className="text-white">intelligence layer</strong> where AI interprets those signals into actionable answers.</p>

      <h3 className="text-sm font-semibold text-gray-200 mt-3">Data Sources</h3>
      <p><strong className="text-white">Crustdata API — the primary structured data backbone</strong></p>
      <p>Crustdata provides the richest structured company data Clear Edge uses. A single domain input triggers enrichment that returns: headcount and growth metrics, funding history and investor data, hiring signals, web traffic, SEO and ad spend, follower growth, revenue estimates, and a mapped list of competitors.</p>
      <p><strong className="text-white">External data sources — filling the gaps Crustdata doesn't cover</strong></p>
      <ul className="list-disc list-outside pl-5 space-y-1">
        <li><em>Google Trends</em> — search demand trends for product category keywords</li>
        <li><em>News APIs</em> — recent developments, regulatory changes, and industry news</li>
        <li><em>Meta Ad Library</em> — active competitor ads, revealing which paid channels and messaging angles are working</li>
        <li><em>G2 / Capterra</em> — customer review text, star rating trends, and switcher reviews</li>
        <li><em>Reddit / HN / community forums</em> — unfiltered customer sentiment, feature requests, and organic product recommendations</li>
        <li><em>Competitor websites and job boards</em> — homepage positioning, product changelogs, and full job descriptions</li>
      </ul>

      <h3 className="text-sm font-semibold text-gray-200 mt-3">The Intelligence Layer</h3>
      <p>Raw data alone doesn't answer business questions — interpretation does. After the data layer assembles the signals, AI synthesises them into structured answers across all four pillars. This is where the real value is created: inferring growth strategy from hiring patterns, building a buyer persona from aggregated review language, flagging a competitor's product direction from their engineering hires, or modelling how a customer segment would react to a pricing change.</p>

      <h3 className="text-sm font-semibold text-gray-200 mt-3">Continuous Monitoring</h3>
      <p>Clear Edge isn't a one-time report. The platform monitors signals continuously and surfaces changes as they happen — a competitor raises a round, hiring activity spikes in a new function, sentiment shifts in a product category, a new entrant starts growing fast.</p>

      <h2 className="text-base font-semibold text-indigo-400 border-b border-gray-800 pb-1 mt-4">Why Now</h2>
      <ol className="list-decimal list-outside pl-5 space-y-2">
        <li><strong className="text-white">Data availability.</strong> More company and market intelligence is publicly accessible than ever — hiring data, web traffic, funding databases, review platforms, ad libraries, community discussions.</li>
        <li><strong className="text-white">AI synthesis.</strong> Large language models can now read disparate signals, connect them, and produce coherent, actionable intelligence — turning a collection of data points into a clear answer to a real business question.</li>
        <li><strong className="text-white">Underserved market.</strong> The tools that do this well today cost $15,000–$50,000 per year and are built for enterprise teams with dedicated analysts. Every startup, scale-up, and mid-market company below that tier has no good option. That's the gap Clear Edge fills.</li>
      </ol>

      <h2 className="text-base font-semibold text-indigo-400 border-b border-gray-800 pb-1 mt-4">The North Star</h2>
      <p>A founder at a 20-person startup should have access to the same quality of market and competitive intelligence that a Fortune 500 company gets from a team of analysts — delivered automatically, kept current, and translated directly into decisions.</p>
      <p>That's what Clear Edge is building toward.</p>
    </>
  )
}
