import type { PointerEvent } from 'react'

// Inclina o cartão na direção do ponteiro (só em mouse/caneta).
export function tiltHandlers(strength = 8) {
  return {
    onPointerMove(e: PointerEvent<HTMLElement>) {
      if (e.pointerType === 'touch') return
      const el = e.currentTarget
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width - 0.5
      const y = (e.clientY - r.top) / r.height - 0.5
      el.style.setProperty('--ry', `${x * strength}deg`)
      el.style.setProperty('--rx', `${-y * strength}deg`)
      el.style.setProperty('--ty', '-6px')
    },
    onPointerLeave(e: PointerEvent<HTMLElement>) {
      const el = e.currentTarget
      el.style.setProperty('--ry', '0deg')
      el.style.setProperty('--rx', '0deg')
      el.style.setProperty('--ty', '0px')
    },
  }
}
