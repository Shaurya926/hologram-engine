import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { shape, particleCount, speed, glowIntensity, particleSize, colorScheme } = body

  // Validate
  const allowed = { shapes: ['cube','sphere','torus','vortex','dna'], colors: ['cyan','blue','white','rainbow'] }
  if (!allowed.shapes.includes(shape)) return NextResponse.json({ error: 'Invalid shape' }, { status: 400 })
  if (!allowed.colors.includes(colorScheme)) return NextResponse.json({ error: 'Invalid colorScheme' }, { status: 400 })

  const snapshot = {
    id: `snap_${Date.now()}`,
    createdAt: new Date().toISOString(),
    config: { shape, particleCount, speed, glowIntensity, particleSize, colorScheme },
    shareUrl: `/share/${Date.now()}`,
  }

  return NextResponse.json({ snapshot }, { status: 201 })
}
