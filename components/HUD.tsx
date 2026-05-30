'use client'
import { useState, useEffect } from 'react'
import { useHologramStore } from '@/lib/store'

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="opacity-40 font-mono text-[9px] tracking-widest uppercase">{label}</span>
      <span className="glow-text font-mono text-[9px]">{value}</span>
    </div>
  )
}

export default function HUD() {
  const { shape, speed, particleCount, colorScheme } = useHologramStore()
  const [time, setTime] = useState('')
  const [fps, setFps] = useState(60)

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('en-US', { hour12: false }))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    let frames = 0
    let last = performance.now()
    let id: number

    const loop = () => {
      frames++
      const now = performance.now()
      if (now - last >= 1000) {
        setFps(frames)
        frames = 0
        last = now
      }
      id = requestAnimationFrame(loop)
    }
    id = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <>
      {/* Top left */}
      <div className="fixed top-6 left-6 z-50">
        <div className="holo-panel corner-bracket px-4 py-3 w-44">
          <div className="font-display text-[8px] tracking-[0.3em] glow-text mb-3 animate-pulse-glow">
            ◈ SYSTEM STATUS
          </div>
          <div className="space-y-1.5">
            <StatRow label="FPS" value={`${fps}`} />
            <StatRow label="PARTICLES" value={particleCount.toLocaleString()} />
            <StatRow label="SHAPE" value={shape.toUpperCase()} />
            <StatRow label="COLOR" value={colorScheme.toUpperCase()} />
            <StatRow label="SPEED" value={`${speed.toFixed(2)}x`} />
          </div>
        </div>
      </div>

      {/* Top right */}
      <div className="fixed top-6 right-6 z-50 text-right">
        <div className="font-display text-[22px] glow-text tracking-widest animate-flicker">
          {time}
        </div>
        <div className="font-mono text-[9px] opacity-40 tracking-[0.3em] mt-0.5">
          HOLOGRAM ENGINE v2.0
        </div>
      </div>

      {/* Title */}
      <div className="fixed top-1/2 left-6 z-50 -translate-y-1/2 pointer-events-none">
        <div
          className="font-display text-[9px] tracking-[0.4em] opacity-20"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          DRAG TO ROTATE · SCROLL TO ZOOM
        </div>
      </div>

      {/* Center title */}
      <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 text-center pointer-events-none">
        <div className="font-display text-[11px] tracking-[0.5em] glow-text">
          HOLOGRAM
        </div>
        <div className="font-mono text-[8px] opacity-30 tracking-[0.3em]">INTERACTIVE 3D ENGINE</div>
      </div>

      {/* Corner decorations */}
      <div className="fixed top-0 left-0 z-40 pointer-events-none w-20 h-20 border-t border-l border-cyan-500/20" />
      <div className="fixed top-0 right-0 z-40 pointer-events-none w-20 h-20 border-t border-r border-cyan-500/20" />
      <div className="fixed bottom-0 left-0 z-40 pointer-events-none w-20 h-20 border-b border-l border-cyan-500/20" />
      <div className="fixed bottom-0 right-0 z-40 pointer-events-none w-20 h-20 border-b border-r border-cyan-500/20" />
    </>
  )
}
