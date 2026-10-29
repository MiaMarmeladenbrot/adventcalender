import { describe, expect, it } from 'vitest'
import { shareOut } from './team'

const HALVES = ['Zimt', 'Zucker']
const FAMILY = [
  { id: 'a', nickname: 'Anna' },
  { id: 'b', nickname: 'Ben' },
  { id: 'c', nickname: 'Cleo' },
]

describe('shareOut', () => {
  it('gives each player one half and names who holds the other', () => {
    expect(shareOut(HALVES, FAMILY, 'a', 4)).toEqual({ halves: ['Zimt'], partners: ['Ben'] })
    expect(shareOut(HALVES, FAMILY, 'b', 4)).toEqual({ halves: ['Zucker'], partners: ['Anna', 'Cleo'] })
    expect(shareOut(HALVES, FAMILY, 'c', 4)).toEqual({ halves: ['Zimt'], partners: ['Ben'] })
  })

  it('swaps the halves from one team day to the next', () => {
    expect(shareOut(HALVES, FAMILY, 'a', 4).halves).toEqual(['Zimt'])
    expect(shareOut(HALVES, FAMILY, 'a', 5).halves).toEqual(['Zucker'])
  })

  it('shows both halves to a player who has nobody to swap with', () => {
    expect(shareOut(HALVES, [FAMILY[0]], 'a', 4)).toEqual({ halves: HALVES, partners: [] })
  })
})
