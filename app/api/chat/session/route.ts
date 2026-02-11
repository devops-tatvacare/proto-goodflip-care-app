import { NextRequest, NextResponse } from 'next/server'
import { getDb, storeEvent } from '@/lib/db/sqlite'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json().catch(() => ({})) as { id?: string }
    const sessionId = id || (globalThis.crypto?.randomUUID?.() ?? `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`)
    const db = getDb()
    const upsert = db.prepare(`INSERT OR IGNORE INTO sessions (id) VALUES (?)`)
    upsert.run(sessionId)

    storeEvent({ event_type: 'session_created', route: '/api/chat/session', session_id: sessionId })
    return NextResponse.json({ id: sessionId })
  } catch (e: any) {
    console.error('POST /api/chat/session error', e)
    storeEvent({ event_type: 'error', route: '/api/chat/session', context: { message: e?.message } })
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const db = getDb()
    const rows = db.prepare(`
      SELECT 
        s.id as id,
        s.created_at as created_at,
        (SELECT created_at FROM messages WHERE session_id = s.id ORDER BY id DESC LIMIT 1) AS last_created_at,
        (SELECT content FROM messages WHERE session_id = s.id ORDER BY id DESC LIMIT 1) AS last_message,
        (SELECT COUNT(*) FROM messages WHERE session_id = s.id) AS message_count
      FROM sessions s
      ORDER BY COALESCE(last_created_at, created_at) DESC
    `).all()

    return NextResponse.json({ sessions: rows })
  } catch (e: any) {
    console.error('GET /api/chat/session error', e)
    return NextResponse.json({ error: 'Failed to list sessions' }, { status: 500 })
  }
}

