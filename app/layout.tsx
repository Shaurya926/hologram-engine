import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hologram Engine — Interactive 3D Particle Visualizer',
  description: 'An interactive holographic 3D particle animation engine. Drag to rotate, morph between shapes, control speed and glow.',
  openGraph: {
    title: 'Hologram Engine',
    description: 'Interactive 3D holographic particle visualizer',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
