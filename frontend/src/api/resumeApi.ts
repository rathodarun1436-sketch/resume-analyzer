import axios from 'axios'
import type { AnalysisResult } from '../types'

const BASE = (import.meta.env.VITE_API_URL ?? 'http://localhost:8080') + '/api/resume'

export async function analyzeResume(file: File, jobDescription?: string): Promise<AnalysisResult> {
  const form = new FormData()
  form.append('file', file)
  if (jobDescription?.trim()) form.append('jobDescription', jobDescription.trim())

  const { data } = await axios.post<AnalysisResult>(`${BASE}/analyze`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}
