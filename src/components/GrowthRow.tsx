import type { EnrichedCompetitor, GrowthMotion } from '@/lib/types'
import { formatTraffic, formatGrowth, seoSignal } from '@/lib/format'

type Props = { competitor: EnrichedCompetitor }

const MOTION_COLOURS: Record<GrowthMotion, string> = {
  'Sales-led': 'bg-blue-900 text-blue-300 border-blue-700',
  'Content-led': 'bg-green-900 text-green-300 border-green-700',
  'Paid-led': 'bg-amber-900 text-amber-300 border-amber-700',
  'Product-led': 'bg-purple-900 text-purple-300 border-purple-700',
  'Community-led': 'bg-orange-900 text-orange-300 border-orange-700',
}

export default function GrowthRow({ competitor: c }: Props) {
  const name = c.basic_info?.name ?? c.domain
  const motionClass = MOTION_COLOURS[c.growthMotion] ?? 'bg-gray-800 text-gray-300 border-gray-700'
  const seo = seoSignal(c.seo?.monthly_google_ads_budget)
  const organic = formatTraffic(c.seo?.monthly_organic_clicks)
  const followers = formatGrowth(c.followers?.yoy_percent)
  const openRoles = c.hiring?.openings_count ?? null
  const openRolesGrowth = c.hiring?.openings_growth_percent ?? null

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div className="flex flex-wrap items-start gap-3">
        {/* Name */}
        <span className="text-white font-medium text-sm min-w-[120px]">{name}</span>

        {/* Growth motion badge */}
        <span className={`text-xs font-medium border rounded px-2 py-0.5 ${motionClass}`}>
          {c.growthMotion}
        </span>

        {/* Signals */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400 mt-0.5">
          <span>SEO spend: <span className="text-gray-300">{seo}</span></span>
          <span>Organic: <span className="text-gray-300">{organic}/mo</span></span>
          <span>Followers YoY: <span className="text-gray-300">{followers}</span></span>
          {openRoles != null && (
            <span>
              Open roles: <span className="text-gray-300">
                {openRoles}{openRolesGrowth != null ? ` (${formatGrowth(openRolesGrowth)})` : ''}
              </span>
            </span>
          )}
        </div>
      </div>

      {/* Reason */}
      <p className="mt-2 text-gray-500 text-xs">{c.growthMotionReason}</p>
    </div>
  )
}
