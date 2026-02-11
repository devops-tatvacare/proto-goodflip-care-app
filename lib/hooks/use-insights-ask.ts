import { useState, useCallback } from 'react'

export type InsightTopChunk = {
  id: string
  source: string
  content: string
  score: number
  metadata?: Record<string, any>
}

export function useInsightsAsk() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [answer, setAnswer] = useState<string | null>(null)
  const [top, setTop] = useState<InsightTopChunk[]>([])

  const ask = useCallback(async (question: string, opts: { sessionId?: string, k?: number } = {}) => {
    setLoading(true)
    setError(null)
    setAnswer(null)
    setTop([])
    try {
      const res = await fetch('/api/insights/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, ...opts })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || data?.error || 'Request failed')
      setAnswer(data.answer)
      setTop(data.top || [])
    } catch (e: any) {
      setError(e?.message || 'Failed to get insights')
    } finally {
      setLoading(false)
    }
  }, [])

  return { loading, error, answer, top, ask }
}

