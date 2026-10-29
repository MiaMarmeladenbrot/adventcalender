import { rest } from './db'

export interface Member {
  id: string
  nickname: string
}

export function familyInJoinOrder(familyId: string) {
  return rest<Member[]>(`players?select=id,nickname&family_id=eq.${familyId}&order=created_at.asc,id.asc`)
}

export function shareOut<T>(halves: T[], members: Member[], playerId: string, day: number) {
  const slot = (position: number) => (position + day) % halves.length
  const mine = slot(Math.max(0, members.findIndex((member) => member.id === playerId)))
  const partners = members.filter((_, position) => slot(position) !== mine).map((member) => member.nickname)
  if (partners.length === 0) return { halves, partners }
  return { halves: [halves[mine]], partners }
}
