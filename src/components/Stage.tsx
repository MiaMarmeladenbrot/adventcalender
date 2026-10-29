import type { ReactNode, Ref } from 'react'
import type { Mood } from '../characters'
import { PLACE_ART, type Place } from '../landscape'
import type { Line, Who } from '../lib/types'
import { Bubble, Face } from './Face'

const FIGURE_SIZE = 'min(230px, 56vw, 30dvh)'
const FIGURE_SMALL = 'min(125px, 30vw, 15dvh)'

interface Props {
  sky: string
  eyebrow?: string
  calendar?: { day: number; month: string }
  title: string
  line?: Line | null
  tail?: 'center' | 'left' | 'right'
  stamp?: string
  quip?: string
  reply?: ReactNode
  note?: ReactNode
  ground: ReactNode
  onBack?: () => void
  children?: ReactNode
}

export function Stage({
  sky,
  eyebrow,
  calendar,
  title,
  line,
  tail,
  stamp,
  quip,
  reply,
  note,
  ground,
  onBack,
  children,
}: Props) {
  const sheet = note !== undefined
  return (
    <section className={`stage${sheet ? ' sheet' : ''}`}>
      <div className="stage-sky" style={{ backgroundImage: sky }} />
      <header className={`stage-head${calendar ? ' dated' : ''}`}>
        {onBack && (
          <button type="button" className="back" onClick={onBack}>
            ‹ Zur Landschaft
          </button>
        )}
        {eyebrow && <small>{eyebrow}</small>}
        <h2>{title}</h2>
        {calendar && (
          <span className="calendar" aria-label={`${calendar.day}. ${calendar.month}`}>
            <span className="calendar-month">{calendar.month.slice(0, 3)}</span>
            <span className="calendar-torn" />
            <span className="calendar-day">{calendar.day}</span>
          </span>
        )}
      </header>
      <div className="stage-speech">
        {stamp && <span className="stamp">{stamp}</span>}
        {sheet && <div className="stage-note paper">{note}</div>}
        {!sheet && line && <Bubble line={line} tail={tail} />}
        {!sheet && reply && <div className="answer-bubble">{reply}</div>}
        {!sheet && !line && (
          <div className="bubble waiting" aria-label="Lädt">
            <i />
            <i />
            <i />
          </div>
        )}
      </div>
      <div className="stage-bottom">
        {quip && (
          <p className="quip" key={quip} role="status">
            {quip}
          </p>
        )}
        <div className="stage-ground">{ground}</div>
        <div className="stage-foot">{children}</div>
      </div>
    </section>
  )
}

interface HillProps {
  place: Place
  who: Who
  mood?: Mood
  small?: boolean
  onTap?: () => void
  figureRef?: Ref<HTMLButtonElement>
}

export function Hill({ place, who, mood, small, onTap, figureRef }: HillProps) {
  const face = <Face who={who} size={small ? FIGURE_SMALL : FIGURE_SIZE} mood={mood} />
  return (
    <>
      <div className="hill" />
      <svg className="hill-place" viewBox="0 0 120 100" aria-hidden="true" dangerouslySetInnerHTML={{ __html: PLACE_ART[place.art] }} />
      {onTap ? (
        <button type="button" ref={figureRef} className="hill-figure tap" onClick={onTap} aria-label="Rudolphs Nase antippen">
          {face}
        </button>
      ) : (
        <div className="hill-figure">{face}</div>
      )}
    </>
  )
}

const DRAPES =
  '<path d="M0 0 H38 Q32 36 17 62 Q24 96 12 136 H0 Z" fill="#a8162a"/><path d="M108 0 H70 Q76 36 91 62 Q84 96 96 136 H108 Z" fill="#a8162a"/>' +
  '<path d="M8 4 Q14 34 12 60 M22 4 Q24 34 15 60 M100 4 Q94 34 96 60 M86 4 Q84 34 93 60" stroke="#7e1020" stroke-width="2" fill="none"/>' +
  '<path d="M0 0 H108 V12 Q94 20 81 12 Q67 20 54 12 Q41 20 27 12 Q14 20 0 12 Z" fill="#7e1020"/>' +
  '<ellipse cx="16" cy="62" rx="7" ry="3.5" fill="#d9b45a"/><ellipse cx="92" cy="62" rx="7" ry="3.5" fill="#d9b45a"/>'

const paper = (inner: string) => `<g filter="url(#pc)">${inner}</g>`

const GABLE =
  paper('<path d="M80 18 H92 V40 H80Z" fill="#5a2a20"/><path d="M78 18 H94 V15 Q86 11 78 15Z" fill="#f5f8fb"/>') +
  '<g fill="#ffffff" opacity=".6"><circle cx="88" cy="9" r="3.5"/><circle cx="93" cy="3" r="4"/></g>' +
  paper('<path d="M6 50 L60 14 L114 50Z" fill="#4a2a22"/>') +
  paper('<path d="M2 51 L60 10 L118 51 Q112 56 106 51 L60 19 L14 51 Q8 56 2 51Z" fill="#f5f8fb"/>') +
  paper('<circle cx="60" cy="34" r="6" fill="#ffd27a"/>') +
  '<path d="M60 28 V40 M54 34 H66" stroke="#4a2a22" stroke-width="1.6"/>'

const RESIDENTS: Who[] = ['santa', 'mrs']

export function House({ speaker }: { speaker: Who }) {
  return (
    <div className="house">
      <svg className="house-gable" viewBox="0 -2 120 56" aria-hidden="true" dangerouslySetInnerHTML={{ __html: GABLE }} />
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
