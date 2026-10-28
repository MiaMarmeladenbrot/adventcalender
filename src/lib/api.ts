import type { AnswerResponse, DayResponse, GameState } from './types'

const PREVIEW_KEY = 'adventskalender-preview'

export function rememberPreviewToken() {
  const token = new URLSearchParams(window.location.search).get('preview')
  if (!token) return
  try {
    localStorage.setItem(PREVIEW_KEY, token)
  } catch {
    return
  }
}

function headers() {
  const result: Record<string, string> = { 'Content-Type': 'application/json' }
  try {
    const token = localStorage.getItem(PREVIEW_KEY)
    if (token) result['x-preview'] = token
  } catch {
    return result
  }
  return result
}

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(path, { ...init, headers: headers() })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.error ?? `Fehler ${response.status}`)
  return data as T
}

function post<T>(path: string, payload: Record<string, unknown>) {
  return call<T>(path, { method: 'POST', body: JSON.stringify(payload) })
}

export const api = {
  join: (code: string, nickname: string) =>
    post<{ player: { id: string; nickname: string } }>('/api/join', { code, nickname }),
  state: (code: string, player: string) =>
    call<GameState>(`/api/state?code=${code}&player=${player}`),
  day: (code: string, player: string, day: number) =>
    call<DayResponse>(`/api/day?code=${code}&player=${player}&day=${day}`),
  answer: (code: string, player: string, day: number, answer: string) =>
    post<AnswerResponse>('/api/answer', { code, player, day, answer }),
  hint: (code: string, player: string, day: number) =>
    post<{ hints: string[] }>('/api/hint', { code, player, day }),
  mark: (code: string, player: string, item: string, crossed: boolean) =>
    post<{ ok: boolean }>('/api/mark', { code, player, item, crossed }),
}
