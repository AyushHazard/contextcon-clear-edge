import type { CompetitorGrowthAnalysis, GrowthMotion } from '@/lib/types'

type Props = { analysis: CompetitorGrowthAnalysis }

const MOTION_COLOURS: Record<GrowthMotion, string> = {
  'Sales-led': 'bg-blue-900 text-blue-300 border-blue-700',
  'Content-led': 'bg-green-900 text-green-300 border-green-700',
  'Paid-led': 'bg-amber-900 text-amber-300 border-amber-700',
  'Product-led': 'bg-purple-900 text-purple-300 border-purple-700',
  'Community-led': 'bg-orange-900 text-orange-300 border-orange-700',
}

const EFFECTIVENESS_COLOURS = {
  High: 'bg-green-900 text-green-300',
  Medium: 'bg-yellow-900 text-yellow-300',
  Low: 'bg-gray-800 text-gray-400',
  Unknown: 'bg-gray-800 text-gray-500',
}

export default function GrowthRow({ analysis: a }: Props) {
  const motionClass = MOTION_COLOURS[a.growthMotion] ?? 'bg-gray-800 text-gray-300 border-gray-700'

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col gap-3">
      {/* Top row */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-white font-medium text-sm">{a.competitorDomain}</span>
        <span className={`text-xs font-medium border rounded px-2 py-0.5 ${motionClass}`}>
          {a.growthMotion}
        </span>
      </div>

      {/* Growth motion reason */}
      <p className="text-gray-500 text-xs">{a.growthMotionReason}</p>

      {/* Channel breakdown */}
      {a.channelBreakdown.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {a.channelBreakdown.map((ch, i) => (
            <div
              key={i}
              className="group relative"
              title={ch.evidence}
            >
              <span className={`text-xs rounded px-2 py-0.5 cursor-default ${EFFECTIVENESS_COLOURS[ch.effectiveness]}`}>
                {ch.channel}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Key insight */}
      <div className="border-t border-gray-800 pt-2">
        <p className="text-indigo-400 text-[10px] uppercase tracking-wide mb-1">Key Insight</p>
        <p className="text-gray-300 text-xs">{a.keyInsight}</p>
      </div>

      {/* Ad intelligence */}
      {a.adIntelligence && (
        <div>
          <p className="text-gray-600 text-[10px] uppercase tracking-wide mb-1">Ad Intelligence</p>
          <p className="text-gray-400 text-xs">{a.adIntelligence}</p>
        </div>
      )}
    </div>
  )
}
