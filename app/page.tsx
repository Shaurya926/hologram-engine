'use client'
import dynamic from 'next/dynamic'
import HUD from '@/components/HUD'
import ControlPanel from '@/components/ControlPanel'
import PresetPanel from '@/components/PresetPanel'

const HologramCanvas = dynamic(() => import('@/components/HologramCanvas'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 flex items-center justify-center bg-[#040810]">
      <div className="text-center space-y-3">
        <div className="font-display text-[11px] tracking-[0.5em] glow-text animate-pulse-glow">
          INITIALIZING HOLOGRAM ENGINE
        </div>
        <div className="font-mono text-[8px] opacity-30 tracking-[0.3em]">
          LOADING PARTICLE SYSTEM...
        </div>
      </div>
    </div>
  ),
})

export default function Home() {
  return (
    <main className="relative w-screen h-screen bg-[#040810] overflow-hidden">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,100,180,0.08) 0%, transparent 70%)',
        }}
      />
      <HologramCanvas />
      <HUD />
      <PresetPanel />
      <ControlPanel />
    </main>
  )
}
