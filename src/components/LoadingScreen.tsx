'use client'

import { useState, useEffect } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Loader2 } from 'lucide-react'

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
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center text-center">
          <div className="p-2 border-2 border-primary mb-6">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
          <h1 className="text-xl font-black tracking-[0.3em] uppercase italic mb-2">Analysing</h1>
          <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider h-5">
            {message ?? 'Initializing...'}
          </p>
        </div>

        <div className="space-y-4 border-2 p-6 bg-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-4 rounded-none bg-primary/20" />
            <Skeleton className="h-4 flex-1 rounded-none bg-primary/20" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-4 rounded-none opacity-60 bg-primary/10" />
            <Skeleton className="h-4 w-[80%] rounded-none opacity-60 bg-primary/10" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-4 rounded-none opacity-30 bg-primary/5" />
            <Skeleton className="h-4 w-[60%] rounded-none opacity-30 bg-primary/5" />
          </div>
        </div>

        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
          <span>Processing Data</span>
          <span>{elapsed}s</span>
        </div>
      </div>
    </div>
  )
}
