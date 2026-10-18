import { HeartStraight } from '@phosphor-icons/react'
import { credits, nav, site } from '../content'
import { scrollToId } from '../hooks/useLenis'
import { Drip } from './Drip'
import { Logo } from './Logo'

export function Footer() {
  return (
    <footer className="relative bg-ink pb-10 pt-[clamp(110px,13vw,190px)] text-white/80">
      <Drip color="#d13a70" seed={41} count={12} className="absolute inset-x-0 top-0" />
      <div className="container-x grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-4 max-w-sm leading-relaxed">
            Confeitaria artesanal em {site.city}. Bolos, donuts e doces finos feitos no dia desde {site.since}.
          </p>
        </div>
        <nav aria-label="Rodapé">
          <h2 className="font-display text-lg font-semibold text-white">Navegue</h2>
          <ul className="mt-4 grid gap-2">
            {nav.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToId(n.id)
                  }}
                  className="link-drip rounded-md transition-colors hover:text-white"
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="font-display text-lg font-semibold text-white">Contato</h2>
          <ul className="mt-4 grid gap-2">
            <li>{site.phone}</li>
            <li>{site.email}</li>
            <li>{site.instagram}</li>
          </ul>
        </div>
      </div>
      <div className="container-x mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
        <p>{credits}</p>
        <p className="flex items-center gap-1.5">
          Desenvolvido com <HeartStraight size={14} weight="fill" className="text-pink" aria-label="carinho" /> por
          <a href={site.author.url} target="_blank" rel="noreferrer" className="link-drip rounded font-semibold text-white">
            {site.author.name}
          </a>
        </p>
      </div>
    </footer>
  )
}
