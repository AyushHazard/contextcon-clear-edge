# Clear Edge — Hackathon PRD
### Scope: 2-hour build | Crustdata API only

---

## What We're Building

A single-input intelligence tool. You enter a company domain. Clear Edge returns a structured, AI-generated brief covering your competitive landscape, growth position, and market standing — all sourced live from Crustdata.

The demo story in one sentence:
> *"You're a founder. You type your domain. In seconds you know exactly who your competitors are, how fast they're growing, how much they've raised, what they're hiring for, and how you stack up — without opening a single browser tab."*

---

## Scope Decision

Out of the four pillars, we're building **two** for the hackathon:

| Pillar | In Scope? | Reason |
|---|---|---|
| Competitor Analysis | ✅ Yes — full focus | Crustdata covers ~80% natively. Most demo-able. Clearest value. |
| Growth Analysis | ✅ Yes — hiring signal only | `hiring.recent_titles_csv` + `headcount.by_role_percent` is pure Crustdata and adds a sharp "growth strategy inference" story |
| Product Analysis | ❌ No | Requires Google Trends + News API for the compelling signals |
| Customer Understanding | ❌ No | Requires G2/Reddit scraping — no good Crustdata substitute |

Within those two pillars, we're only using fields that come directly from Crustdata — no external API calls.

---

## The User Flow

```
1. User lands on Clear Edge
   — If no domain stored: show onboarding input screen (one-time)
   — If domain already stored: skip straight to their existing brief
2. [Onboarding only] User enters their company domain (e.g. retool.com)
   — Domain is saved to localStorage immediately
3. [Onboarding only] User clicks "Analyse"
4. Clear Edge:
   a. Enriches their company → gets competitors list
   b. Batch enriches all competitors
   c. Feeds everything into Claude
   d. Returns a structured intelligence brief
   — Brief is saved to localStorage
5. User reads their brief across two sections:
   — Competitor Landscape
   — Growth Intelligence
```

Total time from input to brief: under 15 seconds.

### Persistence & Refresh Behaviour

- Domain and brief results are stored in **localStorage** (frontend only, no backend persistence for now)
- **Refreshing the page does not clear results** — the stored brief is reloaded instantly
- The only way to trigger a new analysis is the **"Refresh Results"** button on the brief screen
- "Refresh Results" clears the stored brief, re-runs the full analysis pipeline, and saves the new results

---

## Pages & Screens

### Screen 1 — Onboarding / Input (first visit only)
- Product name + one-line description
- Single domain input field
- "Analyse" button
- (Optional) 2–3 example companies to demo with one click
- Shown **once** — after analysis completes, users go directly to Screen 3 on all future visits

### Screen 2 — Loading State
- Progress indicator with live status messages:
  - "Identifying your company..."
  - "Finding your competitors..."
  - "Analysing growth signals..."
  - "Generating your brief..."
- Keeps the user engaged during the ~10 second API sequence

### Screen 3 — The Brief
The core output. Persists across page refreshes — loaded from localStorage on return visits.

Actions available:
- **"Refresh Results"** — clears stored brief, re-runs full analysis pipeline
- Domain is displayed but not editable here (domain change would require a new onboarding)

Split into two sections:

**Section A: Competitor Landscape**
For each competitor (up to 5), display a card showing:
- Company name + description
- Total funding raised + last round type + last round date
- Headcount + headcount growth %
- Estimated revenue range
- Web traffic (monthly visitors)
- Investor highlights (top 2–3 names)
- A one-paragraph AI summary: *"Here's what makes them a threat / what they're focused on / how they compare to you"*

Plus an overall AI-written paragraph at the top:
*"Here is your competitive landscape — who your real competitors are, how the space is funded, and where the pressure is coming from."*

**Section B: Growth Intelligence**
For each competitor, infer their growth strategy from Crustdata signals and display:
- Primary growth motion (e.g. "Sales-led", "Content-led", "Product-led") — AI inferred from hiring titles + role distribution
- SEO spend signal (high / medium / low — from `seo.monthly_google_ads_budget`)
- Organic traffic signal (from `seo.monthly_organic_clicks`)
- Follower growth momentum (from `followers.yoy_percent`)
- Open roles count + growth % — "actively scaling" indicator

Plus an AI-written recommendation at the bottom:
*"Based on what's working for companies in your space, here's the growth motion most worth investing in right now — and why."*

---

## Crustdata Reference

API docs: https://docs.crustdata.com/company-docs/quickstart

---

## Data Used (Crustdata Only)

### From Enrich — your company
- `competitors.company_ids` and `competitors.websites` → seeds the whole analysis

### From Batch Enrich — each competitor
| Field | Used In |
|---|---|
| `basic_info.name + description` | Competitor card |
| `funding.total_investment_usd` | Competitor card |
| `funding.last_round_type + last_round_amount_usd + last_fundraise_date` | Competitor card |
| `funding.investors` | Competitor card |
| `headcount.total + headcount.growth_percent` | Competitor card + growth signal |
| `headcount.by_role_percent` | Growth motion inference |
| `revenue.estimated` | Competitor card |
| `web_traffic.monthly_visitors` | Competitor card |
| `hiring.recent_titles_csv + openings_count + openings_growth_percent` | Growth motion inference |
| `seo.monthly_google_ads_budget + monthly_organic_clicks` | Growth channel signal |
| `followers.yoy_percent + count` | Growth momentum signal |
| `taxonomy.categories` | Context for Claude synthesis |
| `news` (top 3 articles) | Context for Claude synthesis |

---

## What Claude Does

Claude receives the full enriched data for the user's company + all competitors and is asked to produce:

1. **Competitive landscape summary** — a 3–4 sentence overview of the space
2. **Per-competitor threat summary** — 2–3 sentences per competitor on what makes them relevant and how they differ
3. **Growth motion classification** — for each competitor, classify as: Sales-led / Content-led / Paid-led / Product-led / Community-led, with a one-line reason
4. **Growth recommendation** — 3–4 sentences on what growth strategy the user should prioritise based on what's working in their space

Claude does not invent data — it only interprets what Crustdata returned.

---

## What We're NOT Building

To stay within 2 hours, the following are explicitly out of scope:

- User accounts, auth, or saved briefs
- Product Analysis pillar (needs external APIs)
- Customer Understanding pillar (needs G2/Reddit)
- Historical tracking or trend charts
- Email alerts or notifications
- Mobile optimisation
- Any data source other than Crustdata

---

## Demo Script (for the presentation)

1. Open Clear Edge
2. Type a real, recognisable company domain (e.g. `notion.so` or `linear.app`)
3. Hit Analyse — talk through the loading states while it runs
4. Walk through the Competitor Landscape: *"Look — it found their top 5 competitors, pulled funding, headcount growth, revenue estimates — all in under 15 seconds from a single domain"*
5. Walk through Growth Intelligence: *"And here it's inferred that two of their competitors are running a sales-led motion based on their hiring patterns — while this one is clearly content-led. And here's the recommendation for what the user should focus on."*
6. Close with the vision: *"This is just two of four pillars. The full product adds product demand analysis and customer persona intelligence — giving any company a complete strategic brief, updated continuously, for a fraction of what analysts cost."*

---

## Success Criteria for the Demo

- [ ] Single domain input returns a full brief in under 15 seconds
- [ ] At least 3 competitors identified and analysed
- [ ] Each competitor card has funding, headcount, growth %, and revenue
- [ ] Growth motion is classified for at least 2 competitors with a reason
- [ ] Claude's summary paragraphs read like an analyst wrote them — not like a data dump
- [ ] The UI is clean enough that the data is the hero, not the design

---

## Build Order (suggested for 2 hours)

| Time | Task |
|---|---|
| 0:00 – 0:20 | Set up project, connect Crustdata API, test enrich call on a known domain |
| 0:20 – 0:45 | Build the API pipeline: enrich → get competitors → batch enrich competitors |
| 0:45 – 1:10 | Build Claude synthesis prompt + validate output quality |
| 1:10 – 1:40 | Build the UI: input screen + brief output screen with competitor cards |
| 1:40 – 2:00 | Polish loading states, test with 2–3 demo domains, fix edge cases |
