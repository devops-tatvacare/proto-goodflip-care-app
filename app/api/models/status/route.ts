import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // ML models removed - return simple status
    const status = {
      ready: 0,
      totalModels: 0,
      failed: 0,
      message: 'ML models have been removed from this application'
    }

    return NextResponse.json({
      health: 'disabled',
      timestamp: new Date().toISOString(),
      ...status
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to get model status',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}