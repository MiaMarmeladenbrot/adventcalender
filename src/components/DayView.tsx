import { useEffect, useState, type FormEvent } from 'react'
import { rudolphSvg } from '../characters'
import { PLACE_ART, placeOf, skyAt } from '../landscape'
import { api } from '../lib/api'
import type { AnswerResponse, DayResponse, Solved, Who } from '../lib/types'
import { Face, Say } from './Face'
import { Bells } from './widgets/Bells'
import { Final } from './widgets/Final'
import { Floes } from './widgets/Floes'
import { Memory } from './widgets/Memory'
import { Morse } from './widgets/Morse'
import { Torch } from './widgets/Torch'

type Phase = 'talk' | 'puzzle' | 'done'

interface Props {
  code: string
  player: string
  day: number
  nickname: string
  finalMessage: string | null
  onSolved: () => void
  onBack: () => void
}

export function DayView({ code, player, day, nickname, finalMessage, onSolved, onBack }: Props) {
  const [data, setData] = useState<DayResponse | null>(null)
  const [error, setError] = useState('')
  const [phase, setPhase] = useState<Phase>('talk')
  const [line, setLine] = useState(0)
  const [answer, setAnswer] = useState('')
  const [wrong, setWrong] = useState('')
  const [half, setHalf] = useState(0)
  const [shaking, setShaking] = useState(false)
  const [talkOpen, setTalkOpen] = useState(false)

  useEffect(() => {
    let current = true
    api
      .day(code, player, day)
      .then((response) => {
        if (!current) return
        setData(response)
        setPhase(response.solved ? 'done' : 'talk')
      })
      .catch((failure: Error) => current && setError(failure.message))
    return () => {
      current = false
    }
  }, [code, player, day])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [phase, line])

  function finish(solved: Solved) {
    setData((previous) => (previous ? { ...previous, solved } : previous))
    setPhase('done')
    onSolved()
  }

  async function submit(raw: string): Promise<AnswerResponse> {
    const response = await api.answer(code, player, day, raw)
    if (response.correct && response.solved && data?.day.widget?.kind !== 'final') finish(response.solved)
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

  const place = placeOf(day)
  const intro = data?.day.intro ?? []
  const lastLine = line >= intro.length - 1
  let speaker: Who | null = data?.day.who ?? null
  if (data && phase === 'talk') speaker = intro[line][0]
  if (data?.solved && phase === 'done') speaker = data.solved.reply[0]

  return (
    <article className="page">
      <div className="scene" style={{ background: `linear-gradient(${skyAt(day)}, #0a1230 140%)` }}>
        <button type="button" className="back" onClick={onBack}>
          ‹ Zur Landschaft
        </button>
        <div className="scene-title">
          <small>
            Tag {day} · {place.name}
          </small>
          <h2>{data?.day.title ?? ' '}</h2>
        </div>
        <svg className="scene-place" viewBox="0 0 120 100" aria-hidden="true" dangerouslySetInnerHTML={{ __html: PLACE_ART[place.art] }} />
        <div className="scene-hill" />
        {speaker && (
          <div key={speaker} className="scene-figure">
            <Face who={speaker} size={120} />
          </div>
        )}
      </div>

      <div className="paper">
        {error && <p className="wrong">{error}</p>}
        {!data && !error && <p className="wnote">Die Seite schlägt sich auf …</p>}

        {data && phase === 'talk' && (
          <div className="dialogue">
            <Say line={intro[line]} />
            <div className="dialogue-actions">
              <button type="button" className="go" onClick={() => (lastLine ? setPhase('puzzle') : setLine(line + 1))}>
                {lastLine ? 'Zum Rätsel' : 'Weiter'}
              </button>
              {!lastLine && (
                <button type="button" className="talk-toggle" onClick={() => setPhase('puzzle')}>
                  Überspringen
                </button>
              )}
            </div>
          </div>
        )}

        {data && phase === 'puzzle' && (
          <>
            <button type="button" className="talk-toggle" onClick={() => setTalkOpen(!talkOpen)} aria-expanded={talkOpen}>
              {talkOpen ? 'Gespräch ausblenden' : 'Gespräch nochmal lesen'}
            </button>
            {talkOpen && (
              <div className="talk">
                {intro.map((entry, index) => (
                  <Say key={index} line={entry} />
                ))}
              </div>
            )}

            <div className="puzzle">
              <div dangerouslySetInnerHTML={{ __html: data.day.puzzle }} />
              {data.day.halves && (
                <div className="team-half">
                  <div className="pills">
                    <span className="wnote">Ansicht als:</span>
                    {data.day.halves.map((piece, index) => (
                      <button key={piece.name} className="pill" type="button" aria-pressed={half === index} onClick={() => setHalf(index)}>
                        {piece.name}
                      </button>
                    ))}
                  </div>
                  <div dangerouslySetInnerHTML={{ __html: data.day.halves[half].html }} />
                  <p className="wnote">Später sieht jede Person nur ein Stück und bekommt das andere von jemandem aus der Familie.</p>
                </div>
              )}
              {data.day.widget?.kind === 'morse' && <Morse signal={data.day.widget.signal} />}
              {data.day.widget?.kind === 'memory' && <Memory items={data.day.widget.items} />}
              {data.day.widget?.kind === 'torch' && <Torch digits={data.day.widget.digits} />}
              {data.day.widget?.kind === 'bells' && <Bells bells={data.day.widget.bells} recording={data.day.widget.recording} />}
              {data.day.widget?.kind === 'floes' && !data.solved && (
                <Floes grid={data.day.widget.grid} start={data.day.widget.start} onArrive={(values) => void submit(values.join(','))} />
              )}
              {data.day.widget?.kind === 'final' && !data.solved && (
                <Final accuse={submit} onFound={(result) => result.solved && finish(result.solved)} />
              )}
            </div>

            {data.solved ? (
              <button type="button" className="go" onClick={() => setPhase('done')}>
                Zur Antwort
              </button>
            ) : (
              <>
                {data.day.widget?.kind !== 'floes' && data.day.widget?.kind !== 'final' && (
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
                  {data.hints.map((hint, index) => (
                    <p className="hint" key={index}>
                      <b>Hinweis {index + 1}:</b> {hint}
                    </p>
                  ))}
                  {data.hints.length < 3 && (
                    <div className="row">
                      <button type="button" onClick={nextHint}>
                        Hinweis {data.hints.length + 1} von 3
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}

        {data?.solved && phase === 'done' && (
          <div className="solved">
            <p className="right">Gelöst!</p>
            <Say line={data.solved.reply} />
            <div className="clue">
              <span className="eyebrow">Neues Indiz im Notizbuch</span>
              <p>{data.solved.clue}</p>
              {data.solved.strike.length > 0 && <p className="strike">Auf der Tafel gestrichen: {data.solved.strike.join(', ')}</p>}
            </div>
            {day === 24 && (
              <div className="finale">
                <div style={{ width: 120 }} dangerouslySetInnerHTML={{ __html: rudolphSvg('h') }} />
                <h2>Fall gelöst!</h2>
                <p>
                  Der Schlitten bricht aus dem Eis, der Weihnachtsmann fliegt einmal über den ganzen Nordpol, und alle Schlitten
                  der Soko hängen sich hinten dran.
                </p>
                {finalMessage && <p className="final-message">{finalMessage}</p>}
                <p className="credits">Abspann · Gelöst von: {nickname}</p>
              </div>
            )}
            <button type="button" className="go" onClick={onBack}>
              Zurück zur Landschaft
            </button>
            <button type="button" className="talk-toggle" onClick={() => setPhase('puzzle')}>
              Rätsel nochmal ansehen
            </button>
          </div>
        )}
      </div>
    </article>
  )
}
