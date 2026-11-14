import { useEffect, useState, type CSSProperties, type MouseEvent } from 'react'
import { otherSledSvg, RIDGE, skyAt, SLED_SVG } from '../landscape'
import type { Line } from '../lib/types'
import { Bubble, Face } from './Face'

type Scene = 'ice' | 'break' | 'confess' | 'hug' | 'flight' | 'credits'

interface Member {
  nickname: string
  solved: number
}

interface Props {
  confession: Line
  team: Member[]
  me: string
  finalMessage: string | null
  onNotebook: () => void
  onBack: () => void
}

const HUG: Line = [
  'santa',
  'Angst haben ist erlaubt, Rudolph. Du fliegst trotzdem ganz vorn. Und jetzt: Auf geht’s!',
  'h',
]

const AUTO_NEXT: Partial<Record<Scene, [Scene, number]>> = {
  break: ['confess', 2600],
  flight: ['credits', 9200],
}

const SKY = `linear-gradient(#0a1230, ${skyAt(24)} 85%)`
const RIDGE_CLIP = `polygon(0 100%, ${RIDGE.map(([x, y]) => `${x}% ${y}%`).join(', ')}, 100% 100%)`

const STARS = Array.from({ length: 46 }, (_, index) => ({
  left: (index * 37.3) % 100,
  top: (index * 53.7) % 62,
  size: index % 5 === 0 ? 3 : 2,
  delay: (index % 7) * 0.4,
}))

const SLEIGH =
  '<svg viewBox="0 0 120 70" aria-hidden="true">' +
  '<g filter="url(#pc)">' +
  '<path d="M6 62 H96 Q112 62 112 50" stroke="#c9a14a" stroke-width="4" fill="none" stroke-linecap="round"/>' +
  '<path d="M28 62 V50 M76 62 V50" stroke="#c9a14a" stroke-width="3"/>' +
  '<path d="M10 52 C 8 36, 12 22, 22 18 L 30 30 H 92 C 104 30, 110 40, 106 52 Z" fill="#b8232c"/>' +
  '<path d="M100 31 C 112 28, 116 18, 108 14" stroke="#b8232c" stroke-width="6" fill="none" stroke-linecap="round"/>' +
  '</g>' +
  '<path d="M12 46 H104" stroke="#e3b23c" stroke-width="3"/>' +
  '<path d="M22 18 L 30 30" stroke="#e3b23c" stroke-width="2.5"/>' +
  '</svg>'

const FLYING_RUDOLPH =
  '<svg viewBox="-20 -12 140 92" aria-hidden="true">' +
  '<path d="M-18 44 Q8 42 30 40" stroke="#5a3418" stroke-width="2" fill="none"/>' +
  '<g filter="url(#pc)" stroke="#7d4f2f" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round">' +
  '<path class="fin-leg back" d="M30 46 L14 58 L8 56"/><path class="fin-leg back" d="M36 48 L22 64 L16 64"/>' +
  '<path class="fin-leg front" d="M70 46 L86 56 L92 52"/><path class="fin-leg front" d="M64 48 L78 64 L84 62"/>' +
  '</g>' +
  '<g filter="url(#pc)">' +
  '<path d="M22 34 Q14 30 16 24 Q22 28 24 32 Z" fill="#dcb88e"/>' +
  '<ellipse cx="50" cy="40" rx="28" ry="13" fill="#9a6a43"/>' +
  '<path d="M68 34 C 74 26, 78 20, 82 14 L 92 20 C 86 28, 80 34, 76 42 Z" fill="#9a6a43"/>' +
  '<ellipse cx="92" cy="18" rx="12" ry="8" fill="#9a6a43" transform="rotate(15 92 18)"/>' +
  '</g>' +
  '<ellipse cx="50" cy="46" rx="20" ry="5" fill="#b8875a"/>' +
  '<g filter="url(#pc)"><ellipse cx="101" cy="22" rx="7" ry="5.5" fill="#dcb88e"/><path d="M86 12 L79 5 L89 9 Z" fill="#7d4f2f"/></g>' +
  '<path d="M88 10 C 86 2, 84 -4, 80 -9 M84 0 L77 -2 M93 10 C 95 2, 99 -4, 105 -7 M98 0 L104 2" stroke="#c4955c" stroke-width="3" fill="none" stroke-linecap="round"/>' +
  '<path d="M90 15 Q93 12 96 15" stroke="#2a1f1a" stroke-width="1.8" fill="none" stroke-linecap="round"/>' +
  '<g filter="url(#pc)"><path d="M70 30 Q78 35 85 28 L88 32 Q78 41 68 34 Z" fill="#b8232c"/><path d="M71 32 L58 25 L61 33 Z" fill="#9c1c24"/></g>' +
  '<circle class="nose-glow" cx="108" cy="21" r="16" fill="url(#noseGlow)"/>' +
  '<circle cx="108" cy="21" r="4.5" fill="#c62828"/>' +
  '</svg>'

const LAKE =
  '<svg viewBox="0 0 400 150" aria-hidden="true">' +
  '<path d="M30 46 H140 M220 36 H340 M50 112 H160 M250 124 H370" stroke="#ffffff" stroke-opacity=".35" stroke-width="2" stroke-linecap="round"/>' +
  '<ellipse cx="100" cy="80" rx="46" ry="7" fill="#d3e7f2"/><ellipse cx="330" cy="96" rx="50" ry="8" fill="#d3e7f2"/>' +
  '<ellipse class="fin-hole" cx="205" cy="84" rx="74" ry="20" fill="#1d4f73"/>' +
  '<g class="fin-cracks" stroke="#ffffff" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round">' +
  '<path d="M240 76 L196 58 L170 40"/><path d="M240 76 L290 60 L330 48"/><path d="M240 76 L214 104 L180 122"/>' +
  '<path d="M240 76 L282 100 L318 120"/><path d="M196 58 L150 70 L110 66"/><path d="M290 60 L300 36"/>' +
  '</g>' +
  '<g class="fin-tips" stroke="#7a5a2a" stroke-width="6" fill="none" stroke-linecap="round">' +
  '<path d="M226 84 Q 222 66 234 60"/><path d="M262 84 Q 258 66 270 60"/>' +
  '</g>' +
  '<g class="fin-shards" fill="#e8f6fc" stroke="#8cc3dc" stroke-width="1">' +
  '<path d="M200 70 L214 62 L210 78Z"/><path d="M250 66 L262 58 L264 74Z"/><path d="M226 92 L240 88 L232 100Z"/>' +
  '<path d="M180 84 L190 76 L194 90Z"/><path d="M270 86 L282 82 L276 96Z"/>' +
  '</g>' +
  '</svg>'

function wasStill() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function Finale({ confession, team, me, finalMessage, onNotebook, onBack }: Props) {
  const [scene, setScene] = useState<Scene>('ice')
  const [missed, setMissed] = useState(false)

  useEffect(() => {
    const next = AUTO_NEXT[scene]
    if (!next) return
    const timer = setTimeout(() => setScene(next[0]), wasStill() ? 400 : next[1])
    return () => clearTimeout(timer)
  }, [scene])

  function tapIce(event: MouseEvent<HTMLButtonElement>) {
    if (scene !== 'ice') return
    const box = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - box.left) / box.width
    const y = (event.clientY - box.top) / box.height
    if (x > 0.45 && x < 0.8 && y > 0.2 && y < 0.85) {
      setScene('break')
      return
    }
    setMissed(true)
    setTimeout(() => setMissed(false), 400)
  }

  const crew = [me, ...team.map((member) => member.nickname).filter((name) => name !== me)]
  const trail: CSSProperties & Record<'--trail', number> = { '--trail': crew.length }
  const playing = scene !== 'ice' && scene !== 'credits'

  return (
    <section className={`finstage fin-${scene}`} aria-label="Finale">
      <div className="fin-sky" style={{ background: SKY }}>
        <div className="fin-aurora" />
        {STARS.map((star, index) => (
          <i
            key={index}
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: star.size,
              height: star.size,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
        <i className="fin-ridge" style={{ clipPath: RIDGE_CLIP }} />
      </div>

      {playing && (
        <button type="button" className="fin-skip" onClick={() => setScene('credits')}>
          Überspringen
        </button>
      )}

      <div className="fin-speech" aria-live="polite">
        {scene === 'ice' && (
          <p className={`fin-prompt${missed ? ' shake' : ''}`}>
            Na los, befrei den Schlitten aus dem Eis!
          </p>
        )}
        {scene === 'credits' && (
          <div className="fin-end">
            <h2>Fall gelöst!</h2>
            {finalMessage && <p className="final-message">{finalMessage}</p>}
            <div className="fin-roll">
              <span>Ermittelt von</span>
              <ul>
                {team.map((member) => (
                  <li key={member.nickname}>
                    <b>{member.nickname}</b>
                    <small>{member.solved} Türchen gelöst</small>
                  </li>
                ))}
              </ul>
            </div>
            <div className="fin-actions">
              <button type="button" className="go" onClick={onNotebook}>
                Indiz ins Notizbuch schreiben
              </button>
              <button type="button" className="fin-again" onClick={() => setScene('ice')}>
                Nochmal ansehen
              </button>
              <button type="button" className="fin-again" onClick={onBack}>
                Zur Landschaft
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="fin-talk" aria-live="polite">
        {scene === 'confess' && <Bubble line={[confession[0], confession[1]]} tail="left" />}
        {scene === 'hug' && <Bubble line={[HUG[0], HUG[1]]} tail="right" />}
      </div>

      <div className="fin-foot">
        {scene === 'confess' && (
          <button type="button" className="go" onClick={() => setScene('hug')}>
            Weiter
          </button>
        )}
        {scene === 'hug' && (
          <button type="button" className="go" onClick={() => setScene('flight')}>
            Losfliegen
          </button>
        )}
      </div>

      <div className="fin-ground">
        <div className="fin-hill" />
        <button
          type="button"
          className={`fin-lake${missed ? ' shake' : ''}`}
          onClick={tapIce}
          disabled={scene !== 'ice'}
          aria-label="Ins Eis tippen"
          dangerouslySetInnerHTML={{ __html: LAKE }}
        />
        <div className="fin-sleigh">
          <div className="fin-train" style={trail}>
            <div className="fin-followers">
              {crew.map((name) => (
                <div className="fin-follower" key={name}>
                  <span className="fin-flag">{name}</span>
                  <span
                    className="fin-sled"
                    dangerouslySetInnerHTML={{
                      __html: name === me ? SLED_SVG : otherSledSvg(name),
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="fin-sleigh-wrap">
              <div className="fin-santa-seat">
                <Face who="santa" size="100%" mood="h" />
              </div>
              <span className="fin-sleigh-body" dangerouslySetInnerHTML={{ __html: SLEIGH }} />
            </div>
            <span className="fin-leader" dangerouslySetInnerHTML={{ __html: FLYING_RUDOLPH }} />
          </div>
        </div>
        <div className="fin-col">
          <div className="fin-rudolph">
            <Face who="rudolph" size="100%" mood={scene === 'confess' ? 'v' : 'h'} />
          </div>
          <div className="fin-santa">
            <Face who="santa" size="100%" mood="h" />
          </div>
        </div>
      </div>
    </section>
  )
}
