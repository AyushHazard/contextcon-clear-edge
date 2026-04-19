import { NextResponse } from 'next/server'
import { enrichCompany, findCompetitorsByTaxonomy } from '@/lib/crustdata'
import { synthesise } from '@/lib/gemini'
import type { AnalysisResult, EnrichedCompetitor } from '@/lib/types'

export const maxDuration = 30

function cleanDomain(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split('/')[0]
    .split('?')[0]
}

export async function POST(req: Request) {
  const crustKey = process.env.CRUSTDATA_API_KEY
  const geminiKey = process.env.GEMINI_API_KEY

  if (!crustKey || !geminiKey) {
    return NextResponse.json({ error: 'Server misconfiguration: missing API keys.' }, { status: 500 })
  }

  let body: { domain?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const rawDomain = body.domain?.trim()
  if (!rawDomain) {
    return NextResponse.json({ error: 'Domain is required.' }, { status: 400 })
  }

  const domain = cleanDomain(rawDomain)

  // Step 1: Enrich user's company to get competitors list
  let userCompany
  try {
    userCompany = await enrichCompany(domain, crustKey)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    if (msg.includes('No company data')) {
      return NextResponse.json({ error: msg }, { status: 404 })
    }
    return NextResponse.json({ error: `Crustdata error: ${msg}` }, { status: 502 })
  }

  // Step 2: Find competitors via taxonomy search
  let competitorData
  try {
    competitorData = await findCompetitorsByTaxonomy(userCompany, crustKey)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: `Crustdata competitor search error: ${msg}` }, { status: 502 })
  }

  if (!competitorData.length) {
    return NextResponse.json(
      { error: 'Could not retrieve competitor data. Try again.' },
      { status: 404 }
    )
  }

  // Step 3: Claude synthesis
  let claudeResult
  try {
    claudeResult = await synthesise(domain, competitorData, geminiKey)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: `Analysis generation failed: ${msg}` }, { status: 500 })
  }

  // Step 4: Merge Crustdata + Claude results by domain
  const crustByDomain = new Map(
    competitorData.map((c) => {
      const d = (c.basic_info?.primary_domain ?? '')
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .replace(/\/$/, '')
      return [d, c]
    })
  )

  const merged: EnrichedCompetitor[] = claudeResult.competitors.map((cc) => {
    const normDomain = cc.domain
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/$/, '')
    const crustData = crustByDomain.get(normDomain) ?? competitorData[0]
    return { ...crustData, ...cc, domain: normDomain }
  })

  const result: AnalysisResult = {
    userDomain: domain,
    analysedAt: new Date().toISOString(),
    landscapeSummary: claudeResult.landscapeSummary,
    growthRecommendation: claudeResult.growthRecommendation,
    competitors: merged,
  }

  return NextResponse.json(result)
}
