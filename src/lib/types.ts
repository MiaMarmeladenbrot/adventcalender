import type { Line, PublicDay, Solved, Who } from '../../content/types'

export type { Line, PublicDay, Solved, Who }

export interface GameState {
  me: { id: string; nickname: string }
  family: { name: string; finalMessage: string | null; finalMediaUrl: string | null }
  unlocked: number
  doors: { day: number; who: Who; title: string }[]
  solved: number[]
  clues: { day: number; who: Who; clue: string }[]
  hints: Record<number, number>
  marks: Record<string, boolean>
  team: { nickname: string; solved: number; furthest: number }[]
}

export interface DayResponse {
  day: PublicDay
  hints: string[]
  solved: Solved | null
}

export interface AnswerResponse {
  correct: boolean
  message?: string | null
  solved?: Solved
}

export type View = { kind: 'map' } | { kind: 'prolog' } | { kind: 'day'; day: number } | { kind: 'book' }
