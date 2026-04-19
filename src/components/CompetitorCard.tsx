import type { EnrichedCompetitor } from '@/lib/types'
import { formatFunding, formatNumber, formatTraffic, formatDate, formatGrowth } from '@/lib/format'

type Props = { competitor: EnrichedCompetitor }

export default function CompetitorCard({ competitor: c }: Props) {
  const name = c.basic_info?.name ?? c.domain
  const description = c.basic_info?.description ?? null
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
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col gap-4">
      {/* Header */}
      <div>
        <h3 className="text-white font-semibold text-base">{name}</h3>
        {description && (
          <p className="text-gray-400 text-xs mt-1 line-clamp-2">{description}</p>
        )}
      </div>

      {/* Data grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
        <DataRow
          label="Total funding"
          value={formatFunding(c.funding?.total_investment_usd)}
        />
        <DataRow
          label="Last round"
          value={
            c.funding?.last_round_type
              ? `${c.funding.last_round_type} · ${formatDate(c.funding.last_fundraise_date)}`
              : '—'
          }
        />
        <DataRow
          label="Headcount"
          value={formatNumber(c.headcount?.total)}
        />
        <DataRow label="Revenue est." value={revenueStr} />
        <DataRow label="Web traffic" value={`${formatTraffic(c.web_traffic?.monthly_visitors)}/mo`} />
        {investors.length > 0 && (
          <DataRow label="Investors" value={investors.join(', ')} />
        )}
      </div>

      {/* AI Threat Analysis */}
      <div className="border-t border-gray-800 pt-4">
        <p className="text-indigo-400 text-xs font-medium mb-2 uppercase tracking-wide">
          AI Threat Analysis
        </p>
        <p className="text-gray-300 text-xs leading-relaxed italic">{c.threatSummary}</p>
      </div>
    </div>
  )
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-gray-600">{label}: </span>
      <span className="text-gray-300">{value}</span>
    </div>
  )
}
