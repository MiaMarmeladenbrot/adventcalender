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
  const [joined, setJoined] = useState<{ id: string; name: string } | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const known = nickname ?? joined?.name ?? null
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
      setJoined({ id: player.id, name: name.trim() })
      setStep(PROLOG.length)
    } catch (failure) {
      setError(messageOf(failure))
    } finally {
      setBusy(false)
    }
  }

  function finish() {
    if (joined) onJoined(joined.id)
    else onContinue()
  }

  return (
    <Stage
      sky={SKY}
      eyebrow="Prolog · 30. November"
      title="Willkommen am Nordpol"
      line={line}
      tail={line[0] === 'santa' ? 'left' : 'right'}
      ground={<House speaker={line[0]} />}
      onBack={onBack}
    >
      {notice && <p className="wrong">{notice}</p>}
      {asking ? (
        <form className="name-form" onSubmit={join}>
          <label htmlFor="nickname">Dein Name</label>
          <input
            id="nickname"
            type="text"
            autoComplete="nickname"
            maxLength={30}
            placeholder="z. B. Mia"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <small>Schon mal mitgespielt, zum Beispiel auf einem anderen Handy? Dann denselben Namen eingeben, und dein Stand ist wieder da.</small>
          {error && <p className="wrong">{error}</p>}
          <button className="go" type="submit" disabled={busy}>
            Ich bin dabei
          </button>
        </form>
      ) : (
        <button type="button" className="go" onClick={() => (last ? finish() : setStep(step + 1))}>
          {last ? 'Zur Landschaft' : 'Weiter'}
        </button>
      )}
    </Stage>
  )
}
