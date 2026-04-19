'use client'

import { useState, useEffect } from 'react'
import type { AnalysisResult } from '@/lib/types'
import CompetitorCard from './CompetitorCard'
import GrowthRow from './GrowthRow'
import DocModal from './DocModal'
import VisionDoc from './VisionDoc'
import HackathonDoc from './HackathonDoc'

type Props = {
  result: AnalysisResult
  onRefresh: () => void
  onChangeDomain: (domain: string) => void
  refreshError?: string | null
}

type Tab = 'landscape' | 'growth'

function cleanDomain(raw: string): string {
  return raw.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]
}

export default function BriefScreen({ result, onRefresh, onChangeDomain, refreshError }: Props) {
  const [confirmPending, setConfirmPending] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(result.userDomain)
  const [activeTab, setActiveTab] = useState<Tab>('landscape')
  const [openDoc, setOpenDoc] = useState<'vision' | 'hackathon' | null>(null)

  useEffect(() => {
    if (!confirmPending) return
    const t = setTimeout(() => setConfirmPending(false), 3000)
    return () => clearTimeout(t)
  }, [confirmPending])

  useEffect(() => {
    setEditValue(result.userDomain)
    setEditing(false)
    setActiveTab('landscape')
  }, [result.userDomain])

  function submitDomainEdit() {
    const d = cleanDomain(editValue)
    if (!d) return
    setEditing(false)
    onChangeDomain(d)
  }

  function handleEditKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') submitDomainEdit()
    if (e.key === 'Escape') { setEditing(false); setEditValue(result.userDomain) }
  }

  function handleRefreshClick() {
    if (confirmPending) { setConfirmPending(false); onRefresh() }
    else setConfirmPending(true)
  }

  const analysedAt = new Date(result.analysedAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })

  // Build a lookup map: competitorDomain → CrustdataCompany
  const crustMap = new Map(
    result.competitors.map((c) => [c.basic_info?.primary_domain ?? '', c])
  )

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-950/90 backdrop-blur border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-white font-bold text-lg">Clear Edge</span>

          {editing ? (
            <div className="flex items-center gap-1">
              <input
                autoFocus
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleEditKeyDown}
                className="bg-gray-800 border border-indigo-500 text-gray-200 text-xs rounded px-2 py-1 font-mono w-36 focus:outline-none"
              />
              <button onClick={submitDomainEdit} className="text-indigo-400 hover:text-indigo-300 p-1" title="Confirm">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <button onClick={() => { setEditing(false); setEditValue(result.userDomain) }} className="text-gray-500 hover:text-gray-300 p-1" title="Cancel">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <span className="bg-gray-800 text-gray-300 text-xs rounded px-2 py-1 font-mono">{result.userDomain}</span>
              <button onClick={() => setEditing(true)} className="text-gray-600 hover:text-gray-300 p-1 transition-colors" title="Change domain">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
            </div>
          )}

          <span className="text-gray-600 text-xs hidden sm:block">Analysed {analysedAt}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOpenDoc('vision')}
            className="text-xs font-medium rounded-lg px-3 py-2 bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-500 hover:text-gray-200 transition-colors hidden sm:block"
          >
            Product Vision
          </button>
          <button
            onClick={() => setOpenDoc('hackathon')}
            className="text-xs font-medium rounded-lg px-3 py-2 bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-500 hover:text-gray-200 transition-colors hidden sm:block"
          >
            ContextCon Hack Scope
          </button>
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
      </div>

      {refreshError && (
        <div className="bg-red-950 border-b border-red-800 px-6 py-3 text-red-400 text-sm">{refreshError}</div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-800 px-6">
        <div className="max-w-5xl mx-auto flex">
          {([
            { id: 'landscape', label: 'Competitor Landscape' },
            { id: 'growth', label: 'Growth Intelligence' },
          ] as { id: Tab; label: string }[]).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-white'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* ── Competitor Landscape tab ── */}
        {activeTab === 'landscape' && (
          <section className="space-y-6">
            {/* Overall narrative */}
            <div className="bg-gray-900 border-l-4 border-indigo-500 rounded-r-xl px-5 py-4">
              <p className="text-gray-300 text-sm leading-relaxed">{result.landscapeSummary.overallNarrative}</p>
            </div>

            {/* Market dynamics + opportunity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3">
                <p className="text-gray-500 text-[10px] uppercase tracking-wide mb-1">Market Dynamics</p>
                <p className="text-gray-300 text-xs leading-relaxed">{result.landscapeSummary.marketDynamics}</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3">
                <p className="text-green-500 text-[10px] uppercase tracking-wide mb-1">Your Opportunity</p>
                <p className="text-gray-300 text-xs leading-relaxed">{result.landscapeSummary.opportunityGap}</p>
              </div>
            </div>

            {/* Biggest threat callout */}
            <div className="bg-red-950 border border-red-800 rounded-xl px-4 py-3">
              <p className="text-red-400 text-[10px] uppercase tracking-wide mb-1">Biggest Threat</p>
              <p className="text-gray-300 text-xs leading-relaxed">{result.landscapeSummary.biggestThreat}</p>
            </div>

            {/* Competitor cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.landscapeAnalyses.map((a) => (
                <CompetitorCard
                  key={a.competitorDomain}
                  analysis={a}
                  crustdata={crustMap.get(a.competitorDomain) ?? {}}
                />
              ))}
            </div>
          </section>
        )}

        {/* ── Growth Intelligence tab ── */}
        {activeTab === 'growth' && (
          <section className="space-y-6">
            {/* Benchmark block */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3">
                <p className="text-gray-500 text-[10px] uppercase tracking-wide mb-1">Dominant Motion in Space</p>
                <p className="text-gray-300 text-xs leading-relaxed">{result.growthSummary.dominantMotionInSpace}</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3">
                <p className="text-gray-500 text-[10px] uppercase tracking-wide mb-1">Channel Benchmarks</p>
                <p className="text-gray-300 text-xs leading-relaxed">{result.growthSummary.channelBenchmarks}</p>
              </div>
            </div>

            {/* Ad landscape */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3">
              <p className="text-amber-500 text-[10px] uppercase tracking-wide mb-1">Ad Landscape</p>
              <p className="text-gray-300 text-xs leading-relaxed">{result.growthSummary.adLandscapeOverview}</p>
            </div>

            {/* Per-competitor growth rows */}
            <div className="space-y-3">
              {result.growthAnalyses.map((a) => (
                <GrowthRow key={a.competitorDomain} analysis={a} />
              ))}
            </div>

            {/* Growth recommendation */}
            <div className="bg-gray-900 border-l-4 border-green-500 rounded-r-xl px-5 py-4">
              <p className="text-green-400 text-[10px] font-semibold uppercase tracking-wide mb-2">
                Growth Recommendation — {result.growthSummary.recommendedMotion}
              </p>
              <p className="text-gray-300 text-sm leading-relaxed">{result.growthSummary.recommendation}</p>
            </div>
          </section>
        )}

      </div>

      {openDoc === 'vision' && (
        <DocModal title="Overall Product Vision" onClose={() => setOpenDoc(null)}>
          <VisionDoc />
        </DocModal>
      )}
      {openDoc === 'hackathon' && (
        <DocModal title="Scope for the ContextCon Hack" onClose={() => setOpenDoc(null)}>
          <HackathonDoc />
        </DocModal>
      )}
    </div>
  )
}
