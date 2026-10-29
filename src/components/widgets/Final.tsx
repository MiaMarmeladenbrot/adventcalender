import { useState, type MouseEvent } from 'react'
import { BOARD } from '../../../content/constants'
import type { AnswerResponse } from '../../lib/types'

const GROUPS = [
  ['wer', 'Wer?'],
  ['wo', 'Wo?'],
  ['warum', 'Warum?'],
] as const

interface Props {
  accuse: (answer: string) => Promise<AnswerResponse>
  onFound: (result: AnswerResponse) => void
}

export function Final({ accuse, onFound }: Props) {
  const [picks, setPicks] = useState<Record<string, string>>({})
  const [message, setMessage] = useState('')
  const [result, setResult] = useState<AnswerResponse | null>(null)
  const [shaking, setShaking] = useState(false)

  function shake() {
    setShaking(true)
    setTimeout(() => setShaking(false), 400)
  }

  async function submit() {
    if (GROUPS.some(([key]) => !picks[key])) {
      setMessage('Wähle in jeder Zeile genau eins.')
      return
    }
    const response = await accuse(GROUPS.map(([key]) => picks[key]).join(' '))
    if (response.correct) {
      setMessage('')
      setResult(response)
    } else {
      setMessage(response.message ?? 'Der Weihnachtsmann schüttelt den Kopf. Schau nochmal ins Notizbuch.')
      shake()
    }
  }

  function tapIce(event: MouseEvent<HTMLDivElement>) {
    const box = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - box.left) / box.width
    const y = (event.clientY - box.top) / box.height
    if (result && x > 0.6 && x < 0.9 && y > 0.3 && y < 0.7) onFound(result)
    else shake()
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
                disabled={Boolean(result)}
                onClick={() => setPicks({ ...picks, [key]: item })}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      ))}
      {!result && (
        <button type="button" className={`go${shaking ? ' shake' : ''}`} onClick={submit}>
          Anklage erheben
        </button>
      )}
      <p className="wrong" aria-live="polite">
        {message}
      </p>
      {result && (
        <div>
          <p style={{ marginBottom: 8 }}>Richtig! Jetzt tipp ins Eis, genau dahin, wo der Schlitten steckt.</p>
          <div className={`ice${shaking ? ' shake' : ''}`} onClick={tapIce}>
            <svg viewBox="0 0 400 200" preserveAspectRatio="none" aria-hidden="true">
              <path
                d="M30 60 L80 90 L60 140 M150 30 L190 80 L240 70 M100 170 L170 150 M320 160 L360 120"
                stroke="#ffffff"
                strokeWidth="2"
                fill="none"
                opacity=".8"
              />
              <ellipse cx="300" cy="105" rx="46" ry="22" fill="#9cc9de" opacity=".55" />
              <path
                d="M276 104 Q 272 86 284 80 M318 104 Q 314 86 326 80"
                stroke="#7a5a2a"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  )
}
