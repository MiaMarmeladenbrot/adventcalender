import { useEffect, useRef, useState, type FormEvent } from 'react'
import { rudolphSvg } from '../characters'
import { PLACE_ART, placeOf, skyAt } from '../landscape'
import { api } from '../lib/api'
import type { AnswerResponse, DayResponse, Solved, Who } from '../lib/types'
import { Face } from './Face'
import { Hill, Stage } from './Stage'
import { Bells } from './widgets/Bells'
import { Final } from './widgets/Final'
import { Floes } from './widgets/Floes'
import { Memory } from './widgets/Memory'
import { MorseTape } from './widgets/Morse'
import { useMorse } from './widgets/useMorse'
import { Torch } from './widgets/Torch'

type Phase = 'talk' | 'puzzle' | 'reply' | 'clue'

const FIGURE_SIZE = 'min(230px, 56vw, 30dvh)'

interface Props {
  code: string
  player: string
  day: number
  nickname: string
  finalMessage: string | null
  onSolved: () => void
  onBack: () => void
}

function listOf(names: string[]) {
  if (names.length === 1) return names[0]
  return `${names.slice(0, -1).join(', ')} oder ${names[names.length - 1]}`
}

function Pips({ count, at }: { count: number; at: number }) {
  return (
    <div className="pips" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <i key={index} className={index === at ? 'on' : ''} />
      ))}
    </div>
  )
}

export function DayView({ code, player, day, nickname, finalMessage, onSolved, onBack }: Props) {
  const [data, setData] = useState<DayResponse | null>(null)
  const [error, setError] = useState('')
  const [phase, setPhase] = useState<Phase>('talk')
  const [line, setLine] = useState(0)
  const [answer, setAnswer] = useState('')
  const [wrong, setWrong] = useState('')
  const [shaking, setShaking] = useState(false)
  const figure = useRef<HTMLButtonElement>(null)
  const signal = data?.day.widget?.kind === 'morse' ? data.day.widget.signal : undefined
  const morse = useMorse(signal, figure)

  useEffect(() => {
    let current = true
    api
      .day(code, player, day)
      .then((response) => {
        if (!current) return
        setData(response)
        setPhase(response.solved ? 'reply' : 'talk')
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
    setPhase('reply')
    onSolved()
  }

  function replayTalk() {
    setLine(0)
    setPhase('talk')
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
  const sky = `linear-gradient(${skyAt(day)}, #0a1230 140%)`
  const eyebrow = `Tag ${day} · ${place.name}`

  if (data && phase === 'talk') {
    const intro = data.day.intro
    const lastLine = line >= intro.length - 1
    return (
      <Stage
        sky={sky}
        eyebrow={eyebrow}
        title={data.day.title}
        line={intro[line]}
        ground={<Hill place={place} who={intro[line][0]} />}
        onBack={onBack}
      >
        <Pips count={intro.length} at={line} />
        <button type="button" className="go" onClick={() => (lastLine ? setPhase('puzzle') : setLine(line + 1))}>
          {lastLine ? 'Zum Rätsel' : 'Weiter'}
        </button>
        {!lastLine && (
          <button type="button" className="talk-toggle" onClick={() => setPhase('puzzle')}>
            Überspringen
          </button>
        )}
      </Stage>
    )
  }

  if (data?.solved && phase === 'reply') {
    return (
      <Stage
        sky={sky}
        eyebrow={`${eyebrow} · gelöst`}
        title={data.day.title}
        line={data.solved.reply}
        ground={<Hill place={place} who={data.solved.reply[0]} mood={data.solved.reply[0] === 'rudolph' ? 'h' : undefined} />}
        onBack={onBack}
      >
        <button type="button" className="go" onClick={() => setPhase('clue')}>
          Zum neuen Indiz
        </button>
        <button type="button" className="talk-toggle" onClick={() => setPhase('puzzle')}>
          Rätsel nochmal ansehen
        </button>
      </Stage>
    )
  }

  let speaker: Who | null = data?.day.who ?? null
  if (data?.solved && phase === 'clue') speaker = data.solved.reply[0]
  const tappable = phase === 'puzzle' && speaker === 'rudolph' && Boolean(signal)

  return (
    <article className="page">
      <div className="scene" style={{ background: sky }}>
        <button type="button" className="back" onClick={onBack}>
          ‹ Zur Landschaft
        </button>
        <div className="scene-title">
          <small>{eyebrow}</small>
          <h2>{data?.day.title ?? ' '}</h2>
        </div>
        <svg className="scene-place" viewBox="0 0 120 100" aria-hidden="true" dangerouslySetInnerHTML={{ __html: PLACE_ART[place.art] }} />
        <div className="scene-hill" />
        {speaker && tappable && (
          <button type="button" ref={figure} className="scene-figure tap" onClick={morse.play} aria-label="Rudolphs Nase antippen">
            <Face who={speaker} size={FIGURE_SIZE} mood="v" />
          </button>
        )}
        {speaker && !tappable && (
          <div key={speaker} className="scene-figure">
            <Face who={speaker} size={FIGURE_SIZE} />
          </div>
        )}
      </div>

      <div className="paper">
        {error && <p className="wrong">{error}</p>}
        {!data && !error && <p className="wnote">Die Seite schlägt sich auf …</p>}

        {data && phase === 'puzzle' && (
          <>
            <button type="button" className="talk-toggle" onClick={replayTalk}>
              Gespräch nochmal ansehen
            </button>

            <div className="puzzle">
              <div dangerouslySetInnerHTML={{ __html: data.day.puzzle }} />
              {data.day.halves && (
                <div className="team-half">
                  {data.day.halves.map((piece) => (
                    <div className="scrap" key={piece.name}>
                      <span className="scrap-label">
                        {data.day.halves?.length === 1 ? `Dein Stück, von ${piece.name}` : `Von ${piece.name}`}
                      </span>
                      <div dangerouslySetInnerHTML={{ __html: piece.html }} />
                    </div>
                  ))}
                  <p className="wnote">
                    {data.day.partners?.length
                      ? `Das andere Stück hat ${listOf(data.day.partners)}. Fragt euch gegenseitig!`
                      : 'Außer dir ist noch niemand in deiner Familie dabei, deshalb siehst du beide Stücke.'}
                  </p>
                </div>
              )}
              {data.day.widget?.kind === 'morse' && <MorseTape shown={morse.shown} />}
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
              <button type="button" className="go" onClick={() => setPhase('reply')}>
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

        {data?.solved && phase === 'clue' && (
          <div className="solved">
            <p className="right">Gelöst!</p>
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
