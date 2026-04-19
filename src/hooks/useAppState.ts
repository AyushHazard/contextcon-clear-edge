'use client'

import { useState, useEffect, useRef } from 'react'
import { getStoredState, setDomain, setResult } from '@/lib/storage'
import type { AnalysisResult } from '@/lib/types'

export type AppState = 'onboarding' | 'loading' | 'brief'

const LOADING_MESSAGES = [
  'Identifying your company…',
  'Finding competitor candidates…',
  'Verifying direct competitors…',
  'Enriching competitor data…',
  'Analysing competitor landscape…',
  'Analysing growth strategies…',
  'Generating intelligence brief…',
  'Almost there…',
]

export function useAppState() {
  const [state, setState] = useState<AppState>('onboarding')
  const [result, setResultState] = useState<AnalysisResult | null>(null)
  const [domain, setDomainState] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [refreshError, setRefreshError] = useState<string | null>(null)
  const [loadingMessage, setLoadingMessage] = useState<string>(LOADING_MESSAGES[0])
  const msgIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

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

  function startRotatingMessages() {
    let idx = 0
    setLoadingMessage(LOADING_MESSAGES[0])
    msgIntervalRef.current = setInterval(() => {
      idx = Math.min(idx + 1, LOADING_MESSAGES.length - 1)
      setLoadingMessage(LOADING_MESSAGES[idx])
    }, 8000)
  }

  function stopRotatingMessages() {
    if (msgIntervalRef.current) {
      clearInterval(msgIntervalRef.current)
      msgIntervalRef.current = null
    }
  }

  async function callAnalyse(d: string): Promise<AnalysisResult> {
    const res = await fetch('/api/analyse/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain: d }),
    })

    const json = await res.json().catch(() => ({}))

    if (!res.ok) {
      throw new Error(json.error ?? `Analysis failed (${res.status})`)
    }

    return json.result as AnalysisResult
  }

  async function runAnalysis(inputDomain: string) {
    setError(null)
    setDomain(inputDomain)
    setDomainState(inputDomain)
    setState('loading')
    startRotatingMessages()
    try {
      const data = await callAnalyse(inputDomain)
      stopRotatingMessages()
      setResult(data)
      setResultState(data)
      setState('brief')
    } catch (err: unknown) {
      stopRotatingMessages()
      const msg = err instanceof Error ? err.message : 'Analysis failed. Please try again.'
      setError(msg)
      setState('onboarding')
    }
  }

  async function refreshResults() {
    if (!domain) return
    setRefreshError(null)
    setState('loading')
    startRotatingMessages()
    try {
      const data = await callAnalyse(domain)
      stopRotatingMessages()
      setResult(data)
      setResultState(data)
      setState('brief')
    } catch (err: unknown) {
      stopRotatingMessages()
      const msg = err instanceof Error ? err.message : 'Refresh failed.'
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
