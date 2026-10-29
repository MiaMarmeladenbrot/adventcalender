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
        'Hallo! Hier am Nordpol ist etwas verschwunden. Rein kommst du aber nur mit dem Link, den du von deiner Familie bekommen hast. Frag dort einfach nach!',
      ]}
      ground={<Hill place={WORKSHOP} who="snowman" />}
    >
      <p className="welcome-note">Du hast den Link schon? Dann öffne ihn direkt, und es geht los.</p>
    </Stage>
  )
}
