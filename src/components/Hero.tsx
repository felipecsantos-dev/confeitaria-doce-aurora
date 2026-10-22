import { InstagramLogo, TiktokLogo, WhatsappLogo } from '@phosphor-icons/react'
import { Component, lazy, Suspense, useCallback, useLayoutEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'
import { hero, site } from '../content'
import { scrollToId } from '../hooks/useLenis'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { gsap } from '../lib/gsap'
import { whatsappLink } from '../lib/whatsapp'

const HeroCanvas = lazy(() => import('../three/HeroCanvas'))

// Celulares e tablets recebem uma foto do donut no lugar do 3D: o canvas travava a rolagem
// em aparelhos comuns, e lá ele nem responde ao toque.
const mobileQuery = '(max-width: 1023px)'
function useMobile() {
  return useSyncExternalStore(
    (cb) => {
      const mql = window.matchMedia(mobileQuery)
      mql.addEventListener('change', cb)
      return () => mql.removeEventListener('change', cb)
    },
    () => window.matchMedia(mobileQuery).matches,
    () => true,
  )
}

/** Quadro da própria cena 3D (public/images/donut-hero.webp), flutuando com CSS. */
function DonutStill({ reduced, onReady }: { reduced: boolean; onReady: () => void }) {
  const [loaded, setLoaded] = useState(false)
  const done = useCallback(() => {
    setLoaded(true)
    onReady()
  }, [onReady])
  return (
    <div
      className={`pointer-events-none absolute -inset-[18%] transition-[opacity,scale] duration-700 ease-out ${loaded ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}
    >
      <div aria-hidden="true" className="absolute left-1/2 top-[72%] h-[6%] w-[42%] -translate-x-1/2 rounded-[50%] bg-[#1f7f79]/30" />
      <img
        ref={(img) => {
          if (img?.complete && !loaded) done()
        }}
        src="/images/donut-hero.webp"
        alt="Donut com cobertura rosa e granulado colorido"
        width={900}
        height={900}
        fetchPriority="high"
        onLoad={done}
        className={`relative size-full ${reduced ? '' : 'animate-[donut-float_6s_ease-in-out_infinite]'}`}
      />
    </div>
  )
}

// Se o arquivo do 3D não carregar (internet instável), mostra a foto em vez de derrubar a página.
class CanvasBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

function Letters({ text, className = '' }: { text: string; className?: string }) {
  return (
    <span className={`inline-block whitespace-nowrap ${className}`}>
      {[...text].map((ch, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <span data-letter className="inline-block">
            {ch === ' ' ? ' ' : ch}
          </span>
        </span>
      ))}
    </span>
  )
}

const sprinkles = [
  { l: '8%', t: '22%', c: '#fff', r: 30 },
  { l: '44%', t: '14%', c: '#ffd166', r: -40 },
  { l: '52%', t: '78%', c: '#f2709c', r: 70 },
  { l: '90%', t: '18%', c: '#fff', r: -20 },
  { l: '4%', t: '74%', c: '#f2709c', r: 15 },
  { l: '34%', t: '90%', c: '#fff', r: 60 },
  { l: '96%', t: '62%', c: '#ffd166', r: 35 },
  { l: '62%', t: '8%', c: '#e0457b', r: -65 },
]

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const mobile = useMobile()
  // O 3D carrega desde o início, em paralelo com as fontes. Quando ele avisa que está pronto,
  // o texto e o donut entram juntos; se o 3D demorar, o texto não espera mais que 1,2 s.
  const ready3d = useRef<() => void>(() => {})
  const on3dReady = useCallback(() => ready3d.current(), [])

  // Antes da primeira pintura: esconde o texto para animá-lo depois.
  useLayoutEffect(() => {
    if (reduced || !ref.current) return
    let cancelled = false
    const waitFor3d = new Promise<void>((resolve) => {
      ready3d.current = resolve
      setTimeout(resolve, 1200)
    })
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power4.out' } })
      tl.from('[data-letter]', { yPercent: 110, rotate: 8, duration: 1.1, stagger: 0.025 }).from(
        '[data-hero-fade]',
        { y: 30, opacity: 0, duration: 0.9, stagger: 0.1 },
        '-=0.7',
      )
      Promise.all([document.fonts.ready, waitFor3d]).then(() => {
        if (!cancelled) tl.play()
      })
      // Granulados de fundo se afastam ao rolar.
      gsap.to('[data-sprinkle]', {
        y: (i) => -80 - i * 25,
        rotate: (i) => (i % 2 ? 120 : -120),
        ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true },
      })
    }, ref)
    return () => {
      cancelled = true
      ctx.revert()
    }
  }, [reduced])

  return (
    <section
      ref={ref}
      id="inicio"
      className="relative isolate overflow-hidden bg-[radial-gradient(120%_90%_at_80%_20%,#bff0ec_0%,#8edfd9_45%,#5fcac3_100%)] pt-24 pb-8 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-24"
    >
      {/* Bolhas de fundo que mudam de forma */}
      <div aria-hidden="true" className="absolute -left-32 top-1/3 -z-10 hidden lg:block size-[28rem] rounded-[58%_42%_55%_45%/48%_58%_42%_52%] bg-white/25 blur-2xl" />
      <div
        aria-hidden="true"
        className="absolute right-[-10rem] top-[-8rem] -z-10 hidden lg:block size-[34rem] rounded-[45%_55%_40%_60%/58%_42%_58%_42%] bg-glaze/40 blur-3xl"
      />
      {sprinkles.map((s, i) => (
        <span
          key={i}
          data-sprinkle
          aria-hidden="true"
          className="absolute -z-10 h-2.5 w-7 rounded-full opacity-80"
          style={{ left: s.l, top: s.t, background: s.c, rotate: `${s.r}deg` }}
        />
      ))}

      <div className="container-x grid items-center gap-2 sm:gap-6 lg:grid-cols-[1.05fr_1fr]">
        <div className="relative z-10 max-w-xl">
          <h1 className="font-display text-[clamp(2.4rem,7.2vw,5.9rem)] font-bold leading-[0.95] tracking-tight text-ink">
            <Letters text={hero.titleTop} />
            <br />
            <Letters text={hero.titleAccent} className="text-pink-ink" /> <Letters text={hero.titleBottom} />
          </h1>
          <p data-hero-fade className="mt-4 max-w-md text-base leading-relaxed sm:mt-6 sm:text-lg text-ink/80">
            {hero.text}
          </p>
          <div data-hero-fade className="mt-6 flex flex-wrap gap-3 sm:mt-9 sm:gap-4">
            <a href={whatsappLink('Olá! Quero fazer uma encomenda na Doce Aurora.')} target="_blank" rel="noreferrer" className="btn btn-primary">
              <WhatsappLogo size={22} weight="fill" />
              {hero.primary}
            </a>
            <a
              href="#cardapio"
              onClick={(e) => {
                e.preventDefault()
                scrollToId('cardapio')
              }}
              className="btn btn-ghost"
            >
              {hero.secondary}
            </a>
          </div>
          <ul data-hero-fade className="mt-6 flex items-center gap-3 sm:mt-10" aria-label="Redes sociais">
            {[
              { icon: InstagramLogo, label: `Instagram ${site.instagram}` },
              { icon: TiktokLogo, label: 'TikTok' },
              { icon: WhatsappLogo, label: 'WhatsApp' },
            ].map(({ icon: Icon, label }) => (
              <li key={label}>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  aria-label={`${label} (perfil fictício)`}
                  className="grid size-10 place-items-center rounded-full bg-white/60 sm:size-11 text-ink backdrop-blur transition duration-300 hover:-translate-y-1 hover:rotate-6 hover:bg-white hover:text-pink-ink"
                >
                  <Icon size={19} weight="fill" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[16rem] sm:max-w-[26rem] lg:-mr-10 lg:max-w-[38rem]">
          <div aria-hidden="true" className="absolute inset-[12%] hidden rounded-full bg-white/30 blur-2xl lg:block" />
          {mobile ? (
            <DonutStill reduced={reduced} onReady={on3dReady} />
          ) : (
            <CanvasBoundary fallback={<DonutStill reduced={reduced} onReady={on3dReady} />}>
              <Suspense fallback={null}>
                <HeroCanvas reduced={reduced} onReady={on3dReady} />
              </Suspense>
            </CanvasBoundary>
          )}
        </div>
      </div>
    </section>
  )
}
