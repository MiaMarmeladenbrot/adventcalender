import { DAYS } from '../content/days'
import { findPlayer, rest } from './_lib/db'
import { isCorrect, trapFor } from './_lib/answers'
import { body, dayNumber, json, refuse, safely } from './_lib/http'
import { crossOut } from './_lib/progress'
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

  const day = DAYS[number - 1]
  const answer = typeof input.answer === 'string' ? input.answer : ''
  if (!isCorrect(day, answer)) {
    return json({ correct: false, message: trapFor(day, answer) })
  }

  await rest(
    'solves?on_conflict=player_id,day',
    { method: 'POST', body: JSON.stringify({ player_id: player.id, day: number }) },
    'resolution=ignore-duplicates',
  )
  await crossOut(player.id, day.strike)
  return json({ correct: true, solved: { reply: day.reply, clue: day.clue, strike: day.strike } })
})
