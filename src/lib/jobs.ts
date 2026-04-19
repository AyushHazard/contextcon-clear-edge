import type { AnalysisResult } from './types'

export type JobState =
  | { status: 'pending'; message: string }
  | { status: 'done'; result: AnalysisResult }
  | { status: 'error'; error: string }

// In-memory store — works for single-instance dev/demo. Not for multi-instance prod.
const jobs = new Map<string, JobState>()

export function createJob(id: string) {
  jobs.set(id, { status: 'pending', message: 'Starting analysis…' })
}

export function updateJob(id: string, message: string) {
  jobs.set(id, { status: 'pending', message })
}

export function completeJob(id: string, result: AnalysisResult) {
  jobs.set(id, { status: 'done', result })
}

export function failJob(id: string, error: string) {
  jobs.set(id, { status: 'error', error })
}

export function getJob(id: string): JobState | undefined {
  return jobs.get(id)
}
