import { useRef, useState } from 'react'
import { rudolphSvg } from '../../characters'

const SHORT = 240
const LONG = 720
const GAP = 300
const LETTER_GAP = 900

export function Morse({ signal }: { signal: string }) {
  const nose = useRef<HTMLButtonElement>(null)
  const [shown, setShown] = useState('')
  const [busy, setBusy] = useState(false)

  function play() {
    const svg = nose.current?.querySelector('.rud')
    if (busy || !svg) return
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

  return (
    <div className="morse">
      <button
        ref={nose}
        type="button"
        aria-label="Rudolphs Nase antippen"
        onClick={play}
        dangerouslySetInnerHTML={{ __html: rudolphSvg('v') }}
      />
      <div className="dots" aria-live="polite">
        {shown}
      </div>
      <p className="wnote">Rudolph antippen</p>
    </div>
  )
}
