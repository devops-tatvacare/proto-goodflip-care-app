import { NextRequest, NextResponse } from 'next/server'
import { getDb, storeEvent } from '@/lib/db/sqlite'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { sessionId, role, content, traceId } = body || {}
    if (!sessionId || !role || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const db = getDb()
    const insert = db.prepare(`INSERT INTO messages (session_id, role, content) VALUES (?, ?, ?)`)
    insert.run(sessionId, role, String(content))

    // Instrumentation
    storeEvent({
      session_id: sessionId,
      event_type: role === 'user' ? 'message_sent' : 'message_received',
      route: '/api/chat/message',
      trace_id: traceId,
      context: { length: String(content).length }
    })
    console.log('[EVENT] message', { role, sessionId })

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('POST /api/chat/message error', e)
    storeEvent({ event_type: 'error', route: '/api/chat/message', context: { message: e?.message } })
    return NextResponse.json({ error: 'Failed to store message' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get('session_id')
    if (!sessionId) return NextResponse.json({ error: 'session_id required' }, { status: 400 })

    const db = getDb()
    const rows = db.prepare(`SELECT id, role, content, created_at FROM messages WHERE session_id = ? ORDER BY id ASC`).all(sessionId)
    return NextResponse.json({ messages: rows })
  } catch (e: any) {
    console.error('GET /api/chat/message error', e)
    return NextResponse.json({ error: 'Failed to load history' }, { status: 500 })
  }
}

