import { useEffect, useId, useMemo, useRef } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { gsap } from '../lib/gsap'

type Props = {
  color: string
  seed?: number
  count?: number
  className?: string
  /** Brilho no topo da calda (para coberturas claras). */
  gloss?: boolean
}

const W = 1440
const H = 220
const BAND = 46

function random(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Faixa de recheio escorrendo. As gotas são unidas pelo filtro "goo"
 * e descem conforme a seção entra na tela.
 */
export function Drip({ color, seed = 1, count = 15, className = '', gloss = false }: Props) {
  const id = useId().replace(/:/g, '')
  const ref = useRef<SVGSVGElement>(null)
  const reduced = useReducedMotion()

  const shape = useMemo(() => {
    const rnd = random(seed)
    const lumps = Array.from({ length: 22 }, (_, i) => ({
      cx: (i / 21) * W + (rnd() - 0.5) * 30,
      r: 18 + rnd() * 16,
    }))
    const step = W / count
    const drips = Array.from({ length: count }, (_, i) => {
      const w = 20 + rnd() * 26
      const len = 34 + Math.pow(rnd(), 1.4) * (H - BAND - 50)
      return { x: step * i + step * (0.2 + rnd() * 0.6), w, len }
    })
    return { lumps, drips }
  }, [seed, count])

  useEffect(() => {
    const svg = ref.current
    // No celular a calda já aparece escorrida: animar o filtro "goo" quadro a quadro travava a rolagem.
    if (!svg || reduced || window.matchMedia('(max-width: 1023px)').matches) return
    const drips = svg.querySelectorAll<SVGGElement>('[data-drip]')
    const ctx = gsap.context(() => {
      gsap.fromTo(
        drips,
        { y: (i) => -shape.drips[i].len * 0.85 },
        {
          y: 0,
          duration: 1.6,
          ease: 'power2.out',
          stagger: { each: 0.05, from: 'random' },
          // Escorre uma vez ao aparecer: o filtro "goo" só é recalculado durante a animação, não a cada rolagem.
          scrollTrigger: { trigger: svg, start: 'top 90%', once: true },
        },
      )
    }, svg)
    return () => ctx.revert()
  }, [reduced, shape])

  return (
    <svg
      ref={ref}
      aria-hidden="true"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMin slice"
      className={`pointer-events-none block w-full h-[clamp(60px,12vw,190px)] ${className}`}
    >
      <defs>
        <filter id={`goo-${id}`} x="-5%" y="-20%" width="110%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="9" />
          <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" />
        </filter>
      </defs>
      <g filter={`url(#goo-${id})`} fill={color}>
        <rect x={-40} y={-40} width={W + 80} height={BAND + 40} />
        {shape.lumps.map((l, i) => (
          <circle key={i} cx={l.cx} cy={BAND - 4} r={l.r} />
        ))}
        {shape.drips.map((d, i) => (
          <g key={i} data-drip>
            <rect x={d.x - d.w / 2} y={BAND - 30} width={d.w} height={d.len + 30} rx={d.w / 2} />
            <circle cx={d.x} cy={BAND + d.len - d.w * 0.35} r={d.w * 0.62} />
          </g>
        ))}
      </g>
      {gloss && (
        <path
          d={`M60 ${BAND - 22} C 360 ${BAND - 34}, 620 ${BAND - 10}, 900 ${BAND - 26} S 1300 ${BAND - 18}, 1400 ${BAND - 28}`}
          fill="none"
          stroke="#fff"
          strokeOpacity="0.45"
          strokeWidth="5"
          strokeLinecap="round"
        />
      )}
    </svg>
  )
}
