import type { MemoryMotif } from '../content/types'

const INK = '#2a1f1a'
const PAPER = '#f4ecdc'
const GOLD = '#e3b23c'
const SNOW = '#dfe7ef'
const OWL = '#8a5a3b'
const HARE = '#b9a48a'
const FOX = '#d0662b'

const cut = (inner: string) => `<g filter="url(#pc)"><g filter="url(#pcGrain)">${inner}</g></g>`

const HOOF_PRINTS: [number, number][] = [
  [40, 82],
  [60, 70],
  [40, 57],
  [60, 45],
  [40, 32],
  [60, 20],
]

const SNOWFLAKES: [number, number, number][] = [
  [34, 34, 16],
  [68, 52, 12],
  [40, 74, 10],
]

const SPARKLES: [number, number, number][] = [
  [30, 52, 3.4],
  [42, 70, 2.6],
  [20, 66, 2],
]

function sparkle([x, y, r]: [number, number, number]) {
  const k = r * 0.3
  return `<path d="M${x} ${y - r} L${x + k} ${y - k} L${x + r} ${y} L${x + k} ${y + k} L${x} ${y + r} L${x - k} ${y + k} L${x - r} ${y} L${x - k} ${y - k} Z" fill="#fff6d8"/>`
}

function snowflake([x, y, r]: [number, number, number]) {
  const branch = (side: number) =>
    `M${side * r * 0.62} ${-r * 0.22} L${side * r * 0.42} 0 L${side * r * 0.62} ${r * 0.22}`
  const arms = [0, 60, 120]
    .map(
      (angle) =>
        `<path d="M${-r} 0 H${r} ${branch(-1)} ${branch(1)}" transform="rotate(${angle})"/>`,
    )
    .join('')
  return `<g transform="translate(${x} ${y})" stroke="${PAPER}" stroke-width="2.8" stroke-linecap="round" fill="none">${arms}</g>`
}

export const MEMORY_ART: Record<MemoryMotif, { label: string; svg: string }> = {
  moon: {
    label: 'Ein Mond',
    svg:
      '<defs><mask id="memMoonCut"><rect width="100" height="100" fill="#fff"/><circle cx="63" cy="40" r="25" fill="#000"/></mask></defs>' +
      cut(
        `<circle cx="46" cy="50" r="30" fill="${PAPER}" mask="url(#memMoonCut)"/>` +
          `<circle cx="78" cy="22" r="2.4" fill="${PAPER}"/><circle cx="84" cy="62" r="1.8" fill="${PAPER}"/><circle cx="20" cy="18" r="1.6" fill="${PAPER}"/>`,
      ),
  },
  owl: {
    label: 'Eine Eule',
    svg: cut(
      `<rect x="10" y="80" width="80" height="7" rx="3.5" fill="#5b3a26"/>` +
        `<polygon points="33,40 36,18 46,32" fill="${OWL}"/><polygon points="67,40 64,18 54,32" fill="${OWL}"/>` +
        `<ellipse cx="50" cy="56" rx="24" ry="27" fill="${OWL}"/>` +
        `<ellipse cx="50" cy="65" rx="15" ry="16" fill="#c79a6b"/>` +
        `<path d="M43 62 l3 3 l3 -3 M51 62 l3 3 l3 -3 M47 70 l3 3 l3 -3" stroke="${OWL}" stroke-width="1.6" fill="none"/>` +
        `<circle cx="41" cy="44" r="9" fill="${PAPER}"/><circle cx="59" cy="44" r="9" fill="${PAPER}"/>` +
        `<circle cx="41" cy="45" r="4.2" fill="${INK}"/><circle cx="59" cy="45" r="4.2" fill="${INK}"/>` +
        `<polygon points="46.5,51 53.5,51 50,57.5" fill="${GOLD}"/>` +
        `<path d="M42 82 v-3 M45 82 v-3 M55 82 v-3 M58 82 v-3" stroke="${GOLD}" stroke-width="2.4" stroke-linecap="round"/>`,
    ),
  },
  star: {
    label: 'Eine Sternschnuppe',
    svg:
      '<defs><linearGradient id="memStarTail" gradientUnits="userSpaceOnUse" x1="66" y1="32" x2="12" y2="86"><stop offset="0" stop-color="#ffe7a3" stop-opacity=".95"/><stop offset="1" stop-color="#f4ecdc" stop-opacity="0"/></linearGradient></defs>' +
      cut(
        `<path d="M58 24 C42 38 26 58 12 86 C30 64 46 50 72 40 Z" fill="url(#memStarTail)"/>` +
          `<path d="M62 31 C48 44 34 60 24 76 C38 60 50 50 67 38 Z" fill="#fff6d8" opacity=".55"/>` +
          SPARKLES.map(sparkle).join('') +
          `<polygon transform="translate(66 32) rotate(14)" points="0,-15 3.82,-5.26 14.27,-4.64 6.18,2.01 8.82,12.14 0,6.5 -8.82,12.14 -6.18,2.01 -14.27,-4.64 -3.82,-5.26" fill="${GOLD}" stroke="${GOLD}" stroke-width="3" stroke-linejoin="round"/>`,
      ),
  },
  hare: {
    label: 'Ein Hase',
    svg: cut(
      `<ellipse cx="50" cy="86" rx="38" ry="6" fill="${SNOW}"/>` +
        `<ellipse cx="38" cy="27" rx="5.5" ry="17" fill="${HARE}" transform="rotate(-14 38 27)"/>` +
        `<ellipse cx="48" cy="28" rx="5.5" ry="17" fill="${HARE}" transform="rotate(10 48 28)"/>` +
        `<ellipse cx="38" cy="28" rx="2.4" ry="12" fill="#e9b8a8" transform="rotate(-14 38 28)"/>` +
        `<ellipse cx="48" cy="29" rx="2.4" ry="12" fill="#e9b8a8" transform="rotate(10 48 29)"/>` +
        `<ellipse cx="60" cy="66" rx="23" ry="18" fill="${HARE}"/>` +
        `<circle cx="41" cy="51" r="13" fill="${HARE}"/>` +
        `<circle cx="82" cy="62" r="6.5" fill="${PAPER}"/>` +
        `<ellipse cx="42" cy="81" rx="9" ry="4" fill="#a8927a"/>` +
        `<circle cx="36" cy="48" r="2.2" fill="${INK}"/><circle cx="29.5" cy="54" r="1.8" fill="#c97a6a"/>`,
    ),
  },
  lantern: {
    label: 'Eine Laterne',
    svg:
      '<defs><radialGradient id="memLampGlow"><stop offset="0" stop-color="#ffd27a" stop-opacity=".75"/><stop offset=".5" stop-color="#ffb84a" stop-opacity=".22"/><stop offset="1" stop-color="#ffb84a" stop-opacity="0"/></radialGradient></defs>' +
      cut(
        `<circle cx="50" cy="50" r="44" fill="url(#memLampGlow)"/>` +
          `<circle cx="50" cy="14" r="4.5" fill="none" stroke="${INK}" stroke-width="2.6"/>` +
          `<polygon points="36,30 64,30 58,20 42,20" fill="${INK}"/>` +
          `<rect x="38" y="30" width="24" height="34" fill="#f6c95e"/>` +
          `<path d="M50 56 C44 50 48 44 50 40 C52 44 56 50 50 56 Z" fill="#e2702c"/>` +
          `<path d="M38 30 v34 M62 30 v34 M50 30 v6 M50 58 v6" stroke="${INK}" stroke-width="2.6"/>` +
          `<rect x="34" y="64" width="32" height="6" rx="1.5" fill="${INK}"/>`,
      ),
  },
  fox: {
    label: 'Ein Fuchs',
    svg: cut(
      `<ellipse cx="50" cy="86" rx="38" ry="6" fill="${SNOW}"/>` +
        `<path d="M38 84 C14 86 6 60 20 52 C30 47 34 62 42 72 Z" fill="${FOX}"/>` +
        `<path d="M14 70 C10 60 14 52 20 52 C17 58 17 64 20 70 Z" fill="${PAPER}"/>` +
        `<path d="M40 84 C38 64 44 48 56 46 C66 47 70 64 68 84 Z" fill="${FOX}"/>` +
        `<path d="M55 52 C50 62 52 74 57 84 L64 84 C66 72 63 60 55 52 Z" fill="${PAPER}"/>` +
        `<polygon points="49,36 53,12 62,30" fill="${FOX}"/><polygon points="62,30 69,12 76,35" fill="${FOX}"/>` +
        `<polygon points="53,28 53.5,18 58,27" fill="${INK}"/><polygon points="66,27 68.5,18 71,29" fill="${INK}"/>` +
        `<path d="M47 38 C48 28 58 24 68 26 C72 30 74 34 82 40 C76 46 64 50 54 48 C49 46 46 42 47 38 Z" fill="${FOX}"/>` +
        `<path d="M60 44 C68 44 76 43 82 40 C76 46 66 49 58 48 Z" fill="${PAPER}"/>` +
        `<circle cx="82" cy="40" r="2.4" fill="${INK}"/><circle cx="64" cy="35" r="2" fill="${INK}"/>`,
    ),
  },
  hooves: {
    label: 'Hufspuren nach Norden',
    svg: cut(
      `<rect x="14" y="8" width="72" height="86" rx="34" fill="${SNOW}"/>` +
        HOOF_PRINTS.map(
          ([x, y]) =>
            `<path transform="translate(${x} ${y})" d="M-6 5 C-8 -2 -6 -7 -1 -7 L-1 5 Z M6 5 C8 -2 6 -7 1 -7 L1 5 Z" fill="#3a4f6b"/>`,
        ).join(''),
    ),
  },
  snow: {
    label: 'Schneeflocken',
    svg: cut(SNOWFLAKES.map(snowflake).join('')),
  },
}
