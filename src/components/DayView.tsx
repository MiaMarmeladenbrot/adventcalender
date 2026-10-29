import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { rudolphSvg, type Mood } from '../characters'
import { placeOf, skyAt } from '../landscape'
import { api, ApiError, messageOf } from '../lib/api'
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

type Step = 'talk' | 'puzzle' | 'reply'

const STEPS: [Step, string][] = [
  ['talk', 'Gespräch'],
  ['puzzle', 'Rätsel'],
  ['reply', 'Antwort'],
]

interface StepsProps {
  at: Step
  progress?: number
  solved: boolean
  disabled?: boolean
  onGo?: (step: Step) => void
}

function Steps({ at, progress = 1, solved, disabled, onGo }: StepsProps) {
  return (
    <nav className="steps" aria-label="Ablauf des Türchens">
      {STEPS.map(([step, label]) => {
        const filled = step === at ? progress : STEPS.findIndex(([entry]) => entry === at) > STEPS.findIndex(([entry]) => entry === step) ? 1 : 0
        return (
          <button
            key={step}
            type="button"
            className={`step${step === at ? ' on' : ''}`}
            disabled={disabled || (step === 'reply' && !solved)}
            aria-current={step === at ? 'step' : undefined}
            onClick={() => step !== at && onGo?.(step)}
          >
            <i style={{ background: `linear-gradient(to right, #2a1f1a ${filled * 100}%, #d9cfbd ${filled * 100}%)` }} />
            {label}
          </button>
        )
      })}
    </nav>
  )
}

export function DayView({ code, player, day, door, nickname, finalMessage, onSolved, onBack, onNotebook }: Props) {
  const [data, setData] = useState<DayResponse | null>(null)
  const [error, setError] = useState<{ message: string; status: number } | null>(null)
  const [attempt, setAttempt] = useState(0)
  const [phase, setPhase] = useState<Phase>('talk')
  const [line, setLine] = useState(0)
  const [answer, setAnswer] = useState('')
  const [wrong, setWrong] = useState('')
  const [shaking, setShaking] = useState(false)
  const [shownHints, setShownHints] = useState(0)
  const figure = useRef<HTMLButtonElement>(null)
  const hintsRef = useRef<HTMLDivElement>(null)
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
      .catch((failure: unknown) => {
        if (current) setError({ message: messageOf(failure), status: failure instanceof ApiError ? failure.status : 0 })
      })
    return () => {
      current = false
    }
  }, [code, player, day, attempt])

  function retry() {
    setError(null)
    setAttempt(attempt + 1)
  }

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

  function step(next: Step) {
    if (next !== 'talk') {
      go(next)
      return
    }
    withTransition(() => {
      setLine(0)
      setPhase('talk')
    })
  }

  async function submit(raw: string): Promise<AnswerResponse> {
    try {
      const response = await api.answer(code, player, day, raw)
      if (response.correct && response.solved && data?.day.widget?.kind !== 'final') finish(response.solved)
      return response
    } catch (failure) {
      return { correct: false, message: messageOf(failure) }
    }
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
    if (data && data.hints.length <= shownHints) {
      try {
        const { hints } = await api.hint(code, player, day)
        setData((previous) => (previous ? { ...previous, hints } : previous))
      } catch (failure) {
        setWrong(messageOf(failure))
        return
      }
    }
    setWrong('')
    setShownHints(shownHints + 1)
  }

  useEffect(() => {
    if (shownHints > 0) hintsRef.current?.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [shownHints])

  const place = placeOf(day)
  const solved = data?.solved ?? null
  let who: Who = door?.who ?? 'snowman'
  let spoken: Line | null = null
  let note: ReactNode = undefined
  let mood: Mood | undefined
  let tappable = false
  let foot: ReactNode = null

  if (error) {
    const final = error.status === 403 || error.status === 404
    spoken = [who, error.status === 403 ? `Diese Tür ist noch verschlossen. Komm am ${day}. Dezember wieder!` : error.message]
    foot = final ? (
      <button type="button" className="go" onClick={onBack}>
        Zurück zur Landschaft
      </button>
    ) : (
      <button type="button" className="go" onClick={retry}>
        Nochmal versuchen
      </button>
    )
  } else if (!data) {
    foot = (
      <>
        <button type="button" className="go" disabled>
          Weiter
        </button>
        <Steps at="talk" progress={0} solved={false} disabled />
      </>
    )
  } else if (phase === 'talk') {
    const intro = data.day.intro
    const lastLine = line >= intro.length - 1
    who = intro[line][0]
    spoken = intro[line]
    foot = (
      <>
        <button type="button" className="go" onClick={() => (lastLine ? go('puzzle') : withTransition(() => setLine(line + 1)))}>
          {lastLine ? 'Zum Rätsel' : 'Weiter'}
        </button>
        <Steps at="talk" progress={(line + 1) / intro.length} solved={Boolean(solved)} onGo={step} />
      </>
    )
  } else if (solved && phase === 'reply') {
    who = solved.reply[0]
    spoken = solved.reply
    mood = who === 'rudolph' ? 'h' : undefined
    foot = (
      <>
        {day === 24 ? (
          <button type="button" className="go" onClick={() => go('clue')}>
            Weiter
          </button>
        ) : (
          <button type="button" className="go" onClick={onNotebook}>
            Indiz ins Notizbuch schreiben
          </button>
        )}
        <Steps at="reply" solved onGo={step} />
      </>
    )
  } else if (solved && phase === 'clue') {
    who = solved.reply[0]
    mood = who === 'rudolph' ? 'h' : undefined
    note = (
      <div className="solved">
        <div className="clue">
          <span className="eyebrow">Neues Indiz im Notizbuch</span>
          <p>{solved.clue}</p>
        </div>
        <div className="finale">
          <div style={{ width: 120 }} dangerouslySetInnerHTML={{ __html: rudolphSvg('h') }} />
          <h2>Fall gelöst!</h2>
          <p>
            Der Schlitten bricht aus dem Eis, der Weihnachtsmann fliegt einmal über den ganzen Nordpol, und alle Schlitten der Soko
            hängen sich hinten dran.
          </p>
          {finalMessage && <p className="final-message">{finalMessage}</p>}
          <p className="credits">Abspann · Gelöst von: {nickname}</p>
        </div>
      </div>
    )
    foot = (
      <>
        <button type="button" className="go" onClick={onBack}>
          Zurück zur Landschaft
        </button>
        <Steps at="reply" solved onGo={step} />
      </>
    )
  } else {
    who = data.day.who
    tappable = Boolean(signal) && who === 'rudolph'
    mood = tappable ? 'v' : undefined
    const typed = data.day.widget?.kind !== 'floes' && data.day.widget?.kind !== 'final'
    note = (
      <>
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
            <Floes
              grid={data.day.widget.grid}
              start={data.day.widget.start}
              onArrive={(values) => void submit(values.join(',')).then((response) => setWrong(response.correct ? '' : (response.message ?? '')))}
            />
          )}
          {data.day.widget?.kind === 'final' && !solved && <Final accuse={submit} onFound={(result) => result.solved && finish(result.solved)} />}
        </div>
        {!solved && shownHints > 0 && (
          <div className="scribbles" ref={hintsRef}>
            {data.hints.slice(0, shownHints).map((hint, index) => (
              <p className="scribble" key={index}>
                <b>{index + 1}.</b> {hint}
              </p>
            ))}
          </div>
        )}
        {!solved && (
          <button
            type="button"
            className="hint-button"
            onClick={nextHint}
            disabled={shownHints >= 3}
            aria-label={shownHints >= 3 ? 'Alle Hinweise aufgedeckt' : `Hinweis ${shownHints + 1} von 3`}
          >
            ?
          </button>
        )}
      </>
    )
    foot = solved ? (
      <>
        <button type="button" className="go" onClick={() => go('reply')}>
          Zur Antwort
        </button>
        <Steps at="puzzle" solved onGo={step} />
      </>
    ) : (
      <>
        {typed && (
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
              onChange={(event) => {
                setAnswer(event.target.value)
                setWrong('')
              }}
            />
            <button type="submit">Prüfen</button>
          </form>
        )}
        <Steps at="puzzle" solved={false} onGo={step} />
      </>
    )
  }

  return (
    <Stage
      sky={`linear-gradient(${skyAt(day)}, #0a1230 140%)`}
      calendar={{ day, month: 'Dezember' }}
      title={data?.day.title ?? door?.title ?? ''}
      line={spoken}
      stamp={solved && phase === 'reply' ? 'Gelöst!' : undefined}
      quip={phase === 'puzzle' && wrong ? wrong : undefined}
      note={note}
      onBack={onBack}
      ground={
        <Hill
          place={place}
          who={who}
          mood={mood}
          small={note !== undefined}
          onTap={tappable ? morse.play : undefined}
          figureRef={tappable ? figure : undefined}
        />
      }
    >
      {foot}
    </Stage>
  )
}
