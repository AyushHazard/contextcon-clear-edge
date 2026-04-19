'use client'

import { useState } from 'react'
import DocModal from './DocModal'
import VisionDoc from './VisionDoc'
import HackathonDoc from './HackathonDoc'

type Props = {
  onSubmit: (domain: string) => void
  initialDomain?: string | null
  error?: string | null
}

const EXAMPLES = ['retool.com', 'hightouch.com', 'linear.app', 'figma.com']

function cleanDomain(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split('/')[0]
    .split('?')[0]
}

export default function OnboardingScreen({ onSubmit, initialDomain, error }: Props) {
  const [value, setValue] = useState(initialDomain ?? '')
  const [submitting, setSubmitting] = useState(false)
  const [openDoc, setOpenDoc] = useState<'vision' | 'hackathon' | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const d = cleanDomain(value)
    if (!d) return
    setSubmitting(true)
    await onSubmit(d)
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-4">

      {/* Top-right doc buttons */}
      <div className="fixed top-4 right-4 flex items-center gap-2">
        <button
          onClick={() => setOpenDoc('vision')}
          className="text-xs text-zinc-500 border border-zinc-800 rounded px-3 py-1.5 hover:border-zinc-600 hover:text-zinc-300 transition-colors"
        >
          Product Vision
        </button>
        <button
          onClick={() => setOpenDoc('hackathon')}
          className="text-xs text-zinc-500 border border-zinc-800 rounded px-3 py-1.5 hover:border-zinc-600 hover:text-zinc-300 transition-colors"
        >
          ContextCon Hack Scope
        </button>
      </div>

      <div className="w-full max-w-md">

        {/* Badge */}
        <div className="flex justify-center mb-8">
          <span className="text-[10px] font-medium tracking-widest uppercase text-zinc-500 border border-zinc-800 rounded-full px-3 py-1">
            Competitive Intelligence
          </span>
        </div>

        {/* Wordmark */}
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-bold text-zinc-50 tracking-tight">Clear Edge</h1>
          <p className="mt-4 text-zinc-400 text-sm leading-relaxed max-w-sm mx-auto">
            Enter your company domain. Get a structured intelligence brief on your competitive landscape and growth position.
          </p>
        </div>

        {/* Input form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="retool.com"
              disabled={submitting}
              className="flex-1 bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-600 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 disabled:opacity-50 transition-colors font-mono"
            />
            <button
              type="submit"
              disabled={!value.trim() || submitting}
              className="bg-zinc-50 hover:bg-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed text-zinc-950 font-medium rounded-md px-5 py-2.5 text-sm transition-colors whitespace-nowrap"
            >
              {submitting ? 'Analysing…' : 'Analyse'}
            </button>
          </div>

          {error && (
            <p className="text-red-400 text-xs px-1">{error}</p>
          )}
        </form>

        {/* Example chips */}
        <div className="mt-6 flex items-center gap-2 flex-wrap">
          <span className="text-zinc-600 text-xs">Try:</span>
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => setValue(ex)}
              className="text-xs text-zinc-500 border border-zinc-800 rounded-md px-2.5 py-1 hover:border-zinc-600 hover:text-zinc-300 transition-colors font-mono"
            >
              {ex}
            </button>
          ))}
        </div>

        {/* Doc buttons + Powered by */}
        <div className="mt-10 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOpenDoc('vision')}
              className="text-xs text-zinc-500 border border-zinc-800 rounded px-3 py-1.5 hover:border-zinc-600 hover:text-zinc-300 transition-colors"
            >
              Product Vision
            </button>
            <button
              onClick={() => setOpenDoc('hackathon')}
              className="text-xs text-zinc-500 border border-zinc-800 rounded px-3 py-1.5 hover:border-zinc-600 hover:text-zinc-300 transition-colors"
            >
              ContextCon Hack Scope
            </button>
          </div>
          <p className="text-zinc-700 text-xs">
            Powered by <span className="text-zinc-500 font-medium">CrustData</span>
          </p>
        </div>

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
