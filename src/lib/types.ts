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
  hiring?: {
    openings_count?: number | null
    openings_growth_percent?: number | null
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
}

export type GrowthMotion =
  | 'Sales-led'
  | 'Content-led'
  | 'Paid-led'
  | 'Product-led'
  | 'Community-led'

// Step 3 — per-candidate competitor verification
export type CompetitorVerification = {
  isDirectCompetitor: boolean
  reason: string
}

// Step 5a — per-competitor landscape analysis
export type CompetitorLandscapeAnalysis = {
  competitorDomain: string
  competitorName: string
  fundingVerdict: string
  growthTrajectory: string
  productDescription: string
  keyDifferentiator: string
  overlap: string
  threatLevel: 'High' | 'Medium' | 'Low'
  threatReason: string
  overallVerdict: string
}

// Step 5b — per-competitor growth analysis
export type CompetitorGrowthAnalysis = {
  competitorDomain: string
  growthMotion: 'Sales-led' | 'Content-led' | 'Paid-led' | 'Product-led' | 'Community-led'
  growthMotionReason: string
  channelBreakdown: Array<{
    channel: string
    effectiveness: 'High' | 'Medium' | 'Low' | 'Unknown'
    evidence: string
  }>
  adIntelligence: string
  hiringSignals: string
  keyInsight: string
}

// Step 6a — overall landscape synthesis
export type LandscapeSummary = {
  overallNarrative: string
  marketDynamics: string
  biggestThreat: string
  opportunityGap: string
}

// Step 6b — overall growth synthesis
export type GrowthSummary = {
  dominantMotionInSpace: string
  channelBenchmarks: string
  adLandscapeOverview: string
  recommendedMotion: 'Sales-led' | 'Content-led' | 'Paid-led' | 'Product-led' | 'Community-led'
  recommendation: string
}

// Full result — stored in localStorage
export type AnalysisResult = {
  userDomain: string
  analysedAt: string
  userCompany: CrustdataCompany
  competitors: CrustdataCompany[]
  landscapeAnalyses: CompetitorLandscapeAnalysis[]
  landscapeSummary: LandscapeSummary
  growthAnalyses: CompetitorGrowthAnalysis[]
  growthSummary: GrowthSummary
}

export type StoredState = {
  domain: string | null
  result: AnalysisResult | null
}
