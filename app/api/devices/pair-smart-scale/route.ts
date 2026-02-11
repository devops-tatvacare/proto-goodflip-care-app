import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { heightFeet, heightInches, gender, age } = body || {}

    if (!heightFeet || !heightInches || !gender || !age) {
      return NextResponse.json({ error: "missing_required_fields" }, { status: 400 })
    }

    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json({
      ok: true,
      pairingId: `pair-${Date.now()}`,
      status: "paired",
      device: {
        id: `scale-${Date.now()}`,
        name: "Smart Scale Pro",
        type: "Body Composition",
      },
    })
  } catch (error) {
    console.error("POST /api/devices/pair-smart-scale error", error)
    return NextResponse.json({ error: "pairing_failed" }, { status: 500 })
  }
}
