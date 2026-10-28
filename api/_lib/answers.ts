import type { Day } from '../../content/types'

export function normalize(raw: string) {
  return raw
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]/g, '')
}

export function isCorrect(day: Day, raw: string) {
  const answer = normalize(raw)
  const withoutArticle = answer.replace(/^(eine|ein|der|die|das|im|auf)(?=[a-z0-9])/, '')
  if (day.accept?.includes(answer) || day.accept?.includes(withoutArticle)) return true
  return day.contains?.some((part) => answer.includes(part)) ?? false
}

export function trapFor(day: Day, raw: string) {
  return day.traps?.[normalize(raw)] ?? null
}
