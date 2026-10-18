import { InstagramLogo, TiktokLogo, WhatsappLogo } from '@phosphor-icons/react'
import { lazy, Suspense, useEffect, useRef } from 'react'
import { hero, site } from '../content'
import { scrollToId } from '../hooks/useLenis'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { gsap } from '../lib/gsap'
import { whatsappLink } from '../lib/whatsapp'

const HeroCanvas = lazy(() => import('../three/HeroCanvas'))

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

  useEffect(() => {
    if (reduced || !ref.current) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
      tl.from('[data-letter]', { yPercent: 110, rotate: 8, duration: 1.1, stagger: 0.025 })
        .from('[data-hero-fade]', { y: 30, opacity: 0, duration: 0.9, stagger: 0.1 }, '-=0.7')
        .from('[data-hero-art]', { scale: 0.6, opacity: 0, duration: 1.4, ease: 'elastic.out(1, 0.6)' }, 0.2)
      // Granulados de fundo se afastam ao rolar.
      gsap.to('[data-sprinkle]', {
        y: (i) => -80 - i * 25,
        rotate: (i) => (i % 2 ? 120 : -120),
        ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true },
      })
    }, ref)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      ref={ref}
      id="inicio"
      className="relative isolate overflow-hidden bg-[radial-gradient(120%_90%_at_80%_20%,#bff0ec_0%,#8edfd9_45%,#5fcac3_100%)] pt-24 pb-8 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-24"
    >
      {/* Bolhas de fundo que mudam de forma */}
      <div aria-hidden="true" className="absolute -left-32 top-1/3 -z-10 size-[28rem] rounded-[58%_42%_55%_45%/48%_58%_42%_52%] bg-white/25 blur-2xl" />
      <div
        aria-hidden="true"
        className="absolute right-[-10rem] top-[-8rem] -z-10 size-[34rem] rounded-[45%_55%_40%_60%/58%_42%_58%_42%] bg-glaze/40 blur-3xl"
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

        <div data-hero-art className="relative mx-auto aspect-square w-full max-w-[16rem] sm:max-w-[26rem] lg:-mr-10 lg:max-w-[38rem]">
          <div aria-hidden="true" className="absolute inset-[12%] rounded-full bg-white/30 blur-2xl" />
          <Suspense fallback={<div className="absolute inset-[18%] animate-pulse rounded-full bg-pink/40" />}>
            <HeroCanvas reduced={reduced} />
          </Suspense>
        </div>
      </div>
    </section>
  )
}
