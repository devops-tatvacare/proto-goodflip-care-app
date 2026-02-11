// Dynamically require within getDb to avoid build-time resolution

// Single-file dev database (SQLite if available; JSON fallback otherwise)
const DB_PATH = process.env.DEV_DB_PATH || 'health_dev.db'
const JSON_FALLBACK_PATH = (process.env.DEV_DB_JSON_PATH || DB_PATH.replace(/\.db$/i, '')) + '.json'

let db: any | null = null

function initSchema(connection: any) {
  // Create minimal tables if they don't exist
  connection.exec(`
    PRAGMA journal_mode=WAL;
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS symptom_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      logged_at TEXT DEFAULT (datetime('now')),
      symptom TEXT NOT NULL,
      severity INTEGER,
      location TEXT,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS activity_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      logged_at TEXT DEFAULT (datetime('now')),
      activity TEXT NOT NULL,
      duration_min INTEGER,
      intensity TEXT,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT,
      event_type TEXT NOT NULL,
      occurred_at TEXT DEFAULT (datetime('now')),
      route TEXT,
      trace_id TEXT,
      context TEXT
    );
  `)
}

export function getDb() {
  if (!db) {
    try {
      // Try native SQLite (fastest, preferred in Node runtime)
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const BetterSqlite3 = require('better-sqlite3') as any
      db = new BetterSqlite3(DB_PATH)
      initSchema(db)
      return db
    } catch (e: any) {
      // Fall back to a lightweight JSON store so the API doesn't 500 in dev
      console.warn('[DB] better-sqlite3 unavailable, using JSON fallback:', e?.message)
      db = new JsonFallbackDb(JSON_FALLBACK_PATH)
      initSchema(db)
      return db
    }
  }
  return db
}

export type StoredEvent = {
  session_id?: string
  event_type: string
  route?: string
  trace_id?: string
  context?: Record<string, any>
}

export function storeEvent(ev: StoredEvent) {
  const d = getDb()
  const stmt = d.prepare(
    `INSERT INTO events (session_id, event_type, route, trace_id, context)
     VALUES (@session_id, @event_type, @route, @trace_id, @context)`
  )
  stmt.run({
    session_id: ev.session_id || null,
    event_type: ev.event_type,
    route: ev.route || null,
    trace_id: ev.trace_id || null,
    context: ev.context ? JSON.stringify(ev.context) : null,
  })
}

// ------------------------------------------------------------
// JSON fallback implementation (dev-only)
// ------------------------------------------------------------

type JsonMessage = { id: number; session_id: string; role: string; content: string; created_at: string }
type JsonSession = { id: string; created_at: string }
type JsonSymptom = { id: number; session_id: string; logged_at: string; symptom: string; severity: number | null; location: string | null; notes: string | null }
type JsonActivity = { id: number; session_id: string; logged_at: string; activity: string; duration_min: number | null; intensity: string | null; notes: string | null }
type JsonEvent = { id: number; session_id: string | null; event_type: string; occurred_at: string; route: string | null; trace_id: string | null; context: string | null }

type JsonShape = {
  _counters: { messages: number; symptoms: number; activities: number; events: number }
  sessions: JsonSession[]
  messages: JsonMessage[]
  symptom_logs: JsonSymptom[]
  activity_logs: JsonActivity[]
  events: JsonEvent[]
}

class JsonFallbackDb {
  private path: string
  private data: JsonShape

  constructor(path: string) {
    this.path = path
    this.data = this.load()
  }

  exec(_sql: string) {
    // No-op for schema statements
    return
  }

  prepare(sql: string) {
    const s = sql.replace(/\s+/g, ' ').trim()
    if (s.startsWith('INSERT INTO messages')) {
      return {
        run: (session_id: string, role: string, content: string) => {
          const id = ++this.data._counters.messages
          const created_at = new Date().toISOString()
          this.data.messages.push({ id, session_id, role, content, created_at })
          this.save()
          return { changes: 1, lastInsertRowid: id }
        },
      }
    }
    if (s.startsWith('SELECT id, role, content, created_at FROM messages WHERE session_id = ? ORDER BY id ASC')) {
      return {
        all: (session_id: string) => {
          return this.data.messages
            .filter(m => m.session_id === session_id)
            .sort((a, b) => a.id - b.id)
            .map(m => ({ id: m.id, role: m.role, content: m.content, created_at: m.created_at }))
        },
      }
    }
    if (s.startsWith('INSERT OR IGNORE INTO sessions')) {
      return {
        run: (id: string) => {
          const exists = this.data.sessions.some(s => s.id === id)
          if (!exists) {
            this.data.sessions.push({ id, created_at: new Date().toISOString() })
            this.save()
          }
          return { changes: exists ? 0 : 1 }
        },
      }
    }
    if (s.includes('FROM sessions s') && s.includes('SELECT s.id as id')) {
      // sessions listing with computed fields
      return {
        all: () => {
          return this.data.sessions
            .map(sess => {
              const messages = this.data.messages.filter(m => m.session_id === sess.id)
              const last = messages[messages.length - 1]
              return {
                id: sess.id,
                created_at: sess.created_at,
                last_created_at: last ? last.created_at : null,
                last_message: last ? last.content : null,
                message_count: messages.length,
              }
            })
            .sort((a, b) => {
              const at = a.last_created_at || a.created_at
              const bt = b.last_created_at || b.created_at
              return (bt > at ? 1 : bt < at ? -1 : 0)
            })
        },
      }
    }
    if (s.startsWith('INSERT INTO symptom_logs')) {
      return {
        run: (session_id: string, symptom: string, severity: number | null, location: string | null, notes: string | null) => {
          const id = ++this.data._counters.symptoms
          const logged_at = new Date().toISOString()
          this.data.symptom_logs.push({ id, session_id, logged_at, symptom, severity, location, notes })
          this.save()
          return { changes: 1, lastInsertRowid: id }
        },
      }
    }
    if (s.startsWith('INSERT INTO activity_logs')) {
      return {
        run: (session_id: string, activity: string, duration_min: number | null, intensity: string | null, notes: string | null) => {
          const id = ++this.data._counters.activities
          const logged_at = new Date().toISOString()
          this.data.activity_logs.push({ id, session_id, logged_at, activity, duration_min, intensity, notes })
          this.save()
          return { changes: 1, lastInsertRowid: id }
        },
      }
    }
    if (s.startsWith('INSERT INTO events')) {
      return {
        run: (params: { session_id?: string | null; event_type: string; route?: string | null; trace_id?: string | null; context?: string | null }) => {
          const id = ++this.data._counters.events
          const occurred_at = new Date().toISOString()
          this.data.events.push({
            id,
            session_id: params.session_id ?? null,
            event_type: params.event_type,
            occurred_at,
            route: params.route ?? null,
            trace_id: params.trace_id ?? null,
            context: params.context ?? null,
          })
          this.save()
          return { changes: 1, lastInsertRowid: id }
        },
      }
    }

    // Unsupported statement in fallback
    return {
      run: () => ({ changes: 0 }),
      all: () => [],
    }
  }

  private load(): JsonShape {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const fs = require('fs') as typeof import('fs')
      if (fs.existsSync(this.path)) {
        const raw = fs.readFileSync(this.path, 'utf8')
        const parsed = JSON.parse(raw) as JsonShape
        // Ensure counters exist
        parsed._counters = parsed._counters || { messages: 0, symptoms: 0, activities: 0, events: 0 }
        return parsed
      }
    } catch {}
    return {
      _counters: { messages: 0, symptoms: 0, activities: 0, events: 0 },
      sessions: [],
      messages: [],
      symptom_logs: [],
      activity_logs: [],
      events: [],
    }
  }

  private save() {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const fs = require('fs') as typeof import('fs')
      fs.writeFileSync(this.path, JSON.stringify(this.data, null, 2), 'utf8')
    } catch {
      // Ignore write errors in dev fallback
    }
  }
}
