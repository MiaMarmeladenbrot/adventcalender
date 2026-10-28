import { BOARD, NAMES } from '../../content/constants'
import type { GameState } from '../lib/types'
import { Face } from './Face'

const COLUMNS = [
  ['wer', 'Wer?'],
  ['wo', 'Wo?'],
  ['warum', 'Warum?'],
] as const

interface Props {
  state: GameState
  onMark: (item: string, crossed: boolean) => void
}

export function Notebook({ state, onMark }: Props) {
  return (
    <div className="book">
      <div className="board">
        {COLUMNS.map(([key, label]) => (
          <div key={key}>
            <h3>{label}</h3>
            <div className="opts">
              {BOARD[key].map((item) => (
                <button
                  key={item}
                  type="button"
                  className={state.marks[item] ? 'x' : ''}
                  aria-pressed={Boolean(state.marks[item])}
                  onClick={() => onMark(item, !state.marks[item])}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        ))}
        <p className="hintline">
          Gelöste Rätsel streichen automatisch. Antippen streicht oder holt zurück.
        </p>
      </div>
      <div>
        <h2 style={{ marginBottom: 10 }}>Indizien</h2>
        <div className="entries">
          {state.clues.length === 0 ? (
            <p className="empty">
              Noch keine Indizien. Löse das erste Rätsel, dann landet hier, was du herausgefunden hast.
            </p>
          ) : (
            state.clues.map((entry) => (
              <div className="entry" key={entry.day}>
                <Face who={entry.who} size={36} />
                <small>
                  Tag {entry.day} · {NAMES[entry.who]}
                </small>
                <p>{entry.clue}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
