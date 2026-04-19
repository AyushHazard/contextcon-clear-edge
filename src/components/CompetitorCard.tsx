import type { CompetitorLandscapeAnalysis, CrustdataCompany } from '@/lib/types'
import { formatFunding, formatNumber, formatDate } from '@/lib/format'

type Props = {
  analysis: CompetitorLandscapeAnalysis
  crustdata: CrustdataCompany
}

const THREAT_STYLES = {
  High: 'bg-red-950 text-red-400 border-red-900',
  Medium: 'bg-amber-950 text-amber-400 border-amber-900',
  Low: 'bg-zinc-800 text-zinc-400 border-zinc-700',
}

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
    <div className="bg-zinc-900 border border-zinc-800 rounded-md flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 px-4 py-4 border-b border-zinc-800">
        <div>
          <h3 className="text-zinc-100 font-semibold text-sm">{a.competitorName}</h3>
          <p className="text-zinc-600 text-xs font-mono mt-0.5">{a.competitorDomain}</p>
        </div>
        <span className={`text-[10px] font-medium border rounded px-2 py-0.5 shrink-0 uppercase tracking-wide ${THREAT_STYLES[a.threatLevel]}`}>
          {a.threatLevel} threat
        </span>
      </div>

      {/* Product description */}
      <div className="px-4 py-3 border-b border-zinc-800">
        <p className="text-zinc-400 text-xs leading-relaxed">{a.productDescription}</p>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 border-b border-zinc-800">
        <Metric label="Total Funding" value={formatFunding(c.funding?.total_investment_usd)} />
        <Metric
          label="Last Round"
          value={
            c.funding?.last_round_type
              ? `${c.funding.last_round_type} · ${formatDate(c.funding.last_fundraise_date)}`
              : a.fundingVerdict
          }
          border
        />
        <Metric label="Headcount" value={formatNumber(c.headcount?.total)} topBorder />
        <Metric label="Revenue Est." value={revenueStr} border topBorder />
        {investors.length > 0 && (
          <Metric label="Investors" value={investors.join(', ')} topBorder span />
        )}
      </div>

      {/* Differentiation */}
      <div className="grid grid-cols-2 border-b border-zinc-800">
        <div className="px-4 py-3">
          <p className="text-zinc-600 text-[10px] uppercase tracking-widest mb-1.5">Their Edge</p>
          <p className="text-zinc-300 text-xs leading-relaxed">{a.keyDifferentiator}</p>
        </div>
        <div className="px-4 py-3 border-l border-zinc-800">
          <p className="text-zinc-600 text-[10px] uppercase tracking-widest mb-1.5">Overlap</p>
          <p className="text-zinc-300 text-xs leading-relaxed">{a.overlap}</p>
        </div>
      </div>

      {/* Verdict */}
      <div className="px-4 py-3">
        <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-1.5">Analyst Verdict</p>
        <p className="text-zinc-300 text-xs leading-relaxed">{a.overallVerdict}</p>
        {a.threatReason && (
          <p className="text-zinc-600 text-[10px] mt-2 italic">{a.threatReason}</p>
        )}
      </div>
    </div>
  )
}

function Metric({
  label,
  value,
  border,
  topBorder,
  span,
}: {
  label: string
  value: string
  border?: boolean
  topBorder?: boolean
  span?: boolean
}) {
  return (
    <div className={`px-4 py-3 ${border ? 'border-l border-zinc-800' : ''} ${topBorder ? 'border-t border-zinc-800' : ''} ${span ? 'col-span-2' : ''}`}>
      <p className="text-zinc-600 text-[10px] uppercase tracking-widest mb-1">{label}</p>
      <p className="text-zinc-300 text-xs font-medium">{value}</p>
    </div>
  )
}
