import type { CompetitorGrowthAnalysis } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type Props = { analysis: CompetitorGrowthAnalysis }

export default function GrowthRow({ analysis: a }: Props) {
  return (
    <Card className="border-2 bg-card/30 hover:bg-card/40 transition-colors">
      <CardContent className="p-4 flex flex-col md:flex-row gap-6 md:items-center">
        <div className="md:w-1/4 space-y-1">
          <div className="text-sm font-black tracking-tighter uppercase italic">{a.competitorDomain}</div>
          <Badge variant="outline" className="rounded-none border-primary/50 text-primary font-bold uppercase tracking-widest text-[9px]">
            {a.growthMotion}
          </Badge>
        </div>

        <div className="md:flex-1 space-y-2">
          <p className="text-xs text-muted-foreground font-medium leading-relaxed">{a.growthMotionReason}</p>
          
          <div className="flex flex-wrap gap-1.5">
            {a.channelBreakdown.map((ch, i) => (
              <Badge 
                key={i} 
                variant="secondary" 
                className="rounded-none text-[9px] font-bold uppercase tracking-wider px-2"
              >
                {ch.channel}: {ch.effectiveness}
              </Badge>
            ))}
          </div>
        </div>

        <div className="md:w-1/3 border-t md:border-t-0 md:border-l pl-0 md:pl-6 pt-3 md:pt-0">
          <div className="text-[9px] font-black uppercase tracking-[0.2em] text-primary mb-1">Key Insight</div>
          <p className="text-[11px] font-bold leading-tight">{a.keyInsight}</p>
          {a.adIntelligence && (
            <p className="text-[10px] text-muted-foreground italic mt-2 line-clamp-2">{a.adIntelligence}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
