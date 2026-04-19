import type { AnalysisResult } from './types'

export type JobState =
  | { status: 'pending'; message: string }
  | { status: 'done'; result: AnalysisResult }
  | { status: 'error'; error: string }

// Persist across Next.js HMR hot reloads in dev by attaching to globalThis
const g = globalThis as typeof globalThis & { __clearEdgeJobs?: Map<string, JobState> }
if (!g.__clearEdgeJobs) g.__clearEdgeJobs = new Map()
const jobs = g.__clearEdgeJobs

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
