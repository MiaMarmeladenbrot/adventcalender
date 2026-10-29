import { useState, type FormEvent } from 'react'
import { PROLOG } from '../../content/constants'
import { api, messageOf } from '../lib/api'
import type { Line } from '../lib/types'
import { House, Stage } from './Stage'

const SKY = 'linear-gradient(#f1b48f, #c49bb0 45%, #6f78a8)'

interface Props {
  code: string
  nickname: string | null
  notice?: string
  onJoined: (playerId: string) => void
  onContinue: () => void
  onBack?: () => void
}

function welcome(name: string): Line {
  return [
    'mrs',
    `Schön, dich kennenzulernen, ${name}! Ab dem 1. Dezember leuchtet jeden Morgen eine neue Laterne. Alles, was du herausfindest, kommt in dein Notizbuch.`,
  ]
}

export function Prolog({ code, nickname, notice, onJoined, onContinue, onBack }: Props) {
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [joined, setJoined] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const known = nickname ?? joined
  const lines: Line[] = known ? [...PROLOG, welcome(known)] : [...PROLOG]
  const line = lines[Math.min(step, lines.length - 1)]
  const asking = !known && step >= PROLOG.length - 1
  const last = step >= lines.length - 1

  async function join(event: FormEvent) {
    event.preventDefault()
    if (!name.trim()) return
    setBusy(true)
    setError('')
    try {
      const { player } = await api.join(code, name)
      setJoined(name.trim())
      setStep(PROLOG.length)
      onJoined(player.id)
    } catch (failure) {
      setError(messageOf(failure))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Stage
      sky={SKY}
      calendar={{ day: 30, month: 'November' }}
      title="Willkommen am Nordpol"
      line={line}
      tail={line[0] === 'santa' ? 'left' : 'right'}
      ground={<House speaker={line[0]} />}
      onBack={onBack}
      reply={
        asking || error || notice ? (
          <>
            {asking && (
              <label className="bubble-answer" htmlFor="nickname">
                <span>Ich heiße</span>
                <input
                  id="nickname"
                  form="join"
                  type="text"
                  autoComplete="nickname"
                  maxLength={30}
                  placeholder="dein Name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </label>
            )}
            {(error || notice) && <span className="bubble-error">{error || notice}</span>}
          </>
        ) : undefined
      }
    >
      {asking ? (
        <form id="join" className="name-form" onSubmit={join}>
          <button className="go" type="submit" disabled={busy}>
            Ich bin dabei
          </button>
          <small>Schon mal dabei? Gleicher Name, gleicher Stand.</small>
        </form>
      ) : (
        <button
          type="button"
          className="go"
          onClick={() => (last ? onContinue() : setStep(step + 1))}
        >
          {last ? 'Zur Landschaft' : 'Weiter'}
        </button>
      )}
    </Stage>
  )
}
