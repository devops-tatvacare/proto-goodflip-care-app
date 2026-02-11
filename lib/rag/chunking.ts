import { getDb } from '@/lib/db/sqlite'

export type Chunk = {
  id: string
  source: 'message' | 'symptom' | 'activity' | 'pdf' | 'note'
  content: string
  metadata?: Record<string, any>
}

function makeChunksFromMessages(sessionId?: string): Chunk[] {
  const db = getDb()
  const rows = sessionId
    ? db.prepare(`SELECT role, content, created_at FROM messages WHERE session_id = ? ORDER BY id ASC`).all(sessionId)
    : db.prepare(`SELECT session_id, role, content, created_at FROM messages ORDER BY id DESC LIMIT 500`).all()

  const lines: string[] = rows.map((r: any) => {
    const who = r.role === 'user' ? 'User' : 'Assistant'
    const ts = r.created_at
    return `${ts} ${who}: ${r.content}`
  })

  // windowed chunks of ~20 lines
  const window = 20
  const out: Chunk[] = []
  for (let i = 0; i < lines.length; i += window) {
    const content = lines.slice(i, i + window).join('\n')
    out.push({ id: `msg-${i}`, source: 'message', content })
  }
  return out
}

function makeChunksFromSymptoms(sessionId?: string): Chunk[] {
  const db = getDb()
  const rows = sessionId
    ? db.prepare(`SELECT logged_at, symptom, severity, location, notes FROM symptom_logs WHERE session_id = ? ORDER BY id ASC`).all(sessionId)
    : db.prepare(`SELECT session_id, logged_at, symptom, severity, location, notes FROM symptom_logs ORDER BY id DESC LIMIT 500`).all()
  return rows.map((r: any, idx: number) => ({
    id: `sym-${idx}`,
    source: 'symptom',
    content: `${r.logged_at} Symptom: ${r.symptom} Sev: ${r.severity ?? '-'} Loc: ${r.location ?? '-'} Notes: ${r.notes ?? ''}`.trim(),
  }))
}

function makeChunksFromActivities(sessionId?: string): Chunk[] {
  const db = getDb()
  const rows = sessionId
    ? db.prepare(`SELECT logged_at, activity, duration_min, intensity, notes FROM activity_logs WHERE session_id = ? ORDER BY id ASC`).all(sessionId)
    : db.prepare(`SELECT session_id, logged_at, activity, duration_min, intensity, notes FROM activity_logs ORDER BY id DESC LIMIT 500`).all()
  return rows.map((r: any, idx: number) => ({
    id: `act-${idx}`,
    source: 'activity',
    content: `${r.logged_at} Activity: ${r.activity} Duration: ${r.duration_min ?? '-'} Intensity: ${r.intensity ?? '-'} Notes: ${r.notes ?? ''}`.trim(),
  }))
}

// PDF parsing functionality removed (no pdf-parse dependency)

export async function makeChunksFromPdfs(dir = 'data/lab-pdfs'): Promise<Chunk[]> {
  // PDF processing removed (no pdf-parse dependency)
  return []
}

function makeChunksFromNotes(dir = 'data/notes'): Chunk[] {
  const chunks: Chunk[] = []
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fs = require('fs') as typeof import('fs')
    if (!fs.existsSync(dir)) return chunks
    const files: string[] = fs.readdirSync(dir)
    for (const f of files) {
      const lower = f.toLowerCase()
      if (!(lower.endsWith('.txt') || lower.endsWith('.md'))) continue
      const fullPath = `${dir}/${f}`
      const raw = fs.readFileSync(fullPath, 'utf8')
      const size = 800
      for (let i = 0; i < raw.length; i += size) {
        const part = raw.slice(i, i + size)
        chunks.push({ id: `note-${f}-${i}`, source: 'note', content: part, metadata: { file: f } })
      }
    }
  } catch {}
  return chunks
}

export async function buildAllChunks(opts: { sessionId?: string } = {}): Promise<Chunk[]> {
  const messages = makeChunksFromMessages(opts.sessionId)
  const symptoms = makeChunksFromSymptoms(opts.sessionId)
  const activities = makeChunksFromActivities(opts.sessionId)
  const pdfs = await makeChunksFromPdfs()
  const notes = makeChunksFromNotes()

  const ch: Chunk[] = []
  ch.push(...messages, ...symptoms, ...activities, ...pdfs, ...notes)
  return ch
}
