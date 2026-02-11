import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(_req: NextRequest) {
  try {
    // ML models removed - return simple status
    return NextResponse.json({
      ok: true,
      models: { message: 'ML models have been removed from this application' },
      allReady: false,
      pdfParseAvailable: false,
    })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Failed to get model status' }, { status: 500 })
  }
}

