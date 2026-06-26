import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = 800

function Particles() {
  const meshRef = useRef<THREE.Points>(null)
  const mouseRef = useRef({ x: 0, y: 0 })

  const { positions, colors, originalPositions } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3)
    const col = new Float32Array(PARTICLE_COUNT * 3)
    const origPos = new Float32Array(PARTICLE_COUNT * 3)

    const color1 = new THREE.Color('#A855F7')
    const color2 = new THREE.Color('#06B6D4')

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3
      const x = (Math.random() - 0.5) * 20
      const y = (Math.random() - 0.5) * 20
      const z = (Math.random() - 0.5) * 10

      pos[i3] = x
      pos[i3 + 1] = y
      pos[i3 + 2] = z

      origPos[i3] = x
      origPos[i3 + 1] = y
      origPos[i3 + 2] = z

      const t = Math.random()
      const c = color1.clone().lerp(color2, t)
      col[i3] = c.r
      col[i3 + 1] = c.g
      col[i3 + 2] = c.b
    }

    return { positions: pos, colors: col, originalPositions: origPos }
  }, [])

  useFrame(({ clock, pointer }) => {
    if (!meshRef.current) return

    const time = clock.getElapsedTime()
    const posAttr = meshRef.current.geometry.attributes.position
    const posArray = posAttr.array as Float32Array

    mouseRef.current.x += (pointer.x - mouseRef.current.x) * 0.05
    mouseRef.current.y += (pointer.y - mouseRef.current.y) * 0.05

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3
      const ox = originalPositions[i3]
      const oy = originalPositions[i3 + 1]
      const oz = originalPositions[i3 + 2]

      const sineWave = Math.sin(time * 0.5 + ox * 0.3) * 0.15 + Math.cos(time * 0.3 + oy * 0.2) * 0.1

      const dx = ox - mouseRef.current.x * 8
      const dy = oy - mouseRef.current.y * 8
      const dist = Math.sqrt(dx * dx + dy * dy) + 0.1
      const repelForce = Math.max(0, 1.5 - dist * 0.15)

      posArray[i3] = ox + dx * repelForce * 0.08 + sineWave
      posArray[i3 + 1] = oy + dy * repelForce * 0.08 + Math.sin(time * 0.4 + i * 0.01) * 0.08
      posArray[i3 + 2] = oz + Math.cos(time * 0.2 + i * 0.005) * 0.05
    }

    posAttr.needsUpdate = true
  })

  const positionAttr = useMemo(() => new THREE.BufferAttribute(positions, 3), [positions])
  const colorAttr = useMemo(() => new THREE.BufferAttribute(colors, 3), [colors])

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <primitive object={positionAttr} attach="attributes-position" />
        <primitive object={colorAttr} attach="attributes-color" />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

export default function ThreeParticleField() {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        opacity: 0.5,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Particles />
      </Canvas>
    </div>
  )
}
