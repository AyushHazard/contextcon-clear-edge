export type CrustdataCompany = {
  crustdata_company_id?: number
  basic_info?: {
    name?: string
    description?: string
    primary_domain?: string
    year_founded?: string
    company_type?: string
  }
  funding?: {
    total_investment_usd?: number | null
    last_round_type?: string | null
    last_round_amount_usd?: number | null
    last_fundraise_date?: string | null
    investors?: string[]
  }
  headcount?: {
    total?: number | null
  }
  roles?: {
    distribution?: Record<string, number>
    growth_yoy?: Record<string, number>
  }
  revenue?: {
    estimated?: {
      lower_bound_usd?: number | null
      upper_bound_usd?: number | null
    }
  }
  web_traffic?: {
    monthly_visitors?: number | null
  }
  hiring?: {
    recent_titles_csv?: string | null
    openings_count?: number | null
    openings_growth_percent?: number | null
  }
  seo?: {
    monthly_google_ads_budget?: number | null
    monthly_organic_clicks?: number | null
  }
  followers?: {
    yoy_percent?: number | null
    count?: number | null
    mom_percent?: number | null
  }
  taxonomy?: {
    categories?: string[]
    professional_network_specialities?: string[]
    professional_network_industry?: string
  }
  news?: Array<{ title?: string; url?: string; date?: string }>
  competitors?: {
    company_ids?: number[]
    websites?: string[]
  }
}

export type GrowthMotion =
  | 'Sales-led'
  | 'Content-led'
  | 'Paid-led'
  | 'Product-led'
  | 'Community-led'

export type ClaudeCompetitor = {
  domain: string
  threatSummary: string
  growthMotion: GrowthMotion
  growthMotionReason: string
}

export type ClaudeAnalysis = {
  landscapeSummary: string
  competitors: ClaudeCompetitor[]
  growthRecommendation: string
}

export type EnrichedCompetitor = CrustdataCompany &
  ClaudeCompetitor & {
    domain: string
  }

export type AnalysisResult = {
  userDomain: string
  analysedAt: string
  landscapeSummary: string
  growthRecommendation: string
  competitors: EnrichedCompetitor[]
}

export type StoredState = {
  domain: string | null
  result: AnalysisResult | null
}
