import { flushSync } from 'react-dom'

export function withTransition(update: () => void) {
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const apply = () => {
    flushSync(update)
    window.scrollTo(0, 0)
  }
  if (still || typeof document.startViewTransition !== 'function') {
    apply()
    return
  }
  document.startViewTransition(apply)
}
