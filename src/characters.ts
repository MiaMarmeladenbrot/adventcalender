import type { Who } from './lib/types'

const INK = '#2a1f1a'
const SKIN = '#eec3a0'
const CREAM = '#f4ecdc'
const RED = '#b8232c'
const DEEP_RED = '#9c1c24'
const GOLD = '#e3b23c'

const cut = (inner: string) => `<g filter="url(#pc)">${inner}</g>`

const figure = (body: string, extra = '') =>
  `<svg class="fig${extra}" data-e="n" viewBox="0 0 200 240" aria-hidden="true"><g filter="url(#pcGrain)">${body}</g></svg>`

const cheeks = (y: number, left = 72, right = 128) =>
  `<ellipse cx="${left}" cy="${y}" rx="9" ry="5" fill="#e98d7a" opacity=".55"/><ellipse cx="${right}" cy="${y}" rx="9" ry="5" fill="#e98d7a" opacity=".55"/>`

interface EyeStyle {
  size?: number
  iris?: string
  white?: string
  lid?: string
}

function eyes(y: number, left: number, right: number, { size = 7, iris = INK, white, lid = INK }: EyeStyle = {}) {
  const open = [left, right]
    .map((x) =>
      white
        ? `<ellipse cx="${x}" cy="${y}" rx="${size + 2}" ry="${size + 1}" fill="${white}"/><circle cx="${x}" cy="${y}" r="${(size * 0.55).toFixed(1)}" fill="${iris}"/>`
        : `<ellipse cx="${x}" cy="${y}" rx="${size}" ry="${(size * 1.25).toFixed(1)}" fill="${iris}"/><circle cx="${x + size * 0.35}" cy="${y - size * 0.55}" r="${(size * 0.34).toFixed(1)}" fill="#ffffff"/>`,
    )
    .join('')
  const shut = [left, right]
    .map((x) => `<path d="M${x - size - 1} ${y} Q${x} ${y + 5} ${x + size + 1} ${y}"/>`)
    .join('')
  return (
    `<g class="x eyes on-n">${open}</g>` +
    `<g class="x bl" fill="none" stroke="${lid}" stroke-width="3.5" stroke-linecap="round">${shut}</g>`
  )
}

const SANTA = figure(
  cut('<path d="M38 240 C 42 200, 66 178, 100 176 C 134 178, 158 200, 162 240 Z" fill="' + RED + '"/>') +
    cut('<path d="M91 186 H109 V240 H91 Z" fill="' + CREAM + '"/><circle cx="100" cy="206" r="3.5" fill="' + INK + '"/><circle cx="100" cy="226" r="3.5" fill="' + INK + '"/>') +
    cut(`<ellipse cx="100" cy="122" rx="37" ry="41" fill="${SKIN}"/>`) +
    cut('<path d="M64 98 C 70 58, 100 38, 130 52 C 148 60, 156 76, 160 94 L150 98 C 144 82, 134 74, 122 76 C 132 84, 136 94, 136 98 Z" fill="' + RED + '"/>') +
    cut(`<path d="M60 94 C 82 85, 118 85, 140 94 L140 108 C 118 100, 82 100, 60 108 Z" fill="${CREAM}"/><circle cx="156" cy="102" r="10" fill="${CREAM}"/>`) +
    cheeks(130, 77, 123) +
    eyes(118, 86, 114) +
    '<g fill="none" stroke="#fffaf0" stroke-width="5" stroke-linecap="round"><path d="M77 108 Q86 102 94 106"/><path d="M106 106 Q114 102 123 108"/></g>' +
    cut(
      `<path d="M62.7 130 A 38 42 0 0 0 65.7 140 C 64 166, 79 190, 100 195 C 121 190, 136 166, 134.3 140 A 38 42 0 0 0 137.3 130 C 128 141, 116 148, 100 148 C 84 148, 72 141, 62.7 130 Z" fill="${CREAM}"/>`,
    ) +
    '<path d="M94 161 Q100 166 106 161" fill="none" stroke="#5a2620" stroke-width="3" stroke-linecap="round"/>' +
    cut('<path d="M100 143 C 92 134, 79 136, 71 147 C 83 152, 94 151, 100 146 C 106 151, 117 152, 129 147 C 121 136, 108 134, 100 143 Z" fill="#fffaf0"/>') +
    cut('<circle cx="100" cy="134" r="7.5" fill="#de8a75"/>'),
)

const MRS = figure(
  cut(`<path d="M42 240 C 46 202, 68 180, 100 178 C 132 180, 154 202, 158 240 Z" fill="${RED}"/>`) +
    cut(`<path d="M74 180 C 86 198, 114 198, 126 180 L118 174 C 108 186, 92 186, 82 174 Z" fill="${CREAM}"/>`) +
    cut('<circle cx="100" cy="114" r="52" fill="#e6e1d8"/><circle cx="100" cy="58" r="22" fill="#e6e1d8"/>') +
    cut(`<ellipse cx="100" cy="124" rx="38" ry="40" fill="${SKIN}"/>`) +
    cut('<path d="M60 114 C 62 86, 84 72, 100 72 C 116 72, 138 86, 140 114 C 128 98, 112 92, 100 94 C 88 92, 72 98, 60 114 Z" fill="#e6e1d8"/>') +
    cut(`<path d="M112 46 C 122 36, 134 38, 136 46 C 128 46, 120 48, 114 52 Z" fill="#2e7d4f"/><circle cx="114" cy="50" r="5" fill="${RED}"/>`) +
    cheeks(138, 74, 126) +
    eyes(122, 84, 116, { size: 5 }) +
    '<g fill="none" stroke="#7a4a2a" stroke-width="3"><circle cx="84" cy="122" r="12"/><circle cx="116" cy="122" r="12"/><path d="M96 121 H104"/></g>' +
    '<path d="M88 150 Q100 160 112 150" fill="none" stroke="#8a2a2a" stroke-width="3" stroke-linecap="round"/>',
)

const elf = (hat: string, band: string) =>
  cut(`<path d="M44 240 C 48 204, 70 184, 100 182 C 130 184, 152 204, 156 240 Z" fill="${hat}"/>`) +
  cut(`<path d="M62 186 L74 200 L86 188 L100 202 L114 188 L126 200 L138 186 L132 178 H68 Z" fill="${band}"/>`) +
  cut(
    `<path d="M64 124 C 46 112, 36 104, 30 94 C 38 118, 50 136, 66 140 Z" fill="${SKIN}"/><path d="M136 124 C 154 112, 164 104, 170 94 C 162 118, 150 136, 134 140 Z" fill="${SKIN}"/>`,
  ) +
  cut(`<circle cx="100" cy="130" r="40" fill="${SKIN}"/>`) +
  cut(`<path d="M58 108 C 62 70, 90 50, 112 30 C 120 22, 136 14, 150 22 C 136 26, 128 42, 132 62 C 138 80, 142 96, 142 108 Z" fill="${hat}"/>`) +
  cut(`<path d="M56 102 C 80 94, 120 94, 144 102 L144 116 C 120 108, 80 108, 56 116 Z" fill="${band}"/><circle cx="150" cy="24" r="8" fill="${GOLD}"/>`) +
  cheeks(142, 74, 126) +
  '<g fill="#b9773d" opacity=".6"><circle cx="70" cy="136" r="1.6"/><circle cx="76" cy="140" r="1.6"/><circle cx="124" cy="140" r="1.6"/><circle cx="130" cy="136" r="1.6"/></g>' +
  eyes(130, 86, 114) +
  '<g fill="none" stroke="#7a4a2a" stroke-width="3.5" stroke-linecap="round"><path d="M77 118 Q86 113 94 117"/><path d="M106 117 Q114 113 123 118"/></g>' +
  '<path d="M97 136 Q100 142 103 136" fill="none" stroke="#c98a6a" stroke-width="3" stroke-linecap="round"/>' +
  '<path d="M86 152 Q100 164 114 152" fill="none" stroke="#5a2620" stroke-width="3" stroke-linecap="round"/>'

const ELF = figure(elf('#2e7d4f', RED))

const TWINS = figure(
  `<g transform="translate(-16 70) scale(.72)">${elf('#9c5a2e', GOLD)}</g>` +
    `<g transform="translate(72 64) scale(.72)">${elf('#c9d6e3', RED)}</g>`,
)

const KOMET = figure(
  '<g filter="url(#pc)" fill="none" stroke="#a88a66" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M86 76 C 74 58, 62 44, 56 20" stroke-width="9"/><path d="M66 50 C 56 46, 46 42, 38 30" stroke-width="7"/><path d="M59 32 C 62 24, 66 17, 72 10" stroke-width="6"/>' +
    '<path d="M114 76 C 126 58, 138 44, 144 20" stroke-width="9"/><path d="M134 50 C 144 46, 154 42, 162 30" stroke-width="7"/><path d="M141 32 C 138 24, 134 17, 128 10" stroke-width="6"/>' +
    '</g>' +
    cut(
      '<path d="M72 94 C 48 80, 30 82, 20 92 C 32 106, 54 110, 74 104 Z" fill="#5e5248"/><path d="M66 96 C 50 88, 38 89, 31 93 C 40 101, 54 103, 66 101 Z" fill="#c9b3a8"/>' +
        '<path d="M128 94 C 152 80, 170 82, 180 92 C 168 106, 146 110, 126 104 Z" fill="#5e5248"/><path d="M134 96 C 150 88, 162 89, 169 93 C 160 101, 146 103, 134 101 Z" fill="#c9b3a8"/>',
    ) +
    cut('<path d="M68 150 C 66 190, 58 215, 52 240 H148 C 142 215, 134 190, 132 150 Z" fill="#6e6156"/>') +
    cut(
      '<path d="M58 182 C 80 196, 120 196, 142 182 L146 202 C 120 216, 80 216, 54 202 Z" fill="#2f5d8a"/><path d="M84 200 L66 238 L84 240 L96 204 Z" fill="#244a6e"/>' +
        `<path d="M70 192 L68 208 M86 196 L85 212 M102 197 L102 213 M118 196 L119 212 M134 191 L136 207" stroke="${CREAM}" stroke-width="3"/>`,
    ) +
    cut('<path d="M100 62 C 134 62, 150 88, 148 118 C 146 146, 132 164, 122 178 C 113 188, 87 188, 78 178 C 68 164, 54 146, 52 118 C 50 88, 66 62, 100 62 Z" fill="#8c7b6b"/>') +
    cut(`<path d="M100 72 L102.9 80 L111.4 80.3 L104.8 85.5 L107.1 93.7 L100 89 L92.9 93.7 L95.2 85.5 L88.6 80.3 L97.1 80 Z" fill="${GOLD}"/>`) +
    cut('<path d="M100 128 C 126 128, 136 146, 132 162 C 128 180, 114 190, 100 190 C 86 190, 72 180, 68 162 C 64 146, 74 128, 100 128 Z" fill="#c8b8a4"/>') +
    eyes(112, 82, 118) +
    '<g fill="none" stroke="#3a2e26" stroke-width="4" stroke-linecap="round"><path d="M72 96 Q82 98 91 100"/><path d="M109 94 Q118 90 128 93"/></g>' +
    '<path d="M88 174 Q102 182 114 170" fill="none" stroke="#3a2e26" stroke-width="3" stroke-linecap="round"/>' +
    cut('<ellipse cx="100" cy="150" rx="13" ry="10" fill="#2f2622"/>') +
    '<ellipse cx="95" cy="146" rx="4" ry="2.5" fill="#ffffff" opacity=".35"/>',
)

const GRINCH = figure(
  cut('<path d="M44 240 C 50 204, 72 186, 100 184 C 128 186, 150 204, 156 240 Z" fill="#4f7426"/>') +
    '<g fill="none" stroke="#3b5a1c" stroke-width="3" stroke-linecap="round"><path d="M70 206 l6 10 M92 200 l4 12 M116 202 l2 12 M134 210 l-4 10 M80 226 l4 10 M120 226 l-2 10"/></g>' +
    cut('<path d="M88 68 C 82 52, 90 42, 100 36 C 98 48, 104 56, 114 68 Z" fill="#4f7426"/>') +
    cut(
      '<path d="M56 108 C 42 92, 30 90, 26 96 C 32 110, 42 122, 54 126 Z" fill="#4f7426"/><path d="M144 108 C 158 92, 170 90, 174 96 C 168 110, 158 122, 146 126 Z" fill="#4f7426"/>',
    ) +
    cut(
      '<path d="M100 62 C 130 60, 150 82, 150 112 C 150 152, 130 180, 100 184 C 70 180, 50 152, 50 112 C 50 82, 70 60, 100 62 Z" fill="#7cab42"/>',
    ) +
    eyes(114, 80, 120, { size: 8, white: '#e8d84a', iris: RED, lid: '#33521a' }) +
    '<g fill="none" stroke="#33521a" stroke-width="6" stroke-linecap="round"><path d="M64 96 L92 106"/><path d="M136 96 L108 106"/></g>' +
    '<g fill="#33521a"><circle cx="94" cy="136" r="2.6"/><circle cx="106" cy="136" r="2.6"/></g>' +
    '<path d="M66 146 C 84 166, 118 168, 138 138" fill="none" stroke="#33521a" stroke-width="4" stroke-linecap="round"/>' +
    '<path d="M132 146 L138 138 L140 148" fill="none" stroke="#33521a" stroke-width="3" stroke-linecap="round"/>',
)

const SNOWMAN = figure(
  cut('<circle cx="100" cy="250" r="72" fill="#f8f6f0" stroke="#c4d0d6" stroke-width="2"/>') +
    '<circle cx="100" cy="206" r="5" fill="#263238"/><circle cx="100" cy="228" r="5" fill="#263238"/>' +
    cut('<circle cx="100" cy="122" r="48" fill="#f8f6f0" stroke="#c4d0d6" stroke-width="2"/>') +
    cut(
      `<path d="M54 162 C 80 176, 120 176, 146 162 L148 180 C 120 194, 80 194, 52 180 Z" fill="${RED}"/><path d="M120 180 L132 228 L116 230 L106 186 Z" fill="${DEEP_RED}"/>`,
    ) +
    cut('<path d="M66 28 H134 V84 H66 Z" fill="#263238"/><path d="M48 80 H152 V92 H48 Z" fill="#263238"/>') +
    cut(`<path d="M66 68 H134 V80 H66 Z" fill="${RED}"/>`) +
    cheeks(134, 70, 130) +
    eyes(114, 84, 116, { size: 6, iris: '#263238', lid: '#263238' }) +
    '<g fill="#263238"><circle cx="78" cy="148" r="3"/><circle cx="88" cy="155" r="3"/><circle cx="100" cy="158" r="3"/><circle cx="112" cy="155" r="3"/><circle cx="122" cy="148" r="3"/></g>' +
    cut('<path d="M100 124 L150 134 L100 140 Z" fill="#e07b1f"/>'),
)

const GINGER = figure(
  cut(
    '<path d="M56 240 C 58 202, 62 184, 70 174 C 42 176, 24 168, 20 156 C 18 146, 28 140, 38 142 C 54 148, 72 156, 100 156 C 128 156, 146 148, 162 142 C 172 140, 182 146, 180 156 C 176 168, 158 176, 130 174 C 138 184, 142 202, 144 240 Z" fill="#b9773d"/>',
  ) +
    '<g fill="none" stroke="#fffaf0" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M30 150 l6 8 l6 -8 l6 8"/><path d="M152 150 l6 8 l6 -8 l6 8"/></g>' +
    `<circle cx="100" cy="190" r="6" fill="${RED}"/><circle cx="100" cy="214" r="6" fill="#2e7d4f"/>` +
    cut('<circle cx="100" cy="110" r="46" fill="#b9773d"/>') +
    '<circle cx="100" cy="110" r="39" fill="none" stroke="#fffaf0" stroke-width="2.5" stroke-dasharray="5 6" opacity=".8"/>' +
    '<g fill="#f2a7a0"><circle cx="72" cy="124" r="6"/><circle cx="128" cy="124" r="6"/></g>' +
    eyes(104, 84, 116, { size: 6, iris: '#3a2414', lid: '#3a2414' }) +
    '<g fill="none" stroke="#fffaf0" stroke-width="3" stroke-linecap="round"><path d="M76 92 Q84 88 92 91"/><path d="M108 91 Q116 88 124 92"/></g>' +
    '<path d="M82 128 Q100 144 118 128" fill="none" stroke="#fffaf0" stroke-width="4" stroke-linecap="round"/>',
)

const PENGUIN = figure(
  cut(
    '<path d="M48 160 C 30 180, 24 204, 28 222 C 42 208, 50 190, 54 172 Z" fill="#1d272c"/><path d="M152 160 C 170 180, 176 204, 172 222 C 158 208, 150 190, 146 172 Z" fill="#1d272c"/>',
  ) +
    cut('<path d="M100 50 C 140 50, 156 90, 156 140 C 156 190, 150 220, 146 240 H54 C 50 220, 44 190, 44 140 C 44 90, 60 50, 100 50 Z" fill="#263238"/>') +
    cut(
      '<path d="M100 100 C 108 88, 130 86, 136 104 C 142 124, 130 142, 124 156 C 120 180, 126 210, 128 240 H72 C 74 210, 80 180, 76 156 C 70 142, 58 124, 64 104 C 70 86, 92 88, 100 100 Z" fill="#f4f1ea"/>',
    ) +
    cut(`<path d="M58 68 C 60 26, 140 26, 142 68 Z" fill="${GOLD}"/><path d="M52 60 H148 V76 H52 Z" fill="${RED}"/><circle cx="100" cy="26" r="12" fill="${GOLD}"/>`) +
    cheeks(132, 74, 126) +
    eyes(114, 84, 116, { size: 6 }) +
    cut('<path d="M86 128 L114 128 L100 146 Z" fill="#e07b1f"/>') +
    cut(`<path d="M100 178 L82 168 L82 188 Z M100 178 L118 168 L118 188 Z" fill="${RED}"/><circle cx="100" cy="178" r="4.5" fill="${DEEP_RED}"/>`),
)

const BEAR = figure(
  cut('<path d="M40 240 C 46 200, 70 178, 100 176 C 130 178, 154 200, 160 240 Z" fill="#f3f1ea"/>') +
    cut('<path d="M58 182 C 80 196, 120 196, 142 182 L146 200 C 120 214, 80 214, 54 200 Z" fill="#2e7d4f"/><path d="M118 200 L132 238 L116 240 L106 204 Z" fill="#256a42"/>') +
    cut('<circle cx="62" cy="76" r="17" fill="#f3f1ea"/><circle cx="138" cy="76" r="17" fill="#f3f1ea"/>') +
    '<circle cx="62" cy="76" r="8" fill="#e3d5c8"/><circle cx="138" cy="76" r="8" fill="#e3d5c8"/>' +
    cut('<ellipse cx="100" cy="122" rx="52" ry="48" fill="#f3f1ea"/>') +
    cut('<ellipse cx="100" cy="144" rx="25" ry="19" fill="#e6e0d2"/>') +
    cheeks(134, 66, 134) +
    eyes(114, 80, 120, { size: 5.5, iris: '#263238', lid: '#263238' }) +
    cut('<path d="M89 134 C 89 127, 111 127, 111 134 C 111 140, 105 144, 100 144 C 95 144, 89 140, 89 134 Z" fill="#263238"/>') +
    '<path d="M100 144 V151 M91 154 Q100 160 109 154" fill="none" stroke="#263238" stroke-width="3" stroke-linecap="round"/>',
)

const ART: Record<Exclude<Who, 'rudolph'>, string> = {
  santa: SANTA,
  mrs: MRS,
  elf: ELF,
  twins: TWINS,
  komet: KOMET,
  grinch: GRINCH,
  snowman: SNOWMAN,
  ginger: GINGER,
  penguin: PENGUIN,
  bear: BEAR,
}

export type Mood = 'n' | 'v' | 'h'

export function rudolphSvg(mood: Mood = 'n') {
  return (
    `<svg class="fig rud" data-e="${mood}" viewBox="0 0 200 240" aria-hidden="true"><g filter="url(#pcGrain)">` +
    '<g filter="url(#pc)" fill="none" stroke="#c4955c" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M86 76 C 74 58, 62 44, 56 20" stroke-width="9"/><path d="M66 50 C 56 46, 46 42, 38 30" stroke-width="7"/><path d="M59 32 C 62 24, 66 17, 72 10" stroke-width="6"/>' +
    '<path d="M114 76 C 126 58, 138 44, 144 20" stroke-width="9"/><path d="M134 50 C 144 46, 154 42, 162 30" stroke-width="7"/><path d="M141 32 C 138 24, 134 17, 128 10" stroke-width="6"/>' +
    '</g><g filter="url(#pc)">' +
    '<path d="M72 94 C 48 80, 30 82, 20 92 C 32 106, 54 110, 74 104 Z" fill="#7d4f2f"/><path d="M66 96 C 50 88, 38 89, 31 93 C 40 101, 54 103, 66 101 Z" fill="#d9a29a"/>' +
    '<path d="M128 94 C 152 80, 170 82, 180 92 C 168 106, 146 110, 126 104 Z" fill="#7d4f2f"/><path d="M134 96 C 150 88, 162 89, 169 93 C 160 101, 146 103, 134 101 Z" fill="#d9a29a"/>' +
    '</g><g filter="url(#pc)"><path d="M68 150 C 66 190, 58 215, 52 240 H148 C 142 215, 134 190, 132 150 Z" fill="#7d4f2f"/></g>' +
    '<g filter="url(#pc)"><path d="M58 182 C 80 196, 120 196, 142 182 L146 202 C 120 216, 80 216, 54 202 Z" fill="#b8232c"/><path d="M116 200 L134 238 L116 240 L104 204 Z" fill="#9c1c24"/>' +
    '<path d="M70 192 L68 208 M86 196 L85 212 M102 197 L102 213 M118 196 L119 212 M134 191 L136 207" stroke="#f4ecdc" stroke-width="3"/></g>' +
    '<g filter="url(#pc)"><path d="M100 62 C 134 62, 150 88, 148 118 C 146 146, 132 164, 122 178 C 113 188, 87 188, 78 178 C 68 164, 54 146, 52 118 C 50 88, 66 62, 100 62 Z" fill="#9a6a43"/></g>' +
    '<g filter="url(#pc)"><path d="M100 66 C 90 76, 88 88, 100 96 C 112 88, 110 76, 100 66 Z" fill="#b8875a"/></g>' +
    '<g filter="url(#pc)"><path d="M100 128 C 126 128, 136 146, 132 162 C 128 180, 114 190, 100 190 C 86 190, 72 180, 68 162 C 64 146, 74 128, 100 128 Z" fill="#dcb88e"/></g>' +
    '<g class="x on-h on-v"><ellipse cx="70" cy="132" rx="9" ry="5" fill="#e98d7a" opacity=".55"/><ellipse cx="130" cy="132" rx="9" ry="5" fill="#e98d7a" opacity=".55"/></g>' +
    '<g class="x eyes on-n"><ellipse cx="82" cy="112" rx="7" ry="9" fill="#2a1f1a"/><ellipse cx="118" cy="112" rx="7" ry="9" fill="#2a1f1a"/><circle cx="84.5" cy="108" r="2.4" fill="#ffffff"/><circle cx="120.5" cy="108" r="2.4" fill="#ffffff"/></g>' +
    '<g class="x eyes on-v"><ellipse cx="82" cy="112" rx="8" ry="9" fill="#fff8ec"/><ellipse cx="118" cy="112" rx="8" ry="9" fill="#fff8ec"/><circle cx="87" cy="113" r="4.5" fill="#2a1f1a"/><circle cx="123" cy="113" r="4.5" fill="#2a1f1a"/></g>' +
    '<g class="x on-h" fill="none" stroke="#2a1f1a" stroke-width="4" stroke-linecap="round"><path d="M74 114 Q82 104 90 114"/><path d="M110 114 Q118 104 126 114"/></g>' +
    '<g class="x bl" fill="none" stroke="#2a1f1a" stroke-width="3.5" stroke-linecap="round"><path d="M75 112 Q82 116 89 112"/><path d="M111 112 Q118 116 125 112"/></g>' +
    '<g fill="none" stroke="#4a2e1a" stroke-width="4" stroke-linecap="round">' +
    '<g class="x on-n"><path d="M73 97 Q82 92 91 96"/><path d="M109 96 Q118 92 127 97"/></g>' +
    '<g class="x on-v"><path d="M73 99 L91 91"/><path d="M109 91 L127 99"/></g>' +
    '<g class="x on-h"><path d="M73 94 Q82 88 91 93"/><path d="M109 93 Q118 88 127 94"/></g></g>' +
    '<path class="x on-v" d="M148 82 C 143 91, 143 96, 148 98 C 153 96, 153 91, 148 82 Z" fill="#bfe3f2" stroke="#7fb8d1" stroke-width="1"/>' +
    '<path class="x on-n" d="M90 174 Q100 181 110 174" fill="none" stroke="#4a2e1a" stroke-width="3" stroke-linecap="round"/>' +
    '<path class="x on-v" d="M88 176 Q92 171 96 176 Q100 181 104 176 Q108 171 112 176" fill="none" stroke="#4a2e1a" stroke-width="3" stroke-linecap="round"/>' +
    '<path class="x on-h" d="M86 170 Q100 192 114 170 Z" fill="#5a2620"/>' +
    '<circle class="nose-glow" cx="100" cy="152" r="42" fill="url(#noseGlow)"/>' +
    '<g filter="url(#pc)"><circle class="nose" cx="100" cy="152" r="15" fill="#c62828"/></g>' +
    '<ellipse cx="94" cy="146" rx="5" ry="3.5" fill="#ffffff" opacity=".45"/></g></svg>'
  )
}

export function faceSvg(who: Who) {
  if (who === 'rudolph') return rudolphSvg('n')
  return ART[who]
}
