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
    const res = await fetch('/api/analyse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain: d }),
    })
    if (!res.ok) {
      const json = await res.json().catch(() => ({}))
      throw new Error(json.error ?? `Request failed (${res.status})`)
    }
    return res.json() as Promise<AnalysisResult>
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

  return { state, result, domain, error, refreshError, runAnalysis, refreshResults }
}
