'use client'

import { useAppState } from '@/hooks/useAppState'
import OnboardingScreen from '@/components/OnboardingScreen'
import LoadingScreen from '@/components/LoadingScreen'
import BriefScreen from '@/components/BriefScreen'

export default function Home() {
  const { state, result, domain, error, refreshError, runAnalysis, refreshResults } = useAppState()

  if (state === 'loading') return <LoadingScreen />

  if (state === 'brief' && result) {
    return (
      <BriefScreen result={result} onRefresh={refreshResults} refreshError={refreshError} />
    )
  }

  return (
    <OnboardingScreen onSubmit={runAnalysis} initialDomain={domain} error={error} />
  )
}
