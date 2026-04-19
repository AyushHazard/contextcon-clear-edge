'use client'

import { useState, useEffect } from 'react'
import type { AnalysisResult } from '@/lib/types'
import CompetitorCard from './CompetitorCard'
import GrowthRow from './GrowthRow'

type Props = {
  result: AnalysisResult
  onRefresh: () => void
  refreshError?: string | null
}

export default function BriefScreen({ result, onRefresh, refreshError }: Props) {
  const [confirmPending, setConfirmPending] = useState(false)

  useEffect(() => {
    if (!confirmPending) return
    const t = setTimeout(() => setConfirmPending(false), 3000)
    return () => clearTimeout(t)
  }, [confirmPending])

  function handleRefreshClick() {
    if (confirmPending) {
      setConfirmPending(false)
      onRefresh()
    } else {
      setConfirmPending(true)
    }
  }

  const analysedAt = new Date(result.analysedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-950/90 backdrop-blur border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-white font-bold text-lg">Clear Edge</span>
          <span className="bg-gray-800 text-gray-300 text-xs rounded px-2 py-1 font-mono">
            {result.userDomain}
          </span>
          <span className="text-gray-600 text-xs hidden sm:block">Analysed {analysedAt}</span>
        </div>
        <button
          onClick={handleRefreshClick}
          className={`text-xs font-medium rounded-lg px-4 py-2 transition-colors ${
            confirmPending
              ? 'bg-red-900 text-red-300 border border-red-700 hover:bg-red-800'
              : 'bg-gray-800 text-gray-300 border border-gray-700 hover:border-gray-500'
          }`}
        >
          {confirmPending ? 'Confirm refresh?' : 'Refresh Results'}
        </button>
      </div>

      {/* Refresh error banner */}
      {refreshError && (
        <div className="bg-red-950 border-b border-red-800 px-6 py-3 text-red-400 text-sm">
          {refreshError}
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-14">
        {/* Section A: Competitor Landscape */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-4">
            Competitor Landscape
          </h2>

          {/* Landscape summary callout */}
          <div className="bg-gray-900 border-l-4 border-indigo-500 rounded-r-xl px-5 py-4 mb-6">
            <p className="text-gray-300 text-sm leading-relaxed">{result.landscapeSummary}</p>
          </div>

          {/* Competitor cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.competitors.map((c) => (
              <CompetitorCard key={c.domain} competitor={c} />
            ))}
          </div>
        </section>

        {/* Section B: Growth Intelligence */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-4">
            Growth Intelligence
          </h2>

          <div className="space-y-3 mb-6">
            {result.competitors.map((c) => (
              <GrowthRow key={c.domain} competitor={c} />
            ))}
          </div>

          {/* Growth recommendation callout */}
          <div className="bg-gray-900 border-l-4 border-green-500 rounded-r-xl px-5 py-4">
            <p className="text-green-400 text-xs font-semibold uppercase tracking-wide mb-2">
              Growth Recommendation
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">{result.growthRecommendation}</p>
          </div>
        </section>
      </div>
    </div>
  )
}
