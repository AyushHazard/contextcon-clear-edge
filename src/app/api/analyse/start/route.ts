import { NextResponse } from 'next/server'
import { enrichCompany, findCompetitorsByTaxonomy } from '@/lib/crustdata'
import { synthesise } from '@/lib/gemini'
import { createJob, updateJob, completeJob, failJob } from '@/lib/jobs'
import type { AnalysisResult, EnrichedCompetitor } from '@/lib/types'

export const maxDuration = 60

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
    updateJob(jobId, 'Identifying your company…')
    const userCompany = await enrichCompany(domain, crustKey)

    updateJob(jobId, 'Finding competitors…')
    const competitorData = await findCompetitorsByTaxonomy(userCompany, crustKey)

    if (!competitorData.length) {
      failJob(jobId, 'Could not retrieve competitor data. Try again.')
      return
    }

    updateJob(jobId, 'Generating your brief…')
    const geminiResult = await synthesise(domain, competitorData, geminiKey)

    const crustByDomain = new Map(
      competitorData.map((c) => {
        const d = (c.basic_info?.primary_domain ?? '')
          .replace(/^https?:\/\//, '')
          .replace(/^www\./, '')
          .replace(/\/$/, '')
        return [d, c]
      })
    )

    const merged: EnrichedCompetitor[] = geminiResult.competitors.map((cc) => {
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
      landscapeSummary: geminiResult.landscapeSummary,
      growthRecommendation: geminiResult.growthRecommendation,
      competitors: merged,
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

  // Fire and forget — respond immediately with jobId
  runPipeline(jobId, domain, crustKey, geminiKey)

  return NextResponse.json({ jobId })
}
