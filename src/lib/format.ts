export function formatFunding(usd?: number | null): string {
  if (usd == null) return '—'
  if (usd >= 1_000_000_000) return `$${(usd / 1_000_000_000).toFixed(1)}b`
  if (usd >= 1_000_000) return `$${(usd / 1_000_000).toFixed(1)}m`
  if (usd >= 1_000) return `$${(usd / 1_000).toFixed(0)}k`
  return `$${usd}`
}

export function formatNumber(n?: number | null): string {
  if (n == null) return '—'
  return n.toLocaleString()
}

export function formatTraffic(n?: number | null): string {
  if (n == null) return '—'
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}m`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`
  return `${n}`
}

export function formatDate(iso?: string | null): string {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  } catch {
    return iso
  }
}

export function formatGrowth(pct?: number | null): string {
  if (pct == null) return '—'
  const sign = pct > 0 ? '+' : ''
  return `${sign}${pct.toFixed(0)}%`
}

export function seoSignal(budget?: number | null): string {
  if (budget == null) return '—'
  if (budget > 50_000) return 'High'
  if (budget >= 5_000) return 'Medium'
  return 'Low'
}
