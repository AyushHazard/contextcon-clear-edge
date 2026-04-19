'use client'

import { useState, useEffect } from 'react'
import { getStoredState, setDomain, setResult } from '@/lib/storage'
import type { AnalysisResult } from '@/lib/types'

export type AppState = 'onboarding' | 'loading' | 'brief'

export function useAppState() {
  const [state, setState] = useState<AppState>('onboarding')
  const [result, setResultState] = useState<AnalysisResult | null>(null)
  const [domain, setDomainState] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [refreshError, setRefreshError] = useState<string | null>(null)
  const [loadingMessage, setLoadingMessage] = useState<string>('Starting analysis…')

  useEffect(() => {
    const stored = getStoredState()
    if (stored.result) {
      setResultState(stored.result)
      setDomainState(stored.domain)
      setState('brief')
    } else if (stored.domain) {
      setDomainState(stored.domain)
      setState('onboarding')
    }
  }, [])

  async function callAnalyse(d: string): Promise<AnalysisResult> {
    // Step 1: start the job
    const startRes = await fetch('/api/analyse/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain: d }),
    })
    if (!startRes.ok) {
      const json = await startRes.json().catch(() => ({}))
      throw new Error(json.error ?? `Failed to start analysis (${startRes.status})`)
    }
    const { jobId } = await startRes.json()

    // Step 2: poll until done
    while (true) {
      await new Promise((r) => setTimeout(r, 2000))

      const statusRes = await fetch(`/api/analyse/status/${jobId}`)
      if (!statusRes.ok) throw new Error('Lost track of analysis job.')

      const job = await statusRes.json()

      if (job.status === 'done') return job.result as AnalysisResult
      if (job.status === 'error') throw new Error(job.error)
      if (job.status === 'pending') setLoadingMessage(job.message)
    }
  }

  async function runAnalysis(inputDomain: string) {
    setError(null)
    setDomain(inputDomain)
    setDomainState(inputDomain)
    setState('loading')
    try {
      const data = await callAnalyse(inputDomain)
      setResult(data)
      setResultState(data)
      setState('brief')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Analysis failed. Please try again.'
      setError(msg)
      setState('onboarding')
    }
  }

  async function refreshResults() {
    if (!domain) return
    setRefreshError(null)
    setState('loading')
    try {
      const data = await callAnalyse(domain)
      setResult(data)
      setResultState(data)
      setState('brief')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Refresh failed.'
      // Restore previous brief — do NOT lose it on a failed refresh
      const stored = getStoredState()
      setResultState(stored.result)
      setState('brief')
      setRefreshError(`Refresh failed — showing previous results. (${msg})`)
    }
  }

  async function changeDomain(newDomain: string) {
    if (!newDomain || newDomain === domain) return
    setRefreshError(null)
    setError(null)
    await runAnalysis(newDomain)
  }

  return { state, result, domain, error, refreshError, loadingMessage, runAnalysis, refreshResults, changeDomain }
}
