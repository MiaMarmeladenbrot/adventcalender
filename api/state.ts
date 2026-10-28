import { DAYS } from '../content/days'
import { findFamily, findPlayer, rest } from './_lib/db'
import { json, refuse, safely } from './_lib/http'
import { solvedDays } from './_lib/progress'
import { isPreview, unlockedThrough } from './_lib/unlock'

export const config = { runtime: 'edge' }

export default safely(async (request) => {
  const parameters = new URL(request.url).searchParams
  const code = parameters.get('code')
  const player = await findPlayer(code, parameters.get('player'))
  const family = await findFamily(code)
  if (!player || !family) return refuse('Unbekannt. Bitte den Familien-Link neu öffnen.', 404)

  const [solved, hints, marks, team] = await Promise.all([
    solvedDays(player.id),
    rest<{ day: number; level: number }[]>(`hints_taken?select=day,level&player_id=eq.${player.id}`),
    rest<{ item: string; crossed: boolean }[]>(
      `board_marks?select=item,crossed&player_id=eq.${player.id}`,
    ),
    rest<{ nickname: string; solves: { day: number }[] }[]>(
      `players?select=nickname,solves(day)&family_id=eq.${family.id}&order=created_at`,
    ),
  ])

  const unlocked = unlockedThrough(new Date(), isPreview(request))
  return json({
    me: { id: player.id, nickname: player.nickname },
    family: {
      name: family.name,
      finalMessage: solved.includes(24) ? family.final_message : null,
      finalMediaUrl: solved.includes(24) ? family.final_media_url : null,
    },
    unlocked,
    doors: DAYS.slice(0, unlocked).map((day, index) => ({ day: index + 1, who: day.who, title: day.title })),
    solved,
    clues: [...solved]
      .sort((a, b) => a - b)
      .map((day) => ({ day, who: DAYS[day - 1].who, clue: DAYS[day - 1].clue })),
    hints: Object.fromEntries(hints.map((row) => [row.day, row.level])),
    marks: Object.fromEntries(marks.map((row) => [row.item, row.crossed])),
    team: team.map((member) => ({
      nickname: member.nickname,
      solved: member.solves.length,
      furthest: Math.max(0, ...member.solves.map((solve) => solve.day)),
    })),
  })
})
