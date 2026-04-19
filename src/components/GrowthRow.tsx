import type { CompetitorGrowthAnalysis, GrowthMotion } from '@/lib/types'

type Props = { analysis: CompetitorGrowthAnalysis }

const MOTION_STYLES: Record<GrowthMotion, string> = {
  'Sales-led': 'bg-blue-950 text-blue-400 border-blue-900',
  'Content-led': 'bg-emerald-950 text-emerald-400 border-emerald-900',
  'Paid-led': 'bg-amber-950 text-amber-400 border-amber-900',
  'Product-led': 'bg-violet-950 text-violet-400 border-violet-900',
  'Community-led': 'bg-orange-950 text-orange-400 border-orange-900',
}

const EFFECTIVENESS_STYLES = {
  High: 'bg-emerald-950 text-emerald-400 border-emerald-900',
  Medium: 'bg-amber-950 text-amber-400 border-amber-900',
  Low: 'bg-zinc-800 text-zinc-500 border-zinc-700',
  Unknown: 'bg-zinc-900 text-zinc-600 border-zinc-800',
}

export default function GrowthRow({ analysis: a }: Props) {
  const motionStyle = MOTION_STYLES[a.growthMotion] ?? 'bg-zinc-800 text-zinc-400 border-zinc-700'

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-md">
      {/* Header row */}
      <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-zinc-800">
        <span className="text-zinc-100 font-medium text-sm">{a.competitorDomain}</span>
        <span className={`text-[10px] font-medium border rounded px-2 py-0.5 uppercase tracking-wide ${motionStyle}`}>
          {a.growthMotion}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Left: motion reason + channels */}
        <div className="px-4 py-3 border-b border-zinc-800 md:border-b-0 md:border-r md:border-zinc-800 space-y-3">
          <p className="text-zinc-500 text-xs leading-relaxed">{a.growthMotionReason}</p>

          {a.channelBreakdown.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {a.channelBreakdown.map((ch, i) => (
                <span
                  key={i}
                  title={ch.evidence}
                  className={`text-[10px] border rounded px-2 py-0.5 cursor-default ${EFFECTIVENESS_STYLES[ch.effectiveness]}`}
                >
                  {ch.channel}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right: key insight + ad intel */}
        <div className="px-4 py-3 space-y-3">
          <div>
            <p className="text-zinc-600 text-[10px] uppercase tracking-widest mb-1.5">Key Insight</p>
            <p className="text-zinc-300 text-xs leading-relaxed">{a.keyInsight}</p>
          </div>

          {a.adIntelligence && (
            <div>
              <p className="text-zinc-600 text-[10px] uppercase tracking-widest mb-1.5">Ad Intelligence</p>
              <p className="text-zinc-500 text-xs leading-relaxed">{a.adIntelligence}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
