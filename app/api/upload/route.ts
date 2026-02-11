import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const files: File[] = []
    for (const [, v] of form.entries()) {
      if (v instanceof File) files.push(v)
    }
    if (files.length === 0) {
      return NextResponse.json({ error: 'no_files' }, { status: 400 })
    }

    // Ensure uploads dir exists under public
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fs = require('fs') as typeof import('fs')
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const path = require('path') as typeof import('path')
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })

    const saved: Array<{ url: string; name: string; type: string; size: number }> = []
    for (const f of files) {
      const arrayBuffer = await f.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const ts = Date.now()
      const safeName = f.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const base = `${ts}_${safeName}`
      const dest = path.join(uploadsDir, base)
      fs.writeFileSync(dest, buffer)
      const url = `/uploads/${base}`
      saved.push({ url, name: f.name, type: f.type || 'application/octet-stream', size: f.size })
    }

    return NextResponse.json({ files: saved })
  } catch (e: any) {
    console.error('POST /api/upload error', e)
    return NextResponse.json({ error: 'upload_failed', message: e?.message || 'Unknown error' }, { status: 500 })
  }
}

