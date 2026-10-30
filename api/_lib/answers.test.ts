import { describe, expect, it } from 'vitest'
import { BOARD } from '../../content/constants'
import { DAYS } from '../../content/days'
import { isCorrect, trapFor } from './answers'

describe('the 24 days', () => {
  it('has exactly 24 days, each with three hints', () => {
    expect(DAYS).toHaveLength(24)
    DAYS.forEach((day) => expect(day.hints).toHaveLength(3))
  })

  it.each(DAYS.map((day, index) => [index + 1, day] as const))(
    'accepts the intended answer of day %i',
    (_, day) => {
      const intended = day.accept?.[0] ?? day.contains?.[0]
      expect(intended).toBeDefined()
      expect(isCorrect(day, intended ?? '')).toBe(true)
    },
  )

  it('only strikes items that are on the board', () => {
    const items = new Set<string>([...BOARD.wer, ...BOARD.wo, ...BOARD.warum])
    DAYS.flatMap((day) => day.strike).forEach((item) => expect(items.has(item)).toBe(true))
  })

  it('leaves exactly Rudolph, the Eissee and Angst after all clues', () => {
    const struck = new Set(DAYS.flatMap((day) => day.strike))
    expect(BOARD.wer.filter((item) => !struck.has(item))).toEqual(['Rudolph'])
    expect(BOARD.wo.filter((item) => !struck.has(item))).toEqual(['Eissee'])
    expect(BOARD.warum.filter((item) => !struck.has(item))).toEqual(['Angst'])
  })
})

describe('answer matching', () => {
  it('ignores case, umlauts, spaces and a leading article', () => {
    expect(isCorrect(DAYS[6], 'Ein Tannenbaum')).toBe(true)
    expect(isCorrect(DAYS[22], 'Ich wollte üben')).toBe(true)
    expect(isCorrect(DAYS[2], 'das Geschirr')).toBe(true)
  })

  it('reads the mirrored clock only the right way round', () => {
    expect(isCorrect(DAYS[10], '2:10')).toBe(true)
    expect(isCorrect(DAYS[10], '9:50')).toBe(false)
    expect(trapFor(DAYS[10], '9:50')).toContain('Ziffernblatt')
  })

  it('accepts the floe path and the final accusation in the form the widgets send', () => {
    expect(isCorrect(DAYS[21], '9,13,18')).toBe(true)
    expect(isCorrect(DAYS[23], 'Rudolph Eissee Angst')).toBe(true)
    expect(isCorrect(DAYS[23], 'Komet Eissee Angst')).toBe(false)
  })
})
