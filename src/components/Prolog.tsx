import { useState, type FormEvent } from 'react'
import { PROLOG } from '../../content/constants'
import { api } from '../lib/api'
import { Face, Reply, Say } from './Face'

interface Props {
  code: string
  nickname: string | null
  onJoined: (playerId: string) => void
  onContinue: () => void
}

export function Prolog({ code, nickname, onJoined, onContinue }: Props) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function join(event: FormEvent) {
    event.preventDefault()
    if (!name.trim()) return
    setBusy(true)
    setError('')
    try {
      const { player } = await api.join(code, name)
      onJoined(player.id)
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Das hat nicht geklappt.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <article className="day">
      <div className="dhead">
        <Face who="santa" size={54} />
        <div>
          <span className="eyebrow">Prolog · 30. November</span>
          <h2>Willkommen am Nordpol</h2>
        </div>
      </div>
      <div className="talk">
        {PROLOG.map((line, index) => (
          <Say key={index} line={line} />
        ))}
        {nickname && <Reply text={nickname} />}
        {nickname && (
          <Say
            line={[
              'mrs',
              `Willkommen in der Soko Schlitten, ${nickname}! Ab dem 1. Dezember öffnet sich jeden Morgen eine Tür. Alles, was du herausfindest, landet in deinem Notizbuch.`,
            ]}
          />
        )}
      </div>
      {nickname ? (
        <button className="go" type="button" onClick={onContinue}>
          Los geht’s
        </button>
      ) : (
        <>
          <form className="answer" onSubmit={join}>
            <input
              id="nickname"
              type="text"
              autoComplete="nickname"
              maxLength={30}
              placeholder="Dein Spitzname"
              aria-label="Dein Spitzname"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <button type="submit" disabled={busy}>
              Ich bin dabei
            </button>
          </form>
          <p className="wnote">
            Hast du schon mitgespielt, zum Beispiel auf einem anderen Handy? Dann gib genau denselben
            Spitznamen ein, und dein Stand ist wieder da.
          </p>
          <p className="wrong">{error}</p>
        </>
      )}
    </article>
  )
}
