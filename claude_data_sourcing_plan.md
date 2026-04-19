# Introspection Tool — Data Sourcing Master Plan (For the compelte tool)

> **Concept:** An introspection tool that ensures you're always on the right track — aware of new developments that impact you, and one step ahead. Covers four pillars: Product Analysis, Growth Analysis, Competitor Analysis, and Customer Understanding.

---

## Pillar 1 — Product Analysis

> *Is your product in high demand? Will it be in high demand in the near future? Any recent changes / developments that can affect your product's need or demand? Where is your industry headed? How are things changing?*

---

### Q1 — Is your product in high demand right now?

**Crustdata — Enrich your domain**
| Field | Signal |
|---|---|
| `seo.monthly_organic_clicks` | How much search traffic your category is pulling — direct proxy for intent-based demand |
| `seo.total_organic_results` | How contested the keyword space is — high results = validated market |
| `seo.monthly_google_ads_budget` | Competitors spending on paid = confirmed commercial demand |
| `web_traffic.monthly_visitors` | Raw traction signal for your product and competitors' |
| `hiring.openings_count + openings_growth_percent` | Companies hiring in your space = growth signal, validated demand |

**External — Google Trends API (free)**
| Field | Signal |
|---|---|
| `interest over time` | Search volume trend for your product category keywords — rising, flat, or declining |
| `related queries` | What people are searching alongside your category — surfaces emerging use cases |

---

### Q2 — Will it be in high demand in the near future?

**Crustdata — Company Search, filter by your industry**
| Field | Signal |
|---|---|
| `funding.last_fundraise_date + last_round_type` | Recent Series A/B in your space = investors betting on future growth |
| `basic_info.year_founded + headcount.growth_percent` | New entrants growing fast = market is expanding, not consolidating |
| `hiring.openings_growth_percent` | Industry-wide hiring growth = forward-looking demand signal |

**External — News API (NewsAPI.org or Bing News)**
| Field | Signal |
|---|---|
| Headlines for category keywords | Regulatory shifts, tech breakthroughs, macro trends that will drive or kill demand |

**External — Reddit / HN scrape (free)**
| Field | Signal |
|---|---|
| Post volume + sentiment on category subreddits | Ground-level chatter about what people wish existed — leading indicator of demand |

---

### Q3 — Any recent changes that affect your product's need?

**Crustdata — Enrich your company + top competitors**
| Field | Signal |
|---|---|
| `news (article_url, article_title, article_publish_date)` | Recent press about competitors — product launches, pivots, funding that changes the landscape |
| `software_reviews.review_count` growth | Sudden review spike = something changed (launch, PR, viral moment) |

**External — News API + Google Alerts equivalent**
| Field | Signal |
|---|---|
| Regulatory / policy news | Laws, bans, compliance requirements that open or close markets |
| Technology news | New models, frameworks, or platforms that make your product easier to replace |

---

### Q4 — Where is your industry headed?

**Crustdata — Company Search → industry cohort analysis**
| Field | Signal |
|---|---|
| Filter: `year_founded > 2022` + same industry | Count of new entrants per year — is the space getting more or less crowded? |
| Sort by `headcount.growth_percent` | Who is growing fastest in your space and what are they building? |
| `funding.last_round_type` distribution | Are companies raising Seed/A (early) or C/D (mature)? Signals industry maturity stage |

**Claude synthesis — all signals above**
Feed all the above into Claude with a prompt asking it to assess trajectory: growing, plateauing, or declining — and why. This is where raw data becomes actual insight.

---

### Hackathon MVP for Pillar 1
Crustdata Enrich (your domain + competitors) + Company Search (industry cohort) + Google Trends. Skip Reddit/news for the demo — Claude can infer directional signals well enough from Crustdata data alone to produce a compelling output.

---

---

## Pillar 2 — Growth Analysis

> *What is the best growth strategy for your product? Which strategies (ads, content, outreach, etc.) are working best for your product / competitors or products similar to yours in the same niche?*

**Key insight:** Growth strategy can't be read directly — it has to be reverse-engineered from observable behaviour. Where are they spending? What content are they making? Who are they hiring? That's how you infer what's working.

---

### Channel 1 — SEO / Content marketing

**Crustdata — Enrich → competitors list → enrich each**
| Field | Signal |
|---|---|
| `seo.monthly_organic_clicks` | High organic traffic + low ad budget → content/SEO is their primary growth channel |
| `seo.total_organic_results` | Wide keyword coverage = aggressive content strategy |
| `seo.monthly_google_ads_budget` | High ads + low organic = paid-first; opposite = SEO-first |
| `web_traffic.monthly_visitors` trend | Traffic growing despite flat ad spend = organic / word-of-mouth flywheel working |

**External — Similarweb free tier / SpyFu free**
| Field | Signal |
|---|---|
| Top organic keywords | What search terms drive their traffic — reveals content strategy and ICP targeting |
| Traffic source breakdown | Direct vs search vs social vs referral — which channel is their actual growth engine |

---

### Channel 2 — Paid advertising

**Crustdata — Enrich → seo fields**
| Field | Signal |
|---|---|
| `seo.monthly_google_ads_budget` | Rough monthly paid spend — if rising, they're doubling down on paid acquisition |

**External — Meta Ad Library (free, public API)**
| Field | Signal |
|---|---|
| Active ads by competitor domain | What creative, copy, and angles they're running — directly shows positioning and messaging that's working |
| Ad volume + age | Old ads still running = proven winners. Many new ads = testing phase |

**External — Google Ads Transparency Center (scrapeable)**
| Field | Signal |
|---|---|
| Active search ads by brand | Reveals exact value props they're betting on in paid search |

---

### Channel 3 — Hiring as a growth signal

**Crustdata — Enrich → hiring fields (most powerful signal)**
| Field | Signal |
|---|---|
| `hiring.recent_titles_csv` | "Growth Engineer / Demand Gen" = paid growth focus; "Content Writer / SEO Specialist" = content-led; "SDR / BDR" = outbound sales motion |
| `hiring.openings_count + openings_growth_percent` | Rapidly growing open roles in a specific function = scaling that channel right now |
| `headcount.by_role_percent` | % of company in Sales vs Marketing vs Engineering — reveals GTM philosophy (PLG vs sales-led) |

---

### Channel 4 — Social & community

**Crustdata — Enrich → followers**
| Field | Signal |
|---|---|
| `followers.mom_percent / qoq_percent / yoy_percent` | Accelerating growth = something they're doing on social is working |
| `followers.count` trend | Combined with traffic: high followers + high traffic = social-to-web funnel is strong |

**External — Reddit / Slack / Twitter scrape**
| Field | Signal |
|---|---|
| Brand mentions + context | Organic community talk about them — community-driven growth shows up here before anywhere else |

---

### Channel 5 — Partnerships & integrations

**Crustdata — Enrich → news + hiring**
| Field | Signal |
|---|---|
| `news` articles (keywords: "partnership", "integration", "launch") | Recent partnership announcements reveal distribution strategy |
| Hiring for "Partnerships" / "BD" roles | Actively building a partnerships function = this is becoming a growth channel |

**External — Product Hunt / G2 integrations page**
| Field | Signal |
|---|---|
| Integrations listed | How deep is their integration ecosystem — distribution through other products' user bases |

---

### Claude synthesis layer

For each competitor, Claude should:
1. **Classify the channel mix** — PLG (product-led), SLG (sales-led), content-led, paid-led, or community-led — based on role distribution, ad spend, and traffic sources combined
2. **Find what's working** — Cross-reference traffic growth with ad spend. If traffic is growing but ads are flat → organic/word-of-mouth is working. If ads are high but traffic is flat → paid is burning, not working
3. **Recommend for your product** — Based on your company's stage + what's working for comparable companies in the niche, suggest the highest-leverage growth channel to double down on

---

### Hackathon MVP for Pillar 2
Crustdata hiring titles + SEO/ads fields + follower growth → Claude classifies each competitor's growth motion → outputs "companies like yours in this space are primarily growing through [X], here's the evidence." Add the Meta Ad Library call as a bonus — showing actual competitor ads makes the demo visually compelling.

---

---

## Pillar 3 — Competitor Analysis

> *Who are your primary competitors? How much have they raised? How fast are they growing in terms of revenue, headcount, product etc. What is their growth strategy? What are their plans / direction in terms of product etc. What is their product exactly, how is it different from yours?*

**Good news:** This is the pillar where Crustdata does ~80% of the work natively. The full pipeline is essentially 2 API calls. The hard part is synthesis, not data sourcing.

---

### Step 0 — Who are your competitors?

**Crustdata — Enrich your domain → competitors field**
| Field | Signal |
|---|---|
| `competitors.websites` | Direct list of competitor domains Crustdata has mapped — your starting universe, zero effort |
| `competitors.company_ids` | Pass straight into a batch Enrich call to pull full profiles on all of them at once |

**Crustdata — Search → same industry + similar headcount**
| Field | Signal |
|---|---|
| `taxonomy.professional_network_industry` + headcount range | Catches competitors Crustdata's graph missed — same space, similar stage |

**External — G2 / Capterra category page scrape**
| Field | Signal |
|---|---|
| Category listing → all products | Review platforms organise by category — gives you the full competitive set as users see it |

---

### Q1 — How much have they raised?

**Crustdata — Enrich → funding fields (fully covered)**
| Field | Signal |
|---|---|
| `funding.total_investment_usd` | Total disclosed capital raised — the headline number |
| `funding.last_round_amount_usd + last_round_type` | Series A/B/C + amount — tells you their current scale and investor conviction |
| `funding.last_fundraise_date` | Fresh round = aggressive growth mode. Old round = either profitable or struggling |
| `funding.investors` | Who backed them — tier of investors signals credibility and network access |

---

### Q2 — How fast are they growing?

**Crustdata — Enrich → headcount + hiring + followers + web traffic + revenue**
| Field | Signal |
|---|---|
| `headcount.total + headcount.growth_percent` | Headcount growth is the most reliable public growth proxy — companies can't fake hiring |
| `headcount.by_role_absolute + by_role_percent` | Which functions are growing — engineering growth = product investment; sales growth = GTM push |
| `hiring.openings_count + openings_growth_percent` | Forward-looking growth signal — open roles today = headcount in 3 months |
| `web_traffic.monthly_visitors` | Revenue proxy — especially for B2C and PLG products where traffic = pipeline |
| `followers.mom_percent + yoy_percent` | Brand momentum — accelerating follower growth often precedes traffic and revenue growth |
| `revenue.estimated (lower + upper bound)` | Crustdata's revenue estimate range — directionally useful even if not precise |

---

### Q3 — What is their growth strategy?

Reuse the full Growth Analysis pillar signals above, applied to each competitor.

**Key shortcut — Crustdata hiring titles are the cheat code:**

`hiring.recent_titles_csv` is a public declaration of where they're investing growth budget right now:
- Lots of SDRs / AEs → outbound sales motion
- Lots of Content Writers / SEO Specialists → content-led growth
- Lots of Growth Engineers / Performance Marketers → paid acquisition
- Heavy engineering hiring → product-led growth (PLG)

---

### Q4 — What are their product plans and direction?

**Crustdata — Enrich → news + hiring**
| Field | Signal |
|---|---|
| `news (article_title + article_url + publish_date)` | Product launch announcements, feature releases, pivots — most direct signal of product direction |
| `hiring.recent_titles_csv` (engineering roles specifically) | "ML Engineer", "AI PM", "Mobile Lead" — hiring for specific tech roles reveals what they're building 6–9 months before launch |

**External — Competitor website + changelog / blog (scrape)**
| Field | Signal |
|---|---|
| Homepage hero copy | What they lead with = current positioning bet and ICP focus |
| Changelog / release notes | Cadence and direction of product releases — what they're shipping and how fast |
| Pricing page | Pricing model changes reveal GTM shifts — moving to usage-based, adding enterprise tier, etc. |

**External — Job board scrape (careers page)**
| Field | Signal |
|---|---|
| Full job descriptions | JDs mention specific tech stacks, product areas, customer segments — far richer than just the title |

---

### Q5 — What is their product exactly, how is it different from yours?

**Crustdata — Enrich → basic_info + taxonomy + software_reviews**
| Field | Signal |
|---|---|
| `basic_info.description` | Their own product description — the baseline of what they claim to do |
| `taxonomy.categories + professional_network_specialities` | How they've classified themselves — reveals positioning and feature focus |
| `software_reviews.average_rating + review_count` | Established product signal — high rating + many reviews = vocal, engaged user base |
| `employee_reviews.overall_rating` | Internal quality proxy — poor employee reviews often means slow shipping or high churn |

**External — G2 / Capterra reviews scrape**
| Field | Signal |
|---|---|
| Pros / cons from verified reviews | What users say they're bad at = your opportunity. What users love = what you need to match |
| "What made you switch" reviews | Gold. This is the exact differentiation language your sales and marketing should use |

**Claude synthesis — differentiation brief**

Feed your product description + each competitor's description + their review pros/cons into Claude. Output:
1. What they do that you don't
2. What you do that they don't
3. Where you directly overlap
4. Which gaps are worth attacking

---

### Full API call sequence for Pillar 3
1. Enrich your domain → get `competitors.company_ids`
2. Batch enrich all competitor IDs in one call → get funding, headcount, hiring, news, reviews, revenue estimates
3. Search same industry → catch any competitors not in the graph
4. Scrape G2 category + competitor homepages + changelogs
5. Claude synthesises into a structured competitor brief per company

Steps 1–2 are 2 API calls. The whole pipeline runs in under 10 seconds.

---

### Hackathon MVP for Pillar 3
Steps 1–2 (pure Crustdata) are buildable in a couple of hours. Add a G2 category scrape and competitor homepage scrape. Claude produces the differentiation brief. The demo shows a live competitor brief generated from a domain input — compelling and fast.

---

---

## Pillar 4 — Customer Understanding

> *How is your customer's sentiment towards your product? Are they engaging with competitor products? What are your customer's needs? What is the best way to reach your customer? What is the psychology / persona of your customer (how they'd react to certain changes or introductions)?*

**Core challenge:** Customers don't announce their psychology. Every signal here is behavioural inference — what they post, what they complain about, what they search for, what they click. Crustdata is thin here. This pillar lives mostly in external sources, and Claude's synthesis is where the real value is created.

---

### Q1 — How is sentiment towards your product?

**Crustdata — Enrich your domain**
| Field | Signal |
|---|---|
| `software_reviews.average_rating + review_count` | Aggregate sentiment score — directional signal, but trend matters more than the number |
| `employee_reviews.overall_rating + work_life_balance` | Internal health proxy — unhappy teams ship slower, which customers eventually feel |

**External — G2 / Capterra / Trustpilot (scrape)**
| Field | Signal |
|---|---|
| Star ratings over time | Is sentiment improving or declining? A product dropping from 4.5 to 3.9 over 6 months is a warning sign |
| Review text → pros / cons | Verbatim language customers use — this is your actual positioning language |
| Recency of reviews | Lots of old reviews + few recent ones = product has stagnated or users stopped engaging |

**External — Reddit / Twitter / HN mentions**
| Field | Signal |
|---|---|
| Brand mention sentiment | Unfiltered. G2 reviews are curated — Reddit posts are raw. A brand can have 4.5 stars on G2 and a toxic reputation on r/[industry] |
| Complaint threads | What customers rant about unprompted = the real pain points, not sanitised feedback |
| Recommendation threads | Whether your product is being recommended organically — and in what context |

---

### Q2 — Are customers engaging with competitor products?

**Crustdata — Enrich competitors → web traffic + followers**
| Field | Signal |
|---|---|
| `web_traffic.monthly_visitors` (competitor vs yours) | If competitor traffic is growing faster → customers are gravitating toward them |
| `followers.yoy_percent` across competitors | Which competitor is building the most brand momentum with your shared audience |
| `software_reviews.review_count` growth | Rapidly growing review count = customers actively talking about them = strong engagement |

**External — G2 comparison pages**
| Field | Signal |
|---|---|
| "[Your product] vs [Competitor]" pages | G2 auto-generates these — shows which products customers are actively comparing you against |
| Switcher reviews | "I moved from X to Y because..." — customers who switched tell you exactly what triggered the move |

**External — Reddit / community forums**
| Field | Signal |
|---|---|
| "Switched from [your product] to [competitor]" posts | When customers announce they switched, they almost always explain why — free churn research |

---

### Q3 — What are your customer's needs?

**External — G2 / Capterra reviews → "cons" and "what would you improve"**
| Field | Signal |
|---|---|
| Cons across your product + competitors | Unmet needs in plain sight. If every product in your category gets the same complaint → that's a white space |
| "What features are you missing" | Direct feature requests from paying customers of you and your competitors |

**External — Reddit / HN / Quora**
| Field | Signal |
|---|---|
| "How do I..." + "Is there a tool that..." posts | Unsolved problems people are asking publicly = unmet needs. If no product solves it well, that's a roadmap item |
| Feature request threads | Communities around tools in your space often have explicit "I wish it could do X" threads |

**External — Google Trends + autocomplete**
| Field | Signal |
|---|---|
| "[category] + problem keywords" search volume | What problems people are actively searching to solve — demand-side view of needs |
| Google autocomplete for your category | "[Your product type] for..." completions reveal the exact use cases driving search intent |

---

### Q4 — What is the best way to reach your customer?

**Crustdata — Enrich competitors → web traffic sources + followers**
| Field | Signal |
|---|---|
| `web_traffic.domain_traffic` (source breakdown) | Where competitor traffic comes from — if 60% is direct/social for top players, that's where your audience lives |
| `followers.count + growth rate` | Which platform the audience is on. High LinkedIn followers + fast growth = B2B LinkedIn audience |
| `seo.monthly_google_ads_budget` | If top competitors are all spending on Google Ads → search intent is high and paid search is a validated channel |

**External — Meta Ad Library**
| Field | Signal |
|---|---|
| Active competitor ads + creative format | If competitor ads have been live for months → that channel works. The creative format (video vs image, emotional vs feature-led) shows how the customer responds |

**External — Reddit / Slack / Discord communities**
| Field | Signal |
|---|---|
| Which communities your ICP hangs out in | The existence of active communities around your category tells you where the audience self-organises — organic reach is cheapest here |

---

### Q5 — Customer psychology and persona

**Crustdata — Enrich your domain + competitors → people**
| Field | Signal |
|---|---|
| `people.decision_makers + cxos` | For B2B: who is buying — their titles, seniority, function. Reveals the buyer persona directly |
| `basic_info.employee_count_range` across customer companies | If you can enrich your known customers, company size distribution tells you your ICP sweet spot |

**External — G2 reviews → reviewer role + company size filter**
| Field | Signal |
|---|---|
| Reviewer job title + company size | G2 shows who is reviewing — "Head of Operations at 51–200 person company" tells you exactly who your buyer is and what words they use |

**Claude synthesis — persona + psychology layer**

Feed G2 reviewer profiles + review language + Reddit post tone + traffic sources into Claude. Output:

1. **Build the persona** — job title, company stage, core frustrations, what they celebrate, how they evaluate tools, what messaging lands
2. **React to changes** — "Given this persona, how would they react to a price increase / a new enterprise tier / removing the free plan?" Claude reasons over the persona it built to answer these hypotheticals
3. **Reach strategy** — Based on where this persona spends time (inferred from traffic sources + community data) + what messaging resonates (from review language), output the top 2–3 channels and the specific angle to lead with on each

---

### Hackathon MVP for Pillar 4
G2 scrape for your product + top 2 competitors → pull reviewer titles, star ratings, pros/cons text → Claude builds a persona and sentiment summary. That alone is a compelling demo. Reddit/community layer makes it richer but isn't needed on day one.

**Honest limitation:** Everything here is about *other people's customers* unless the user gives access to their own data (analytics, CRM, support tickets). That's a V2 feature — letting users connect their own data sources.

---

---

## Summary — Full Data Source Map

| Source | Pillars it serves | Cost | Complexity |
|---|---|---|---|
| Crustdata Enrich | All 4 | Credits | Low — 1–2 API calls |
| Crustdata Search | Product, Competitor | Credits | Low |
| Google Trends API | Product, Growth | Free | Low |
| News API | Product, Growth | Free tier available | Low |
| Meta Ad Library | Growth, Customer | Free | Medium — scrape |
| G2 / Capterra scrape | All 4 | Free | Medium |
| Reddit / HN scrape | Product, Growth, Customer | Free | Medium |
| Competitor website scrape | Competitor, Customer | Free | Low |
| Claude synthesis | All 4 | API credits | The value layer |

---

## The Core Data Pipeline (Hackathon Build Order)

```
User inputs domain
        ↓
1. Crustdata Enrich (your company)
   → SEO, traffic, hiring, news, competitors, reviews, people
        ↓
2. Crustdata Batch Enrich (all competitor IDs)
   → Same fields for every competitor
        ↓
3. Crustdata Search (industry cohort)
   → Catch competitors not in graph, map industry trajectory
        ↓
4. G2 category scrape
   → Sentiment, reviewer personas, switcher reviews, feature gaps
        ↓
5. Google Trends
   → Demand trend for category keywords
        ↓
6. Meta Ad Library (optional but compelling)
   → What growth channels + creative is actually working
        ↓
7. Claude synthesis
   → Structured intelligence brief across all 4 pillars
```

Steps 1–3 are pure Crustdata. Steps 1–2 are literally 2 API calls.
The whole data pipeline runs in under 15 seconds. The intelligence layer on top is where your product lives.
