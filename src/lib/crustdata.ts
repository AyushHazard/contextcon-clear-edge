import type { CrustdataCompany } from './types'

const BASE = 'https://api.crustdata.com/company/search'

const HEADERS = (apiKey: string) => ({
  Authorization: `Bearer ${apiKey}`,
  'Content-Type': 'application/json',
  'x-api-version': '2025-11-01',
})

async function crustSearch(apiKey: string, body: object): Promise<CrustdataCompany[]> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: HEADERS(apiKey),
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Crustdata API error ${res.status}: ${text}`)
  }

  const json = await res.json()
  return (json.companies ?? []) as CrustdataCompany[]
}

function cleanDomain(domain: string): string {
  return domain
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split('/')[0]
}

const BASE_FIELDS = [
  'crustdata_company_id',
  'basic_info.name',
  'basic_info.primary_domain',
  'basic_info.description',
  'basic_info.year_founded',
  'funding.total_investment_usd',
  'funding.last_round_type',
  'funding.last_round_amount_usd',
  'funding.last_fundraise_date',
  'funding.investors',
  'headcount.total',
  'roles.distribution',
  'roles.growth_yoy',
  'revenue.estimated.lower_bound_usd',
  'revenue.estimated.upper_bound_usd',
  'hiring.openings_count',
  'hiring.openings_growth_percent',
  'followers.yoy_percent',
  'followers.count',
  'taxonomy.categories',
  'competitors.company_ids',
  'competitors.websites',
]

export async function enrichCompany(domain: string, apiKey: string): Promise<CrustdataCompany> {
  const d = cleanDomain(domain)

  const results = await crustSearch(apiKey, {
    filters: {
      field: 'basic_info.primary_domain',
      type: '=',
      value: d,
    },
    limit: 1,
  })

  if (!results.length) {
    throw new Error(
      `No company data found for "${domain}". Try the bare domain without www (e.g. retool.com).`
    )
  }

  return results[0]
}

export async function findCompetitorsByTaxonomy(
  company: CrustdataCompany,
  apiKey: string
): Promise<CrustdataCompany[]> {
  // Use the most specific signal first: professional_network_specialities (e.g. "Low-code")
  // Fall back to taxonomy.categories if specialities are missing
  const specialities = company.taxonomy?.professional_network_specialities ?? []
  const categories = company.taxonomy?.categories ?? []
  const excludeId = company.crustdata_company_id

  const filterValue = specialities.length ? specialities[0] : categories[0]
  const filterField = specialities.length
    ? 'taxonomy.professional_network_specialities'
    : 'taxonomy.categories'

  if (!filterValue) {
    throw new Error('Could not determine taxonomy for this company to find competitors.')
  }

  const results = await crustSearch(apiKey, {
    filters: {
      field: filterField,
      type: '=',
      value: filterValue,
    },
    fields: BASE_FIELDS,
    sorts: [{ column: 'funding.total_investment_usd', order: 'desc' }],
    limit: 10,
  })

  // Exclude the user's own company, take top 5
  return results
    .filter((c) => c.crustdata_company_id !== excludeId)
    .slice(0, 5)
}
