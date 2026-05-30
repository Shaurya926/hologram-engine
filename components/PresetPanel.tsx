'use client'
import { useState, useEffect } from 'react'
import { useHologramStore } from '@/lib/store'

interface Preset {
  id: string
  name: string
  description: string
  config: {
    shape: 'cube' | 'sphere' | 'torus' | 'vortex' | 'dna'
    particleCount: number
    speed: number
    glowIntensity: number
    particleSize: number
    colorScheme: 'cyan' | 'blue' | 'white' | 'rainbow'
  }
}

export default function PresetPanel() {
  const [presets, setPresets] = useState<Preset[]>([])
  const [open, setOpen] = useState(false)
  const [applying, setApplying] = useState<string | null>(null)
  const store = useHologramStore()

  useEffect(() => {
    fetch('/api/presets')
      .then(r => r.json())
      .then(d => setPresets(d.presets))
      .catch(() => {})
  }, [])

  const applyPreset = (preset: Preset) => {
    setApplying(preset.id)
    const c = preset.config
    store.setShape(c.shape)
    store.setSpeed(c.speed)
    store.setGlowIntensity(c.glowIntensity)
    store.setParticleSize(c.particleSize)
    store.setColorScheme(c.colorScheme)
    setTimeout(() => setApplying(null), 800)
  }

  return (
    <div className="fixed top-6 right-6 mt-12 z-50">
      {/* Toggle button */}
      <div className="flex justify-end mb-2">
        <button
          onClick={() => setOpen(!open)}
          className="holo-btn text-[9px] px-3 py-1.5"
        >
          {open ? '✕ PRESETS' : '◈ PRESETS'}
        </button>
      </div>

      {/* Panel */}
      {open && (
        <div className="holo-panel corner-bracket p-4 w-52">
          <div className="font-display text-[8px] tracking-[0.3em] glow-text mb-3">
            PRESET CONFIGURATIONS
          </div>
          <div className="space-y-2">
            {presets.map(p => (
              <button
                key={p.id}
                onClick={() => applyPreset(p)}
                className={`w-full text-left holo-btn px-3 py-2 block ${applying === p.id ? 'active' : ''}`}
              >
                <div className="font-display text-[8px] tracking-wider">
                  {applying === p.id ? '✓ APPLIED' : p.name.toUpperCase()}
                </div>
                <div className="font-mono text-[8px] opacity-40 mt-0.5 leading-tight">
                  {p.description}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
