import type { Who } from './types'

export const SEASON_YEAR = 2026
export const UNLOCK_HOUR = 6
export const TIME_ZONE = 'Europe/Berlin'
export const DAY_COUNT = 24

export const NAMES: Record<Who, string> = {
  santa: 'Weihnachtsmann',
  mrs: 'Weihnachtsfrau',
  elf: 'Oberelf Knöpfchen',
  twins: 'Zimt & Zucker',
  rudolph: 'Rudolph',
  komet: 'Komet',
  grinch: 'Grinch',
  snowman: 'Schneemann Flocke',
  ginger: 'Lebkuchenmann',
  penguin: 'Pinguin Pedro',
  bear: 'Eisbärin Berta',
}

export const BOARD = {
  wer: ['Grinch', 'Rudolph', 'Komet', 'Zimt & Zucker', 'Pinguin Pedro', 'Schneemann'],
  wo: ['Werkstatt', 'Rentierstall', 'Eissee', 'Bäckerei', 'Polarlicht-Gipfel'],
  warum: ['Rache', 'Neid', 'Überraschung', 'Versehen', 'Angst'],
} as const

export const PROLOG: readonly (readonly [Who, string])[] = [
  [
    'santa',
    'Ho ho ho! Schön, dass du da bist. Ich hab ein Problem. Ein großes. Ein schlittengroßes.',
  ],
  ['mrs', 'Mehr erfährst du morgen früh. Bis dahin nur eins: Wie dürfen wir dich nennen?'],
]
