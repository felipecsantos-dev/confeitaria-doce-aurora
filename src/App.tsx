import { useEffect } from 'react'
import { About } from './components/About'
import { Carousel } from './components/Carousel'
import { Cta } from './components/Cta'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { Highlights } from './components/Highlights'
import { Location } from './components/Location'
import { Marquee } from './components/Marquee'
import { Menu } from './components/Menu'
import { Navbar } from './components/Navbar'
import { useLenis } from './hooks/useLenis'
import { useReducedMotion } from './hooks/useReducedMotion'
import { gsap, ScrollTrigger } from './lib/gsap'

export default function App() {
  const reduced = useReducedMotion()
  useLenis(!reduced)

  // Revela os elementos marcados com data-reveal; grupos entram em sequência.
  useEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      const grouped = new Set<Element>()
      gsap.utils.toArray<HTMLElement>('[data-reveal-group]').forEach((group) => {
        const items = group.querySelectorAll('[data-reveal]')
        items.forEach((el) => grouped.add(el))
        gsap.from(items, {
          y: 50,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: { trigger: group, start: 'top 85%' },
        })
      })
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        if (grouped.has(el)) return
        gsap.from(el, { y: 40, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } })
      })
    })
    // Recalcula as posições quando as imagens terminam de carregar.
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    return () => {
      window.removeEventListener('load', refresh)
      ctx.revert()
    }
  }, [reduced])

  return (
    <>
      <a
        href="#conteudo"
        className="fixed left-4 top-4 z-[200] -translate-y-24 rounded-full bg-ink px-5 py-3 font-semibold text-white transition focus:translate-y-0"
      >
        Pular para o conteúdo
      </a>
      <Navbar />
      <main id="conteudo">
        <Hero />
        <Highlights />
        <Carousel />
        <div className="relative z-20 -my-8">
          <Marquee />
        </div>
        <About />
        <Menu />
        <Location />
        <Cta />
      </main>
      <Footer />
    </>
  )
}
