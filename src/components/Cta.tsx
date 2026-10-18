import { WhatsappLogo } from '@phosphor-icons/react'
import { whatsappLink } from '../lib/whatsapp'
import { Drip } from './Drip'

export function Cta() {
  return (
    <section aria-labelledby="cta-title" className="relative overflow-hidden bg-pink-deep pb-28 pt-[clamp(120px,14vw,210px)] text-white">
      <Drip color="#e6f8f6" seed={33} count={14} className="absolute inset-x-0 top-0 z-10" />
      <img
        src="/images/donuts-rosa.webp"
        alt=""
        width={1200}
        height={800}
        loading="lazy"
        className="absolute -right-24 bottom-0 hidden w-[34rem] rotate-6 rounded-[3rem] opacity-90 mix-blend-luminosity lg:block"
      />
      <div className="container-x relative">
        <div className="max-w-2xl">
          <h2 id="cta-title" data-reveal className="font-display text-[clamp(2.6rem,6vw,4.75rem)] font-bold leading-[0.95]">
            Tem festa chegando?
          </h2>
          <p data-reveal className="mt-5 max-w-lg text-lg text-white/90">
            Conte a data, o número de convidados e o sabor dos sonhos. A gente monta o bolo, os docinhos e a mesa.
          </p>
          <div data-reveal className="mt-9">
            <a href={whatsappLink('Olá! Quero um orçamento de bolo e doces para festa.')} target="_blank" rel="noreferrer" className="btn btn-light">
              <WhatsappLogo size={22} weight="fill" />
              Pedir orçamento
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
