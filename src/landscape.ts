export const TRAIL_END = 2520
export const SHORE_X = 2500
export const WORLD_WIDTH = 3060
export const START_X = 270
export const LANTERN_GAP = (TRAIL_END - START_X - 90) / 23

export interface Place {
  name: string
  art: keyof typeof PLACE_ART
  from: number
  to: number
}

export const PLACES: Place[] = [
  { name: 'Rentierstall', art: 'stall', from: 1, to: 6 },
  { name: 'Lebkuchenbäckerei', art: 'bake', from: 7, to: 12 },
  { name: 'Eistor', art: 'gate', from: 13, to: 17 },
  { name: 'Polarlicht-Gipfel', art: 'peak', from: 18, to: 21 },
  { name: 'Eissee', art: 'lake', from: 22, to: 24 },
]

export function lanternX(day: number) {
  return START_X + (day - 1) * LANTERN_GAP
}

export function lanternY(day: number) {
  return 140 + 14 * Math.sin(day * 1.1)
}

export function placeX(place: Place) {
  return (lanternX(place.from) + lanternX(place.to)) / 2
}

export function placeOf(day: number) {
  return PLACES.find((place) => day >= place.from && day <= place.to) ?? PLACES[0]
}

function seeded(seed: number) {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let mixed = Math.imul(state ^ (state >>> 15), 1 | state)
    mixed = (mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed)) ^ mixed
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296
  }
}

export const RIDGE: [number, number][] = [
  [0, 60],
  [6, 30],
  [12, 55],
  [20, 8],
  [28, 50],
  [35, 35],
  [42, 62],
  [50, 14],
  [58, 48],
  [66, 26],
  [74, 58],
  [82, 18],
  [90, 52],
  [100, 30],
]

const random = seeded(24)

export const STARS = Array.from({ length: 320 }, () => {
  const bright = random() < 0.08
  return {
    x: random() * 100,
    y: Math.pow(random(), 1.4) * 100,
    r: bright ? 1.3 + random() * 0.6 : 0.5 + random() * 0.7,
    opacity: bright ? 1 : 0.35 + random() * 0.55,
    twinkle: bright || random() < 0.06,
    delay: random() * 4,
  }
})

const SKY_STOPS: [number, string][] = [
  [0, '#f1b48f'],
  [0.14, '#c49bb0'],
  [0.3, '#8394c4'],
  [0.52, '#3a4c86'],
  [0.76, '#16224a'],
  [1, '#0a1230'],
]

function channels(hex: string) {
  return [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16))
}

export function skyAt(day: number) {
  const position = lanternX(day) / WORLD_WIDTH
  const upper = SKY_STOPS.findIndex(([stop]) => stop >= position)
  const [toStop, toColour] = SKY_STOPS[Math.max(upper, 1)]
  const [fromStop, fromColour] = SKY_STOPS[Math.max(upper, 1) - 1]
  const share = Math.min(1, Math.max(0, (position - fromStop) / (toStop - fromStop)))
  const from = channels(fromColour)
  const to = channels(toColour)
  return `rgb(${from.map((value, index) => Math.round(value + (to[index] - value) * share)).join(',')})`
}

const SNOW = '#f5f8fb'
const LIGHT = '#ffd27a'
const ICING = '#fffaf0'
const PINE = '#2b5a46'

const paper = (inner: string) => `<g filter="url(#pc)">${inner}</g>`

const drift = `<path d="M2 97 Q18 88 38 93 Q60 88 82 93 Q102 88 118 97 Q60 101 2 97Z" fill="${SNOW}"/>`

const glow = (x: number, y: number) =>
  `<circle cx="${x}" cy="${y}" r="8" fill="${LIGHT}" opacity=".28"/><circle cx="${x}" cy="${y}" r="3" fill="${LIGHT}"/>`

export const PLACE_ART = {
  stall:
    paper('<path d="M18 50 H102 V95 H18Z" fill="#9e2b25"/>') +
    '<path d="M30 54 V95 M90 54 V95" stroke="#86221d" stroke-width="1.5"/>' +
    paper('<path d="M12 54 L26 30 L60 16 L94 30 L108 54Z" fill="#5a2a20"/>') +
    paper(`<path d="M8 54 L24 27 L60 12 L96 27 L112 54 Q107 59 102 54 L92 34 L60 21 L28 34 L18 54 Q13 59 8 54Z" fill="${SNOW}"/>`) +
    paper(`<path d="M52 30 H68 V46 H52Z" fill="${LIGHT}"/>`) +
    '<path d="M60 30 V46" stroke="#5a2a20" stroke-width="2"/>' +
    paper('<path d="M42 95 V62 H78 V95Z" fill="#5a1a16"/>') +
    `<path d="M42 62 H78 V95 M42 62 V95 M42 62 L78 95 M78 62 L42 95" stroke="${SNOW}" stroke-width="2.5" fill="none"/>` +
    glow(32, 66) +
    glow(88, 66) +
    drift,
  bake:
    paper('<path d="M82 14 H92 V36 H82Z" fill="#8a5426"/>') +
    `<g fill="#ffffff" opacity=".6"><circle cx="88" cy="8" r="3.5"/><circle cx="93" cy="3" r="4"/></g>` +
    paper('<path d="M20 48 H100 V95 H20Z" fill="#c4834a"/>') +
    paper('<path d="M8 52 L60 12 L112 52Z" fill="#7a4520"/>') +
    paper(
      `<path d="M6 50 H114 V53 Q108 60 102 53 Q96 60 90 53 Q84 60 78 53 Q72 60 66 53 Q60 60 54 53 Q48 60 42 53 Q36 60 30 53 Q24 60 18 53 Q12 60 6 53Z" fill="${ICING}"/>`,
    ) +
    `<path d="M8 51 L60 12 L112 51" stroke="${ICING}" stroke-width="4" fill="none" stroke-linejoin="round"/>` +
    '<circle cx="40" cy="38" r="3.5" fill="#e53935"/><circle cx="80" cy="38" r="3.5" fill="#e53935"/><circle cx="51" cy="28" r="3" fill="#2e7d4f"/><circle cx="69" cy="28" r="3" fill="#2e7d4f"/>' +
    paper(`<circle cx="60" cy="38" r="6" fill="${LIGHT}"/>`) +
    paper(`<circle cx="38" cy="70" r="8" fill="${LIGHT}"/><circle cx="82" cy="70" r="8" fill="${LIGHT}"/>`) +
    `<g stroke="${ICING}" stroke-width="2.5" fill="none"><circle cx="38" cy="70" r="8"/><circle cx="82" cy="70" r="8"/><path d="M38 62 V78 M30 70 H46 M82 62 V78 M74 70 H90"/></g>` +
    paper('<path d="M52 95 V79 Q60 70 68 79 V95Z" fill="#5a3418"/>') +
    `<path d="M52 95 V79 Q60 70 68 79 V95" stroke="${ICING}" stroke-width="2" fill="none"/>` +
    `<path d="M24 92 l4 -5 l4 5 l4 -5 l4 5 M80 92 l4 -5 l4 5 l4 -5 l4 5" stroke="${ICING}" stroke-width="2" fill="none" stroke-linejoin="round"/>` +
    paper(`<path d="M107 95 V74 Q107 67 101 67 Q95 67 95 73" stroke="${ICING}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`) +
    '<path d="M107 95 V74 Q107 67 101 67 Q95 67 95 73" stroke="#c62828" stroke-width="4.5" stroke-dasharray="3 3" fill="none"/>' +
    drift,
  gate:
    paper(
      '<path d="M12 95 V44 Q12 8 60 8 Q108 8 108 44 V95 H86 V50 Q86 28 60 28 Q34 28 34 50 V95Z" fill="#cfeaf7"/>',
    ) +
    '<path d="M12 72 H34 M86 72 H108 M12 50 H34 M86 50 H108 M16 28 L36 38 M104 28 L84 38 M60 8 V28 M38 13 L45 30 M82 13 L75 30" stroke="#8cc3dc" stroke-width="1.5"/>' +
    '<path d="M18 92 V46 Q18 18 50 13" stroke="#ffffff" stroke-width="3" fill="none" opacity=".75" stroke-linecap="round"/>' +
    '<path d="M38 40 L41 50 L44 40Z M48 32 L51 45 L54 32Z M58 29 L61 40 L64 29Z M68 31 L71 43 L74 31Z M78 37 L80 46 L82 37Z" fill="#e8f6fc" stroke="#8cc3dc" stroke-width=".8"/>' +
    paper(`<path d="M12 42 Q12 4 60 4 Q108 4 108 42 Q103 34 98 38 Q92 13 60 11 Q28 13 22 38 Q17 34 12 42Z" fill="${SNOW}"/>`) +
    '<path d="M100 54 l1.5 4 l4 1.5 l-4 1.5 l-1.5 4 l-1.5 -4 l-4 -1.5 l4 -1.5Z M22 60 l1.2 3 l3 1.2 l-3 1.2 l-1.2 3 l-1.2 -3 l-3 -1.2 l3 -1.2Z" fill="#ffffff"/>' +
    drift,
  peak:
    paper('<path d="M30 95 L72 18 L114 95Z" fill="#8a9fbd"/>') +
    '<path d="M72 18 L114 95 H90Z" fill="#000000" opacity=".12"/>' +
    paper(`<path d="M72 18 L84 40 L78 37 L72 44 L66 37 L60 40Z" fill="${SNOW}"/>`) +
    '<path d="M72 18 V4" stroke="#3a2a22" stroke-width="1.5"/><path d="M72 4 L84 7 L72 10Z" fill="#c62828"/>' +
    paper('<path d="M2 95 L40 28 L80 95Z" fill="#62789a"/>') +
    '<path d="M40 28 L80 95 H54Z" fill="#000000" opacity=".12"/>' +
    paper(`<path d="M40 28 L51 48 L45 45 L40 52 L35 45 L29 49Z" fill="${SNOW}"/>`) +
    paper(`<path d="M10 95 L17 78 L24 95Z M90 95 L98 74 L106 95Z M102 95 L108 82 L114 95Z" fill="${PINE}"/>`) +
    drift,
  lake:
    paper(`<path d="M42 74 L49 54 L56 74Z M52 74 L60 48 L68 74Z M64 74 L70 58 L76 74Z" fill="${PINE}"/>`) +
    paper('<ellipse cx="60" cy="84" rx="56" ry="13" fill="#cfe9f5"/>') +
    '<ellipse cx="62" cy="85" rx="44" ry="8" fill="#b9dff0"/>' +
    '<path d="M38 80 L48 84 L46 89 M68 79 L77 83 L90 82 M77 83 L79 89" stroke="#ffffff" stroke-width="1.4" fill="none" stroke-linecap="round"/>' +
    '<path d="M28 77 Q40 74 52 76" stroke="#ffffff" stroke-width="2" fill="none" opacity=".7" stroke-linecap="round"/>' +
    '<path d="M30 74 V60 M34 74 V56 M38 75 V62" stroke="#8a7a4a" stroke-width="1.6"/><g fill="#6b4a2a"><ellipse cx="30" cy="61" rx="1.6" ry="3.5"/><ellipse cx="34" cy="57" rx="1.6" ry="3.5"/><ellipse cx="38" cy="63" rx="1.6" ry="3.5"/></g>' +
    paper('<path d="M2 96 Q4 80 15 78 Q25 78 27 92Z" fill="#7d8a99"/>') +
    paper(`<path d="M5 84 Q10 76 17 77 Q24 79 25 86 Q17 81 5 84Z" fill="${SNOW}"/>`) +
    paper('<path d="M88 72 H118 V76 H88Z" fill="#8a5a36"/>') +
    `<path d="M92 76 V86 M105 76 V86 M115 76 V84" stroke="#6b4428" stroke-width="2.5"/><path d="M88 72 H118" stroke="${SNOW}" stroke-width="2"/>` +
    drift,
  workshop:
    paper(`<path d="M80 18 H92 V40 H80Z" fill="#5a2a20"/><path d="M78 18 H94 V15 Q86 11 78 15Z" fill="${SNOW}"/>`) +
    `<g fill="#ffffff" opacity=".6"><circle cx="88" cy="9" r="3.5"/><circle cx="93" cy="3" r="4"/></g>` +
    paper('<path d="M16 46 H104 V95 H16Z" fill="#8a3b2e"/>') +
    '<path d="M16 60 H104 M16 74 H104 M16 88 H104" stroke="#73301f" stroke-width="1.5"/>' +
    paper('<path d="M6 50 L60 14 L114 50Z" fill="#4a2a22"/>') +
    paper(`<path d="M2 51 L60 10 L118 51 Q112 56 106 51 L60 19 L14 51 Q8 56 2 51Z" fill="${SNOW}"/>`) +
    paper(`<circle cx="60" cy="34" r="6" fill="${LIGHT}"/>`) +
    '<path d="M60 28 V40 M54 34 H66" stroke="#4a2a22" stroke-width="1.6"/>' +
    paper(`<rect x="26" y="58" width="18" height="16" rx="2" fill="${LIGHT}"/><rect x="76" y="58" width="18" height="16" rx="2" fill="${LIGHT}"/>`) +
    `<path d="M35 58 V74 M26 66 H44 M85 58 V74 M76 66 H94" stroke="#5a2a20" stroke-width="2"/><path d="M24 74 H46 M74 74 H96" stroke="${SNOW}" stroke-width="3.5" stroke-linecap="round"/>` +
    paper('<path d="M51 95 V76 Q60 67 69 76 V95Z" fill="#3d1f18"/>') +
    '<circle cx="60" cy="81" r="4.5" fill="none" stroke="#2e7d4f" stroke-width="2.5"/><circle cx="60" cy="85.5" r="1.6" fill="#c62828"/>' +
    drift,
}

export const LANTERN_SVG =
  '<svg viewBox="0 0 22 46" aria-hidden="true"><rect x="10" y="14" width="2" height="32" fill="#3a2a22"/><path d="M5 4 H17 L15 15 H7Z" fill="#5a6474" stroke="#3a2a22" stroke-width="1.4"/><rect x="6" y="1" width="10" height="3" fill="#3a2a22"/></svg>'

export const SLED_SVG =
  '<svg viewBox="0 0 40 26" aria-hidden="true"><path d="M3 21 H33 Q38 21 38 15" stroke="#7a4a2a" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M9 21 V16 M27 21 V16" stroke="#7a4a2a" stroke-width="2"/><rect x="6" y="9" width="26" height="8" rx="2" fill="#c62828"/><circle cx="13" cy="5" r="4" fill="#f2c9a5"/><path d="M9 4 L13 -3 L17 4Z" fill="#2e7d4f"/><circle cx="24" cy="5" r="4" fill="#f2c9a5"/><path d="M20 4 L24 -3 L28 4Z" fill="#c62828"/></svg>'
