import { ArrowsClockwise, InstagramLogo, Star, TiktokLogo, WhatsappLogo } from '@phosphor-icons/react'
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
        .from('[data-chip]', { y: 20, opacity: 0, scale: 0.8, duration: 0.8, stagger: 0.15, ease: 'back.out(2)' }, '-=0.9')
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
      className="relative isolate overflow-hidden bg-[radial-gradient(120%_90%_at_80%_20%,#bff0ec_0%,#8edfd9_45%,#5fcac3_100%)] pt-28 pb-16 lg:pt-32 lg:pb-24"
    >
      {/* Bolhas de fundo que mudam de forma */}
      <div aria-hidden="true" className="absolute -left-32 top-1/3 -z-10 size-[28rem] animate-[blob_14s_ease-in-out_infinite] bg-white/25 blur-2xl" />
      <div
        aria-hidden="true"
        className="absolute right-[-10rem] top-[-8rem] -z-10 size-[34rem] animate-[blob_18s_ease-in-out_infinite_reverse] bg-glaze/40 blur-3xl"
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

      <div className="container-x grid items-center gap-6 lg:grid-cols-[1.05fr_1fr]">
        <div className="relative z-10 max-w-xl">
          <p data-hero-fade className="eyebrow !text-ink">
            {hero.eyebrow}
          </p>
          <h1 className="mt-5 font-display text-[clamp(3rem,7.2vw,5.9rem)] font-bold leading-[0.95] tracking-tight text-ink">
            <Letters text={hero.titleTop} />
            <br />
            <Letters text={hero.titleAccent} className="text-pink-ink" /> <Letters text={hero.titleBottom} />
          </h1>
          <p data-hero-fade className="mt-6 max-w-md text-lg leading-relaxed text-ink/80">
            {hero.text}
          </p>
          <div data-hero-fade className="mt-9 flex flex-wrap gap-4">
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
          <ul data-hero-fade className="mt-10 flex items-center gap-3" aria-label="Redes sociais">
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
                  className="grid size-11 place-items-center rounded-full bg-white/60 text-ink backdrop-blur transition duration-300 hover:-translate-y-1 hover:rotate-6 hover:bg-white hover:text-pink-ink"
                >
                  <Icon size={21} weight="fill" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div data-hero-art className="relative mx-auto aspect-square w-full max-w-[38rem] lg:-mr-10">
          <div aria-hidden="true" className="absolute inset-[12%] rounded-full bg-white/30 blur-2xl" />
          <Suspense fallback={<div className="absolute inset-[18%] animate-pulse rounded-full bg-pink/40" />}>
            <HeroCanvas reduced={reduced} />
          </Suspense>

          <div
            data-chip
            className="absolute left-0 top-[12%] flex items-center gap-2 rounded-2xl bg-white/75 px-4 py-3 shadow-soft backdrop-blur-md sm:left-[2%]"
          >
            <Star size={20} weight="fill" className="text-[#f5b301]" />
            <span className="text-sm leading-tight">
              <strong className="block font-display text-lg">4,9</strong>2 mil avaliações
            </span>
          </div>
          <div data-chip className="absolute bottom-[10%] right-0 rounded-2xl bg-white/75 px-4 py-3 text-sm shadow-soft backdrop-blur-md sm:right-[4%]">
            <strong className="block font-display text-lg text-pink-ink">Feito hoje</strong>
            saiu do forno às 7h
          </div>
          <p
            data-chip
            className="absolute bottom-0 left-1/2 hidden -translate-x-1/2 items-center gap-2 rounded-full bg-ink/80 px-4 py-2 text-xs font-medium text-white sm:flex"
          >
            <ArrowsClockwise size={14} weight="bold" /> Arraste para girar
          </p>
        </div>
      </div>
    </section>
  )
}
