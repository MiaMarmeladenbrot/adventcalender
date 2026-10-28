import { rest } from './db'

export async function solvedDays(playerId: string) {
  const rows = await rest<{ day: number }[]>(`solves?select=day&player_id=eq.${playerId}`)
  return rows.map((row) => row.day)
}

export async function hintLevel(playerId: string, day: number) {
  const rows = await rest<{ level: number }[]>(
    `hints_taken?select=level&player_id=eq.${playerId}&day=eq.${day}`,
  )
  return rows[0]?.level ?? 0
}

export async function crossOut(playerId: string, items: string[]) {
  if (items.length === 0) return
  await rest(
    'board_marks?on_conflict=player_id,item',
    {
      method: 'POST',
      body: JSON.stringify(items.map((item) => ({ player_id: playerId, item, crossed: true }))),
    },
    'resolution=merge-duplicates',
  )
}
