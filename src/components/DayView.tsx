import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { rudolphSvg, type Mood } from '../characters'
import { placeOf, skyAt } from '../landscape'
import { api } from '../lib/api'
import { withTransition } from '../lib/transition'
import type { AnswerResponse, DayResponse, Line, Solved, Who } from '../lib/types'
import { Hill, Stage } from './Stage'
import { Bells } from './widgets/Bells'
import { Final } from './widgets/Final'
import { Floes } from './widgets/Floes'
import { Memory } from './widgets/Memory'
import { MorseTape } from './widgets/Morse'
import { useMorse } from './widgets/useMorse'
import { Torch } from './widgets/Torch'

type Phase = 'talk' | 'puzzle' | 'reply' | 'clue'

interface Props {
  code: string
  player: string
  day: number
  door?: { who: Who; title: string }
  nickname: string
  finalMessage: string | null
  onSolved: () => void
  onBack: () => void
  onNotebook: () => void
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

export function DayView({ code, player, day, door, nickname, finalMessage, onSolved, onBack, onNotebook }: Props) {
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
        withTransition(() => {
          setData(response)
          setPhase(response.solved ? 'reply' : 'talk')
        })
      })
      .catch((failure: Error) => current && setError(failure.message))
    return () => {
      current = false
    }
  }, [code, player, day])

  function go(next: Phase) {
    withTransition(() => setPhase(next))
  }

  function finish(solved: Solved) {
    withTransition(() => {
      setData((previous) => (previous ? { ...previous, solved } : previous))
      setPhase('reply')
    })
    onSolved()
  }

  function replayTalk() {
    withTransition(() => {
      setLine(0)
      setPhase('talk')
    })
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
  const solved = data?.solved ?? null
  let who: Who = door?.who ?? 'santa'
  let spoken: Line | null = null
  let mood: Mood | undefined
  let compact = false
  let tappable = false
  let body: ReactNode = null

  if (!data && !error) {
    body = (
      <>
        <Pips count={2} at={-1} />
        <button type="button" className="go" disabled>
          Weiter
        </button>
      </>
    )
  } else if (error) {
    compact = true
    body = (
      <>
        <p className="wrong">{error}</p>
        <button type="button" className="go" onClick={onBack}>
          Zurück zur Landschaft
        </button>
      </>
    )
  } else if (data && phase === 'talk') {
    const intro = data.day.intro
    const lastLine = line >= intro.length - 1
    who = intro[line][0]
    spoken = intro[line]
    body = (
      <>
        <Pips count={intro.length} at={line} />
        <button type="button" className="go" onClick={() => (lastLine ? go('puzzle') : withTransition(() => setLine(line + 1)))}>
          {lastLine ? 'Zum Rätsel' : 'Weiter'}
        </button>
      </>
    )
  } else if (data && solved && phase === 'reply') {
    who = solved.reply[0]
    spoken = solved.reply
    mood = who === 'rudolph' ? 'h' : undefined
    body = (
      <>
        <p className="right">Gelöst!</p>
        {day === 24 ? (
          <button type="button" className="go" onClick={() => go('clue')}>
            Weiter
          </button>
        ) : (
          <button type="button" className="go" onClick={onNotebook}>
            Ins Notizbuch
          </button>
        )}
        <button type="button" className="talk-toggle" onClick={() => go('puzzle')}>
          Rätsel nochmal ansehen
        </button>
      </>
    )
  } else if (data && solved && phase === 'clue') {
    compact = true
    who = solved.reply[0]
    mood = who === 'rudolph' ? 'h' : undefined
    body = (
      <div className="solved">
        <div className="clue">
          <span className="eyebrow">Neues Indiz im Notizbuch</span>
          <p>{solved.clue}</p>
          {solved.strike.length > 0 && <p className="strike">Auf der Tafel gestrichen: {solved.strike.join(', ')}</p>}
        </div>
        {day === 24 && (
          <div className="finale">
            <div style={{ width: 120 }} dangerouslySetInnerHTML={{ __html: rudolphSvg('h') }} />
            <h2>Fall gelöst!</h2>
            <p>
              Der Schlitten bricht aus dem Eis, der Weihnachtsmann fliegt einmal über den ganzen Nordpol, und alle Schlitten der
              Soko hängen sich hinten dran.
            </p>
            {finalMessage && <p className="final-message">{finalMessage}</p>}
            <p className="credits">Abspann · Gelöst von: {nickname}</p>
          </div>
        )}
        <button type="button" className="go" onClick={onBack}>
          Zurück zur Landschaft
        </button>
        <button type="button" className="talk-toggle" onClick={() => go('reply')}>
          Antwort nochmal ansehen
        </button>
      </div>
    )
  } else if (data) {
    compact = true
    who = data.day.who
    tappable = Boolean(signal) && who === 'rudolph'
    mood = tappable ? 'v' : undefined
    body = (
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
          {data.day.widget?.kind === 'floes' && !solved && (
            <Floes grid={data.day.widget.grid} start={data.day.widget.start} onArrive={(values) => void submit(values.join(','))} />
          )}
          {data.day.widget?.kind === 'final' && !solved && <Final accuse={submit} onFound={(result) => result.solved && finish(result.solved)} />}
        </div>

        {solved ? (
          <button type="button" className="go" onClick={() => go('reply')}>
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
    )
  }

  return (
    <Stage
      sky={`linear-gradient(${skyAt(day)}, #0a1230 140%)`}
      eyebrow={`Tag ${day} · ${place.name}${solved ? ' · gelöst' : ''}`}
      title={data?.day.title ?? door?.title ?? ''}
      line={spoken}
      compact={compact}
      onBack={onBack}
      ground={
        <Hill
          place={place}
          who={who}
          mood={mood}
          compact={compact}
          onTap={tappable ? morse.play : undefined}
          figureRef={tappable ? figure : undefined}
        />
      }
    >
      {body}
    </Stage>
  )
}
