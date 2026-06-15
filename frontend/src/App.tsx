import { useState } from 'react'
import UploadSection from './components/UploadSection'
import ResultsDashboard from './components/ResultsDashboard'
import { analyzeResume } from './api/resumeApi'
import type { AnalysisResult } from './types'

export default function App() {
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async (file: File, jobDescription: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await analyzeResume(file, jobDescription || undefined)
      setResult(data)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Analysis failed'
      setError(msg.includes('Network') ? 'Could not reach the backend. Make sure it is running on port 8080.' : 'Analysis failed. Please try a different file.')
    } finally {
      setLoading(false)
    }
  }

  if (result) {
    return <ResultsDashboard result={result} onBack={() => setResult(null)} />
  }

  return (
    <>
      <UploadSection onAnalyze={handleAnalyze} isLoading={loading} />
      {error && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50
          px-5 py-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-sm shadow-lg">
          {error}
        </div>
      )}
    </>
  )
}
