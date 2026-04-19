'use client'

import { useState, useEffect } from 'react'

const MESSAGES = [
  { text: 'Identifying your company…', at: 0 },
  { text: 'Finding your competitors…', at: 2000 },
  { text: 'Analysing growth signals…', at: 5000 },
  { text: 'Generating your brief…', at: 9000 },
]

export default function LoadingScreen() {
  const [msgIndex, setMsgIndex] = useState(0)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const start = Date.now()

    const timers = MESSAGES.slice(1).map((m, i) =>
      setTimeout(() => setMsgIndex(i + 1), m.at)
    )

    const ticker = setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000))
    }, 1000)

    return () => {
      timers.forEach(clearTimeout)
      clearInterval(ticker)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-8">Clear Edge</h1>

        {/* Spinner */}
        <div className="flex justify-center mb-6">
          <div className="w-8 h-8 border-2 border-gray-700 border-t-indigo-500 rounded-full animate-spin" />
        </div>

        {/* Message */}
        <p className="text-gray-300 text-base font-medium min-h-[1.5rem]">
          {MESSAGES[msgIndex].text}
        </p>

        {/* Elapsed */}
        <p className="mt-3 text-gray-600 text-xs">{elapsed}s</p>
      </div>
    </div>
  )
}
