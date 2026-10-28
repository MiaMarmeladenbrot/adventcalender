const PREFIX = 'adventskalender-player-'

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
