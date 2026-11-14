import type { Place } from '../landscape'
import { Hill, Stage } from './Stage'

const SKY = 'linear-gradient(#f1b48f, #c49bb0 45%, #6f78a8)'
const WORKSHOP: Place = { name: 'Werkstatt', art: 'workshop', from: 0, to: 0 }

export function Welcome() {
  return (
    <Stage
      sky={SKY}
      eyebrow="Ein Rätsel-Adventskalender"
      title="Wo ist der Schlitten?"
      line={[
        'snowman',
        'Hallo! Hier am Nordpol ist etwas verschwunden, und wir brauchen deine Hilfe. Frag einfach in deiner Gruppe nach dem richtigen Link und los geht die Spurensuche.',
      ]}
      ground={<Hill place={WORKSHOP} who="snowman" />}
    >
      <p className="welcome-note">
        Du hast schon einen Zugang? Dann achte darauf, dass du gerade den richtigen Link offen hast.
      </p>
    </Stage>
  )
}

export function Waiting({ trouble, onRetry }: { trouble: string; onRetry: () => void }) {
  return (
    <Stage
      sky={SKY}
      eyebrow="Ein Rätsel-Adventskalender"
      title="Wo ist der Schlitten?"
      line={trouble ? ['snowman', trouble] : null}
      ground={<Hill place={WORKSHOP} who="snowman" />}
    >
      {trouble && (
        <button type="button" className="go" onClick={onRetry}>
          Nochmal versuchen
        </button>
      )}
    </Stage>
  )
}
