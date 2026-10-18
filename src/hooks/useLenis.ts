import Lenis from 'lenis'
import { useEffect } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'

let lenis: Lenis | null = null

// Rola até uma seção usando o Lenis quando ele está ativo.
export function scrollToId(id: string) {
  const target = document.getElementById(id)
  if (!target) return
  // As seções começam com a faixa de calda; o deslocamento leva o título para perto do topo.
  const y = id === 'inicio' ? 0 : target.getBoundingClientRect().top + window.scrollY + 40
  if (lenis) lenis.scrollTo(y, { duration: 1.4 })
  else window.scrollTo({ top: y, behavior: 'smooth' })
}

export function useLenis(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return
    const instance = new Lenis({ lerp: 0.1, wheelMultiplier: 0.9 })
    lenis = instance
    instance.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => instance.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      instance.destroy()
      lenis = null
    }
  }, [enabled])
}
