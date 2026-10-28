import { BOARD } from '../content/constants'
import { findPlayer, rest } from './_lib/db'
import { body, json, refuse } from './_lib/http'

export const config = { runtime: 'edge' }

const ITEMS = new Set<string>([...BOARD.wer, ...BOARD.wo, ...BOARD.warum])

export default async function handler(request: Request) {
  if (request.method !== 'POST') return refuse('Nur POST', 405)
  const input = await body(request)
  const player = await findPlayer(input.code, input.player)
  if (!player) return refuse('Unbekannt. Bitte den Familien-Link neu öffnen.', 404)
  if (typeof input.item !== 'string' || !ITEMS.has(input.item)) return refuse('Unbekannter Eintrag.')

  await rest(
    'board_marks?on_conflict=player_id,item',
    {
      method: 'POST',
      body: JSON.stringify({ player_id: player.id, item: input.item, crossed: input.crossed === true }),
    },
    'resolution=merge-duplicates',
  )
  return json({ ok: true })
}
