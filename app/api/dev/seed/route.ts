import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db/sqlite'

export const runtime = 'nodejs'

// Dev-only: seed minimal data so insights have context
export async function POST(_req: NextRequest) {
  try {
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 })
    }

    const db = getDb()

    // Create or ensure a session
    const sessionId = 'seed-session-001'
    try {
      db.prepare(`INSERT OR IGNORE INTO sessions (id) VALUES (?)`).run(sessionId)
    } catch {}

    // Seed a few messages (pretend user and assistant chat history)
    const insertMsg = db.prepare(`INSERT INTO messages (session_id, role, content) VALUES (?, ?, ?)`)
    insertMsg.run(sessionId, 'user', 'I started Semaglutide last week and feel a bit tired.')
    insertMsg.run(sessionId, 'assistant', 'Fatigue can occur early. Make sure you hydrate and monitor your sleep.')
    insertMsg.run(sessionId, 'user', 'I walked 30 minutes daily and drank about 1.8 liters of water yesterday.')

    // Seed a few symptom logs
    const insertSym = db.prepare(`INSERT INTO symptom_logs (session_id, symptom, severity, location, notes) VALUES (?, ?, ?, ?, ?)`)
    insertSym.run(sessionId, 'fatigue', 3, null, 'Worse in afternoons')
    insertSym.run(sessionId, 'nausea', 2, null, 'Mild morning nausea on day 3')

    // Seed a few activity logs
    const insertAct = db.prepare(`INSERT INTO activity_logs (session_id, activity, duration_min, intensity, notes) VALUES (?, ?, ?, ?, ?)`)
    insertAct.run(sessionId, 'walk', 30, 'moderate', 'Evening walk around the block')
    insertAct.run(sessionId, 'sleep', 420, 'normal', 'Slept 7 hours, woke once')

    return NextResponse.json({ ok: true, sessionId })
  } catch (e: any) {
    console.error('POST /api/dev/seed error', e)
    return NextResponse.json({ error: 'seed_failed', message: e?.message || 'Unknown error' }, { status: 500 })
  }
}

