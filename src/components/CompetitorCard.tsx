import type { CompetitorLandscapeAnalysis, CrustdataCompany } from '@/lib/types'
import { formatFunding, formatNumber, formatDate } from '@/lib/format'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type Props = {
  analysis: CompetitorLandscapeAnalysis
  crustdata: CrustdataCompany
}

const THREAT_VARIANTS = {
  High: 'destructive',
  Medium: 'outline',
  Low: 'secondary',
} as const

export default function CompetitorCard({ analysis: a, crustdata: c }: Props) {
  const investors = (c.funding?.investors ?? []).slice(0, 3)
  const revLow = c.revenue?.estimated?.lower_bound_usd
  const revHigh = c.revenue?.estimated?.upper_bound_usd
  const revenueStr =
    revLow != null && revHigh != null
      ? `${formatFunding(revLow)}–${formatFunding(revHigh)}`
      : revLow != null
      ? `~${formatFunding(revLow)}`
      : '—'

  return (
    <Card className="border-2 bg-card/40 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4 border-b">
        <div className="space-y-1">
          <CardTitle className="text-lg font-black tracking-tight uppercase">{a.competitorName}</CardTitle>
          <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{a.competitorDomain}</div>
        </div>
        <Badge variant={THREAT_VARIANTS[a.threatLevel]} className="rounded-none font-bold uppercase tracking-widest text-[10px] px-2 py-0.5">
          {a.threatLevel} THREAT
        </Badge>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <p className="text-xs leading-relaxed text-muted-foreground font-medium italic">
          "{a.productDescription}"
        </p>

        <div className="grid grid-cols-2 gap-4 text-[11px] border-y py-3 border-border/50">
          <DataRow label="Funding" value={formatFunding(c.funding?.total_investment_usd)} />
          <DataRow label="Headcount" value={formatNumber(c.headcount?.total)} />
          <DataRow 
            label="Last Round" 
            value={c.funding?.last_round_type ? `${c.funding.last_round_type}` : a.fundingVerdict} 
          />
          <DataRow label="Revenue" value={revenueStr} />
        </div>

        <div className="space-y-3">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-1">Differentiation</div>
            <p className="text-xs font-semibold leading-snug">{a.keyDifferentiator}</p>
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-1">Growth Trajectory</div>
            <p className="text-[11px] text-muted-foreground">{a.growthTrajectory}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/30 border-t flex flex-col items-start gap-1 p-4 pt-3">
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Analyst Verdict</div>
        <p className="text-xs font-bold leading-tight">{a.overallVerdict}</p>
        <p className="text-[10px] text-muted-foreground/70 italic mt-1">{a.threatReason}</p>
      </CardFooter>
    </Card>
  )
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-muted-foreground font-bold uppercase text-[9px] tracking-wider">{label}</span>
      <span className="font-semibold text-foreground truncate">{value || '—'}</span>
    </div>
  )
}
