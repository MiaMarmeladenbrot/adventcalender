import { DAYS } from '../content/days'
import type { PublicDay } from '../content/types'
import { findPlayer } from './_lib/db'
import { dayNumber, json, refuse, safely } from './_lib/http'
import { hintLevel, solvedDays } from './_lib/progress'
import { isPreview, unlockedThrough } from './_lib/unlock'

export const config = { runtime: 'edge' }

export default safely(async (request) => {
  const parameters = new URL(request.url).searchParams
  const player = await findPlayer(parameters.get('code'), parameters.get('player'))
  if (!player) return refuse('Unbekannt. Bitte den Familien-Link neu öffnen.', 404)
  const number = dayNumber(parameters.get('day'))
  if (!number) return refuse('Diesen Tag gibt es nicht.')
  if (number > unlockedThrough(new Date(), isPreview(request))) {
    return refuse('Diese Tür ist noch verschlossen.', 403)
  }

  const day = DAYS[number - 1]
  const [solved, level] = await Promise.all([solvedDays(player.id), hintLevel(player.id, number)])
  const view: PublicDay = {
    day: number,
    who: day.who,
    title: day.title,
    special: day.special,
    intro: day.intro,
    puzzle: day.puzzle,
    halves: day.halves,
    widget: day.widget,
  }
  return json({
    day: view,
    hints: day.hints.slice(0, level),
    solved: solved.includes(number)
      ? { reply: day.reply, clue: day.clue, strike: day.strike }
      : null,
  })
})
