import { DAYS } from '../content/days'
import { findPlayer, rest } from './_lib/db'
import { body, dayNumber, json, refuse, safely } from './_lib/http'
import { hintLevel } from './_lib/progress'
import { isPreview, unlockedThrough } from './_lib/unlock'

export const config = { runtime: 'edge' }

export default safely(async (request) => {
  if (request.method !== 'POST') return refuse('Nur POST', 405)
  const input = await body(request)
  const player = await findPlayer(input.code, input.player)
  if (!player) return refuse('Unbekannt. Bitte den Familien-Link neu öffnen.', 404)
  const number = dayNumber(input.day)
  if (!number) return refuse('Diesen Tag gibt es nicht.')
  if (number > unlockedThrough(new Date(), isPreview(request))) {
    return refuse('Diese Tür ist noch verschlossen.', 403)
  }

  const level = Math.min(3, (await hintLevel(player.id, number)) + 1)
  await rest(
    'hints_taken?on_conflict=player_id,day',
    { method: 'POST', body: JSON.stringify({ player_id: player.id, day: number, level }) },
    'resolution=merge-duplicates',
  )
  return json({ hints: DAYS[number - 1].hints.slice(0, level) })
})
