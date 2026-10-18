import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { gsap, ScrollTrigger } from '../lib/gsap'

const words = ['Bolos de andar', 'Donuts recheados', 'Macarons', 'Drip cakes', 'Cupcakes', 'Tortas', 'Cookies']

function Flower() {
  return (
    <svg viewBox="0 0 24 24" className="size-6 shrink-0 sm:size-8 animate-[spin-slow_8s_linear_infinite] text-mint" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2c1.7 0 2.6 2.4 2.1 4.3 1.6-1.2 4.2-1.1 4.9.5.8 1.6-1 3.4-2.9 3.9 1.9.6 3.6 2.4 2.9 4-.7 1.6-3.3 1.7-4.9.5.5 1.9-.4 4.3-2.1 4.3s-2.6-2.4-2.1-4.3c-1.6 1.2-4.2 1.1-4.9-.5-.7-1.6 1-3.4 2.9-4C5.9 10.2 4.2 8.4 5 6.8c.7-1.6 3.3-1.7 4.9-.5C9.4 4.4 10.3 2 12 2Z"
      />
      <circle cx="12" cy="12" r="2.6" fill="#ffd166" />
    </svg>
  )
}

// Faixa de texto infinita que inclina conforme a velocidade da rolagem.
export function Marquee() {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    const skew = gsap.quickTo(el, 'skewX', { duration: 0.5, ease: 'power3' })
    const st = ScrollTrigger.create({
      trigger: el,
      onUpdate: (self) => skew(gsap.utils.clamp(-12, 12, self.getVelocity() / -250)),
    })
    return () => st.kill()
  }, [reduced])

  const row = (
    <div className="flex shrink-0 items-center gap-5 pr-5 sm:gap-8 sm:pr-8">
      {words.map((w) => (
        <span key={w} className="flex items-center gap-5 sm:gap-8">
          <span className="font-display text-[clamp(1.4rem,5vw,3.75rem)] font-semibold whitespace-nowrap text-white">{w}</span>
          <Flower />
        </span>
      ))}
    </div>
  )

  return (
    <div aria-hidden="true" className="-rotate-2 overflow-hidden bg-pink-deep py-3 shadow-pink sm:py-5">
      <div ref={ref} className="flex w-max animate-[marquee_32s_linear_infinite]">
        {row}
        {row}
      </div>
    </div>
  )
}
