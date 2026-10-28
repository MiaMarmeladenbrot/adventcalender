import { DAY_COUNT, SEASON_YEAR, TIME_ZONE, UNLOCK_HOUR } from '../../content/constants'

function berlinParts(now: Date) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(now)
  const pick = (type: string) => Number(parts.find((part) => part.type === type)?.value)
  return { year: pick('year'), month: pick('month'), day: pick('day'), hour: pick('hour') }
}

export function unlockedThrough(now: Date, preview: boolean) {
  if (preview) return DAY_COUNT
  const { year, month, day, hour } = berlinParts(now)
  if (year > SEASON_YEAR) return DAY_COUNT
  if (year < SEASON_YEAR || month < 12) return 0
  const reached = hour >= UNLOCK_HOUR ? day : day - 1
  return Math.max(0, Math.min(DAY_COUNT, reached))
}

export function isPreview(request: Request) {
  const token = process.env.PREVIEW_TOKEN
  return Boolean(token) && request.headers.get('x-preview') === token
}
