import type { View } from './types'

const PREFIX = 'adventskalender-player-'
const PLACE_PREFIX = 'adventskalender-place-'

interface Place {
  view: View
  selected: number | null
}

const START: Place = { view: { kind: 'map' }, selected: null }

function isDay(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 24
}

export function storedPlace(code: string | null): Place {
  if (!code) return START
  try {
    const raw: unknown = JSON.parse(sessionStorage.getItem(PLACE_PREFIX + code) ?? 'null')
    if (!raw || typeof raw !== 'object' || !('view' in raw) || !('selected' in raw)) return START
    const selected = isDay(raw.selected) ? raw.selected : null
    const view = raw.view
    if (view && typeof view === 'object' && 'kind' in view) {
      if (view.kind === 'day' && 'day' in view && isDay(view.day) && view.day > 0)
        return { view: { kind: 'day', day: view.day }, selected }
      if (view.kind === 'prolog') return { view: { kind: 'prolog' }, selected }
    }
    return { view: { kind: 'map' }, selected }
  } catch {
    return START
  }
}

export function storePlace(code: string, place: Place) {
  try {
    sessionStorage.setItem(PLACE_PREFIX + code, JSON.stringify(place))
  } catch {
    return
  }
}

export function familyCode() {
  return window.location.pathname.match(/^\/f\/([A-Za-z0-9_-]{10,64})/)?.[1] ?? null
}

export function storedPlayer(code: string) {
  try {
    return localStorage.getItem(PREFIX + code)
  } catch {
    return null
  }
}

export function storePlayer(code: string, playerId: string | null) {
  try {
    if (playerId) localStorage.setItem(PREFIX + code, playerId)
    else localStorage.removeItem(PREFIX + code)
  } catch {
    return
  }
}
