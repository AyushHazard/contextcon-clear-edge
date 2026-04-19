'use client'

import { useState, useEffect } from 'react'

type Props = { message?: string }

export default function LoadingScreen({ message }: Props) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const start = Date.now()
    const ticker = setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000))
    }, 1000)
    return () => clearInterval(ticker)
  }, [])

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Wordmark */}
        <p className="text-center text-zinc-50 font-bold text-xl mb-12 tracking-tight">Clear Edge</p>

        {/* Progress bar */}
        <div className="h-px bg-zinc-800 rounded-full overflow-hidden mb-8">
          <div
            className="h-full bg-zinc-400 rounded-full animate-pulse"
            style={{ width: `${Math.min(90, 10 + elapsed * 3)}%`, transition: 'width 1s ease-out' }}
          />
        </div>

        {/* Message */}
        <p className="text-zinc-300 text-sm font-medium text-center min-h-[1.25rem]">
          {message ?? 'Starting analysis…'}
        </p>

        {/* Timer */}
        <p className="mt-3 text-zinc-600 text-xs text-center tabular-nums">{elapsed}s elapsed</p>

        {/* Steps hint */}
        <div className="mt-10 border border-zinc-800 rounded-md p-4 space-y-2">
          {[
            'Enriching company data',
            'Finding competitor candidates',
            'Verifying direct competitors',
            'Running competitive analysis',
            'Generating intelligence brief',
          ].map((step, i) => {
            const stepElapsed = i * 15
            const done = elapsed > stepElapsed + 12
            const active = elapsed >= stepElapsed && !done
            return (
              <div key={step} className="flex items-center gap-3">
                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  done ? 'bg-zinc-400' : active ? 'bg-zinc-400 animate-pulse' : 'bg-zinc-700'
                }`} />
                <span className={`text-xs ${
                  done ? 'text-zinc-500 line-through' : active ? 'text-zinc-300' : 'text-zinc-600'
                }`}>
                  {step}
                </span>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}
