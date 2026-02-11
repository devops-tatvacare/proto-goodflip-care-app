import { NextRequest, NextResponse } from 'next/server'
import { buildAllChunks } from '@/lib/rag/chunking'
// RAG search, prompt building, and answer generation removed

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const t0 = Date.now()
    const body = await req.json().catch(() => ({}))
    const question: string | undefined = body?.question
    const sessionId: string | undefined = body?.sessionId
    const k: number = Math.min(Math.max(Number(body?.k ?? 8), 1), 20)
    const attachments: Array<{ url: string; name?: string; type?: string }> = Array.isArray(body?.attachments) ? body.attachments : []

    if (!question || typeof question !== 'string') {
      return NextResponse.json({ error: 'question is required' }, { status: 400 })
    }

    // Build basic chunks from DB (PDF processing removed)
    const chunks = await buildAllChunks({ sessionId })

    // Simple text-based response (ML models removed)
    const answer = `Based on your health data, I found ${chunks.length} entries to analyze. However, AI-powered insights have been disabled. Please consult with your healthcare provider for detailed analysis of your symptoms and health data.`

    return NextResponse.json({
      answer,
      top: chunks.slice(0, Math.min(5, chunks.length)).map((c, i) => ({
        id: c.id,
        source: c.source,
        content: c.content.substring(0, 200) + '...',
        score: 0.5
      }))
    })
  } catch (e: any) {
    console.error('POST /api/insights/ask error', e)
    return NextResponse.json({ error: 'failed', message: e?.message || 'Unknown error' }, { status: 500 })
  }
}
