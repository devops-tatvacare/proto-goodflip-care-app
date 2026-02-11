import { NextRequest, NextResponse } from 'next/server'
import { getDb, storeEvent } from '@/lib/db/sqlite'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { sessionId, activity, duration_min, intensity, notes, traceId, answers } = body || {}
    if (!sessionId || !activity) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const db = getDb()
    const stmt = db.prepare(`
      INSERT INTO activity_logs (session_id, activity, duration_min, intensity, notes)
      VALUES (?, ?, ?, ?, ?)
    `)
    stmt.run(sessionId, String(activity), duration_min != null ? Number(duration_min) : null, intensity ? String(intensity) : null, notes ? String(notes) : (answers ? JSON.stringify(answers) : null))

    storeEvent({
      session_id: sessionId,
      event_type: 'activity_logged',
      route: '/api/logs/activity',
      trace_id: traceId,
      context: { duration_min: duration_min != null ? Number(duration_min) : undefined }
    })
    console.log('[EVENT] activity_logged', { sessionId, activity })

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('POST /api/logs/activity error', e)
    storeEvent({ event_type: 'error', route: '/api/logs/activity', context: { message: e?.message } })
    return NextResponse.json({ error: 'Failed to store activity log' }, { status: 500 })
  }
}

