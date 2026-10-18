import { ArrowLeft, ArrowRight, Plus } from '@phosphor-icons/react'
import useEmblaCarousel from 'embla-carousel-react'
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures'
import { useCallback, useEffect, useRef, useState } from 'react'
import { products } from '../content'
import { tiltHandlers } from '../hooks/useTilt'
import { whatsappLink } from '../lib/whatsapp'
import { Drip } from './Drip'

export function Carousel() {
  const [viewportRef, embla] = useEmblaCarousel({ loop: true, align: 'center', dragFree: true }, [WheelGesturesPlugin({ forceWheelAxis: 'x' })])
  const [progress, setProgress] = useState(0)
  const [current, setCurrent] = useState(0)
  const progressRef = useRef<HTMLDivElement>(null)

  const onScroll = useCallback(() => {
    if (!embla) return
    const p = embla.scrollProgress()
    setProgress(((p % 1) + 1) % 1)
    setCurrent(embla.selectedScrollSnap())
  }, [embla])

  useEffect(() => {
    if (!embla) return
    embla.on('scroll', onScroll).on('reInit', onScroll).on('select', onScroll)
    return () => {
      embla.off('scroll', onScroll).off('reInit', onScroll).off('select', onScroll)
    }
  }, [embla, onScroll])

  const prev = () => embla?.scrollPrev()
  const next = () => embla?.scrollNext()

  return (
    <section id="vitrine" className="relative bg-blush pt-[clamp(76px,13vw,200px)] pb-12 sm:pb-16" aria-labelledby="vitrine-title">
      <Drip color="#ffffff" seed={9} count={18} className="absolute inset-x-0 top-0 z-10" />

      <div className="container-x flex flex-wrap items-end justify-between gap-6">
        <div data-reveal>
          <p className="eyebrow">Vitrine do dia</p>
          <h2 id="vitrine-title" className="mt-3 font-display text-[clamp(1.75rem,4.5vw,3.4rem)] font-bold leading-none">
            Saídos do forno hoje
          </h2>
        </div>
        <div data-reveal className="flex items-center gap-3">
          <p className="mr-2 hidden text-sm text-ink-soft md:block">Role, arraste ou use as setas</p>
          {[
            { fn: prev, Icon: ArrowLeft, label: 'Doce anterior' },
            { fn: next, Icon: ArrowRight, label: 'Próximo doce' },
          ].map(({ fn, Icon, label }) => (
            <button
              key={label}
              type="button"
              onClick={fn}
              aria-label={label}
              aria-controls="vitrine-track"
              className="group grid size-11 place-items-center sm:size-14 rounded-full border-2 border-ink/15 bg-white text-ink transition duration-300 hover:scale-110 hover:border-pink hover:bg-pink hover:text-white active:scale-95"
            >
              <Icon size={20} weight="bold" className="transition-transform duration-300 group-hover:scale-110" />
            </button>
          ))}
        </div>
      </div>

      <div
        ref={viewportRef}
        className="mt-6 cursor-grab sm:mt-10 overflow-hidden active:cursor-grabbing"
        role="region"
        aria-roledescription="carrossel"
        aria-label="Doces da vitrine"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') prev()
          if (e.key === 'ArrowRight') next()
        }}
      >
        <ul id="vitrine-track" className="flex touch-pan-y gap-5">
          {products.map((p, i) => (
            <li
              key={p.name}
              className="min-w-0 shrink-0 basis-[62%] py-4 sm:basis-[40%] md:basis-[30%] lg:basis-[22%]"
              aria-roledescription="slide"
              aria-label={`${i + 1} de ${products.length}: ${p.name}`}
            >
              <article
                {...tiltHandlers(7)}
                className={`tilt group relative h-full rounded-[1.75rem] bg-white p-3 shadow-[0_20px_40px_-28px_rgb(35_48_59/0.45)] hover:shadow-[0_30px_50px_-25px_rgb(224_69_123/0.5)] ${
                  current === i ? 'ring-2 ring-pink/30' : ''
                }`}
              >
                <div className="relative aspect-[4/4.2] overflow-hidden rounded-[1.25rem] bg-mint-soft">
                  <img
                    src={`/images/${p.image}.webp`}
                    alt={p.name}
                    width={640}
                    height={960}
                    loading="lazy"
                    draggable={false}
                    className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-1"
                  />
                  {p.tag && (
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-pink-ink backdrop-blur">{p.tag}</span>
                  )}
                </div>
                <div className="flex items-end justify-between gap-3 px-2 pt-4 pb-1">
                  <div className="min-w-0">
                    <h3 className="truncate font-display text-base font-semibold sm:text-lg">{p.name}</h3>
                    <p className="font-display text-lg font-semibold text-pink-ink sm:text-xl">{p.price}</p>
                  </div>
                  <a
                    href={whatsappLink(`Olá! Quero encomendar: ${p.name}.`)}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Encomendar ${p.name}`}
                    className="grid size-10 shrink-0 place-items-center rounded-full bg-mint-soft sm:size-11 text-mint-deep transition duration-500 ease-[var(--ease-jelly)] hover:rotate-90 hover:bg-pink hover:text-white group-hover:bg-pink group-hover:text-white"
                  >
                    <Plus size={20} weight="bold" />
                  </a>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>

      <div className="container-x mt-6 sm:mt-8">
        <div className="h-1.5 overflow-hidden rounded-full bg-pink/15" aria-hidden="true">
          <div ref={progressRef} className="h-full w-1/4 rounded-full bg-pink" style={{ transform: `translateX(${progress * 300}%)` }} />
        </div>
      </div>
    </section>
  )
}
