import { GoogleGenAI } from '@google/genai'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type {
  CrustdataCompany,
  CompetitorVerification,
  CompetitorLandscapeAnalysis,
  CompetitorGrowthAnalysis,
  LandscapeSummary,
  GrowthSummary,
} from './types'

const MODEL = 'gemini-3.1-pro-preview'

function client(apiKey: string) {
  return new GoogleGenAI({ apiKey })
}

async function generate<T>(
  apiKey: string,
  prompt: string,
  schema: z.ZodType<T>
): Promise<T> {
  const ai = client(apiKey)
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseJsonSchema: zodToJsonSchema(schema),
    },
  })
  return schema.parse(JSON.parse(response.text ?? '{}'))
}

// ─── 1. Verify direct competitor ───────────────────────────────────────────

const VerificationSchema = z.object({
  isDirectCompetitor: z.boolean().describe(
    'True if this company directly competes with the user company for the same customers with a similar core product'
  ),
  reason: z.string().describe('One sentence explaining the verdict'),
})

export async function verifyDirectCompetitor(
  userDomain: string,
  candidateDomain: string,
  apiKey: string
): Promise<CompetitorVerification> {
  const prompt = `Is "${candidateDomain}" a direct competitor to "${userDomain}"?

A direct competitor serves the same primary customer segment with a similar core product or service. Use your knowledge of both companies to make this determination.

User company: ${userDomain}
Candidate: ${candidateDomain}`

  return generate(apiKey, prompt, VerificationSchema)
}

// ─── 2. Per-competitor landscape analysis ──────────────────────────────────

const LandscapeAnalysisSchema = z.object({
  competitorDomain: z.string(),
  competitorName: z.string().describe('Company name'),
  fundingVerdict: z.string().describe(
    'One sentence on their funding status, e.g. "Well-funded at $141m Series C (Jul 2022)"'
  ),
  growthTrajectory: z.string().describe(
    'One sentence on headcount and revenue growth direction based on Crustdata signals and your knowledge'
  ),
  productDescription: z.string().describe('What this company does in 1-2 sentences'),
  keyDifferentiator: z.string().describe(
    'The single most important thing this competitor does differently from the user company'
  ),
  overlap: z.string().describe('Where they directly compete with the user company'),
  threatLevel: z.enum(['High', 'Medium', 'Low']).describe(
    'How much of a threat this competitor poses to the user company right now'
  ),
  threatReason: z.string().describe('One sentence explaining the threat level verdict'),
  overallVerdict: z.string().describe(
    '2-3 sentence analyst-quality summary of this competitor and what it means for the user company'
  ),
})

export async function analyseCompetitorLandscape(
  userDomain: string,
  userCompany: CrustdataCompany,
  competitor: CrustdataCompany,
  apiKey: string
): Promise<CompetitorLandscapeAnalysis> {
  const compDomain = competitor.basic_info?.primary_domain ?? 'unknown'

  const prompt = `You are a competitive intelligence analyst. Produce a detailed competitive analysis of "${compDomain}" as a competitor to "${userDomain}".

Use BOTH your knowledge of these companies AND the structured Crustdata data below.

USER COMPANY (${userDomain}):
${JSON.stringify(userCompany, null, 2)}

COMPETITOR (${compDomain}):
${JSON.stringify(competitor, null, 2)}

Be specific. Reference actual data points (funding amounts, headcount numbers, growth rates) where available. Do not fabricate data — if a field is null, rely on your knowledge instead.`

  const result = await generate(apiKey, prompt, LandscapeAnalysisSchema)
  return { ...result, competitorDomain: compDomain }
}

// ─── 3. Per-competitor growth analysis ─────────────────────────────────────

const ChannelSchema = z.object({
  channel: z.string().describe('Growth channel name, e.g. SEO, Paid Search, LinkedIn Outbound, Product Virality'),
  effectiveness: z.enum(['High', 'Medium', 'Low', 'Unknown']),
  evidence: z.string().describe('One sentence: what signal or observation supports this rating'),
})

const GrowthAnalysisSchema = z.object({
  competitorDomain: z.string(),
  growthMotion: z.enum(['Sales-led', 'Content-led', 'Paid-led', 'Product-led', 'Community-led']).describe(
    'Primary growth motion — the dominant way this company acquires customers'
  ),
  growthMotionReason: z.string().describe(
    'One sentence explaining what signals (hiring, roles, SEO, ads, product behaviour) led to this classification'
  ),
  channelBreakdown: z.array(ChannelSchema).describe(
    'The 3-5 most relevant acquisition channels for this competitor with evidence'
  ),
  adIntelligence: z.string().describe(
    'What you know about their paid advertising activity — campaigns, messaging angles, platforms. If unknown, say so.'
  ),
  hiringSignals: z.string().describe(
    'What their hiring patterns (from Crustdata roles data or your knowledge) reveal about their growth direction'
  ),
  keyInsight: z.string().describe(
    'The single most important growth insight about this competitor that the user company should know'
  ),
})

export async function analyseCompetitorGrowth(
  userDomain: string,
  userCompany: CrustdataCompany,
  competitor: CrustdataCompany,
  apiKey: string
): Promise<CompetitorGrowthAnalysis> {
  const compDomain = competitor.basic_info?.primary_domain ?? 'unknown'

  const prompt = `You are a growth strategy analyst. Analyse the growth strategy of "${compDomain}" in the context of competing with "${userDomain}".

Use BOTH your knowledge of their marketing, GTM, and growth activity AND the Crustdata signals below (roles distribution, hiring, followers growth, funding).

USER COMPANY (${userDomain}):
${JSON.stringify({ basic_info: userCompany.basic_info, taxonomy: userCompany.taxonomy, headcount: userCompany.headcount }, null, 2)}

COMPETITOR (${compDomain}) — CRUSTDATA SIGNALS:
${JSON.stringify(competitor, null, 2)}

Be specific about channels, campaigns, and strategies. Draw on your knowledge of what this company has publicly done for growth.`

  const result = await generate(apiKey, prompt, GrowthAnalysisSchema)
  return { ...result, competitorDomain: compDomain }
}

// ─── 4. Overall landscape synthesis ────────────────────────────────────────

const LandscapeSummarySchema = z.object({
  overallNarrative: z.string().describe(
    '3-4 sentences: what this competitive space looks like, how it is funded, who is winning and why. Analyst quality.'
  ),
  marketDynamics: z.string().describe(
    '1-2 sentences on how the market is moving — consolidation, expansion, new entrants, etc.'
  ),
  biggestThreat: z.string().describe(
    'Which competitor poses the biggest threat to the user company and the key reason why in 1-2 sentences'
  ),
  opportunityGap: z.string().describe(
    'The clearest opportunity the user company has in this competitive landscape, in 1-2 sentences'
  ),
})

export async function synthesiseLandscape(
  userDomain: string,
  analyses: CompetitorLandscapeAnalysis[],
  apiKey: string
): Promise<LandscapeSummary> {
  const prompt = `You are a competitive intelligence analyst. Based on the following individual competitive analyses for "${userDomain}", produce an overall competitive landscape summary.

INDIVIDUAL COMPETITOR ANALYSES:
${JSON.stringify(analyses, null, 2)}

Synthesise these into a cohesive picture of the competitive landscape. Be specific — name competitors, reference their threat levels, highlight patterns across the set.`

  return generate(apiKey, prompt, LandscapeSummarySchema)
}

// ─── 5. Overall growth synthesis ───────────────────────────────────────────

const GrowthSummarySchema = z.object({
  dominantMotionInSpace: z.string().describe(
    'What growth motion is most common or most successful across the competitive set, with examples'
  ),
  channelBenchmarks: z.string().describe(
    'Which specific channels are driving the fastest-growing companies in this space, with evidence'
  ),
  adLandscapeOverview: z.string().describe(
    'What paid advertising activity looks like across the competitive set — who is spending, on what, with what messaging'
  ),
  recommendedMotion: z.enum(['Sales-led', 'Content-led', 'Paid-led', 'Product-led', 'Community-led']).describe(
    'The single growth motion most worth investing in for the user company given what is working in the space'
  ),
  recommendation: z.string().describe(
    '3-4 sentences: what growth motion the user company should prioritise, why, and what specifically to do — grounded in what competitors are doing'
  ),
})

export async function synthesiseGrowth(
  userDomain: string,
  analyses: CompetitorGrowthAnalysis[],
  apiKey: string
): Promise<GrowthSummary> {
  const prompt = `You are a growth strategy analyst. Based on the following individual growth analyses for competitors of "${userDomain}", produce an overall growth intelligence summary and a concrete recommendation.

INDIVIDUAL GROWTH ANALYSES:
${JSON.stringify(analyses, null, 2)}

Your recommendation must be specific to what is working in this space — not generic advice. Name the channels and motions that are actually producing results for these specific competitors.`

  return generate(apiKey, prompt, GrowthSummarySchema)
}
