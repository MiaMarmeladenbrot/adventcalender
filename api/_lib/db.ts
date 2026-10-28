const SCHEMA = 'adventskalender'
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const JOIN_CODE = /^[A-Za-z0-9_-]{10,64}$/

function env(name: string) {
  const value = process.env[name]
  if (!value) throw new Error(`${name} fehlt in den Umgebungsvariablen.`)
  return value
}

export async function rest<T>(path: string, init: RequestInit = {}, prefer?: string): Promise<T> {
  const key = env('SUPABASE_SERVICE_ROLE_KEY')
  const base = env('SUPABASE_URL').replace(/\/?$/, '/')
  const response = await fetch(new URL(`rest/v1/${path}`, base), {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Accept-Profile': SCHEMA,
      'Content-Profile': SCHEMA,
      'Content-Type': 'application/json',
      ...(prefer ? { Prefer: prefer } : {}),
    },
  })
  if (!response.ok) throw new Error(`Supabase ${response.status}: ${await response.text()}`)
  const text = await response.text()
  return (text ? JSON.parse(text) : null) as T
}

export interface Family {
  id: string
  name: string
  final_message: string | null
  final_media_url: string | null
}

export interface Player {
  id: string
  nickname: string
  family_id: string
}

export async function findFamily(code: unknown): Promise<Family | null> {
  if (typeof code !== 'string' || !JOIN_CODE.test(code)) return null
  const rows = await rest<Family[]>(
    `families?select=id,name,final_message,final_media_url&join_code=eq.${code}`,
  )
  return rows[0] ?? null
}

export async function findPlayer(code: unknown, playerId: unknown): Promise<Player | null> {
  if (typeof code !== 'string' || !JOIN_CODE.test(code)) return null
  if (typeof playerId !== 'string' || !UUID.test(playerId)) return null
  const rows = await rest<(Player & { family: unknown })[]>(
    `players?select=id,nickname,family_id,family:families!inner(join_code)&id=eq.${playerId}&family.join_code=eq.${code}`,
  )
  const row = rows[0]
  return row ? { id: row.id, nickname: row.nickname, family_id: row.family_id } : null
}
