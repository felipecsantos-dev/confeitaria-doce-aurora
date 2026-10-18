import { ContactShadows, Environment, Float, Lightformer } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import type { Group } from 'three'
import { MathUtils } from 'three'
import { Donut } from './Donut'

type Props = { reduced: boolean }

function Scene({ reduced }: Props) {
  const tiltRef = useRef<Group>(null)
  const spinRef = useRef<Group>(null)

  useFrame((_, delta) => {
    const tilt = tiltRef.current
    const spin = spinRef.current
    if (!tilt || !spin) return
    // Gira devagar sozinho e inclina um pouco conforme a página rola.
    const scroll = window.scrollY / window.innerHeight
    if (!reduced) spin.rotation.z += delta * 0.18
    tilt.rotation.x = MathUtils.damp(tilt.rotation.x, -0.95 + scroll * 0.6, 4, delta)
    tilt.position.y = MathUtils.damp(tilt.position.y, -scroll * 0.8, 4, delta)
  })

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 4, 5]} intensity={1.6} color="#fff4f0" />
      <directionalLight position={[-4, -2, 2]} intensity={0.5} color="#8edfd9" />

      <Float speed={reduced ? 0 : 1.6} rotationIntensity={reduced ? 0 : 0.25} floatIntensity={reduced ? 0 : 0.8}>
        <group ref={tiltRef} rotation={[-0.95, 0, 0]}>
          <group ref={spinRef} rotation={[0, 0, 0.6]}>
            <Donut seed={3} />
          </group>
        </group>
      </Float>

      {/* Donuts menores ao fundo dão profundidade. */}
      <Float speed={reduced ? 0 : 2.2} rotationIntensity={reduced ? 0 : 1.2} floatIntensity={reduced ? 0 : 1.4}>
        <group position={[-1.75, 1.4, -1.2]} rotation={[-0.4, 0.6, 0.3]} scale={0.38}>
          <Donut seed={11} icing="#6a3a2f" sprinkles={70} sprinkleColors={['#ffffff', '#f2709c', '#ffd166']} />
        </group>
      </Float>
      <Float speed={reduced ? 0 : 1.9} rotationIntensity={reduced ? 0 : 1} floatIntensity={reduced ? 0 : 1.2}>
        <group position={[2.05, -1.35, -0.8]} rotation={[-1.2, -0.3, 0.2]} scale={0.32}>
          <Donut seed={21} icing="#bff0ec" sprinkles={60} sprinkleColors={['#f2709c', '#ffffff', '#e0457b']} />
        </group>
      </Float>

      {/* Sombra calculada uma vez só, em vez de a cada quadro. */}
      <ContactShadows frames={1} resolution={256} position={[0, -1.55, 0]} opacity={0.28} scale={6} blur={2.6} far={3} color="#1f7f79" />

      {/* Ambiente feito só com luzes, sem baixar HDR. */}
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={2.2} position={[2, 3, 4]} scale={[4, 2, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={1.2} position={[-4, 1, 2]} scale={[2, 4, 1]} color="#ffd6e4" />
        <Lightformer form="ring" intensity={1.4} position={[0, -3, 3]} scale={3} color="#8edfd9" />
      </Environment>
    </>
  )
}

export default function HeroCanvas({ reduced }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)

  // Para de renderizar quando o hero sai da tela.
  useEffect(() => {
    const check = () => {
      const rect = wrapRef.current?.getBoundingClientRect()
      if (rect && rect.height > 0) setVisible(rect.bottom > 0 && rect.top < window.innerHeight)
    }
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)
    return () => {
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
    }
  }, [])

  return (
    <div ref={wrapRef} className="pointer-events-none absolute -inset-[18%]">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 6.4], fov: 38 }}
        frameloop={visible ? 'always' : 'never'}
        gl={{ antialias: true, alpha: true }}
        aria-label="Donut 3D com cobertura rosa e granulado colorido"
        role="img"
      >
        <Scene reduced={reduced} />
      </Canvas>
    </div>
  )
}
