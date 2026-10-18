import { List, X } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { nav, site } from '../content'
import { scrollToId } from '../hooks/useLenis'
import { Logo } from './Logo'

export function Navbar() {
  const [hidden, setHidden] = useState(false)
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('inicio')

  // Some ao descer e volta ao subir.
  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setSolid(y > 40)
      if (y > 300 && y > last + 2) setHidden(true)
      else if (y < last - 2 || y <= 300) setHidden(false)
      last = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Destaca o link da seção que está na tela.
  useEffect(() => {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-45% 0px -50% 0px' })
    nav.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
    }
  }, [open])

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    setOpen(false)
    scrollToId(id)
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${hidden && !open ? '-translate-y-full' : 'translate-y-0'} ${
          solid && !open ? 'bg-white/80 shadow-[0_10px_30px_-20px_rgb(35_48_59/0.4)] backdrop-blur-xl' : ''
        }`}
      >
        <nav className="container-x flex h-16 items-center sm:h-20 justify-between gap-6" aria-label="Principal">
          <a href="#inicio" onClick={go('inicio')} className="group relative z-10 rounded-full" aria-label={`${site.fullName}, voltar ao início`}>
            <Logo />
          </a>

          <ul className="hidden items-center gap-8 font-medium lg:flex">
            {nav.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} onClick={go(item.id)} className="link-drip rounded-md" aria-current={active === item.id}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <a href="#cardapio" onClick={go('cardapio')} className="btn btn-primary hidden !min-h-11 !px-5 text-sm sm:inline-flex">
              Encomendar
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="relative z-10 grid size-11 place-items-center rounded-full bg-white text-ink shadow-soft lg:hidden"
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            >
              {open ? <X size={22} weight="bold" /> : <List size={22} weight="bold" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Fora do header: o transform dele prenderia o painel fixo. */}
      <div
        id="menu-mobile"
        className={`fixed inset-0 z-40 bg-mint transition-[clip-path] duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] lg:hidden ${
          open ? '[clip-path:circle(150%_at_calc(100%-2.5rem)_2.5rem)]' : 'pointer-events-none [clip-path:circle(0%_at_calc(100%-2.5rem)_2.5rem)]'
        }`}
        inert={!open}
      >
        <ul className="container-x flex h-full flex-col justify-center gap-3">
          {nav.map((item, i) => (
            <li
              key={item.id}
              className="transition-all duration-500"
              style={{ transitionDelay: open ? `${150 + i * 60}ms` : '0ms', opacity: open ? 1 : 0, transform: open ? 'none' : 'translateY(20px)' }}
            >
              <a href={`#${item.id}`} onClick={go(item.id)} className="font-display text-4xl font-semibold text-ink transition-colors hover:text-pink-ink">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
