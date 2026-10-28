import { findFamily, rest, type Player } from './_lib/db'
import { body, json, refuse } from './_lib/http'

export const config = { runtime: 'edge' }

export default async function handler(request: Request) {
  if (request.method !== 'POST') return refuse('Nur POST', 405)
  const { code, nickname } = await body(request)
  const family = await findFamily(code)
  if (!family) return refuse('Diesen Familien-Link gibt es nicht.', 404)
  const name = typeof nickname === 'string' ? nickname.trim() : ''
  if (name.length < 1 || name.length > 30) return refuse('Der Spitzname braucht 1 bis 30 Zeichen.')

  const [player] = await rest<Player[]>(
    'players?on_conflict=family_id,nickname&select=id,nickname,family_id',
    { method: 'POST', body: JSON.stringify({ family_id: family.id, nickname: name }) },
    'resolution=merge-duplicates,return=representation',
  )
  return json({ player: { id: player.id, nickname: player.nickname }, family: { name: family.name } })
}
