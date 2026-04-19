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

function log(step: string, msg: string) {
  console.log(`[${step}] ${msg}`)
}

function elapsed(t: number) {
  return `${Date.now() - t}ms`
}

async function runPipeline(jobId: string, domain: string, crustKey: string, geminiKey: string) {
  const t0 = Date.now()
  log('pipeline', `START domain=${domain} jobId=${jobId}`)

  try {
    // Step 1: Enrich user's company
    updateJob(jobId, 'Identifying your company…')
    log('step 1', 'Enriching user company via Crustdata…')
    const t1 = Date.now()
    const userCompany = await enrichCompany(domain, crustKey)
    log('step 1', `DONE — name="${userCompany.basic_info?.name}" id=${userCompany.crustdata_company_id} (${elapsed(t1)})`)

    // Step 2: Find candidate competitors by taxonomy
    updateJob(jobId, 'Finding competitor candidates…')
    log('step 2', 'Finding competitor candidates by taxonomy…')
    const t2 = Date.now()
    const candidates = await findCompetitorsByTaxonomy(userCompany, crustKey)
    const candidateDomains = candidates.map((c) => c.basic_info?.primary_domain ?? '?')
    log('step 2', `DONE — ${candidates.length} candidates: [${candidateDomains.join(', ')}] (${elapsed(t2)})`)

    if (!candidates.length) {
      failJob(jobId, 'No competitor candidates found for this domain. Try a more established company.')
      return
    }

    // Step 3: Verify which candidates are direct competitors (parallel Gemini calls)
    updateJob(jobId, 'Verifying direct competitors…')
    log('step 3', `Verifying ${candidates.length} candidates in parallel (${candidates.length} Gemini calls)…`)
    const t3 = Date.now()
    const verifications = await Promise.all(
      candidates.map((c) =>
        verifyDirectCompetitor(domain, c.basic_info?.primary_domain ?? '', geminiKey)
      )
    )
    candidates.forEach((c, i) => {
      const v = verifications[i]
      log('step 3', `  ${c.basic_info?.primary_domain} → ${v.isDirectCompetitor ? '✓ YES' : '✗ NO'}  "${v.reason}"`)
    })
    const confirmed = candidates
      .filter((_, i) => verifications[i].isDirectCompetitor)
      .slice(0, 5)
    log('step 3', `DONE — ${confirmed.length} confirmed: [${confirmed.map((c) => c.basic_info?.primary_domain).join(', ')}] (${elapsed(t3)})`)

    if (!confirmed.length) {
      failJob(jobId, 'Could not identify direct competitors for this domain.')
      return
    }

    // Step 4: Re-enrich confirmed competitors with full field set
    updateJob(jobId, 'Enriching competitor data…')
    log('step 4', `Re-enriching ${confirmed.length} confirmed competitors via Crustdata…`)
    const t4 = Date.now()
    const enrichedIds = confirmed
      .map((c) => c.crustdata_company_id)
      .filter((id): id is number => id != null)
    const enriched = enrichedIds.length
      ? await enrichCompanyIds(enrichedIds, crustKey)
      : confirmed
    log('step 4', `DONE — enriched: [${enriched.map((c) => c.basic_info?.primary_domain).join(', ')}] (${elapsed(t4)})`)

    // Step 5: Run landscape + growth analyses in parallel (5+5 = 10 Gemini calls)
    updateJob(jobId, 'Analysing competitors…')
    log('step 5', `Running ${enriched.length * 2} parallel Gemini calls (${enriched.length} landscape + ${enriched.length} growth)…`)
    const t5 = Date.now()
    const [landscapeAnalyses, growthAnalyses] = await Promise.all([
      Promise.all(enriched.map((c) => analyseCompetitorLandscape(domain, userCompany, c, geminiKey))),
      Promise.all(enriched.map((c) => analyseCompetitorGrowth(domain, userCompany, c, geminiKey))),
    ])
    log('step 5', `DONE — ${landscapeAnalyses.length} landscape analyses, ${growthAnalyses.length} growth analyses (${elapsed(t5)})`)

    // Step 6: Synthesise overall summaries (2 parallel Gemini calls)
    updateJob(jobId, 'Generating intelligence brief…')
    log('step 6', 'Running 2 parallel synthesis calls (landscape summary + growth summary)…')
    const t6 = Date.now()
    const [landscapeSummary, growthSummary] = await Promise.all([
      synthesiseLandscape(domain, landscapeAnalyses, geminiKey),
      synthesiseGrowth(domain, growthAnalyses, geminiKey),
    ])
    log('step 6', `DONE — summaries ready (${elapsed(t6)})`)

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
    log('pipeline', `COMPLETE — total time: ${elapsed(t0)}`)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Analysis failed.'
    log('pipeline', `ERROR: ${msg}`)
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
