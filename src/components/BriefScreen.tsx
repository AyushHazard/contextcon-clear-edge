'use client'

import { useState, useEffect } from 'react'
import type { AnalysisResult } from '@/lib/types'
import CompetitorCard from './CompetitorCard'
import GrowthRow from './GrowthRow'
import DocModal from './DocModal'
import VisionDoc from './VisionDoc'
import HackathonDoc from './HackathonDoc'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  RefreshCcw, 
  Edit3, 
  Check, 
  X, 
  BarChart3, 
  Zap, 
  ShieldAlert, 
  Target, 
  ExternalLink,
  BookOpen,
  Box
} from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  result: AnalysisResult
  onRefresh: () => void
  onChangeDomain: (domain: string) => void
  refreshError?: string | null
}

function cleanDomain(raw: string): string {
  return raw.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]
}

export default function BriefScreen({ result, onRefresh, onChangeDomain, refreshError }: Props) {
  const [confirmPending, setConfirmPending] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(result.userDomain)
  const [openDoc, setOpenDoc] = useState<'vision' | 'hackathon' | null>(null)

  useEffect(() => {
    if (!confirmPending) return
    const t = setTimeout(() => setConfirmPending(false), 3000)
    return () => clearTimeout(t)
  }, [confirmPending])

  useEffect(() => {
    setEditValue(result.userDomain)
    setEditing(false)
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
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b-2 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="bg-primary p-1">
                <Box className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-black tracking-tighter uppercase italic text-lg">CLEAR EDGE</span>
            </div>

            <div className="h-6 w-[2px] bg-border hidden md:block" />

            <div className="flex items-center gap-2">
              {editing ? (
                <div className="flex items-center gap-0">
                  <Input
                    autoFocus
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={handleEditKeyDown}
                    className="h-8 w-40 rounded-none border-2 border-primary focus-visible:ring-0 text-xs font-mono"
                  />
                  <Button size="icon-xs" onClick={submitDomainEdit} className="h-8 w-8 rounded-none bg-primary">
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button size="icon-xs" variant="outline" onClick={() => { setEditing(false); setEditValue(result.userDomain) }} className="h-8 w-8 rounded-none border-2 border-l-0">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 group">
                  <Badge variant="secondary" className="rounded-none font-mono text-[10px] uppercase tracking-widest px-2 py-1 border border-border/50">
                    {result.userDomain}
                  </Badge>
                  <Button variant="ghost" size="icon-xs" onClick={() => setEditing(true)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Edit3 className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-4 mr-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
               <span>Analysed: {analysedAt}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setOpenDoc('vision')} className="hidden sm:flex rounded-none border-2 font-bold uppercase tracking-widest text-[10px]">
                <BookOpen className="mr-2 h-3 w-3" />
                Vision
              </Button>
              <Button 
                variant={confirmPending ? "destructive" : "outline"} 
                size="sm" 
                onClick={handleRefreshClick}
                className="rounded-none border-2 font-bold uppercase tracking-widest text-[10px]"
              >
                <RefreshCcw className={cn("mr-2 h-3 w-3", confirmPending ? "animate-spin" : "")} />
                {confirmPending ? 'Confirm?' : 'Refresh'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {refreshError && (
        <div className="bg-destructive text-destructive-foreground px-4 py-2 text-center text-[10px] font-bold uppercase tracking-[0.2em]">
          Error: {refreshError}
        </div>
      )}

      <main className="container mx-auto max-w-5xl px-4 py-12">
        <Tabs defaultValue="landscape" className="w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b-2 pb-2">
             <div className="space-y-1">
                <h2 className="text-3xl font-black tracking-tighter uppercase italic">Intelligence Brief</h2>
                <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider">Competitive Landscape & Growth Analysis</p>
             </div>
             <TabsList className="bg-transparent h-auto p-0 gap-8 justify-start">
              <TabsTrigger 
                value="landscape" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground data-[state=active]:text-foreground transition-all"
              >
                Landscape
              </TabsTrigger>
              <TabsTrigger 
                value="growth"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground data-[state=active]:text-foreground transition-all"
              >
                Growth
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="landscape" className="space-y-12 mt-0 outline-none">
            {/* Landscape Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 border-2 bg-primary/5 border-primary/20">
                <CardHeader className="pb-2">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2 flex items-center">
                    <Target className="w-3 h-3 mr-2" />
                    Overall Narrative
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-bold leading-tight tracking-tight italic">
                    {result.landscapeSummary.overallNarrative}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-destructive/30 bg-destructive/5">
                <CardHeader className="pb-2">
                   <div className="text-[10px] font-black uppercase tracking-[0.2em] text-destructive mb-2 flex items-center">
                    <ShieldAlert className="w-3 h-3 mr-2" />
                    Biggest Threat
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-bold leading-relaxed italic">
                    {result.landscapeSummary.biggestThreat}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 px-1">Market Dynamics</div>
                <div className="p-4 border-2 bg-card font-medium text-xs leading-relaxed h-full">
                  {result.landscapeSummary.marketDynamics}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary px-1">Opportunity Gap</div>
                <div className="p-4 border-2 border-primary/20 bg-primary/5 font-bold text-xs leading-relaxed text-primary/80 h-full">
                  {result.landscapeSummary.opportunityGap}
                </div>
              </div>
            </div>

            {/* Competitor Grid */}
            <div className="space-y-6 pt-6">
              <div className="flex items-center gap-4">
                 <h3 className="text-xl font-black tracking-tighter uppercase italic">The Players</h3>
                 <div className="h-[2px] flex-1 bg-border" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {result.landscapeAnalyses.map((a) => (
                  <CompetitorCard
                    key={a.competitorDomain}
                    analysis={a}
                    crustdata={crustMap.get(a.competitorDomain) ?? {}}
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="growth" className="space-y-12 mt-0 outline-none">
             {/* Growth Benchmark */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1 border-2 bg-primary border-primary">
                  <CardHeader>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-foreground/70 mb-2">Recommended Motion</div>
                    <CardTitle className="text-2xl font-black text-primary-foreground uppercase italic tracking-tighter">
                      {result.growthSummary.recommendedMotion}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-bold text-primary-foreground leading-snug">
                      {result.growthSummary.recommendation}
                    </p>
                  </CardContent>
                </Card>

                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 px-1">Dominant Motion</div>
                    <div className="p-4 border-2 bg-card font-medium text-xs leading-relaxed h-full">
                      {result.growthSummary.dominantMotionInSpace}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 px-1">Benchmarks</div>
                    <div className="p-4 border-2 bg-card font-medium text-xs leading-relaxed h-full">
                      {result.growthSummary.channelBenchmarks}
                    </div>
                  </div>
                </div>
             </div>

             <Card className="border-2 bg-amber-500/5 border-amber-500/20">
                <CardHeader className="pb-2">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600 mb-2 flex items-center">
                    <Zap className="w-3 h-3 mr-2 fill-amber-600" />
                    Ad Landscape Overview
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-semibold leading-relaxed">
                    {result.growthSummary.adLandscapeOverview}
                  </p>
                </CardContent>
              </Card>

             {/* Growth Analysis Rows */}
             <div className="space-y-6 pt-6">
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-black tracking-tighter uppercase italic">GTM Intelligence</h3>
                  <div className="h-[2px] flex-1 bg-border" />
                </div>
                <div className="space-y-4">
                  {result.growthAnalyses.map((a) => (
                    <GrowthRow key={a.competitorDomain} analysis={a} />
                  ))}
                </div>
             </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t-2 py-12 mt-20 bg-muted/20">
        <div className="container mx-auto px-4 max-w-6xl flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex items-center gap-2">
              <Box className="w-4 h-4 text-muted-foreground" />
              <span className="font-black tracking-tighter uppercase italic text-muted-foreground">CLEAR EDGE</span>
           </div>
           
           <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">
             <span>Data by Crustdata</span>
             <span>Intelligence by Gemini</span>
             <span>UI by Shadcn</span>
           </div>

           <div className="flex gap-4">
             <Button variant="ghost" size="sm" onClick={() => setOpenDoc('hackathon')} className="text-[10px] font-bold uppercase tracking-widest h-auto p-0 hover:bg-transparent">
                Hack Scope
             </Button>
             <div className="w-[1px] h-3 bg-border" />
             <Button variant="ghost" size="sm" onClick={() => setOpenDoc('vision')} className="text-[10px] font-bold uppercase tracking-widest h-auto p-0 hover:bg-transparent">
                Product Vision
             </Button>
           </div>
        </div>
      </footer>

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
