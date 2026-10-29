import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import {
  LANTERN_SVG,
  lanternX,
  lanternY,
  PLACE_ART,
  PLACES,
  placeX,
  SLED_SVG,
  START_X,
  WORLD_WIDTH,
} from '../landscape'
import type { GameState } from '../lib/types'
import { Sheet } from './Sheet'

const LIFT = 120
const PROLOG_X = 60

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

function Scenery() {
  return useMemo(() => {
    const bumps = []
    for (let x = -200; x < WORLD_WIDTH; x += 380) bumps.push(<div key={`b${x}`} className="bump" style={{ left: x, bottom: LIFT - 130 }} />)
    const pines = []
    for (let x = 30, index = 0; x < WORLD_WIDTH; x += 58, index++) {
      if (PLACES.some((place) => Math.abs(placeX(place) - x) < 75) || Math.abs(x - 40) < 40) continue
      const scale = 0.6 + ((index * 37) % 10) / 14
      pines.push(
        <i
          key={`p${x}`}
          className="pine"
          style={{ left: x, bottom: LIFT + 176 + ((index * 13) % 22), transform: `scale(${scale.toFixed(2)})` }}
        />,
      )
    }
    const fronts = []
    for (let x = -100; x < WORLD_WIDTH; x += 300) fronts.push(<div key={`f${x}`} className="bump front" style={{ left: x, bottom: LIFT - 150 }} />)
    const points = Array.from({ length: 24 }, (_, index) => `${lanternX(index + 1).toFixed(1)} ${(262 - lanternY(index + 1)).toFixed(1)}`)
    const path = `M0 ${(262 - 140).toFixed(1)} L${PROLOG_X} 122 L${points.join(' L')} L${WORLD_WIDTH} ${(262 - lanternY(24)).toFixed(1)}`
    return (
      <>
        <div className="snowband" style={{ height: 172 + LIFT }} />
        {bumps}
        {pines}
        <svg className="pathsvg" viewBox={`0 0 ${WORLD_WIDTH} 260`} style={{ bottom: LIFT }} aria-hidden="true">
          <path d={path} stroke="#c6d3df" strokeWidth="12" fill="none" strokeLinejoin="round" strokeLinecap="round" />
          <path d={path} stroke="#9fb0c2" strokeWidth="2.5" strokeDasharray="2 9" fill="none" strokeLinecap="round" />
        </svg>
        {fronts}
      </>
    )
  }, [])
}

export function Landscape({ state, selected, onSelect, onOpen, onNotebook }: Props) {
  const track = useRef<HTMLDivElement>(null)
  const sky = useRef<HTMLDivElement>(null)
  const far = useRef<HTMLDivElement>(null)
  const [here, setHere] = useState(0)
  const solved = new Set(state.solved)
  const sledDay = ownSledDay(state)

  useEffect(() => {
    const element = track.current
    if (!element) return
    element.scrollLeft = xOf(selected) - element.clientWidth / 2
    follow()
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
    if (far.current) far.current.style.transform = `translateX(${-left * 0.35}px)`
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
        <div className="stars" />
        <div className="aurora" />
      </div>
      <div className="far" ref={far}>
        <i style={{ bottom: LIFT + 168 }} />
      </div>
      <div className="track" ref={track} onScroll={follow}>
        <div className="world" style={{ width: WORLD_WIDTH }}>
          <Scenery />
          <div className="place" style={{ left: START_X - 95, bottom: LIFT + 168 } as CSSProperties}>
            <svg viewBox="0 0 120 100" aria-hidden="true" dangerouslySetInnerHTML={{ __html: PLACE_ART.workshop }} />
          </div>
          {PLACES.map((entry) => {
            const open = entry.from <= state.unlocked
            return (
              <div key={entry.name} className={`place${open ? '' : ' fog'}`} style={{ left: placeX(entry), bottom: LIFT + 168 }}>
                <svg viewBox="0 0 120 100" aria-hidden="true" dangerouslySetInnerHTML={{ __html: PLACE_ART[entry.art] }} />
                <span className="sign">{open ? entry.name : '???'}</span>
              </div>
            )
          })}
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
