import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from 'react'
import { flushSync } from 'react-dom'
import { BOARD, NAMES } from '../../content/constants'
import type { GameState } from '../lib/types'
import { Face } from './Face'

const COLUMNS = [
  ['wer', 'Wer?'],
  ['wo', 'Wo?'],
  ['warum', 'Warum?'],
] as const

const NARROW_BELOW = 760
const COVER_RATIO = 0.7
export const ICON_TILT = 4
const LID_OPEN_MS = 1050
const LID_CLOSE_MS = 850
const PEEK = 18
const NARROW_TOP = 64
const NARROW_BOTTOM = 24
const SWIPE_START_PX = 8
const SWIPE_ZOOM = 0.94
const PAGE_GLIDE_MS = 380
const SWIPE_CLICK_GUARD_MS = 350
const PAGE_GAP = 40
const TURN_MS = 680

interface Rect {
  left: number
  top: number
  width: number
  height: number
}

interface Layout extends Rect {
  narrow: boolean
  pan: number
}

interface Camera {
  x: number
  zoom: number
  page: 1 | 2
  ready: boolean
}

interface Pager {
  index: number
  count: number
  turn: (step: 1 | -1) => boolean
}

function layoutFor(viewWidth: number, viewHeight: number): Layout {
  const narrow = viewWidth < NARROW_BELOW
  if (!narrow) {
    let height = Math.min(viewHeight - 96, 620)
    let width = Math.round(height * COVER_RATIO)
    if (2 * width > viewWidth - 64) {
      width = Math.floor((viewWidth - 64) / 2)
      height = Math.round(width / COVER_RATIO)
    }
    return {
      narrow,
      width,
      height,
      left: Math.round(viewWidth / 2),
      top: Math.round((viewHeight - height) / 2),
      pan: 0,
    }
  }
  const width = viewWidth - 2 * PEEK
  const room = viewHeight - NARROW_TOP - NARROW_BOTTOM
  const height = Math.min(room, Math.round(width / COVER_RATIO))
  return {
    narrow,
    width,
    height,
    left: PEEK + width,
    top: NARROW_TOP + Math.round((room - height) / 2),
    pan: width,
  }
}

function closedRect(layout: Layout): Rect {
  return {
    left: layout.left - layout.pan,
    top: layout.top,
    width: layout.width,
    height: layout.height,
  }
}

function still() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function tween(ms: number, step: (t: number) => void): Promise<void> {
  return new Promise((resolve) => {
    if (still() || ms <= 0) {
      step(1)
      resolve()
      return
    }
    const start = performance.now()
    const frame = (now: number) => {
      const t = Math.min(1, (now - start) / ms)
      step(t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
      if (t < 1) requestAnimationFrame(frame)
      else resolve()
    }
    requestAnimationFrame(frame)
  })
}

function aim(element: HTMLElement | null, camera: Camera, x: number, zoom = 1) {
  camera.x = x
  camera.zoom = zoom
  if (element) element.style.transform = `translateX(${x}px) scale(${zoom})`
}

function glide(element: HTMLElement | null, camera: Camera, to: number, ms: number): Promise<void> {
  const fromX = camera.x
  const fromZoom = camera.zoom
  return tween(ms, (t) =>
    aim(element, camera, fromX + (to - fromX) * t, fromZoom + (1 - fromZoom) * t),
  )
}

function flipFrom(from: Rect, to: Rect) {
  const dx = from.left + from.width / 2 - (to.left + to.width / 2)
  const dy = from.top + from.height / 2 - (to.top + to.height / 2)
  return (
    `translate(${to.width / 2 + dx}px, ${to.height / 2 + dy}px) rotate(${ICON_TILT}deg) ` +
    `scale(${from.width / to.width}, ${from.height / to.height}) translate(${-to.width / 2}px, ${-to.height / 2}px)`
  )
}

function play(
  element: Element | null,
  keyframes: Keyframe[],
  options: { duration: number; delay?: number; easing?: string },
) {
  if (!element) return Promise.resolve()
  return element
    .animate(keyframes, {
      easing: 'cubic-bezier(.2,.7,.2,1)',
      fill: 'both',
      ...options,
      duration: still() ? 0 : options.duration,
      delay: still() ? 0 : (options.delay ?? 0),
    })
    .finished.then(
      () => undefined,
      () => undefined,
    )
}

const FADE_IN: Keyframe[] = [{ opacity: 0 }, { opacity: 1 }]
const FADE_OUT: Keyframe[] = [{ opacity: 1 }, { opacity: 0 }]

function swingLid(
  lid: HTMLElement | null,
  shadeFront: HTMLElement | null,
  shadeBack: HTMLElement | null,
  open: boolean,
) {
  const duration = open ? LID_OPEN_MS : LID_CLOSE_MS
  const half = duration / 2
  const turn: Keyframe[] = [
    { transform: 'translateZ(1px) rotateY(0deg)' },
    { transform: 'translateZ(1px) rotateY(-180deg)' },
  ]
  return Promise.all([
    play(lid, open ? turn : [...turn].reverse(), {
      duration,
      easing: 'cubic-bezier(.55,.05,.3,1)',
    }),
    play(shadeFront, [{ opacity: open ? 0 : 0.45 }, { opacity: open ? 0.45 : 0 }], {
      duration: half,
      delay: open ? 0 : half,
      easing: 'linear',
    }),
    play(shadeBack, [{ opacity: open ? 0.45 : 0 }, { opacity: open ? 0 : 0.45 }], {
      duration: half,
      delay: open ? half : 0,
      easing: 'linear',
    }),
  ])
}

function iconOf() {
  return document.querySelector<HTMLElement>('.bookbtn .leather')
}

function onScreen(element: HTMLElement | null): Rect | null {
  if (!element) return null
  const rect = element.getBoundingClientRect()
  if (rect.width === 0) return null
  const width = element.offsetWidth
  const height = element.offsetHeight
  return {
    left: rect.left + rect.width / 2 - width / 2,
    top: rect.top + rect.height / 2 - height / 2,
    width,
    height,
  }
}

export function LeatherCover({ count }: { count?: number }) {
  return (
    <span className="leather">
      <span className="leather-title">Notizbuch</span>
      <span className="leather-strap" />
      {count !== undefined && <span className="leather-count">{count}</span>}
    </span>
  )
}

function Board({
  state,
  onMark,
}: {
  state: GameState
  onMark: (item: string, crossed: boolean) => void
}) {
  return (
    <div className="nb-board">
      <span className="nb-kicker">Die Tafel</span>
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
    </div>
  )
}

interface CluesProps {
  state: GameState
  index: number
  fresh?: number | null
  endRef?: RefObject<HTMLSpanElement | null>
}

function Clues({ state, index, fresh, endRef }: CluesProps) {
  return (
    <div className="nb-text">
      <div
        className="nb-flow"
        style={{ transform: `translateX(calc(${-index} * (100% + ${PAGE_GAP}px)))` }}
      >
        <h2 className="nb-heading" id={endRef ? 'notebook-title' : undefined}>
          Indizien
        </h2>
        {state.clues.length === 0 && (
          <p className="empty">
            Noch keine Indizien. Löse das erste Rätsel, dann landet hier, was du herausgefunden
            hast.
          </p>
        )}
        {state.clues.map((entry) => (
          <div
            className={`entry${entry.day === fresh ? ' fresh' : ''}`}
            key={entry.day}
            data-day={entry.day}
          >
            <Face who={entry.who} size={36} />
            <small>
              Tag {entry.day} · {NAMES[entry.who]}
            </small>
            <p>
              <span>{entry.clue}</span>
            </p>
          </div>
        ))}
        <span className="nb-end" ref={endRef} />
      </div>
    </div>
  )
}

interface CluePagesProps {
  state: GameState
  pager: RefObject<Pager>
  backRef: RefObject<HTMLDivElement | null>
  fresh?: number | null
}

function CluePages({ state, pager, backRef, fresh }: CluePagesProps) {
  const endRef = useRef<HTMLSpanElement>(null)
  const leafRef = useRef<HTMLDivElement>(null)
  const leafShadeRef = useRef<HTMLDivElement>(null)
  const turning = useRef(false)
  const [index, setIndex] = useState(0)
  const [count, setCount] = useState(1)
  const [leaf, setLeaf] = useState<number | null>(null)

  useLayoutEffect(() => {
    const end = endRef.current
    const flow = end?.parentElement
    if (!end || !flow) return
    const step = flow.clientWidth + PAGE_GAP
    setCount(Math.floor(end.offsetLeft / step) + 1)
    const entry = fresh ? flow.querySelector<HTMLElement>(`[data-day="${fresh}"]`) : null
    if (!entry) return
    setIndex(Math.floor(entry.offsetLeft / step))
  }, [state.clues, fresh])

  useEffect(() => {
    if (!turning.current && backRef.current)
      backRef.current.style.visibility = index > 0 ? 'visible' : 'hidden'
  }, [index, backRef])

  useLayoutEffect(() => {
    const turn = (step: 1 | -1) => {
      const next = index + step
      if (turning.current || next < 0 || next >= count) return false
      turning.current = true
      const half = TURN_MS / 2
      const shade = [{ opacity: 0 }, { opacity: 0.35 }]
      const away = [{ transform: 'rotateY(0deg)' }, { transform: 'rotateY(-90deg)' }]
      const land = [{ transform: 'rotateY(90deg)' }, { transform: 'rotateY(0deg)' }]
      const back = backRef.current
      const settle = () => back?.getAnimations().forEach((animation) => animation.cancel())
      const show = (visible: boolean) => {
        if (back) back.style.visibility = visible ? 'visible' : 'hidden'
      }
      void (async () => {
        if (step === 1) {
          flushSync(() => {
            setLeaf(index)
            setIndex(next)
          })
          await Promise.all([
            play(leafRef.current, away, { duration: half, easing: 'ease-in' }),
            play(leafShadeRef.current, shade, { duration: half, easing: 'ease-in' }),
          ])
          flushSync(() => setLeaf(null))
          show(true)
          await play(back, land, { duration: half, easing: 'ease-out' })
          settle()
        } else {
          await play(back, [...land].reverse(), { duration: half, easing: 'ease-in' })
          show(next > 0)
          settle()
          flushSync(() => setLeaf(next))
          await Promise.all([
            play(leafRef.current, [...away].reverse(), { duration: half, easing: 'ease-out' }),
            play(leafShadeRef.current, [...shade].reverse(), {
              duration: half,
              easing: 'ease-out',
            }),
          ])
          flushSync(() => {
            setIndex(next)
            setLeaf(null)
          })
        }
        turning.current = false
      })()
      return true
    }
    pager.current = { index, count, turn }
  })

  return (
    <>
      <Clues state={state} index={index} fresh={fresh} endRef={endRef} />
      {leaf !== null && (
        <div className="nb-leaf nb-paper" ref={leafRef}>
          <Clues state={state} index={leaf} fresh={fresh} />
          <div className="nb-shade" ref={leafShadeRef} />
        </div>
      )}
      {count > 1 && (
        <nav className="nb-pager">
          <button
            type="button"
            onClick={() => pager.current.turn(-1)}
            disabled={index === 0}
            aria-label="Seite zurück"
          >
            ‹
          </button>
          <span>
            {index + 1} / {count}
          </span>
          <button
            type="button"
            onClick={() => pager.current.turn(1)}
            disabled={index === count - 1}
            aria-label="Seite weiter"
          >
            ›
          </button>
        </nav>
      )}
    </>
  )
}

interface Props {
  state: GameState
  closing: boolean
  onMark: (item: string, crossed: boolean) => void
  onRequestClose: () => void
  onClosed: () => void
  fresh?: number | null
}

export function Notebook({ state, closing, onMark, onRequestClose, onClosed, fresh }: Props) {
  const [layout] = useState(() => layoutFor(window.innerWidth, window.innerHeight))
  const backdropRef = useRef<HTMLDivElement>(null)
  const bookRef = useRef<HTMLDivElement>(null)
  const lidRef = useRef<HTMLDivElement>(null)
  const shadeFrontRef = useRef<HTMLDivElement>(null)
  const shadeBackRef = useRef<HTMLDivElement>(null)
  const pageRef = useRef<HTMLDivElement>(null)
  const flatRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const cameraElRef = useRef<HTMLDivElement>(null)
  const cameraRef = useRef<Camera>({ x: -layout.pan, zoom: 1, page: 1, ready: false })
  const closingRef = useRef(false)
  const pagerRef = useRef<Pager>({ index: 0, count: 1, turn: () => false })
  const backSheetRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    let cancelled = false
    const icon = iconOf()
    const from = onScreen(icon)
    if (icon) icon.style.visibility = 'hidden'
    const animated = [
      backdropRef.current,
      bookRef.current,
      lidRef.current,
      shadeFrontRef.current,
      shadeBackRef.current,
      pageRef.current,
      closeRef.current,
    ]
    const lid = lidRef.current
    const flat = flatRef.current
    const camera = cameraRef.current

    void (async () => {
      void play(closeRef.current, FADE_IN, { duration: 340, delay: 600 })
      await Promise.all([
        play(backdropRef.current, FADE_IN, { duration: 340, easing: 'ease-out' }),
        from
          ? play(
              bookRef.current,
              [{ transform: flipFrom(from, closedRect(layout)) }, { transform: 'none' }],
              { duration: 640 },
            )
          : play(
              bookRef.current,
              [
                { opacity: 0, transform: 'scale(0.94)' },
                { opacity: 1, transform: 'none' },
              ],
              { duration: 420 },
            ),
      ])
      if (cancelled || closingRef.current) return
      void play(pageRef.current, FADE_IN, {
        duration: 450,
        delay: LID_OPEN_MS * 0.35,
        easing: 'ease-out',
      })
      await Promise.all([
        swingLid(lid, shadeFrontRef.current, shadeBackRef.current, true),
        layout.pan ? glide(cameraElRef.current, camera, 0, LID_OPEN_MS) : null,
      ])
      if (cancelled || closingRef.current) return
      if (flat) flat.hidden = false
      if (lid) lid.style.visibility = 'hidden'
      camera.page = 1
      camera.ready = true
      closeRef.current?.focus({ preventScroll: true })
      if (fresh && layout.narrow) {
        camera.page = 2
        await glide(cameraElRef.current, camera, -layout.width, PAGE_GLIDE_MS)
      }
    })()

    return () => {
      cancelled = true
      animated.forEach((element) =>
        element?.getAnimations().forEach((animation) => animation.cancel()),
      )
      if (icon) icon.style.visibility = ''
    }
  }, [layout, fresh])

  useEffect(() => {
    if (!closing) return
    closingRef.current = true
    let cancelled = false
    const lid = lidRef.current
    const camera = cameraRef.current
    camera.ready = false
    if (flatRef.current) flatRef.current.hidden = true
    if (lid) lid.style.visibility = ''

    void (async () => {
      void play(closeRef.current, FADE_OUT, { duration: 150 })
      void play(pageRef.current, FADE_OUT, { duration: 250, easing: 'ease-in' })
      await Promise.all([
        swingLid(lid, shadeFrontRef.current, shadeBackRef.current, false),
        layout.pan ? glide(cameraElRef.current, camera, -layout.pan, LID_CLOSE_MS) : null,
      ])
      if (cancelled) return
      const to = onScreen(iconOf())
      await Promise.all([
        to
          ? play(
              bookRef.current,
              [{ transform: 'none' }, { transform: flipFrom(to, closedRect(layout)) }],
              {
                duration: 540,
                easing: 'cubic-bezier(.5,0,.25,1)',
              },
            )
          : play(
              bookRef.current,
              [
                { opacity: 1, transform: 'none' },
                { opacity: 0, transform: 'scale(0.94)' },
              ],
              { duration: 320 },
            ),
        play(backdropRef.current, FADE_OUT, { duration: 340, delay: 120, easing: 'ease-in' }),
      ])
      if (!cancelled) onClosed()
    })()

    return () => {
      cancelled = true
    }
  }, [closing, layout, onClosed])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !closing) onRequestClose()
      if (layout.narrow) return
      if (event.key === 'ArrowRight') pagerRef.current.turn(1)
      if (event.key === 'ArrowLeft') pagerRef.current.turn(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closing, onRequestClose, layout])

  useEffect(() => {
    if (!layout.narrow) return
    const stage = stageRef.current
    const cameraEl = cameraElRef.current
    const camera = cameraRef.current
    if (!stage) return

    const goTo = (page: 1 | 2) => {
      camera.page = page
      return glide(cameraEl, camera, page === 1 ? 0 : -layout.width, PAGE_GLIDE_MS)
    }
    let swipe: {
      id: number
      x: number
      y: number
      from: number
      moving: boolean
      leaf: 0 | 1 | -1
    } | null = null
    let swallowClicksUntil = 0

    const onDown = (event: PointerEvent) => {
      if (!camera.ready || event.button !== 0) return
      swipe = {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        from: camera.x,
        moving: false,
        leaf: 0,
      }
    }
    const onMove = (event: PointerEvent) => {
      if (!swipe || event.pointerId !== swipe.id) return
      const dx = event.clientX - swipe.x
      const dy = event.clientY - swipe.y
      if (!swipe.moving) {
        if (Math.abs(dx) < SWIPE_START_PX || Math.abs(dx) < Math.abs(dy)) return
        swipe.moving = true
        stage.setPointerCapture(event.pointerId)
        const pager = pagerRef.current
        if (camera.page === 2 && dx < 0 && pager.index < pager.count - 1) swipe.leaf = 1
        if (camera.page === 2 && dx > 0 && pager.index > 0) swipe.leaf = -1
      }
      if (swipe.leaf) return
      aim(cameraEl, camera, Math.min(0, Math.max(-layout.width, swipe.from + dx)), SWIPE_ZOOM)
    }
    const onUp = (event: PointerEvent) => {
      if (!swipe || event.pointerId !== swipe.id) return
      const { from, moving, leaf } = swipe
      swipe = null
      if (!moving) return
      swallowClicksUntil = performance.now() + SWIPE_CLICK_GUARD_MS
      if (leaf) {
        pagerRef.current.turn(leaf)
        return
      }
      const turned = from === 0 ? camera.x < -layout.width * 0.2 : camera.x < -layout.width * 0.8
      void goTo(turned ? 2 : 1)
    }
    const onClick = (event: MouseEvent) => {
      if (performance.now() < swallowClicksUntil) {
        event.preventDefault()
        event.stopPropagation()
        return
      }
      if (!camera.ready || !(event.target instanceof Element)) return
      const onHiddenPage =
        (camera.page === 1 && event.target.closest('.nb-page')) ||
        (camera.page === 2 && event.target.closest('.nb-flat'))
      if (!onHiddenPage) return
      event.preventDefault()
      event.stopPropagation()
      void goTo(camera.page === 1 ? 2 : 1)
    }
    const onKey = (event: KeyboardEvent) => {
      if (!camera.ready) return
      if (event.key === 'ArrowRight' && camera.page === 1) void goTo(2)
      else if (event.key === 'ArrowRight') pagerRef.current.turn(1)
      if (event.key === 'ArrowLeft' && camera.page === 2 && !pagerRef.current.turn(-1)) void goTo(1)
    }

    stage.addEventListener('pointerdown', onDown)
    stage.addEventListener('pointermove', onMove)
    stage.addEventListener('pointerup', onUp)
    stage.addEventListener('pointercancel', onUp)
    stage.addEventListener('click', onClick, true)
    window.addEventListener('keydown', onKey)
    return () => {
      stage.removeEventListener('pointerdown', onDown)
      stage.removeEventListener('pointermove', onMove)
      stage.removeEventListener('pointerup', onUp)
      stage.removeEventListener('pointercancel', onUp)
      stage.removeEventListener('click', onClick, true)
      window.removeEventListener('keydown', onKey)
    }
  }, [layout])

  const requestClose = () => {
    if (!closing) onRequestClose()
  }

  const stage: CSSProperties = {
    left: layout.left,
    top: layout.top,
    width: layout.width,
    height: layout.height,
  }

  return (
    <div
      className={`nb${layout.narrow ? ' is-narrow' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="notebook-title"
    >
      <div className="nb-backdrop" ref={backdropRef} onClick={requestClose} />
      <div
        className="nb-camera"
        ref={cameraElRef}
        style={{ transform: `translateX(${-layout.pan}px)` }}
      >
        <div className="nb-stage" style={stage} ref={stageRef}>
          <div className="nb-book" ref={bookRef}>
            <section className="nb-page nb-paper">
              <div className="nb-scroll" ref={pageRef}>
                <CluePages state={state} pager={pagerRef} backRef={backSheetRef} fresh={fresh} />
              </div>
            </section>
            <div className="nb-lid" ref={lidRef}>
              <div className="nb-front">
                <LeatherCover />
                <div className="nb-shade" ref={shadeFrontRef} />
              </div>
              <div className="nb-back" inert>
                <Board state={state} onMark={onMark} />
                <div className="nb-shade" ref={shadeBackRef} />
              </div>
            </div>
          </div>
          <div className="nb-flat" ref={flatRef} hidden>
            <div className="nb-back nb-flat-face">
              <Board state={state} onMark={onMark} />
            </div>
            <div className="nb-backsheet" ref={backSheetRef} />
          </div>
        </div>
      </div>
      <button
        type="button"
        className="nb-close"
        ref={closeRef}
        onClick={requestClose}
        aria-label="Schließen"
      >
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path
            d="M3 3l10 10M13 3L3 13"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  )
}
