import { Cake, Gift, Leaf, SunHorizon } from '@phosphor-icons/react'
import { highlights } from '../content'
import { Drip } from './Drip'

const icons = { cake: Cake, leaf: Leaf, sun: SunHorizon, gift: Gift }

export function Highlights() {
  return (
    <section aria-label="Diferenciais" className="relative bg-white pt-[clamp(110px,13vw,200px)] pb-10">
      <Drip color="#f58fb4" seed={4} gloss className="absolute inset-x-0 top-0 z-10" />
      <ul data-reveal-group className="container-x grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {highlights.map((h) => {
          const Icon = icons[h.icon]
          return (
            <li key={h.title} data-reveal className="group">
              <span className="grid size-16 animate-[blob_10s_ease-in-out_infinite] place-items-center bg-mint-soft text-mint-deep transition-colors duration-500 group-hover:bg-pink group-hover:text-white">
                <Icon
                  size={30}
                  weight="duotone"
                  className="transition-transform duration-500 ease-[var(--ease-jelly)] group-hover:-rotate-12 group-hover:scale-125"
                />
              </span>
              <h3 className="mt-5 font-display text-xl font-semibold">{h.title}</h3>
              <p className="mt-2 leading-relaxed text-ink-soft">{h.text}</p>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
