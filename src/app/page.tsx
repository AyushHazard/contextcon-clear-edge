'use client'

import { useAppState } from '@/hooks/useAppState'
import OnboardingScreen from '@/components/OnboardingScreen'
import LoadingScreen from '@/components/LoadingScreen'
import BriefScreen from '@/components/BriefScreen'

export default function Home() {
  const { state, result, domain, error, refreshError, loadingMessage, runAnalysis, refreshResults, changeDomain } = useAppState()

  if (state === 'loading') return <LoadingScreen message={loadingMessage} />

  if (state === 'brief' && result) {
    return (
      <BriefScreen result={result} onRefresh={refreshResults} onChangeDomain={changeDomain} refreshError={refreshError} />
    )
  }

  return (
    <OnboardingScreen onSubmit={runAnalysis} initialDomain={domain} error={error} />
  )
}
