import { useEffect, useState, type FormEvent } from 'react'
import { NAMES } from '../../content/constants'
import { rudolphSvg } from '../characters'
import { api } from '../lib/api'
import type { AnswerResponse, DayResponse, Solved } from '../lib/types'
import { Face, Say } from './Face'
import { Bells } from './widgets/Bells'
import { Final } from './widgets/Final'
import { Floes } from './widgets/Floes'
import { Memory } from './widgets/Memory'
import { Morse } from './widgets/Morse'
import { Torch } from './widgets/Torch'

const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']

interface Props {
  code: string
  player: string
  day: number
  unlocked: number
  nickname: string
  finalMessage: string | null
  onSolved: () => void
  onNavigate: (day: number) => void
}

export function DayView({ code, player, day, unlocked, nickname, finalMessage, onSolved, onNavigate }: Props) {
  const [data, setData] = useState<DayResponse | null>(null)
  const [error, setError] = useState('')
  const [answer, setAnswer] = useState('')
  const [wrong, setWrong] = useState('')
  const [half, setHalf] = useState(0)
  const [shaking, setShaking] = useState(false)

  useEffect(() => {
    let current = true
    setData(null)
    setError('')
    setAnswer('')
    setWrong('')
    setHalf(0)
    api
      .day(code, player, day)
      .then((response) => current && setData(response))
      .catch((failure: Error) => current && setError(failure.message))
    return () => {
      current = false
    }
  }, [code, player, day])

  function reveal(solved: Solved) {
    setData((previous) => (previous ? { ...previous, solved } : previous))
    onSolved()
  }

  async function submit(raw: string): Promise<AnswerResponse> {
    const response = await api.answer(code, player, day, raw)
    if (response.correct && response.solved && data?.day.widget?.kind !== 'final') reveal(response.solved)
    return response
  }

  async function check(event: FormEvent) {
    event.preventDefault()
    if (!answer.trim()) return
    const response = await submit(answer)
    if (response.correct) return
    setWrong(response.message ?? 'Das ist es nicht. Noch ein Versuch?')
    setShaking(true)
    setTimeout(() => setShaking(false), 400)
  }

  async function nextHint() {
    const { hints } = await api.hint(code, player, day)
    setData((previous) => (previous ? { ...previous, hints } : previous))
  }

  if (error) return <article className="day"><p className="wrong">{error}</p></article>
  if (!data) return <article className="day"><p className="wnote">Die Tür geht auf …</p></article>

  const { day: content, hints, solved } = data
  const widget = content.widget

  return (
    <article className="day">
      <div className="dhead">
        <Face who={content.who} size={54} />
        <div>
          <span className="eyebrow">
            Tag {day} · {WEEKDAYS[day % 7]} · {NAMES[content.who]}
          </span>
          <h2>{content.title}</h2>
        </div>
        <div className="dnav">
          <button type="button" aria-label="Vorheriger Tag" disabled={day === 1} onClick={() => onNavigate(day - 1)}>
            ‹
          </button>
          <button
            type="button"
            aria-label="Nächster Tag"
            disabled={day >= unlocked}
            onClick={() => onNavigate(day + 1)}
          >
            ›
          </button>
        </div>
      </div>

      <div className="talk">
        {content.intro.map((line, index) => (
          <Say key={index} line={line} />
        ))}
      </div>

      <div className="puzzle">
        <div dangerouslySetInnerHTML={{ __html: content.puzzle }} />
        {content.halves && (
          <div className="team-half">
            <div className="pills">
              <span className="wnote">Ansicht als:</span>
              {content.halves.map((piece, index) => (
                <button
                  key={piece.name}
                  className="pill"
                  type="button"
                  aria-pressed={half === index}
                  onClick={() => setHalf(index)}
                >
                  {piece.name}
                </button>
              ))}
            </div>
            <div dangerouslySetInnerHTML={{ __html: content.halves[half].html }} />
            <p className="wnote">
              Später sieht jede Person nur ein Stück und bekommt das andere von jemandem aus der Familie.
            </p>
          </div>
        )}
        {widget?.kind === 'morse' && <Morse signal={widget.signal} />}
        {widget?.kind === 'memory' && <Memory items={widget.items} />}
        {widget?.kind === 'torch' && <Torch digits={widget.digits} />}
        {widget?.kind === 'bells' && <Bells bells={widget.bells} recording={widget.recording} />}
        {widget?.kind === 'floes' && !solved && (
          <Floes grid={widget.grid} start={widget.start} onArrive={(values) => void submit(values.join(','))} />
        )}
        {widget?.kind === 'final' && !solved && (
          <Final accuse={submit} onFound={(result) => result.solved && reveal(result.solved)} />
        )}
      </div>

      {solved ? (
        <div className="solved">
          <Say line={solved.reply} />
          <div className="clue">
            <span className="eyebrow">Indiz gesichert</span>
            <p>{solved.clue}</p>
            {solved.strike.length > 0 && <p className="strike">Auf der Tafel gestrichen: {solved.strike.join(', ')}</p>}
          </div>
          {day === 24 && (
            <div className="finale">
              <div style={{ width: 120 }} dangerouslySetInnerHTML={{ __html: rudolphSvg('h') }} />
              <h2>Fall gelöst!</h2>
              <p>
                Der Schlitten bricht aus dem Eis, der Weihnachtsmann fliegt einmal über den ganzen Nordpol, und alle
                Schlitten der Soko hängen sich hinten dran.
              </p>
              {finalMessage && <p className="final-message">{finalMessage}</p>}
              <p className="credits">Abspann · Gelöst von: {nickname}</p>
            </div>
          )}
        </div>
      ) : (
        <>
          {widget?.kind !== 'floes' && widget?.kind !== 'final' && (
            <>
              <form className="answer" onSubmit={check}>
                <input
                  id={`answer-${day}`}
                  className={shaking ? 'shake' : ''}
                  type="text"
                  autoComplete="off"
                  autoCapitalize="off"
                  placeholder="Deine Lösung"
                  aria-label="Deine Lösung"
                  value={answer}
                  onChange={(event) => setAnswer(event.target.value)}
                />
                <button type="submit">Prüfen</button>
              </form>
              <p className="wrong" aria-live="polite">
                {wrong}
              </p>
            </>
          )}
          <div className="hints">
            {hints.map((hint, index) => (
              <p className="hint" key={index}>
                <b>Hinweis {index + 1}:</b> {hint}
              </p>
            ))}
            {hints.length < 3 && (
              <div className="row">
                <button type="button" onClick={nextHint}>
                  Hinweis {hints.length + 1} von 3
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </article>
  )
}
