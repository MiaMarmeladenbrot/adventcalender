import type { ReactNode } from 'react'
import type { Mood } from '../characters'
import { PLACE_ART, type Place } from '../landscape'
import type { Line, Who } from '../lib/types'
import { Bubble, Face } from './Face'

const FIGURE_SIZE = 'min(230px, 56vw, 30dvh)'

interface Props {
  sky: string
  eyebrow: string
  title: string
  line: Line
  tail?: 'center' | 'left' | 'right'
  ground: ReactNode
  onBack?: () => void
  children: ReactNode
}

export function Stage({ sky, eyebrow, title, line, tail, ground, onBack, children }: Props) {
  return (
    <section className="stage" style={{ background: sky }}>
      <header className="stage-head">
        {onBack && (
          <button type="button" className="back" onClick={onBack}>
            ‹ Zur Landschaft
          </button>
        )}
        <small>{eyebrow}</small>
        <h2>{title}</h2>
      </header>
      <div className="stage-bubble">
        <Bubble line={line} tail={tail} />
      </div>
      <div className="stage-ground">{ground}</div>
      <div className="stage-foot">{children}</div>
    </section>
  )
}

export function Hill({ place, who, mood }: { place: Place; who: Who; mood?: Mood }) {
  return (
    <>
      <svg className="hill-place" viewBox="0 0 120 100" aria-hidden="true" dangerouslySetInnerHTML={{ __html: PLACE_ART[place.art] }} />
      <div className="hill" />
      <div key={who} className="hill-figure">
        <Face who={who} size={FIGURE_SIZE} mood={mood} />
      </div>
    </>
  )
}

const ROOF =
  '<path d="M0 0 H320 V40 H0 Z" fill="#3d221b"/><path d="M0 14 H320 M0 28 H320" stroke="#2c1812" stroke-width="2"/>' +
  '<path d="M0 0 H320 V30 C 304 40, 290 27, 272 35 C 256 42, 240 29, 222 36 C 206 43, 190 30, 170 37 C 150 44, 136 31, 116 37 C 98 43, 82 30, 62 36 C 44 42, 26 30, 0 38 Z" fill="#f5f8fb"/>' +
  '<path d="M40 38 l3 14 l3 -14 Z M92 39 l2.5 10 l2.5 -10 Z M150 40 l3 16 l3 -16 Z M206 38 l2.5 11 l2.5 -11 Z M262 36 l3 13 l3 -13 Z" fill="#e3f2f9"/>'

const DRAPES =
  '<path d="M0 0 H38 Q32 36 17 62 Q24 96 12 136 H0 Z" fill="#a8162a"/><path d="M108 0 H70 Q76 36 91 62 Q84 96 96 136 H108 Z" fill="#a8162a"/>' +
  '<path d="M8 4 Q14 34 12 60 M22 4 Q24 34 15 60 M100 4 Q94 34 96 60 M86 4 Q84 34 93 60" stroke="#7e1020" stroke-width="2" fill="none"/>' +
  '<path d="M0 0 H108 V12 Q94 20 81 12 Q67 20 54 12 Q41 20 27 12 Q14 20 0 12 Z" fill="#7e1020"/>' +
  '<ellipse cx="16" cy="62" rx="7" ry="3.5" fill="#d9b45a"/><ellipse cx="92" cy="62" rx="7" ry="3.5" fill="#d9b45a"/>'

const RESIDENTS: Who[] = ['santa', 'mrs']

export function House({ speaker }: { speaker: Who }) {
  return (
    <div className="house">
      <svg className="house-roof" viewBox="0 0 320 70" preserveAspectRatio="none" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ROOF }} />
      <div className="house-wreath" />
      <div className="house-windows">
        {RESIDENTS.map((who) => (
          <div key={who} className={`house-window${who === speaker ? ' lit' : ''}`}>
            <div className="pane">
              <Face who={who} size="112%" />
              <svg className="drapes" viewBox="0 0 108 136" preserveAspectRatio="none" aria-hidden="true" dangerouslySetInnerHTML={{ __html: DRAPES }} />
            </div>
            <div className="sill" />
          </div>
        ))}
      </div>
    </div>
  )
}
