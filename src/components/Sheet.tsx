import { placeOf } from '../landscape'
import type { Who } from '../lib/types'
import { Face } from './Face'

interface Props {
  day: number
  door?: { who: Who; title: string }
  solved: boolean
  onOpen: (day: number) => void
}

export function Sheet({ day, door, solved, onOpen }: Props) {
  if (day === 0) {
    return (
      <div className="ssheet">
        <Face who="santa" size={44} />
        <small>Prolog · 30. November</small>
        <strong>Willkommen am Nordpol</strong>
        <button type="button" onClick={() => onOpen(0)}>
          Nochmal ansehen
        </button>
      </div>
    )
  }

  if (!door) {
    return (
      <div className="ssheet">
        <Face who="snowman" size={44} />
        <small>Tag {day} · ???</small>
        <strong>Noch im Nebel</strong>
        <button type="button" disabled>
          Öffnet am {day}. Dezember
        </button>
      </div>
    )
  }

  return (
    <div className="ssheet">
      <Face who={door.who} size={44} />
      <small>
        Tag {day} · {placeOf(day).name}
        {solved ? ' · gelöst' : ''}
      </small>
      <strong>{door.title}</strong>
      <button type="button" className={solved ? 'quiet' : ''} onClick={() => onOpen(day)}>
        {solved ? 'Nochmal ansehen' : 'Türchen öffnen'}
      </button>
    </div>
  )
}
