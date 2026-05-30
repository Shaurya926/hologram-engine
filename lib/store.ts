import { create } from 'zustand'

export type ShapeType = 'cube' | 'sphere' | 'torus' | 'vortex' | 'dna'

export interface HologramState {
  shape: ShapeType
  particleCount: number
  speed: number
  glowIntensity: number
  wireframe: boolean
  particleSize: number
  colorScheme: 'cyan' | 'blue' | 'white' | 'rainbow'
  isPlaying: boolean
  morphProgress: number

  setShape: (shape: ShapeType) => void
  setParticleCount: (n: number) => void
  setSpeed: (s: number) => void
  setGlowIntensity: (g: number) => void
  setWireframe: (w: boolean) => void
  setParticleSize: (s: number) => void
  setColorScheme: (c: 'cyan' | 'blue' | 'white' | 'rainbow') => void
  setPlaying: (p: boolean) => void
  setMorphProgress: (p: number) => void
}

export const useHologramStore = create<HologramState>((set) => ({
  shape: 'cube',
  particleCount: 4000,
  speed: 1.0,
  glowIntensity: 1.0,
  wireframe: true,
  particleSize: 1.2,
  colorScheme: 'cyan',
  isPlaying: true,
  morphProgress: 0,

  setShape: (shape) => set({ shape }),
  setParticleCount: (particleCount) => set({ particleCount }),
  setSpeed: (speed) => set({ speed }),
  setGlowIntensity: (glowIntensity) => set({ glowIntensity }),
  setWireframe: (wireframe) => set({ wireframe }),
  setParticleSize: (particleSize) => set({ particleSize }),
  setColorScheme: (colorScheme) => set({ colorScheme }),
  setPlaying: (isPlaying) => set({ isPlaying }),
  setMorphProgress: (morphProgress) => set({ morphProgress }),
}))
