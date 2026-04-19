'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

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
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-lg border-2 bg-card/50 backdrop-blur-sm">
        <CardHeader className="text-center pb-6 border-b mb-6">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 border border-primary/20">
               <Sparkles className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-4xl font-black tracking-tighter uppercase italic">CLEAR EDGE</CardTitle>
          <CardDescription className="text-base font-medium text-muted-foreground/80">
            Real-time competitive intelligence from a single domain.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex gap-0 relative group">
              <Input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="retool.com"
                disabled={submitting}
                className="h-14 text-lg bg-background border-2 border-r-0 focus-visible:ring-0 focus-visible:border-primary transition-all pr-32"
              />
              <Button 
                type="submit" 
                disabled={!value.trim() || submitting}
                size="lg"
                className="h-14 px-8 absolute right-0 top-0 border-2 border-primary"
              >
                {submitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <span className="font-bold uppercase tracking-widest text-xs">Analyse</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 p-3">
                <p className="text-destructive text-sm font-semibold">{error}</p>
              </div>
            )}

            <div className="flex items-center gap-2 flex-wrap pt-2">
              <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.2em] mr-2">Try:</span>
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => setValue(ex)}
                  className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground border border-border px-2 py-1 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                >
                  {ex}
                </button>
              ))}
            </div>
          </form>
        </CardContent>
      </Card>
      
      <div className="mt-12 flex items-center gap-4 text-muted-foreground/40 text-[10px] uppercase font-bold tracking-[0.3em]">
        <span>Powered by Crustdata</span>
      </div>
    </div>
  )
}
