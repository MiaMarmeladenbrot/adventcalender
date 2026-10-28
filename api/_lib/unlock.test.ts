import { describe, expect, it } from 'vitest'
import { unlockedThrough } from './unlock'

describe('unlockedThrough', () => {
  it('keeps every door shut in November', () => {
    expect(unlockedThrough(new Date('2026-11-30T20:00:00Z'), false)).toBe(0)
  })

  it('opens a door at six in the morning Berlin time', () => {
    expect(unlockedThrough(new Date('2026-12-01T04:59:00Z'), false)).toBe(0)
    expect(unlockedThrough(new Date('2026-12-01T05:00:00Z'), false)).toBe(1)
    expect(unlockedThrough(new Date('2026-12-13T12:00:00Z'), false)).toBe(13)
  })

  it('keeps all doors open from Christmas Eve on', () => {
    expect(unlockedThrough(new Date('2026-12-24T05:00:00Z'), false)).toBe(24)
    expect(unlockedThrough(new Date('2026-12-31T12:00:00Z'), false)).toBe(24)
    expect(unlockedThrough(new Date('2027-01-05T12:00:00Z'), false)).toBe(24)
  })

  it('opens everything in preview mode', () => {
    expect(unlockedThrough(new Date('2026-10-28T12:00:00Z'), true)).toBe(24)
  })
})
