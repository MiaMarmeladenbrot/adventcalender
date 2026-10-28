export type Who =
  | 'santa'
  | 'mrs'
  | 'elf'
  | 'twins'
  | 'rudolph'
  | 'komet'
  | 'grinch'
  | 'snowman'
  | 'ginger'
  | 'penguin'
  | 'bear'

export type Line = readonly [Who, string]

export type Widget =
  | { kind: 'morse'; signal: string }
  | { kind: 'memory'; items: string[] }
  | { kind: 'torch'; digits: { digit: string; left: number; top: number }[] }
  | { kind: 'bells'; bells: { name: string; notes: number[] }[]; recording: number[] }
  | { kind: 'floes'; grid: number[][]; start: [number, number][] }
  | { kind: 'final' }

export interface Day {
  who: Who
  title: string
  special?: boolean
  intro: Line[]
  puzzle: string
  halves?: { name: string; html: string }[]
  widget?: Widget
  accept?: string[]
  contains?: string[]
  traps?: Record<string, string>
  hints: [string, string, string]
  solution: string
  reply: Line
  clue: string
  strike: string[]
}

export type PublicDay = Pick<Day, 'who' | 'title' | 'special' | 'intro' | 'puzzle' | 'halves' | 'widget'> & {
  day: number
}

export interface Solved {
  reply: Line
  clue: string
  strike: string[]
}
