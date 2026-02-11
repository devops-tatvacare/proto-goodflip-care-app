import { NextRequest, NextResponse } from 'next/server'
import { getDb, storeEvent } from '@/lib/db/sqlite'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { sessionId, symptom, severity, location, notes, traceId, answers } = body || {}
    if (!sessionId || !symptom) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const db = getDb()
    const stmt = db.prepare(`
      INSERT INTO symptom_logs (session_id, symptom, severity, location, notes)
      VALUES (?, ?, ?, ?, ?)
    `)
    stmt.run(sessionId, String(symptom), Number(severity ?? null), location ? String(location) : null, notes ? String(notes) : (answers ? JSON.stringify(answers) : null))

    storeEvent({
      session_id: sessionId,
      event_type: 'symptom_logged',
      route: '/api/logs/symptom',
      trace_id: traceId,
      context: { hasLocation: Boolean(location) }
    })
    console.log('[EVENT] symptom_logged', { sessionId, symptom })

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('POST /api/logs/symptom error', e)
    storeEvent({ event_type: 'error', route: '/api/logs/symptom', context: { message: e?.message } })
    return NextResponse.json({ error: 'Failed to store symptom log' }, { status: 500 })
  }
}

