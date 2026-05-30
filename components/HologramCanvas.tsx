'use client'
import { useEffect, useRef, useCallback } from 'react'
import * as THREE from 'three'
import { useHologramStore } from '@/lib/store'
import { getPositionsForShape, lerpPositions } from '@/lib/geometries'

const COLOR_SCHEMES: Record<string, number[]> = {
  cyan:    [0, 245, 255],
  blue:    [0, 100, 255],
  white:   [220, 240, 255],
  rainbow: [255, 100, 50],
}

export default function HologramCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef({
    renderer: null as THREE.WebGLRenderer | null,
    scene: null as THREE.Scene | null,
    camera: null as THREE.PerspectiveCamera | null,
    particles: null as THREE.Points | null,
    frameId: 0,
    mouse: { x: 0, y: 0 },
    isDragging: false,
    lastMouse: { x: 0, y: 0 },
    rotX: 0.3,
    rotY: 0.3,
    targetRotX: 0.3,
    targetRotY: 0.3,
    autoRotY: 0,
    targetPositions: null as Float32Array | null,
    currentPositions: null as Float32Array | null,
    morphT: 0,
    isMorphing: false,
    currentShape: 'cube',
    streakMesh: null as THREE.Points | null,
    glowMesh: null as THREE.Mesh | null,
  })

  const { shape, speed, glowIntensity, particleSize, colorScheme, isPlaying, particleCount } = useHologramStore()

  const initScene = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const s = stateRef.current

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)
    s.renderer = renderer

    // Scene
    const scene = new THREE.Scene()
    s.scene = scene

    // Camera
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.set(0, 0, 6)
    s.camera = camera

    // Particles
    const count = particleCount
    const positions = getPositionsForShape('cube', count)
    s.currentPositions = new Float32Array(positions)
    s.currentShape = 'cube'

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3))

    // Vertex colors
    const colors = new Float32Array(count * 3)
    const [r, g, b] = COLOR_SCHEMES[colorScheme].map(v => v / 255)
    for (let i = 0; i < count; i++) {
      colors[i * 3] = r + (Math.random() - 0.5) * 0.15
      colors[i * 3 + 1] = g + (Math.random() - 0.5) * 0.15
      colors[i * 3 + 2] = b + (Math.random() - 0.5) * 0.15
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: particleSize * 0.02,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const particles = new THREE.Points(geometry, material)
    scene.add(particles)
    s.particles = particles

    // Falling streaks (vertical lines like in the video)
    const streakCount = 300
    const streakGeo = new THREE.BufferGeometry()
    const streakPos = new Float32Array(streakCount * 3)
    for (let i = 0; i < streakCount; i++) {
      streakPos[i * 3] = (Math.random() - 0.5) * 5
      streakPos[i * 3 + 1] = (Math.random() - 0.5) * 6
      streakPos[i * 3 + 2] = (Math.random() - 0.5) * 5
    }
    streakGeo.setAttribute('position', new THREE.BufferAttribute(streakPos, 3))
    const streakMat = new THREE.PointsMaterial({
      size: 0.015,
      color: new THREE.Color(0x00f5ff),
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const streaks = new THREE.Points(streakGeo, streakMat)
    scene.add(streaks)
    s.streakMesh = streaks

    // Central glow
    const glowGeo = new THREE.SphereGeometry(0.3, 16, 16)
    const glowMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0x00f5ff),
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
    })
    const glow = new THREE.Mesh(glowGeo, glowMat)
    scene.add(glow)
    s.glowMesh = glow

    // Ambient light beam (vertical)
    const beamGeo = new THREE.CylinderGeometry(0.05, 0.3, 5, 8, 1, true)
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x00f5ff,
      transparent: true,
      opacity: 0.05,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    })
    const beam = new THREE.Mesh(beamGeo, beamMat)
    scene.add(beam)

  }, []) // eslint-disable-line

  const startMorph = useCallback((newShape: string) => {
    const s = stateRef.current
    if (!s.particles) return

    const count = (s.particles.geometry.attributes.position as THREE.BufferAttribute).count
    const newPositions = getPositionsForShape(newShape, count)
    s.targetPositions = newPositions
    s.morphT = 0
    s.isMorphing = true
    s.currentShape = newShape
  }, [])

  useEffect(() => {
    if (stateRef.current.currentShape !== shape) {
      startMorph(shape)
    }
  }, [shape, startMorph])

  // Update particle size
  useEffect(() => {
    const s = stateRef.current
    if (s.particles) {
      (s.particles.material as THREE.PointsMaterial).size = particleSize * 0.02
    }
  }, [particleSize])

  // Update color scheme
  useEffect(() => {
    const s = stateRef.current
    if (!s.particles) return
    const count = (s.particles.geometry.attributes.color as THREE.BufferAttribute).count
    const colors = new Float32Array(count * 3)
    const [r, g, b] = COLOR_SCHEMES[colorScheme].map(v => v / 255)
    for (let i = 0; i < count; i++) {
      colors[i * 3] = r + (Math.random() - 0.5) * 0.2
      colors[i * 3 + 1] = g + (Math.random() - 0.5) * 0.2
      colors[i * 3 + 2] = b + (Math.random() - 0.5) * 0.2
    }
    ;(s.particles.geometry.attributes.color as THREE.BufferAttribute).array.set(colors)
    ;(s.particles.geometry.attributes.color as THREE.BufferAttribute).needsUpdate = true

    const col = new THREE.Color(r, g, b)
    if (s.streakMesh) (s.streakMesh.material as THREE.PointsMaterial).color = col
    if (s.glowMesh) (s.glowMesh.material as THREE.MeshBasicMaterial).color = col
  }, [colorScheme])

  // Main animate loop
  useEffect(() => {
    initScene()
    const s = stateRef.current

    let time = 0
    function animate() {
      s.frameId = requestAnimationFrame(animate)
      if (!s.renderer || !s.scene || !s.camera || !s.particles) return

      if (isPlaying) time += 0.005 * speed

      // Smooth rotation
      if (!s.isDragging) s.autoRotY += 0.003 * speed
      s.rotX += (s.targetRotX - s.rotX) * 0.08
      s.rotY += (s.targetRotY + s.autoRotY - s.rotY) * 0.08

      s.particles.rotation.x = s.rotX
      s.particles.rotation.y = s.rotY
      if (s.streakMesh) {
        s.streakMesh.rotation.y = s.rotY * 0.3
      }

      // Morphing
      if (s.isMorphing && s.targetPositions && s.currentPositions) {
        s.morphT = Math.min(s.morphT + 0.025 * speed, 1)
        const eased = s.morphT < 0.5 ? 2 * s.morphT * s.morphT : -1 + (4 - 2 * s.morphT) * s.morphT
        const lerped = lerpPositions(s.currentPositions, s.targetPositions, eased)
        ;(s.particles.geometry.attributes.position as THREE.BufferAttribute).array.set(lerped)
        ;(s.particles.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true

        if (s.morphT >= 1) {
          s.isMorphing = false
          s.currentPositions = new Float32Array(s.targetPositions)
        }
      }

      // Animate streak particles falling
      if (s.streakMesh) {
        const pos = s.streakMesh.geometry.attributes.position as THREE.BufferAttribute
        const arr = pos.array as Float32Array
        for (let i = 0; i < arr.length / 3; i++) {
          arr[i * 3 + 1] -= 0.02 * speed
          if (arr[i * 3 + 1] < -3) arr[i * 3 + 1] = 3
        }
        pos.needsUpdate = true
      }

      // Pulse glow
      if (s.glowMesh) {
        const mat = s.glowMesh.material as THREE.MeshBasicMaterial
        mat.opacity = (0.1 + Math.sin(time * 3) * 0.08) * glowIntensity
        const scale = 0.8 + Math.sin(time * 2) * 0.3
        s.glowMesh.scale.setScalar(scale * glowIntensity)
      }

      s.renderer.render(s.scene, s.camera)
    }

    animate()

    // Resize
    const onResize = () => {
      if (!s.renderer || !s.camera) return
      s.camera.aspect = window.innerWidth / window.innerHeight
      s.camera.updateProjectionMatrix()
      s.renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(s.frameId)
      window.removeEventListener('resize', onResize)
      s.renderer?.dispose()
    }
  }, []) // eslint-disable-line

  // Mouse/touch drag handlers
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const s = stateRef.current
    s.isDragging = true
    s.lastMouse = { x: e.clientX, y: e.clientY }
    s.autoRotY = s.rotY - s.targetRotY  // absorb auto rotation
  }, [])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const s = stateRef.current
    if (!s.isDragging) return
    const dx = (e.clientX - s.lastMouse.x) * 0.008
    const dy = (e.clientY - s.lastMouse.y) * 0.008
    s.targetRotY += dx
    s.targetRotX += dy
    s.targetRotX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, s.targetRotX))
    s.lastMouse = { x: e.clientX, y: e.clientY }
  }, [])

  const onMouseUp = useCallback(() => {
    stateRef.current.isDragging = false
  }, [])

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const s = stateRef.current
    s.isDragging = true
    s.lastMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }, [])

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    const s = stateRef.current
    if (!s.isDragging) return
    const dx = (e.touches[0].clientX - s.lastMouse.x) * 0.008
    const dy = (e.touches[0].clientY - s.lastMouse.y) * 0.008
    s.targetRotY += dx
    s.targetRotX += dy
    s.targetRotX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, s.targetRotX))
    s.lastMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full cursor-grab active:cursor-grabbing"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onMouseUp}
    />
  )
}
