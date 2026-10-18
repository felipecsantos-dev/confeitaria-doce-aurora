import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

const R = 1 // raio do anel
const r = 0.44 // raio da massa

type Props = {
  icing?: string
  dough?: string
  sprinkles?: number
  seed?: number
  sprinkleColors?: string[]
}

function random(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
  }
}

/** Massa: toro com pequenas irregularidades para não parecer plástico. */
function makeDough(seed: number) {
  const geo = new THREE.TorusGeometry(R, r, 48, 120)
  const pos = geo.attributes.position
  const rnd = random(seed)
  const phase = [rnd() * 6, rnd() * 6, rnd() * 6]
  const v = new THREE.Vector3()
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i)
    const u = Math.atan2(v.y, v.x)
    const bump = Math.sin(u * 5 + phase[0]) * 0.012 + Math.sin(u * 11 + v.z * 6 + phase[1]) * 0.008 + Math.sin(v.z * 9 + phase[2]) * 0.006
    const center = new THREE.Vector3(Math.cos(u) * R, Math.sin(u) * R, 0)
    const n = v.clone().sub(center).normalize()
    v.addScaledVector(n, bump)
    pos.setXYZ(i, v.x, v.y, v.z)
  }
  geo.computeVertexNormals()
  return geo
}

/**
 * Cobertura: superfície paramétrica sobre a metade de cima do toro.
 * Do lado de fora a borda desce em gotas (curvas gaussianas), como glacê escorrendo.
 */
function makeIcing(seed: number) {
  const rnd = random(seed + 7)
  const drips = Array.from({ length: 11 }, () => ({
    u: rnd() * Math.PI * 2,
    width: 0.06 + rnd() * 0.12,
    depth: 0.35 + rnd() * 0.85,
  }))
  const innerDrips = Array.from({ length: 5 }, () => ({
    u: rnd() * Math.PI * 2,
    width: 0.08 + rnd() * 0.1,
    depth: 0.15 + rnd() * 0.3,
  }))
  const wave = (u: number, k: number) => Math.sin(u * k + seed) * 0.06 + Math.sin(u * (k + 3) + seed * 2) * 0.04
  const dripAt = (u: number, list: typeof drips) =>
    list.reduce((sum, d) => {
      let du = Math.abs(u - d.u)
      du = Math.min(du, Math.PI * 2 - du)
      return sum + d.depth * Math.exp(-(du * du) / (2 * d.width * d.width))
    }, 0)

  const segU = 260
  const segV = 48
  const positions: number[] = []
  const uvs: number[] = []
  const indices: number[] = []

  for (let i = 0; i <= segU; i++) {
    const u = (i / segU) * Math.PI * 2
    // Ângulo do tubo: 0 = equador externo, PI/2 = topo, PI = equador interno.
    const outer = 0.12 - wave(u, 4) - dripAt(u, drips)
    const inner = Math.PI - 0.05 + wave(u, 6) * 0.8 + dripAt(u, innerDrips)
    for (let j = 0; j <= segV; j++) {
      const s = j / segV
      const theta = outer + (inner - outer) * s
      // Espessura: mais grossa no meio, afinando nas bordas para "fundir" com a massa.
      const edge = Math.min(s, 1 - s)
      const thick = 0.012 + 0.038 * Math.min(1, edge * 7) ** 0.6
      const rr = r + thick
      const x = (R + rr * Math.cos(theta)) * Math.cos(u)
      const y = (R + rr * Math.cos(theta)) * Math.sin(u)
      const z = rr * Math.sin(theta)
      positions.push(x, y, z)
      uvs.push(i / segU, s)
    }
  }
  for (let i = 0; i < segU; i++) {
    for (let j = 0; j < segV; j++) {
      const a = i * (segV + 1) + j
      const b = (i + 1) * (segV + 1) + j
      indices.push(a, b, a + 1, b, b + 1, a + 1)
    }
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geo.setIndex(indices)
  geo.computeVertexNormals()
  return geo
}

const defaultSprinkles = ['#ffffff', '#8edfd9', '#ffd166', '#7aa7ff', '#e0457b', '#b892ff']

export function Donut({ icing = '#ff86b3', dough = '#e1a15c', sprinkles = 300, seed = 3, sprinkleColors = defaultSprinkles }: Props) {
  const doughGeo = useMemo(() => makeDough(seed), [seed])
  const icingGeo = useMemo(() => makeIcing(seed), [seed])
  const sprinkleGeo = useMemo(() => new THREE.CapsuleGeometry(0.014, 0.065, 3, 8), [])
  const instRef = useRef<THREE.InstancedMesh>(null)

  useLayoutEffect(() => {
    const mesh = instRef.current
    if (!mesh) return
    const rnd = random(seed + 99)
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    const color = new THREE.Color()
    const up = new THREE.Vector3(0, 1, 0)
    for (let i = 0; i < sprinkles; i++) {
      const u = rnd() * Math.PI * 2
      // Só na parte de cima da cobertura.
      const theta = 0.45 + rnd() * (Math.PI - 0.85)
      const rr = r + 0.055
      const p = new THREE.Vector3((R + rr * Math.cos(theta)) * Math.cos(u), (R + rr * Math.cos(theta)) * Math.sin(u), rr * Math.sin(theta))
      const center = new THREE.Vector3(Math.cos(u) * R, Math.sin(u) * R, 0)
      const normal = p.clone().sub(center).normalize()
      // Deita o granulado na superfície com direção aleatória.
      const tangent = new THREE.Vector3().crossVectors(normal, new THREE.Vector3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5)).normalize()
      q.setFromUnitVectors(up, tangent)
      m.compose(p, q, new THREE.Vector3(1, 1, 1))
      mesh.setMatrixAt(i, m)
      mesh.setColorAt(i, color.set(sprinkleColors[Math.floor(rnd() * sprinkleColors.length)]))
    }
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [seed, sprinkles, sprinkleColors])

  return (
    <group>
      <mesh geometry={doughGeo} castShadow>
        <meshStandardMaterial color={dough} roughness={0.72} />
      </mesh>
      <mesh geometry={icingGeo}>
        <meshPhysicalMaterial color={icing} roughness={0.2} clearcoat={1} clearcoatRoughness={0.08} sheen={0.3} sheenColor="#ffffff" side={THREE.DoubleSide} />
      </mesh>
      {sprinkles > 0 && (
        <instancedMesh ref={instRef} args={[sprinkleGeo, undefined, sprinkles]}>
          <meshStandardMaterial roughness={0.35} />
        </instancedMesh>
      )}
    </group>
  )
}
