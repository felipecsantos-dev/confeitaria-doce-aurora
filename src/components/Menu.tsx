import { ArrowUpRight } from '@phosphor-icons/react'
import { useLayoutEffect, useRef, useState } from 'react'
import { categories, products, type Category } from '../content'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { Flip, gsap } from '../lib/gsap'
import { whatsappLink } from '../lib/whatsapp'

type Filter = Category | 'todos'

export function Menu() {
  const [filter, setFilter] = useState<Filter>('todos')
  const listRef = useRef<HTMLUListElement>(null)
  const flipState = useRef<Flip.FlipState | null>(null)
  const reduced = useReducedMotion()

  const choose = (id: Filter) => {
    if (id === filter) return
    if (listRef.current && !reduced) flipState.current = Flip.getState(listRef.current.children)
    setFilter(id)
  }

  // Reorganiza a grade com animação depois da troca de filtro.
  useLayoutEffect(() => {
    const state = flipState.current
    if (!state || !listRef.current) return
    flipState.current = null
    Flip.from(state, {
      targets: listRef.current.children,
      duration: 0.6,
      ease: 'power3.inOut',
      absolute: true,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.5, delay: 0.15 }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.85, duration: 0.3 }),
    })
  }, [filter])

  const visible = products.filter((p) => filter === 'todos' || p.category === filter)

  return (
    <section id="cardapio" className="relative bg-white pb-6 pt-10" aria-labelledby="cardapio-title">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <p data-reveal className="eyebrow">
            Cardápio
          </p>
          <h2 id="cardapio-title" data-reveal className="mt-3 font-display text-[clamp(2.3rem,4.6vw,3.6rem)] font-bold leading-none">
            Escolha seu próximo doce
          </h2>
          <p data-reveal className="mt-4 text-lg text-ink-soft">
            Preços por unidade ou por bolo inteiro. Encomendas de bolos com 48h de antecedência.
          </p>
        </div>

        <div data-reveal role="group" aria-label="Filtrar cardápio" className="mt-10 flex flex-wrap justify-center gap-3">
          {categories.map((c) => {
            const on = filter === c.id
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={on}
                onClick={() => choose(c.id)}
                className={`rounded-full border-2 px-6 py-2.5 font-semibold transition duration-300 hover:-translate-y-0.5 ${
                  on ? 'border-pink-deep bg-pink-deep text-white shadow-pink' : 'border-mint text-mint-deep hover:border-pink hover:text-pink-ink'
                }`}
              >
                {c.label}
              </button>
            )
          })}
        </div>

        <ul ref={listRef} className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
          {visible.map((p) => (
            <li key={p.name} data-flip-id={p.name}>
              <a
                href={whatsappLink(`Olá! Quero encomendar: ${p.name} (${p.price}).`)}
                target="_blank"
                rel="noreferrer"
                className="group flex h-full items-center gap-4 rounded-[1.75rem] border border-ink/8 bg-white p-3 pr-5 transition duration-500 hover:-translate-y-1 hover:border-pink/40 hover:shadow-[0_24px_40px_-28px_rgb(224_69_123/0.6)] focus-visible:!rounded-[1.75rem]"
              >
                <span className="size-24 shrink-0 overflow-hidden rounded-[1.25rem] bg-mint-soft">
                  <img
                    src={`/images/${p.image}.webp`}
                    alt=""
                    width={640}
                    height={960}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-115"
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline gap-2">
                    <span className="font-display text-lg font-semibold leading-tight">{p.name}</span>
                    <span aria-hidden="true" className="mb-1 min-w-4 flex-1 border-b-2 border-dotted border-ink/20" />
                    <span className="whitespace-nowrap font-display text-lg font-semibold text-pink-ink">{p.price}</span>
                  </span>
                  <span className="mt-1 line-clamp-2 block text-sm leading-snug text-ink-soft">{p.description}</span>
                </span>
                <ArrowUpRight
                  size={20}
                  weight="bold"
                  aria-hidden="true"
                  className="shrink-0 text-ink/30 transition duration-500 group-hover:rotate-45 group-hover:text-pink-deep"
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
