import type { CompetitorLandscapeAnalysis, CrustdataCompany } from '@/lib/types'
import { formatFunding, formatNumber, formatDate } from '@/lib/format'

type Props = {
  analysis: CompetitorLandscapeAnalysis
  crustdata: CrustdataCompany
}

const THREAT_STYLES = {
  High: 'bg-red-900 text-red-300 border-red-700',
  Medium: 'bg-amber-900 text-amber-300 border-amber-700',
  Low: 'bg-green-900 text-green-300 border-green-700',
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
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-white font-semibold text-base">{a.competitorName}</h3>
          <p className="text-gray-500 text-xs font-mono mt-0.5">{a.competitorDomain}</p>
        </div>
        <span className={`text-xs font-medium border rounded px-2 py-0.5 shrink-0 ${THREAT_STYLES[a.threatLevel]}`}>
          {a.threatLevel} threat
        </span>
      </div>

      {/* Product description */}
      <p className="text-gray-400 text-xs leading-relaxed">{a.productDescription}</p>

      {/* Crustdata metrics */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
        <DataRow label="Total funding" value={formatFunding(c.funding?.total_investment_usd)} />
        <DataRow
          label="Last round"
          value={
            c.funding?.last_round_type
              ? `${c.funding.last_round_type} · ${formatDate(c.funding.last_fundraise_date)}`
              : a.fundingVerdict
          }
        />
        <DataRow label="Headcount" value={formatNumber(c.headcount?.total)} />
        <DataRow label="Revenue est." value={revenueStr} />
        {investors.length > 0 && (
          <DataRow label="Investors" value={investors.join(', ')} />
        )}
      </div>

      {/* Growth trajectory */}
      <div className="text-xs text-gray-400 italic">{a.growthTrajectory}</div>

      {/* Differentiation */}
      <div className="border-t border-gray-800 pt-3 grid grid-cols-2 gap-3 text-xs">
        <div>
          <p className="text-gray-600 uppercase tracking-wide text-[10px] mb-1">Their edge</p>
          <p className="text-gray-300">{a.keyDifferentiator}</p>
        </div>
        <div>
          <p className="text-gray-600 uppercase tracking-wide text-[10px] mb-1">Overlap with you</p>
          <p className="text-gray-300">{a.overlap}</p>
        </div>
      </div>

      {/* Overall verdict */}
      <div className="border-t border-gray-800 pt-3">
        <p className="text-indigo-400 text-[10px] font-medium uppercase tracking-wide mb-1">
          Analyst Verdict
        </p>
        <p className="text-gray-300 text-xs leading-relaxed">{a.overallVerdict}</p>
        <p className="text-gray-600 text-[10px] mt-1 italic">{a.threatReason}</p>
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
