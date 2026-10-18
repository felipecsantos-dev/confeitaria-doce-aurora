import { Float } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Group } from 'three'
import { MathUtils } from 'three'
import { Donut } from './Donut'

type Props = { reduced: boolean; onReady?: () => void }

// Compila os shaders em paralelo e desenha o primeiro quadro antes de mostrar o donut,
// assim o trabalho pesado acontece antes das animações de entrada começarem.
function Warmup({ onReady }: { onReady: () => void }) {
  const gl = useThree((s) => s.gl)
  const scene = useThree((s) => s.scene)
  const camera = useThree((s) => s.camera)
  useEffect(() => {
    let alive = true
    gl.compileAsync(scene, camera)
      .catch(() => undefined)
      .then(() => {
        if (!alive) return
        gl.render(scene, camera)
        requestAnimationFrame(() => alive && onReady())
      })
    return () => {
      alive = false
    }
  }, [gl, scene, camera, onReady])
  return null
}

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
      {/* Só luzes (sem mapa de ambiente): o mapa de reflexo levava mais de 1 s para compilar e travava a página. */}
      <hemisphereLight args={['#ffffff', '#8edfd9', 1.1]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 5]} intensity={1.9} color="#fff4f0" />
      <directionalLight position={[-3, 3, 4]} intensity={0.9} color="#ffe4ee" />
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
        <group position={[1.8, -1.3, -0.8]} rotation={[-1.2, -0.3, 0.2]} scale={0.32}>
          <Donut seed={21} icing="#bff0ec" sprinkles={60} sprinkleColors={['#f2709c', '#ffffff', '#e0457b']} />
        </group>
      </Float>
    </>
  )
}

export default function HeroCanvas({ reduced, onReady: notify }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)
  const [ready, setReady] = useState(false)
  const onReady = useCallback(() => {
    setReady(true)
    notify?.()
  }, [notify])

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
    <div
      ref={wrapRef}
      className={`pointer-events-none absolute -inset-[18%] transition-[opacity,scale] duration-700 ease-out ${ready ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}
    >
      {/* Sombra em CSS: mesmo efeito da sombra 3D, sem custo de renderização. */}
      <div aria-hidden="true" className="absolute left-1/2 top-[72%] h-[6%] w-[42%] -translate-x-1/2 rounded-[50%] bg-[#1f7f79]/40 blur-xl" />
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 6.4], fov: 38 }}
        frameloop={ready && visible ? 'always' : 'never'}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          // Sem a checagem síncrona de erros, a compilação dos shaders não trava a página.
          gl.debug.checkShaderErrors = false
        }}
        aria-label="Donut 3D com cobertura rosa e granulado colorido"
        role="img"
      >
        <Scene reduced={reduced} />
        <Warmup onReady={onReady} />
      </Canvas>
    </div>
  )
}
