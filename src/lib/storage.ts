import type { AnalysisResult, StoredState } from './types'

const KEY = 'clear_edge_v1'

function isBrowser() {
  return typeof window !== 'undefined'
}

export function getStoredState(): StoredState {
  if (!isBrowser()) return { domain: null, result: null }
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { domain: null, result: null }
    return JSON.parse(raw) as StoredState
  } catch {
    return { domain: null, result: null }
  }
}

function save(state: StoredState) {
  if (!isBrowser()) return
  localStorage.setItem(KEY, JSON.stringify(state))
}

export function setDomain(domain: string) {
  const current = getStoredState()
  save({ ...current, domain })
}

export function setResult(result: AnalysisResult) {
  const current = getStoredState()
  save({ ...current, result })
}

export function clearResult() {
  const current = getStoredState()
  save({ domain: current.domain, result: null })
}

export function clearAll() {
  if (!isBrowser()) return
  localStorage.removeItem(KEY)
}
