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

  const crustMap = new Map(
    result.competitors.map((c) => [c.basic_info?.primary_domain ?? '', c])
  )

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">

      {/* Header */}
      <div className="sticky top-0 z-10 bg-zinc-950/95 backdrop-blur border-b border-zinc-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-zinc-100 font-bold text-base tracking-tight">Clear Edge</span>

          <div className="h-4 w-px bg-zinc-800" />

          {editing ? (
            <div className="flex items-center gap-1.5">
              <input
                autoFocus
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleEditKeyDown}
                className="bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs rounded px-2 py-1 font-mono w-36 focus:outline-none focus:border-zinc-500"
              />
              <button onClick={submitDomainEdit} className="text-zinc-400 hover:text-zinc-100 p-1 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <button onClick={() => { setEditing(false); setEditValue(result.userDomain) }} className="text-zinc-600 hover:text-zinc-300 p-1 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="bg-zinc-900 text-zinc-400 text-xs rounded px-2 py-1 font-mono border border-zinc-800">{result.userDomain}</span>
              <button onClick={() => setEditing(true)} className="text-zinc-700 hover:text-zinc-400 p-1 transition-colors" title="Change domain">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
            </div>
          )}

          <span className="text-zinc-700 text-xs hidden md:block">{analysedAt}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setOpenDoc('vision')}
            className="text-xs text-zinc-500 border border-zinc-800 rounded px-3 py-1.5 hover:border-zinc-600 hover:text-zinc-300 transition-colors hidden sm:block"
          >
            Product Vision
          </button>
          <button
            onClick={() => setOpenDoc('hackathon')}
            className="text-xs text-zinc-500 border border-zinc-800 rounded px-3 py-1.5 hover:border-zinc-600 hover:text-zinc-300 transition-colors hidden sm:block"
          >
            ContextCon Hack Scope
          </button>
          <button
            onClick={handleRefreshClick}
            className={`text-xs font-medium rounded px-3 py-1.5 border transition-colors ${
              confirmPending
                ? 'bg-red-950 text-red-400 border-red-900 hover:bg-red-900'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-zinc-200'
            }`}
          >
            {confirmPending ? 'Confirm refresh?' : 'Refresh'}
          </button>
        </div>
      </div>

      {refreshError && (
        <div className="border-b border-red-900 bg-red-950/50 px-6 py-3 text-red-400 text-xs">{refreshError}</div>
      )}

      {/* Tabs */}
      <div className="border-b border-zinc-800 px-6">
        <div className="max-w-5xl mx-auto flex gap-0">
          {([
            { id: 'landscape', label: 'Competitor Landscape' },
            { id: 'growth', label: 'Growth Intelligence' },
          ] as { id: Tab; label: string }[]).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
                activeTab === tab.id
                  ? 'border-zinc-100 text-zinc-100'
                  : 'border-transparent text-zinc-600 hover:text-zinc-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* ── Competitor Landscape ── */}
        {activeTab === 'landscape' && (
          <section className="space-y-6">

            {/* Summary callout */}
            <div className="border border-zinc-800 rounded-md px-5 py-4 bg-zinc-900">
              <p className="text-zinc-300 text-sm leading-relaxed">{result.landscapeSummary.overallNarrative}</p>
            </div>

            {/* Market dynamics + opportunity */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-800 border border-zinc-800 rounded-md overflow-hidden">
              <div className="bg-zinc-950 px-4 py-4 md:col-span-1">
                <p className="text-zinc-600 text-[10px] uppercase tracking-widest mb-2">Market Dynamics</p>
                <p className="text-zinc-300 text-xs leading-relaxed">{result.landscapeSummary.marketDynamics}</p>
              </div>
              <div className="bg-zinc-950 px-4 py-4 md:col-span-1">
                <p className="text-zinc-600 text-[10px] uppercase tracking-widest mb-2">Opportunity Gap</p>
                <p className="text-zinc-300 text-xs leading-relaxed">{result.landscapeSummary.opportunityGap}</p>
              </div>
              <div className="bg-zinc-950 px-4 py-4 md:col-span-1">
                <p className="text-red-900 text-[10px] uppercase tracking-widest mb-2">Biggest Threat</p>
                <p className="text-zinc-300 text-xs leading-relaxed">{result.landscapeSummary.biggestThreat}</p>
              </div>
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

        {/* ── Growth Intelligence ── */}
        {activeTab === 'growth' && (
          <section className="space-y-6">

            {/* Benchmarks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-800 border border-zinc-800 rounded-md overflow-hidden">
              <div className="bg-zinc-950 px-4 py-4">
                <p className="text-zinc-600 text-[10px] uppercase tracking-widest mb-2">Dominant Motion in Space</p>
                <p className="text-zinc-300 text-xs leading-relaxed">{result.growthSummary.dominantMotionInSpace}</p>
              </div>
              <div className="bg-zinc-950 px-4 py-4">
                <p className="text-zinc-600 text-[10px] uppercase tracking-widest mb-2">Channel Benchmarks</p>
                <p className="text-zinc-300 text-xs leading-relaxed">{result.growthSummary.channelBenchmarks}</p>
              </div>
            </div>

            {/* Ad landscape */}
            <div className="border border-zinc-800 rounded-md px-4 py-4 bg-zinc-900">
              <p className="text-zinc-600 text-[10px] uppercase tracking-widest mb-2">Ad Landscape</p>
              <p className="text-zinc-300 text-xs leading-relaxed">{result.growthSummary.adLandscapeOverview}</p>
            </div>

            {/* Growth rows */}
            <div className="space-y-3">
              {result.growthAnalyses.map((a) => (
                <GrowthRow key={a.competitorDomain} analysis={a} />
              ))}
            </div>

            {/* Recommendation */}
            <div className="border border-zinc-800 rounded-md overflow-hidden">
              <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-2 flex items-center gap-2">
                <span className="text-zinc-100 text-xs font-semibold uppercase tracking-widest">Growth Recommendation</span>
                <span className="text-[10px] border border-zinc-700 text-zinc-500 rounded px-2 py-0.5">{result.growthSummary.recommendedMotion}</span>
              </div>
              <div className="px-4 py-4 bg-zinc-950">
                <p className="text-zinc-300 text-sm leading-relaxed">{result.growthSummary.recommendation}</p>
              </div>
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
