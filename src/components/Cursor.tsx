import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'

// Bolinha rosa que segue o mouse e cresce sobre links e botões. Só em ponteiro fino.
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const x = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3' })
    const y = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3' })
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      x(e.clientX)
      y(e.clientY)
      const hot = (e.target as Element | null)?.closest('a, button, [role="region"][tabindex], canvas')
      el.dataset.hot = hot ? 'true' : 'false'
      el.style.opacity = '1'
    }
    const leave = () => (el.style.opacity = '0')
    window.addEventListener('pointermove', move)
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-hot="false"
      className="pointer-events-none fixed left-0 top-0 z-[100] -ml-2 -mt-2 size-4 rounded-full bg-pink opacity-0 mix-blend-multiply transition-[width,height,margin,opacity,background-color] duration-300 data-[hot=true]:-ml-7 data-[hot=true]:-mt-7 data-[hot=true]:size-14 data-[hot=true]:bg-pink/35"
    />
  )
}
