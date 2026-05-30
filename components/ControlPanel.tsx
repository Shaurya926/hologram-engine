'use client'
import { useHologramStore, ShapeType } from '@/lib/store'

const SHAPES: { id: ShapeType; label: string; icon: string }[] = [
  { id: 'cube',   label: 'CUBE',   icon: '⬛' },
  { id: 'sphere', label: 'SPHERE', icon: '⬤'  },
  { id: 'torus',  label: 'TORUS',  icon: '◎'  },
  { id: 'vortex', label: 'VORTEX', icon: '🌀' },
  { id: 'dna',    label: 'DNA',    icon: '🧬' },
]

const COLOR_SCHEMES = [
  { id: 'cyan' as const,    label: 'CYAN',    color: '#00f5ff' },
  { id: 'blue' as const,    label: 'BLUE',    color: '#0066ff' },
  { id: 'white' as const,   label: 'WHITE',   color: '#dce8ff' },
  { id: 'rainbow' as const, label: 'RGB',     color: 'linear-gradient(90deg, #f00, #0f0, #00f)' },
]

export default function ControlPanel() {
  const {
    shape, setShape,
    speed, setSpeed,
    glowIntensity, setGlowIntensity,
    particleSize, setParticleSize,
    colorScheme, setColorScheme,
    isPlaying, setPlaying,
  } = useHologramStore()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-6 px-4">
      <div className="holo-panel corner-bracket rounded-none px-6 py-4 w-full max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span className="font-display text-[9px] tracking-[0.3em] glow-text animate-flicker">
            HOLOGRAM CONTROL MATRIX
          </span>
          <button
            onClick={() => setPlaying(!isPlaying)}
            className="holo-btn text-[9px] px-3 py-1"
          >
            {isPlaying ? '⏸ PAUSE' : '▶ PLAY'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Shape selector */}
          <div>
            <div className="font-display text-[8px] tracking-[0.2em] text-cyan-400 mb-2 opacity-60">SHAPE MATRIX</div>
            <div className="flex flex-wrap gap-1">
              {SHAPES.map(s => (
                <button
                  key={s.id}
                  onClick={() => setShape(s.id)}
                  className={`holo-btn text-[8px] px-2 py-1 ${shape === s.id ? 'active' : ''}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-display text-[8px] tracking-[0.15em] opacity-60">VELOCITY</span>
                <span className="font-mono text-[9px] glow-text">{speed.toFixed(2)}x</span>
              </div>
              <input
                type="range" min={0.1} max={3} step={0.05} value={speed}
                onChange={e => setSpeed(parseFloat(e.target.value))}
                className="holo-slider"
              />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-display text-[8px] tracking-[0.15em] opacity-60">PARTICLE SIZE</span>
                <span className="font-mono text-[9px] glow-text">{particleSize.toFixed(1)}</span>
              </div>
              <input
                type="range" min={0.3} max={3} step={0.1} value={particleSize}
                onChange={e => setParticleSize(parseFloat(e.target.value))}
                className="holo-slider"
              />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-display text-[8px] tracking-[0.15em] opacity-60">GLOW</span>
                <span className="font-mono text-[9px] glow-text">{(glowIntensity * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range" min={0} max={2} step={0.05} value={glowIntensity}
                onChange={e => setGlowIntensity(parseFloat(e.target.value))}
                className="holo-slider"
              />
            </div>
          </div>

          {/* Color scheme */}
          <div>
            <div className="font-display text-[8px] tracking-[0.2em] text-cyan-400 mb-2 opacity-60">EMISSION COLOR</div>
            <div className="grid grid-cols-2 gap-1">
              {COLOR_SCHEMES.map(c => (
                <button
                  key={c.id}
                  onClick={() => setColorScheme(c.id)}
                  className={`holo-btn text-[8px] px-2 py-1 flex items-center gap-1 ${colorScheme === c.id ? 'active' : ''}`}
                >
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{ background: c.color }}
                  />
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
