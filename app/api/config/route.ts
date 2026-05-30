import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    shapes: ['cube', 'sphere', 'torus', 'vortex', 'dna'],
    colorSchemes: ['cyan', 'blue', 'white', 'rainbow'],
    defaults: {
      shape: 'cube',
      particleCount: 4000,
      speed: 1.0,
      glowIntensity: 1.0,
      particleSize: 1.2,
      colorScheme: 'cyan',
    },
    limits: {
      particleCount: { min: 500, max: 10000 },
      speed: { min: 0.1, max: 3.0 },
      glowIntensity: { min: 0, max: 2.0 },
      particleSize: { min: 0.3, max: 3.0 },
    },
  })
}
