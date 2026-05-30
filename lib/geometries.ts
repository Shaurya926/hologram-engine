import * as THREE from 'three'

export function getCubePositions(count: number): Float32Array {
  const positions = new Float32Array(count * 3)
  const size = 2.0

  for (let i = 0; i < count; i++) {
    const face = Math.floor(Math.random() * 6)
    let x, y, z

    switch (face) {
      case 0: x = size; y = (Math.random() - 0.5) * size * 2; z = (Math.random() - 0.5) * size * 2; break
      case 1: x = -size; y = (Math.random() - 0.5) * size * 2; z = (Math.random() - 0.5) * size * 2; break
      case 2: x = (Math.random() - 0.5) * size * 2; y = size; z = (Math.random() - 0.5) * size * 2; break
      case 3: x = (Math.random() - 0.5) * size * 2; y = -size; z = (Math.random() - 0.5) * size * 2; break
      case 4: x = (Math.random() - 0.5) * size * 2; y = (Math.random() - 0.5) * size * 2; z = size; break
      default: x = (Math.random() - 0.5) * size * 2; y = (Math.random() - 0.5) * size * 2; z = -size; break
    }

    // Edge-biased — make particles cluster near edges
    if (Math.random() > 0.3) {
      const snap = Math.random() > 0.5 ? size : -size
      const axis = Math.floor(Math.random() * 2)
      if (face < 2) { if (axis === 0) y = snap; else z = snap; }
      else if (face < 4) { if (axis === 0) x = snap; else z = snap; }
      else { if (axis === 0) x = snap; else y = snap; }
    }

    positions[i * 3] = x!
    positions[i * 3 + 1] = y!
    positions[i * 3 + 2] = z!
  }
  return positions
}

export function getSpherePositions(count: number): Float32Array {
  const positions = new Float32Array(count * 3)
  const radius = 2.2

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = radius * Math.cos(phi)
    positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta)
  }
  return positions
}

export function getTorusPositions(count: number): Float32Array {
  const positions = new Float32Array(count * 3)
  const R = 2.0, r = 0.7

  for (let i = 0; i < count; i++) {
    const u = Math.random() * Math.PI * 2
    const v = Math.random() * Math.PI * 2
    positions[i * 3] = (R + r * Math.cos(v)) * Math.cos(u)
    positions[i * 3 + 1] = (R + r * Math.cos(v)) * Math.sin(u)
    positions[i * 3 + 2] = r * Math.sin(v)
  }
  return positions
}

export function getVortexPositions(count: number): Float32Array {
  const positions = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const t = i / count
    const angle = t * Math.PI * 20
    const radius = t * 2.5
    const height = (t - 0.5) * 4
    positions[i * 3] = radius * Math.cos(angle)
    positions[i * 3 + 1] = height
    positions[i * 3 + 2] = radius * Math.sin(angle)
  }
  return positions
}

export function getDNAPositions(count: number): Float32Array {
  const positions = new Float32Array(count * 3)
  const half = Math.floor(count / 2)

  for (let i = 0; i < count; i++) {
    const t = (i % half) / half
    const angle = t * Math.PI * 8
    const y = (t - 0.5) * 4

    if (i < half) {
      positions[i * 3] = Math.cos(angle) * 1.2
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = Math.sin(angle) * 1.2
    } else {
      positions[i * 3] = Math.cos(angle + Math.PI) * 1.2
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = Math.sin(angle + Math.PI) * 1.2
    }
  }
  return positions
}

export function lerpPositions(a: Float32Array, b: Float32Array, t: number): Float32Array {
  const result = new Float32Array(a.length)
  for (let i = 0; i < a.length; i++) {
    result[i] = a[i] + (b[i] - a[i]) * t
  }
  return result
}

export function getPositionsForShape(shape: string, count: number): Float32Array {
  switch (shape) {
    case 'cube': return getCubePositions(count)
    case 'sphere': return getSpherePositions(count)
    case 'torus': return getTorusPositions(count)
    case 'vortex': return getVortexPositions(count)
    case 'dna': return getDNAPositions(count)
    default: return getCubePositions(count)
  }
}
