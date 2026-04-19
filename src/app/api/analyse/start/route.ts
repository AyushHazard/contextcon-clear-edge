import { NextResponse } from 'next/server'
import { enrichCompany, findCompetitorsByTaxonomy, enrichCompanyIds } from '@/lib/crustdata'
import {
  verifyDirectCompetitor,
  analyseCompetitorLandscape,
  analyseCompetitorGrowth,
  synthesiseLandscape,
  synthesiseGrowth,
} from '@/lib/gemini'
import { createJob, updateJob, completeJob, failJob } from '@/lib/jobs'
import type { AnalysisResult } from '@/lib/types'

export const maxDuration = 120

function cleanDomain(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split('/')[0]
    .split('?')[0]
}

async function runPipeline(jobId: string, domain: string, crustKey: string, geminiKey: string) {
  try {
    // Step 1: Enrich user's company
    updateJob(jobId, 'Identifying your company…')
    const userCompany = await enrichCompany(domain, crustKey)

    // Step 2: Find candidate competitors by taxonomy
    updateJob(jobId, 'Finding competitor candidates…')
    const candidates = await findCompetitorsByTaxonomy(userCompany, crustKey)

    if (!candidates.length) {
      failJob(jobId, 'No competitor candidates found for this domain. Try a more established company.')
      return
    }

    // Step 3: Verify which candidates are direct competitors (parallel Gemini calls)
    updateJob(jobId, 'Verifying direct competitors…')
    const verifications = await Promise.all(
      candidates.map((c) =>
        verifyDirectCompetitor(domain, c.basic_info?.primary_domain ?? '', geminiKey)
      )
    )
    const confirmed = candidates
      .filter((_, i) => verifications[i].isDirectCompetitor)
      .slice(0, 5)

    if (!confirmed.length) {
      failJob(jobId, 'Could not identify direct competitors for this domain.')
      return
    }

    // Step 4: Re-enrich confirmed competitors with full field set
    updateJob(jobId, 'Enriching competitor data…')
    const enrichedIds = confirmed
      .map((c) => c.crustdata_company_id)
      .filter((id): id is number => id != null)
    const enriched = enrichedIds.length
      ? await enrichCompanyIds(enrichedIds, crustKey)
      : confirmed // fallback: use what we already have

    // Step 5: Run landscape + growth analyses in parallel (5+5 = 10 Gemini calls)
    updateJob(jobId, 'Analysing competitors…')
    const [landscapeAnalyses, growthAnalyses] = await Promise.all([
      Promise.all(enriched.map((c) => analyseCompetitorLandscape(domain, userCompany, c, geminiKey))),
      Promise.all(enriched.map((c) => analyseCompetitorGrowth(domain, userCompany, c, geminiKey))),
    ])

    // Step 6: Synthesise overall summaries (2 parallel Gemini calls)
    updateJob(jobId, 'Generating intelligence brief…')
    const [landscapeSummary, growthSummary] = await Promise.all([
      synthesiseLandscape(domain, landscapeAnalyses, geminiKey),
      synthesiseGrowth(domain, growthAnalyses, geminiKey),
    ])

    const result: AnalysisResult = {
      userDomain: domain,
      analysedAt: new Date().toISOString(),
      userCompany,
      competitors: enriched,
      landscapeAnalyses,
      landscapeSummary,
      growthAnalyses,
      growthSummary,
    }

    completeJob(jobId, result)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Analysis failed.'
    failJob(jobId, msg)
  }
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
  const jobId = crypto.randomUUID()

  createJob(jobId)
  runPipeline(jobId, domain, crustKey, geminiKey)

  return NextResponse.json({ jobId })
}
