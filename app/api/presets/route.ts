import { NextResponse } from 'next/server'

const PRESETS = [
  {
    id: 'holographic-cube',
    name: 'Holographic Cube',
    description: 'Classic wireframe cube as seen in the original demo',
    config: { shape: 'cube', particleCount: 5000, speed: 0.8, glowIntensity: 1.2, particleSize: 1.0, colorScheme: 'cyan' },
  },
  {
    id: 'plasma-sphere',
    name: 'Plasma Sphere',
    description: 'Glowing plasma sphere with high particle density',
    config: { shape: 'sphere', particleCount: 6000, speed: 1.2, glowIntensity: 1.8, particleSize: 0.8, colorScheme: 'blue' },
  },
  {
    id: 'vortex-storm',
    name: 'Vortex Storm',
    description: 'High speed spiral vortex',
    config: { shape: 'vortex', particleCount: 4000, speed: 2.5, glowIntensity: 1.0, particleSize: 1.5, colorScheme: 'rainbow' },
  },
  {
    id: 'ghost-dna',
    name: 'Ghost DNA',
    description: 'Ethereal DNA double helix',
    config: { shape: 'dna', particleCount: 3000, speed: 0.6, glowIntensity: 0.8, particleSize: 1.2, colorScheme: 'white' },
  },
  {
    id: 'torus-node',
    name: 'Torus Node',
    description: 'Rotating torus ring',
    config: { shape: 'torus', particleCount: 4500, speed: 1.0, glowIntensity: 1.4, particleSize: 1.0, colorScheme: 'cyan' },
  },
]

export async function GET() {
  return NextResponse.json({ presets: PRESETS })
}
