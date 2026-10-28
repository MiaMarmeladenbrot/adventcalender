import type { Who } from './lib/types'

const ELF =
  '<path d="M14 38 L8 30 L18 34Z M50 38 L56 30 L46 34Z" fill="#f2c9a5"/><circle cx="32" cy="40" r="15" fill="#f2c9a5"/><path d="M16 32 L40 4 L48 32Z" fill="HAT"/><rect x="15" y="29" width="34" height="6" rx="3" fill="BAND"/><circle cx="40" cy="4" r="3.5" fill="#ffd54a"/><circle cx="27" cy="41" r="1.8" fill="#2b2b2b"/><circle cx="37" cy="41" r="1.8" fill="#2b2b2b"/><path d="M27 47 Q32 51 37 47" stroke="#2b2b2b" stroke-width="1.6" fill="none"/>'

const elf = (hat: string, band: string) => ELF.replace('HAT', hat).replace('BAND', band)

const ART: Record<Exclude<Who, 'rudolph'>, string> = {
  santa:
    '<circle cx="32" cy="36" r="16" fill="#f2c9a5"/><path d="M15 38 Q32 66 49 38 Q41 47 32 47 Q23 47 15 38Z" fill="#ffffff" stroke="#d9d9d9"/><path d="M14 30 L34 6 L50 30Z" fill="#c62828"/><rect x="13" y="27" width="38" height="7" rx="3.5" fill="#ffffff"/><circle cx="34" cy="6" r="4" fill="#ffffff"/><circle cx="26" cy="37" r="1.8" fill="#2b2b2b"/><circle cx="38" cy="37" r="1.8" fill="#2b2b2b"/><circle cx="32" cy="42" r="2.4" fill="#e88b7a"/>',
  mrs: '<circle cx="32" cy="16" r="8" fill="#ececec"/><circle cx="32" cy="36" r="18" fill="#ececec"/><circle cx="32" cy="39" r="14" fill="#f2c9a5"/><circle cx="26" cy="38" r="4" fill="none" stroke="#7a4a2a" stroke-width="1.5"/><circle cx="38" cy="38" r="4" fill="none" stroke="#7a4a2a" stroke-width="1.5"/><path d="M30 38 H34" stroke="#7a4a2a" stroke-width="1.5"/><path d="M27 46 Q32 50 37 46" stroke="#b04040" stroke-width="1.8" fill="none"/><circle cx="32" cy="9" r="3" fill="#c62828"/>',
  elf: elf('#2e7d4f', '#c62828'),
  twins: `<g transform="translate(-4 8) scale(.72)">${elf('#2e7d4f', '#ffd54a')}</g><g transform="translate(22 8) scale(.72)">${elf('#c62828', '#ffd54a')}</g>`,
  komet:
    '<path d="M22 22 L16 6 M16 12 L10 8 M18 16 L12 16 M42 22 L48 6 M48 12 L54 8 M46 16 L52 16" stroke="#5e5248" stroke-width="3" stroke-linecap="round" fill="none"/><ellipse cx="32" cy="38" rx="16" ry="18" fill="#8c7b6b"/><ellipse cx="32" cy="46" rx="10" ry="8" fill="#b3a392"/><path d="M32 21 L34 25.5 L38.5 26 L35 29 L36 33.5 L32 31 L28 33.5 L29 29 L25.5 26 L30 25.5Z" fill="#ffd54a"/><circle cx="26" cy="35" r="2" fill="#2b2b2b"/><circle cx="38" cy="35" r="2" fill="#2b2b2b"/><ellipse cx="32" cy="46" rx="4.5" ry="3.5" fill="#2b2b2b"/>',
  grinch:
    '<ellipse cx="32" cy="36" rx="17" ry="19" fill="#7cb342"/><ellipse cx="25" cy="32" rx="4.5" ry="3.2" fill="#f5e050"/><ellipse cx="39" cy="32" rx="4.5" ry="3.2" fill="#f5e050"/><circle cx="25" cy="32" r="1.6" fill="#c62828"/><circle cx="39" cy="32" r="1.6" fill="#c62828"/><path d="M21 42 Q32 53 43 42" stroke="#33521a" stroke-width="2.2" fill="none"/><path d="M19 25 L28 28 M45 25 L36 28" stroke="#33521a" stroke-width="2.2" stroke-linecap="round"/>',
  snowman:
    '<circle cx="32" cy="50" r="12" fill="#ffffff" stroke="#c4d0d6"/><circle cx="32" cy="29" r="11" fill="#ffffff" stroke="#c4d0d6"/><rect x="23" y="7" width="18" height="12" fill="#263238"/><rect x="19" y="18" width="26" height="3" fill="#263238"/><path d="M32 30 L43 32 L32 33Z" fill="#ff8f00"/><circle cx="28" cy="27" r="1.5" fill="#263238"/><circle cx="36" cy="27" r="1.5" fill="#263238"/><path d="M22 38 Q32 42 42 38" stroke="#c62828" stroke-width="3" fill="none"/>',
  ginger:
    '<circle cx="32" cy="17" r="10" fill="#b9773d"/><path d="M20 29 H44 L54 37 L50 41 L44 37 V47 L50 59 H42 L32 50 L22 59 H14 L20 47 V37 L14 41 L10 37Z" fill="#b9773d"/><path d="M27 20 Q32 24 37 20" stroke="#ffffff" stroke-width="1.6" fill="none"/><circle cx="28" cy="15" r="1.5" fill="#ffffff"/><circle cx="36" cy="15" r="1.5" fill="#ffffff"/><circle cx="32" cy="35" r="2" fill="#e53935"/><circle cx="32" cy="42" r="2" fill="#2e7d4f"/>',
  penguin:
    '<ellipse cx="32" cy="38" rx="16" ry="21" fill="#263238"/><ellipse cx="32" cy="42" rx="10" ry="15" fill="#ffffff"/><circle cx="27" cy="28" r="2.2" fill="#ffffff"/><circle cx="37" cy="28" r="2.2" fill="#ffffff"/><circle cx="27" cy="28" r="1" fill="#000000"/><circle cx="37" cy="28" r="1" fill="#000000"/><path d="M28 33 L36 33 L32 38Z" fill="#ff8f00"/><path d="M18 18 Q32 8 46 18 L48 20 H16Z" fill="#f2c94c"/><rect x="20" y="16" width="24" height="3" fill="#e53935"/>',
  bear: '<circle cx="19" cy="21" r="6" fill="#f3f1ea" stroke="#c9c4b4"/><circle cx="45" cy="21" r="6" fill="#f3f1ea" stroke="#c9c4b4"/><circle cx="32" cy="37" r="18" fill="#f3f1ea" stroke="#c9c4b4"/><ellipse cx="32" cy="44" rx="7.5" ry="5.5" fill="#e3ded0"/><circle cx="32" cy="41" r="2.6" fill="#263238"/><circle cx="25" cy="33" r="1.8" fill="#263238"/><circle cx="39" cy="33" r="1.8" fill="#263238"/><path d="M20 52 H44" stroke="#2e7d4f" stroke-width="4"/>',
}

export type Mood = 'n' | 'v' | 'h'

export function rudolphSvg(mood: Mood = 'n') {
  return (
    `<svg class="rud" data-e="${mood}" viewBox="0 0 200 240" aria-hidden="true"><g filter="url(#pcGrain)">` +
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
  return `<svg viewBox="0 0 64 64" aria-hidden="true">${ART[who]}</svg>`
}
