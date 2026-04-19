'use client'

import { useState } from 'react'

type Props = {
  onSubmit: (domain: string) => void
  initialDomain?: string | null
  error?: string | null
}

const EXAMPLES = ['retool.com', 'notion.so', 'linear.app', 'figma.com']

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const d = cleanDomain(value)
    if (!d) return
    setSubmitting(true)
    await onSubmit(d)
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-lg">
        {/* Wordmark */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-white tracking-tight">Clear Edge</h1>
          <p className="mt-3 text-gray-400 text-base">
            Enter your company domain. Get a competitive intelligence brief in seconds.
          </p>
        </div>

        {/* Input form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="retool.com"
            disabled={submitting}
            className="flex-1 bg-gray-900 border border-gray-700 text-white placeholder-gray-600 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!value.trim() || submitting}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium rounded-lg px-5 py-3 text-sm transition-colors"
          >
            {submitting ? 'Analysing…' : 'Analyse'}
          </button>
        </form>

        {/* Error */}
        {error && (
          <p className="mt-3 text-red-400 text-sm">{error}</p>
        )}

        {/* Example chips */}
        <div className="mt-6 flex items-center gap-2 flex-wrap">
          <span className="text-gray-600 text-xs">Try:</span>
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => setValue(ex)}
              className="text-xs text-gray-400 border border-gray-700 rounded px-2 py-1 hover:border-indigo-500 hover:text-indigo-400 transition-colors"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
