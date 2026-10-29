import { useEffect, useMemo, useRef, useState } from 'react'
import {
  LANTERN_SVG,
  lanternX,
  lanternY,
  PLACE_ART,
  PLACES,
  placeX,
  RIDGE,
  SHORE_X,
  SLED_SVG,
  STARS,
  START_X,
  WORLD_WIDTH,
} from '../landscape'
import type { GameState } from '../lib/types'
import { Sheet } from './Sheet'

const LIFT = 120
const PROLOG_X = 180
const SNOW_TOP = LIFT + 172
const BUMP_STEP = 380
const BUMP_WIDTH = 620
const BUMP_HEIGHT = 340
const BUMP_BOTTOM = LIFT - 130
const BUMP_LEFTS = Array.from({ length: 8 }, (_, index) => -200 + index * BUMP_STEP).filter(
  (left) => left + BUMP_WIDTH <= SHORE_X + 60,
)
const FRONT_WIDTH = 520
const LAKE_WIDTH = WORLD_WIDTH - SHORE_X
const LAKE_HEIGHT = SNOW_TOP + 8
const SHORE_LINE = `M0 ${LAKE_HEIGHT} C 10 200, 20 80, 60 40 C 80 22, 110 10, 170 8`
const PATH_END = SHORE_X + 260
const PARALLAX = 0.35
const RIDGE_BOTTOM = LIFT + 168
const RIDGE_HEIGHT = 150
const RIDGE_CLIP = `polygon(0 100%, ${RIDGE.map(([x, y]) => `${x}% ${y}%`).join(', ')}, 100% 100%)`
const STARS_FROM = 1000
const PLACE_BOTTOM = LIFT + 182
const BAKERY_DROP = 14

interface Props {
  state: GameState
  selected: number
  onSelect: (day: number) => void
  onOpen: (day: number) => void
  onNotebook: () => void
}

function ownSledDay(state: GameState) {
  const open = state.doors.find((door) => !state.solved.includes(door.day))
  if (open) return open.day
  return state.solved.length ? Math.max(...state.solved) : 0
}

function xOf(day: number) {
  return day === 0 ? PROLOG_X : lanternX(day)
}

function bottomOf(day: number) {
  return (day === 0 ? 140 : lanternY(day)) + LIFT
}

function groundAt(x: number) {
  let top = SNOW_TOP
  for (const left of BUMP_LEFTS) {
    const offset = (x - left - BUMP_WIDTH / 2) / (BUMP_WIDTH / 2)
    if (Math.abs(offset) < 1) top = Math.max(top, BUMP_BOTTOM + (BUMP_HEIGHT / 2) * (1 + Math.sqrt(1 - offset * offset)))
  }
  return top
}

function Lake() {
  return (
    <svg
      className="icelake"
      style={{ left: SHORE_X, width: LAKE_WIDTH, height: LAKE_HEIGHT }}
      viewBox={`0 0 ${LAKE_WIDTH} ${LAKE_HEIGHT}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ice" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9fb3cc" />
          <stop offset=".4" stopColor="#b9d3e6" />
          <stop offset="1" stopColor="#e1f0f7" />
        </linearGradient>
      </defs>
      <path d={`${SHORE_LINE} H${LAKE_WIDTH} V${LAKE_HEIGHT} Z`} fill="url(#ice)" />
      <ellipse cx="340" cy="40" rx="170" ry="9" fill="#9ff5d6" opacity=".22" />
      <ellipse cx="200" cy="120" rx="60" ry="9" fill="#d3e7f2" />
      <ellipse cx="430" cy="190" rx="75" ry="11" fill="#d3e7f2" />
      <path
        d="M120 70 H260 M300 110 H470 M170 160 H300 M360 210 H530"
        stroke="#ffffff"
        strokeOpacity=".35"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M140 236 L190 214 L232 226 L292 202 M190 214 L200 188 M400 258 L440 240 L476 250 M440 240 L454 216"
        stroke="#ffffff"
        strokeWidth="1.6"
        fill="none"
        opacity=".8"
        strokeLinecap="round"
      />
      <ellipse cx="260" cy="278" rx="80" ry="8" fill="#eef4f8" />
      <ellipse cx="480" cy="150" rx="50" ry="5" fill="#eef4f8" opacity=".75" />
      <path d={SHORE_LINE} stroke="#8fb0c8" strokeWidth="1.5" fill="none" opacity=".7" strokeLinecap="round" />
    </svg>
  )
}

function Scenery() {
  return useMemo(() => {
    const bumps = BUMP_LEFTS.map((x) => <div key={`b${x}`} className="bump" style={{ left: x, bottom: BUMP_BOTTOM }} />)
    const pines = []
    for (let x = 30, index = 0; x < SHORE_X - 20; x += 58, index++) {
      if (PLACES.some((place) => place.art !== 'lake' && Math.abs(placeX(place) - x) < 75) || Math.abs(x - (START_X - 95)) < 40) continue
      const scale = 0.6 + ((index * 37) % 10) / 14
      pines.push(
        <i
          key={`p${x}`}
          className="pine"
          style={{ left: x, bottom: groundAt(x + 12) - 5 - ((index * 13) % 8), transform: `scale(${scale.toFixed(2)})` }}
        />,
      )
    }
    const fronts = []
    for (let x = -100; x + FRONT_WIDTH <= SHORE_X; x += 300)
      fronts.push(<div key={`f${x}`} className="bump front" style={{ left: x, bottom: LIFT - 150 }} />)
    const points = Array.from({ length: 24 }, (_, index) => `${lanternX(index + 1).toFixed(1)} ${(262 - lanternY(index + 1)).toFixed(1)}`)
    const path = `M0 ${(262 - 140).toFixed(1)} L${PROLOG_X} 122 L${points.join(' L')} L${PATH_END} ${(262 - lanternY(24)).toFixed(1)}`
    return (
      <>
        <div className="snowband" style={{ height: SNOW_TOP }} />
        {bumps}
        {pines}
        <svg className="pathsvg" viewBox={`0 0 ${WORLD_WIDTH} 260`} style={{ bottom: LIFT, width: WORLD_WIDTH }} aria-hidden="true">
          <path d={path} stroke="#b8946a" strokeWidth="9" fill="none" strokeLinejoin="round" strokeLinecap="round" />
          <path d={path} stroke="#d4b68c" strokeWidth="5.5" fill="none" strokeLinejoin="round" strokeLinecap="round" />
          <path d={path} stroke="#ffffff" strokeOpacity=".45" strokeWidth="2" strokeDasharray="1 23" fill="none" strokeLinecap="round" />
        </svg>
        <Lake />
        {fronts}
      </>
    )
  }, [])
}

export function Landscape({ state, selected, onSelect, onOpen, onNotebook }: Props) {
  const track = useRef<HTMLDivElement>(null)
  const sky = useRef<HTMLDivElement>(null)
  const far = useRef<HTMLDivElement>(null)
  const stars = useRef<SVGSVGElement>(null)
  const [here, setHere] = useState(0)
  const solved = new Set(state.solved)
  const sledDay = ownSledDay(state)

  useEffect(() => {
    const element = track.current
    if (!element) return
    element.scrollLeft = xOf(selected) - element.clientWidth / 2
    follow()
    window.addEventListener('resize', follow)
    return () => window.removeEventListener('resize', follow)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const element = track.current
    if (!element) return
    const wheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return
      event.preventDefault()
      element.scrollLeft += event.deltaY
    }
    element.addEventListener('wheel', wheel, { passive: false })

    let drag: { x: number; left: number; speed: number; time: number; moved: boolean } | null = null
    let glide = 0
    const down = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      cancelAnimationFrame(glide)
      drag = { x: event.clientX, left: element.scrollLeft, speed: 0, time: performance.now(), moved: false }
    }
    const move = (event: PointerEvent) => {
      if (!drag) return
      const distance = event.clientX - drag.x
      if (Math.abs(distance) > 4) drag.moved = true
      const now = performance.now()
      const next = drag.left - distance
      drag.speed = ((element.scrollLeft - next) / Math.max(1, now - drag.time)) * 16
      drag.time = now
      element.scrollLeft = next
    }
    const up = () => {
      if (!drag) return
      let speed = -drag.speed
      if (drag.moved) {
        element.addEventListener('click', (event) => event.stopPropagation(), { capture: true, once: true })
        const step = () => {
          if (Math.abs(speed) < 0.4) return
          element.scrollLeft += speed
          speed *= 0.94
          glide = requestAnimationFrame(step)
        }
        step()
      }
      drag = null
    }
    element.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    return () => {
      element.removeEventListener('wheel', wheel)
      element.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      cancelAnimationFrame(glide)
    }
  }, [])

  function follow() {
    const element = track.current
    if (!element) return
    const left = element.scrollLeft
    if (sky.current) sky.current.style.transform = `translateX(${-left}px)`
    if (far.current) far.current.style.transform = `translateX(${-left * PARALLAX}px)`
    if (far.current && stars.current) {
      const shift = left * (1 - PARALLAX) - STARS_FROM
      const width = far.current.offsetWidth
      const base = element.clientHeight - RIDGE_BOTTOM - RIDGE_HEIGHT
      const ridge = [...RIDGE]
        .reverse()
        .map(([x, y]) => `${Math.round(shift + (x / 100) * width)}px ${Math.round(base + (y / 100) * RIDGE_HEIGHT)}px`)
      stars.current.style.clipPath = `polygon(${Math.round(shift + width)}px 0, ${ridge.join(', ')}, ${Math.round(shift)}px 0)`
    }
    const centre = left + element.clientWidth / 2
    let nearest = 0
    PLACES.forEach((place, index) => {
      if (Math.abs(placeX(place) - centre) < Math.abs(placeX(PLACES[nearest]) - centre)) nearest = index
    })
    setHere(nearest)
  }

  function goTo(x: number) {
    const element = track.current
    if (element) element.scrollTo({ left: x - element.clientWidth / 2, behavior: 'smooth' })
  }

  const place = PLACES[here]
  const reached = place.from <= state.unlocked
  const door = state.doors.find((entry) => entry.day === selected)

  return (
    <section className="scape">
      <div className="sky" ref={sky} style={{ width: WORLD_WIDTH }}>
        <svg className="stars" ref={stars} style={{ left: STARS_FROM, width: WORLD_WIDTH - STARS_FROM }} aria-hidden="true">
          {STARS.map((star, index) => (
            <circle
              key={index}
              className={star.twinkle ? 'tw' : undefined}
              cx={`${star.x.toFixed(2)}%`}
              cy={`${star.y.toFixed(2)}%`}
              r={star.r.toFixed(2)}
              fill="#ffffff"
              opacity={star.opacity.toFixed(2)}
              style={star.twinkle ? { animationDelay: `${star.delay.toFixed(2)}s` } : undefined}
            />
          ))}
        </svg>
        <div className="aurora" />
      </div>
      <div className="far" ref={far} style={{ width: `calc(${Math.ceil(WORLD_WIDTH * PARALLAX)}px + 100vw)` }}>
        <i style={{ bottom: RIDGE_BOTTOM, height: RIDGE_HEIGHT, clipPath: RIDGE_CLIP }} />
      </div>
      <div className="track" ref={track} onScroll={follow}>
        <div className="world" style={{ width: WORLD_WIDTH }}>
          <Scenery />
          <div className="place" style={{ left: START_X - 95, bottom: PLACE_BOTTOM }}>
            <svg viewBox="0 0 120 100" aria-hidden="true" dangerouslySetInnerHTML={{ __html: PLACE_ART.workshop }} />
          </div>
          {PLACES.filter((entry) => entry.art !== 'lake').map((entry) => (
            <div
              key={entry.name}
              className={`place${entry.from <= state.unlocked ? '' : ' fog'}`}
              style={{ left: placeX(entry), bottom: entry.art === 'bake' ? PLACE_BOTTOM - BAKERY_DROP : PLACE_BOTTOM }}
            >
              <svg viewBox="0 0 120 100" aria-hidden="true" dangerouslySetInnerHTML={{ __html: PLACE_ART[entry.art] }} />
            </div>
          ))}
          <button
            type="button"
            className={`startsign${selected === 0 ? ' sel' : ''}`}
            style={{ left: PROLOG_X, bottom: LIFT + 132 }}
            onClick={() => onSelect(0)}
          >
            Start
          </button>
          {Array.from({ length: 24 }, (_, index) => {
            const day = index + 1
            const status = solved.has(day) ? ' lit' : day <= state.unlocked ? ' now' : ''
            return (
              <button
                key={day}
                type="button"
                className={`lan${status}${selected === day ? ' sel' : ''}`}
                style={{ left: lanternX(day), bottom: bottomOf(day) }}
                aria-label={`Tag ${day}`}
                onClick={() => onSelect(day)}
              >
                <span dangerouslySetInnerHTML={{ __html: LANTERN_SVG }} />
                <span className="ln">{day}</span>
              </button>
            )
          })}
          {state.team
            .filter((member) => member.nickname !== state.me.nickname)
            .map((member, index) => (
              <div
                key={member.nickname}
                className="sled other"
                style={{ left: xOf(member.furthest) - 30, bottom: bottomOf(member.furthest) + 8 + index * 6 }}
              >
                <span className="flag">{member.nickname}</span>
                <span dangerouslySetInnerHTML={{ __html: SLED_SVG }} />
              </div>
            ))}
          <div className="sled" style={{ left: xOf(sledDay) + 12, bottom: bottomOf(sledDay) - 4 }}>
            <span dangerouslySetInnerHTML={{ __html: SLED_SVG }} />
          </div>
        </div>
      </div>

      <header className="sbar">
        <div>
          <strong>{reached ? place.name : 'Unbekanntes Land'}</strong>
          <small>{reached ? `Tag ${place.from} bis ${place.to}` : `Ab dem ${place.from}. Dezember`}</small>
        </div>
        <div className="dots">
          {PLACES.map((entry, index) => (
            <button
              key={entry.name}
              type="button"
              aria-label={entry.from <= state.unlocked ? entry.name : 'Unbekannter Ort'}
              className={`${entry.from <= state.unlocked ? 'reached' : ''}${index === here ? ' here' : ''}`}
              onClick={() => goTo(placeX(entry))}
            />
          ))}
        </div>
        <button type="button" className="bookbtn" onClick={onNotebook}>
          Notizbuch
          <span>{state.clues.length}</span>
        </button>
      </header>

      <Sheet day={selected} door={door} solved={solved.has(selected)} onOpen={onOpen} />
    </section>
  )
}
