import { useState } from 'react'
import { BOARD } from '../../../content/constants'
import type { AnswerResponse } from '../../lib/types'

const GROUPS = [
  ['wer', 'Wer?'],
  ['wo', 'Wo?'],
  ['warum', 'Warum?'],
] as const

interface Props {
  accuse: (answer: string) => Promise<AnswerResponse>
  onConvicted: (result: AnswerResponse) => void
}

export function Final({ accuse, onConvicted }: Props) {
  const [picks, setPicks] = useState<Record<string, string>>({})
  const [message, setMessage] = useState('')
  const [shaking, setShaking] = useState(false)
  const [sending, setSending] = useState(false)

  async function submit() {
    if (GROUPS.some(([key]) => !picks[key])) {
      setMessage('Wähle in jeder Zeile genau eins.')
      return
    }
    setSending(true)
    const response = await accuse(GROUPS.map(([key]) => picks[key]).join(' '))
    setSending(false)
    if (response.correct) {
      setMessage('')
      onConvicted(response)
      return
    }
    setMessage(
      response.message ?? 'Der Weihnachtsmann schüttelt den Kopf. Schau nochmal ins Notizbuch.',
    )
    setShaking(true)
    setTimeout(() => setShaking(false), 400)
  }

  return (
    <div className="final">
      {GROUPS.map(([key, label]) => (
        <div className="grp" key={key}>
          <h3>{label}</h3>
          <div className="pills">
            {BOARD[key].map((item) => (
              <button
                key={item}
                className="pill"
                type="button"
                aria-pressed={picks[key] === item}
                disabled={sending}
                onClick={() => setPicks({ ...picks, [key]: item })}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      ))}
      <button
        type="button"
        className={`go${shaking ? ' shake' : ''}`}
        disabled={sending}
        onClick={submit}
      >
        Anklage erheben
      </button>
      <p className="wrong" aria-live="polite">
        {message}
      </p>
    </div>
  )
}
