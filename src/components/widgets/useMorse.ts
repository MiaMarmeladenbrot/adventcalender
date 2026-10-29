import { useState, type RefObject } from 'react'

const SHORT = 240
const LONG = 720
const GAP = 300
const LETTER_GAP = 900

export function useMorse(signal: string | undefined, figure: RefObject<HTMLElement | null>) {
  const [shown, setShown] = useState('')
  const [busy, setBusy] = useState(false)

  function play() {
    const svg = figure.current?.querySelector('.rud')
    if (!signal || busy || !svg) return
    setBusy(true)
    setShown('')
    let at = 0
    signal.split(' ').forEach((letter, index) => {
      if (index > 0) {
        setTimeout(() => setShown((text) => text + ' / '), at)
        at += LETTER_GAP
      }
      letter.split('').forEach((symbol) => {
        const on = symbol === '.' ? SHORT : LONG
        setTimeout(() => {
          svg.classList.add('glow')
          setShown((text) => text + (symbol === '.' ? '·' : '–'))
        }, at)
        setTimeout(() => svg.classList.remove('glow'), at + on)
        at += on + GAP
      })
    })
    setTimeout(() => setBusy(false), at)
  }

  return { shown, play }
}
