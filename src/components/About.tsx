import { Sparkle } from '@phosphor-icons/react'
import { useEffect, useRef } from 'react'
import { about, site } from '../content'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { gsap } from '../lib/gsap'

function SpinningBadge() {
  const text = `feito à mão • desde ${site.since} • `
  return (
    <div className="absolute -right-4 -top-6 z-10 grid size-32 place-items-center rounded-full bg-pink text-white shadow-pink sm:-right-8 sm:size-36">
      <svg viewBox="0 0 100 100" className="absolute inset-0 animate-[spin-slow_16s_linear_infinite]" aria-hidden="true">
        <defs>
          <path id="badge-circle" d="M50 50m-37 0a37 37 0 1 1 74 0a37 37 0 1 1 -74 0" />
        </defs>
        <text className="fill-white font-sans text-[9.5px] font-bold uppercase tracking-[0.12em]">
          <textPath href="#badge-circle">{text}</textPath>
        </text>
      </svg>
      <span className="font-display text-2xl font-bold">{site.since}</span>
    </div>
  )
}

export function About() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced || !ref.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo('[data-parallax]', { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: ref.current, scrub: true } })
      gsap.from('[data-photo]', {
        clipPath: 'inset(30% 30% 30% 30% round 50%)',
        duration: 1.4,
        ease: 'expo.out',
        scrollTrigger: { trigger: '[data-photo]', start: 'top 80%' },
      })
      gsap.from('[data-photo-small]', {
        scale: 0,
        rotate: -30,
        duration: 1.2,
        ease: 'elastic.out(1, 0.55)',
        scrollTrigger: { trigger: '[data-photo]', start: 'top 60%' },
      })
      // Contadores animados
      gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
        const end = Number(el.dataset.count)
        const decimals = Number(el.dataset.decimals ?? 0)
        const obj = { v: 0 }
        gsap.to(obj, {
          v: end,
          duration: 2,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%' },
          onUpdate: () => {
            el.textContent = obj.v.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
          },
        })
      })
    }, ref)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section ref={ref} id="sobre" className="relative isolate overflow-hidden bg-white py-24 lg:py-32" aria-labelledby="sobre-title">
      <div className="container-x grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
        <div className="relative mx-auto w-full max-w-lg">
          <div data-photo className="relative aspect-[4/5] overflow-hidden rounded-[46%_54%_48%_52%/38%_40%_60%_62%] bg-mint-soft shadow-soft">
            <img
              data-parallax
              src="/images/cafe-rosa.webp"
              alt="Salão da confeitaria com mesas de mármore, cadeiras rosa e flores"
              width={1200}
              height={1599}
              loading="lazy"
              className="absolute inset-0 h-[118%] w-full -translate-y-[8%] object-cover"
            />
          </div>
          <div
            data-photo-small
            className="absolute -bottom-8 -left-4 size-40 overflow-hidden rounded-full border-[6px] border-white shadow-soft sm:-left-10 sm:size-48"
          >
            <img
              src="/images/confeiteira.webp"
              alt="Confeiteira decorando doces com saco de confeitar"
              width={1200}
              height={1800}
              loading="lazy"
              className="size-full object-cover"
            />
          </div>
          <SpinningBadge />
          <span aria-hidden="true" className="absolute -left-10 top-10 -z-10 size-40 animate-[blob_12s_ease-in-out_infinite] bg-mint" />
          <span aria-hidden="true" className="absolute -bottom-12 right-6 -z-10 size-28 animate-[blob_9s_ease-in-out_infinite_reverse] bg-glaze" />
        </div>

        <div>
          <p data-reveal className="eyebrow">
            {about.eyebrow}
          </p>
          <h2 id="sobre-title" data-reveal className="mt-4 font-display text-[clamp(2.3rem,4.6vw,3.6rem)] font-bold leading-[1.02]">
            Desde <span className="text-pink-ink">{site.since}</span> adoçando Aurora do Vale
          </h2>
          {about.paragraphs.map((p) => (
            <p key={p} data-reveal className="mt-5 text-lg leading-relaxed text-ink-soft">
              {p}
            </p>
          ))}

          <div data-reveal className="mt-8 flex gap-4 rounded-3xl bg-mint-soft p-5">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white text-pink-deep">
              <Sparkle size={24} weight="fill" />
            </span>
            <div>
              <h3 className="font-display text-lg font-semibold">{about.specialty.title}</h3>
              <p className="mt-1 text-ink-soft">{about.specialty.text}</p>
            </div>
          </div>

          <dl data-reveal-group className="mt-10 grid grid-cols-3 gap-4 border-t border-ink/10 pt-8">
            {about.stats.map((s) => (
              <div key={s.label} data-reveal>
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-display text-[clamp(2rem,4vw,3rem)] font-bold leading-none text-ink">
                  <span data-count={s.value} data-decimals={'decimals' in s ? s.decimals : 0}>
                    {s.value.toLocaleString('pt-BR')}
                  </span>
                  <span className="text-pink-deep">{s.suffix}</span>
                </dd>
                <dd className="mt-2 text-sm text-ink-soft" aria-hidden="true">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
