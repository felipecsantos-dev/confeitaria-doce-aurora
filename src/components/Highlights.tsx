import { Cake, Gift, Leaf, SunHorizon } from '@phosphor-icons/react'
import { highlights } from '../content'
import { Drip } from './Drip'

const icons = { cake: Cake, leaf: Leaf, sun: SunHorizon, gift: Gift }

export function Highlights() {
  return (
    <section aria-label="Diferenciais" className="relative bg-white pt-[clamp(76px,13vw,200px)] pb-6 sm:pb-10">
      <Drip color="#f58fb4" seed={4} gloss className="absolute inset-x-0 top-0 z-10" />
      <ul data-reveal-group className="container-x grid grid-cols-2 gap-x-5 gap-y-8 sm:gap-x-8 sm:gap-y-12 lg:grid-cols-4">
        {highlights.map((h) => {
          const Icon = icons[h.icon]
          return (
            <li key={h.title} data-reveal className="group">
              <span className="grid size-12 place-items-center sm:size-16 rounded-[58%_42%_55%_45%/48%_58%_42%_52%] bg-mint-soft text-mint-deep transition-colors duration-500 group-hover:bg-pink group-hover:text-white">
                <Icon
                  size={30}
                  weight="duotone"
                  className="size-6 transition-transform sm:size-[30px] duration-500 ease-[var(--ease-jelly)] group-hover:-rotate-12 group-hover:scale-125"
                />
              </span>
              <h3 className="mt-3 font-display text-base font-semibold sm:mt-5 sm:text-xl">{h.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft sm:mt-2 sm:text-base">{h.text}</p>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
