import { GoogleGenAI } from '@google/genai'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { CrustdataCompany, ClaudeAnalysis } from './types'

const GrowthMotion = z.enum([
  'Sales-led',
  'Content-led',
  'Paid-led',
  'Product-led',
  'Community-led',
])

const CompetitorSchema = z.object({
  domain: z.string().describe('The company website/domain from the provided data'),
  threatSummary: z
    .string()
    .describe(
      'What this company does, why they are a genuine threat, and one key differentiator. 2-3 sentences. Reference actual data points like funding or headcount growth.'
    ),
  growthMotion: GrowthMotion.describe(
    'Primary growth motion inferred from hiring titles, role distribution, SEO spend, and organic traffic'
  ),
  growthMotionReason: z
    .string()
    .describe(
      'One sentence citing the specific signals (hiring titles, SEO spend, organic traffic, role distribution) that led to this classification'
    ),
})

const AnalysisSchema = z.object({
  landscapeSummary: z
    .string()
    .describe(
      'A 3-4 sentence overview: what this competitive space is, how it is funded, which competitors are moving fastest, and the key dynamics. Write like a senior analyst, not a data aggregator.'
    ),
  competitors: z.array(CompetitorSchema),
  growthRecommendation: z
    .string()
    .describe(
      'A 3-4 sentence recommendation on the single highest-leverage growth motion for the user\'s company based on what is actually working in this space. Reference specific competitor patterns from the data.'
    ),
})

const MODEL = 'gemini-3.1-pro-preview'

export async function synthesise(
  userDomain: string,
  competitors: CrustdataCompany[],
  apiKey: string
): Promise<ClaudeAnalysis> {
  const ai = new GoogleGenAI({ apiKey })

  const prompt = `You are a competitive intelligence analyst. Analyse the following competitor data for a company with domain "${userDomain}" and return a structured intelligence brief.

Do not invent data. Only interpret what is present in the provided fields. If a field is null or missing, acknowledge the gap briefly rather than fabricating.

COMPETITOR DATA:
${JSON.stringify(competitors, null, 2)}`

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseJsonSchema: zodToJsonSchema(AnalysisSchema),
    },
  })

  const parsed = AnalysisSchema.parse(JSON.parse(response.text ?? '{}'))
  return parsed as ClaudeAnalysis
}
