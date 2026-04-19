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
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-8">Clear Edge</h1>

        <div className="flex justify-center mb-6">
          <div className="w-8 h-8 border-2 border-gray-700 border-t-indigo-500 rounded-full animate-spin" />
        </div>

        <p className="text-gray-300 text-base font-medium min-h-[1.5rem]">
          {message ?? 'Starting analysis…'}
        </p>

        <p className="mt-3 text-gray-600 text-xs">{elapsed}s</p>
      </div>
    </div>
  )
}
