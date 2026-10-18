import { Clock, MapPin, NavigationArrow, Phone } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import { location, site } from '../content'
import { Drip } from './Drip'

function isOpenNow(date = new Date()) {
  const day = date.getDay()
  const hour = date.getHours() + date.getMinutes() / 60
  return location.hours.some((h) => h.open.includes(day) && hour >= h.from && hour < h.to)
}

const pinHtml = `
<span style="position:relative;display:grid;place-items:center;width:56px;height:56px">
  <span style="position:absolute;inset:8px;border-radius:999px;background:#f2709c;opacity:.35;animation:pin-pulse 2s ease-out infinite"></span>
  <svg width="40" height="48" viewBox="0 0 40 48" style="position:relative;filter:drop-shadow(0 8px 10px rgb(224 69 123/.45))">
    <path d="M20 47C20 47 38 29 38 18A18 18 0 0 0 2 18c0 11 18 29 18 29Z" fill="#e0457b"/>
    <circle cx="20" cy="18" r="10" fill="#e9a65f"/><circle cx="20" cy="18" r="4" fill="#fff"/>
    <path d="M10.5 15c1-4.5 5-7.5 9.5-7.5s8.5 3 9.5 7.5c-1.5.8-2 2.6-3.4 1.6-1-.7-2 1.8-3.3.4-1.1-1.2-2.2 1.6-3.6.3-1.3-1.2-2.4 1.4-3.6.1-1-1.1-2.2.6-5.1-2.4Z" fill="#ffc6da"/>
  </svg>
</span>`

export function Location() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [open] = useState(isOpenNow)

  // Só carrega o Leaflet e os blocos do mapa quando a seção chega perto da tela.
  useEffect(() => {
    const el = mapRef.current
    if (!el) return
    let map: import('leaflet').Map | undefined
    let cancelled = false
    const io = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        const [L] = await Promise.all([import('leaflet'), import('leaflet/dist/leaflet.css')])
        if (cancelled) return
        map = L.map(el, { center: location.coords, zoom: 15, maxZoom: 16, scrollWheelZoom: false, zoomControl: false, attributionControl: true })
        L.control.zoom({ position: 'bottomright' }).addTo(map)
        // Mapa sem nomes de ruas: o endereço da confeitaria é fictício.
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
          attribution: 'Tiles &copy; Esri',
          maxZoom: 16,
        }).addTo(map)
        const icon = L.divIcon({ html: pinHtml, className: 'map-pin', iconSize: [56, 56], iconAnchor: [28, 50] })
        L.marker(location.coords, { icon, title: site.fullName, alt: site.fullName }).addTo(map)
      },
      { rootMargin: '300px' },
    )
    io.observe(el)
    return () => {
      cancelled = true
      io.disconnect()
      map?.remove()
    }
  }, [])

  return (
    <section id="visite" className="relative bg-mint-soft pb-16 sm:pb-24 pt-[clamp(76px,13vw,200px)]" aria-labelledby="visite-title">
      <Drip color="#ffffff" seed={27} count={16} className="absolute inset-x-0 top-0 z-10" />

      <div className="container-x">
        <div className="max-w-2xl">
          <h2 id="visite-title" data-reveal className="font-display text-[clamp(1.75rem,4.6vw,3.6rem)] font-bold leading-none">
            Passa aqui para um café com bolo
          </h2>
        </div>

        <div className="mt-8 grid gap-4 sm:mt-12 sm:gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div data-reveal className="relative overflow-hidden rounded-[2rem] border-[6px] border-white bg-white shadow-soft">
            <div
              ref={mapRef}
              className="h-64 w-full sm:h-[22rem] lg:h-full lg:min-h-[28rem]"
              role="region"
              aria-label="Mapa com a localização da confeitaria"
            />
            <p className="pointer-events-none absolute left-4 top-4 z-[500] rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-ink-soft shadow backdrop-blur">
              Endereço fictício · projeto de portfólio
            </p>
          </div>

          <div data-reveal className="flex flex-col gap-5 rounded-[2rem] bg-white p-5 shadow-soft sm:gap-6 sm:p-9">
            <div className="flex gap-4">
              <MapPin size={26} weight="duotone" className="mt-0.5 shrink-0 text-pink-deep" />
              <address className="not-italic">
                <strong className="block font-display text-lg font-semibold sm:text-xl">{location.address}</strong>
                <span className="text-ink-soft">{location.city}</span>
              </address>
            </div>

            <div className="flex gap-4">
              <Clock size={26} weight="duotone" className="mt-0.5 shrink-0 text-pink-deep" />
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <strong className="font-display text-lg font-semibold sm:text-xl">Horários</strong>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
                      open ? 'bg-mint-soft text-mint-deep' : 'bg-blush text-pink-ink'
                    }`}
                  >
                    <span className={`size-2 rounded-full ${open ? 'animate-pulse bg-mint-deep' : 'bg-pink-deep'}`} />
                    {open ? 'Aberto agora' : 'Fechado agora'}
                  </span>
                </div>
                <dl className="mt-3 divide-y divide-ink/8">
                  {location.hours.map((h) => (
                    <div key={h.days} className="flex justify-between py-2 text-[0.95rem]">
                      <dt className="text-ink-soft">{h.days}</dt>
                      <dd className="font-semibold">{h.time}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            <div className="flex gap-4">
              <Phone size={26} weight="duotone" className="mt-0.5 shrink-0 text-pink-deep" />
              <div>
                <strong className="block font-display text-lg font-semibold sm:text-xl">{site.phone}</strong>
                <span className="text-ink-soft">{site.email}</span>
              </div>
            </div>

            <a
              href={`https://www.openstreetmap.org/?mlat=${location.coords[0]}&mlon=${location.coords[1]}#map=17/${location.coords[0]}/${location.coords[1]}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary mt-auto"
            >
              <NavigationArrow size={20} weight="fill" />
              Como chegar
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
