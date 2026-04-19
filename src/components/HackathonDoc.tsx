export default function HackathonDoc() {
  return (
    <>
      <h1 className="text-2xl font-bold text-white">Clear Edge — Hackathon PRD</h1>
      <p className="text-zinc-500 text-xs">Scope: 2-hour build | Crustdata API only</p>

      <h2 className="text-base font-semibold text-zinc-300 border-b border-zinc-800 pb-1 mt-4">What We're Building</h2>
      <p>A single-input intelligence tool. You enter a company domain. Clear Edge returns a structured, AI-generated brief covering your competitive landscape, growth position, and market standing — all sourced live from Crustdata.</p>
      <blockquote className="border-l-4 border-indigo-500 pl-4 italic text-zinc-300">
        "You're a founder. You type your domain. In seconds you know exactly who your competitors are, how fast they're growing, how much they've raised, what they're hiring for, and how you stack up — without opening a single browser tab."
      </blockquote>

      <h2 className="text-base font-semibold text-zinc-300 border-b border-zinc-800 pb-1 mt-4">Scope Decision</h2>
      <p>Out of the four pillars, we're building <strong className="text-white">two</strong> for the hackathon:</p>
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr>
              <th className="border border-zinc-700 bg-zinc-800 text-zinc-200 font-semibold px-3 py-2 text-left">Pillar</th>
              <th className="border border-zinc-700 bg-zinc-800 text-zinc-200 font-semibold px-3 py-2 text-left">In Scope?</th>
              <th className="border border-zinc-700 bg-zinc-800 text-zinc-200 font-semibold px-3 py-2 text-left">Reason</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-zinc-900">
              <td className="border border-zinc-700 text-zinc-300 px-3 py-2">Competitor Analysis</td>
              <td className="border border-zinc-700 text-green-400 px-3 py-2">✅ Yes — full focus</td>
              <td className="border border-zinc-700 text-zinc-300 px-3 py-2">Crustdata covers ~80% natively. Most demo-able. Clearest value.</td>
            </tr>
            <tr className="bg-zinc-800/40">
              <td className="border border-zinc-700 text-zinc-300 px-3 py-2">Growth Analysis</td>
              <td className="border border-zinc-700 text-green-400 px-3 py-2">✅ Yes — hiring signal only</td>
              <td className="border border-zinc-700 text-zinc-300 px-3 py-2">Hiring titles + role distribution is pure Crustdata and adds a sharp growth strategy inference story.</td>
            </tr>
            <tr className="bg-zinc-900">
              <td className="border border-zinc-700 text-zinc-300 px-3 py-2">Product Analysis</td>
              <td className="border border-zinc-700 text-red-400 px-3 py-2">❌ No</td>
              <td className="border border-zinc-700 text-zinc-300 px-3 py-2">Requires Google Trends + News API for the compelling signals.</td>
            </tr>
            <tr className="bg-zinc-800/40">
              <td className="border border-zinc-700 text-zinc-300 px-3 py-2">Customer Understanding</td>
              <td className="border border-zinc-700 text-red-400 px-3 py-2">❌ No</td>
              <td className="border border-zinc-700 text-zinc-300 px-3 py-2">Requires G2/Reddit scraping — no good Crustdata substitute.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-base font-semibold text-zinc-300 border-b border-zinc-800 pb-1 mt-4">The User Flow</h2>
      <ol className="list-decimal list-outside pl-5 space-y-2">
        <li>User lands on Clear Edge — if no domain stored, show onboarding input screen. If domain already stored, skip straight to their existing brief.</li>
        <li><em>(Onboarding only)</em> User enters their company domain (e.g. <code className="bg-zinc-800 text-indigo-300 text-xs rounded px-1">retool.com</code>) — domain is saved to localStorage immediately.</li>
        <li><em>(Onboarding only)</em> User clicks "Analyse".</li>
        <li>Clear Edge: enriches their company → finds candidates by taxonomy → verifies direct competitors via Gemini → batch enriches confirmed competitors → runs landscape + growth analyses → synthesises summaries.</li>
        <li>User reads their brief across two tabs: <strong className="text-white">Competitor Landscape</strong> and <strong className="text-white">Growth Intelligence</strong>.</li>
      </ol>

      <h3 className="text-sm font-semibold text-zinc-200 mt-3">Persistence &amp; Refresh Behaviour</h3>
      <ul className="list-disc list-outside pl-5 space-y-1">
        <li>Domain and brief results are stored in <strong className="text-white">localStorage</strong> (frontend only, no backend persistence)</li>
        <li>Refreshing the page does not clear results — the stored brief is reloaded instantly</li>
        <li>The only way to trigger a new analysis is the <strong className="text-white">"Refresh Results"</strong> button on the brief screen</li>
      </ul>

      <h2 className="text-base font-semibold text-zinc-300 border-b border-zinc-800 pb-1 mt-4">Pages &amp; Screens</h2>

      <h3 className="text-sm font-semibold text-zinc-200 mt-3">Screen 1 — Onboarding / Input</h3>
      <ul className="list-disc list-outside pl-5 space-y-1">
        <li>Product name + one-line description</li>
        <li>Single domain input field</li>
        <li>"Analyse" button</li>
        <li>Shown once — after analysis completes, users go directly to the brief on all future visits</li>
      </ul>

      <h3 className="text-sm font-semibold text-zinc-200 mt-3">Screen 2 — Loading State</h3>
      <ul className="list-disc list-outside pl-5 space-y-1">
        <li>Progress indicator with live status messages pulled from the server pipeline</li>
        <li>Keeps the user engaged during the ~30–60 second API sequence</li>
      </ul>

      <h3 className="text-sm font-semibold text-zinc-200 mt-3">Screen 3 — The Brief</h3>
      <p>The core output. Persists across page refreshes — loaded from localStorage on return visits.</p>
      <p><strong className="text-white">Competitor Landscape tab:</strong> Overall narrative, market dynamics, biggest threat, opportunity gap, and up to 5 competitor cards each showing funding, headcount, revenue, threat level, differentiator, and overlap.</p>
      <p><strong className="text-white">Growth Intelligence tab:</strong> Dominant motion in space, channel benchmarks, ad landscape overview, per-competitor growth rows with channel breakdown tags, and an overall growth recommendation.</p>

      <h2 className="text-base font-semibold text-zinc-300 border-b border-zinc-800 pb-1 mt-4">What We're NOT Building</h2>
      <ul className="list-disc list-outside pl-5 space-y-1">
        <li>User accounts, auth, or server-side saved briefs</li>
        <li>Product Analysis pillar (needs Google Trends + News API)</li>
        <li>Customer Understanding pillar (needs G2/Reddit)</li>
        <li>Historical tracking or trend charts</li>
        <li>Email alerts or notifications</li>
        <li>Mobile optimisation</li>
      </ul>

      <h2 className="text-base font-semibold text-zinc-300 border-b border-zinc-800 pb-1 mt-4">Demo Script</h2>
      <ol className="list-decimal list-outside pl-5 space-y-2">
        <li>Open Clear Edge.</li>
        <li>Type a real, recognisable company domain (e.g. <code className="bg-zinc-800 text-indigo-300 text-xs rounded px-1">notion.so</code> or <code className="bg-zinc-800 text-indigo-300 text-xs rounded px-1">linear.app</code>).</li>
        <li>Hit Analyse — talk through the loading states while it runs.</li>
        <li>Walk through the Competitor Landscape: <em>"Look — it found their top competitors, pulled funding, headcount growth, revenue estimates — all in under a minute from a single domain."</em></li>
        <li>Walk through Growth Intelligence: <em>"Here it's inferred growth motions from hiring patterns and Crustdata signals — and here's the recommendation for what the user should focus on."</em></li>
        <li>Close with the vision: <em>"This is just two of four pillars. The full product adds product demand analysis and customer persona intelligence — giving any company a complete strategic brief, updated continuously."</em></li>
      </ol>

      <h2 className="text-base font-semibold text-zinc-300 border-b border-zinc-800 pb-1 mt-4">Success Criteria</h2>
      <ul className="list-disc list-outside pl-5 space-y-1">
        <li>Single domain input returns a full brief</li>
        <li>At least 3 competitors identified and analysed</li>
        <li>Each competitor card has funding, headcount, and threat level</li>
        <li>Growth motion is classified for each competitor with a reason</li>
        <li>Summaries read like an analyst wrote them — not like a data dump</li>
        <li>The UI is clean enough that the data is the hero, not the design</li>
      </ul>
    </>
  )
}
