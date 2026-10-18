type Props = { light?: boolean }

export function Logo({ light = false }: Props) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg viewBox="0 0 40 40" className="size-8 shrink-0 sm:size-10 transition-transform duration-700 group-hover:rotate-[200deg]" aria-hidden="true">
        <circle cx="20" cy="20" r="17" fill="#e9a65f" />
        <path
          d="M4 19C4 10 11 3.5 20 3.5S36 10 36 19c0 2.5-1.8 2.6-2.4 5-.6 2.6-2.7 3.2-3.3.6-.5-2.2-2.1-2.8-3.1-.8-1 2-1.8 5.6-3.8 5.6s-1.7-3.6-3.2-3.6-2.5 2.4-4.5 1.8c-1.8-.6-1.2-4.3-3.2-4.3s-3.1 3-4.9 1.8C6.5 25.6 7.6 22.6 6 21.5 4.9 20.7 4 21.4 4 19Z"
          fill="#f2709c"
        />
        <circle cx="20" cy="19" r="5.2" fill={light ? '#23303b' : '#fff'} />
        <g strokeLinecap="round" strokeWidth="2">
          <path d="M11 12.5l2.4 1.2" stroke="#fff" />
          <path d="M26 9.5l1.8-1.8" stroke="#ffd166" />
          <path d="M29.5 17.5l2.4.6" stroke="#8edfd9" />
          <path d="M15 25.5l-1.8 1.8" stroke="#fff" />
          <path d="M20.5 9l-.6 2.4" stroke="#8edfd9" />
        </g>
      </svg>
      <span className={`font-display text-[1.2rem] sm:text-[1.45rem] font-semibold leading-none tracking-tight ${light ? 'text-white' : 'text-ink'}`}>
        Doce <span className="text-pink-deep">Aurora</span>
      </span>
    </span>
  )
}
