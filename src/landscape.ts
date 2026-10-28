export const WORLD_WIDTH = 2400
export const START_X = 150
export const LANTERN_GAP = (WORLD_WIDTH - START_X - 90) / 23

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

export const PLACE_ART = {
  stall:
    '<rect x="18" y="42" width="84" height="53" fill="#9e2b25"/><path d="M10 46 L30 20 H90 L110 46Z" fill="#f4f7fa"/><path d="M44 95 V60 H76 V95Z" fill="#5a1a16"/><path d="M44 60 L76 95 M76 60 L44 95" stroke="#f4f7fa" stroke-width="3"/><circle cx="60" cy="34" r="6" fill="#ffd27a"/>',
  bake: '<rect x="20" y="44" width="80" height="51" fill="#b9773d"/><path d="M10 48 L60 10 L110 48Z" fill="#8a5426"/><path d="M10 48 Q20 56 30 48 Q40 56 50 48 Q60 56 70 48 Q80 56 90 48 Q100 56 110 48" stroke="#ffffff" stroke-width="4" fill="none"/><circle cx="40" cy="64" r="8" fill="#ffd27a"/><circle cx="80" cy="64" r="8" fill="#ffd27a"/><rect x="52" y="72" width="16" height="23" rx="8" fill="#5a3418"/><circle cx="35" cy="34" r="3" fill="#e53935"/><circle cx="60" cy="24" r="3" fill="#2e7d4f"/><circle cx="85" cy="34" r="3" fill="#e53935"/>',
  gate: '<path d="M14 95 V40 Q60 -6 106 40 V95 H84 V50 Q60 22 36 50 V95Z" fill="#bfe3f2" stroke="#7fb8d1" stroke-width="2"/><path d="M30 30 L36 20 M60 12 V2 M90 30 L84 20" stroke="#7fb8d1" stroke-width="2"/>',
  peak: '<path d="M4 95 L46 22 L62 46 L78 30 L116 95Z" fill="#6f86a6"/><path d="M46 22 L57 41 L50 37 L44 44 L38 36Z M78 30 L88 47 L80 44 L74 48 L71 42Z" fill="#f4f7fa"/>',
  lake: '<ellipse cx="60" cy="86" rx="58" ry="12" fill="#cfe9f5" stroke="#9cc9de"/><path d="M36 82 H82 Q90 82 90 74" stroke="#d9a93a" stroke-width="3" fill="none"/><path d="M40 60 H78 L84 76 H44Z" fill="#c62828"/><path d="M78 60 Q84 50 90 56" stroke="#c62828" stroke-width="5" fill="none"/><rect x="30" y="54" width="64" height="30" rx="6" fill="#bfe3f2" opacity=".6"/>',
  workshop:
    '<rect x="15" y="40" width="90" height="55" fill="#7a3b2e"/><rect x="80" y="12" width="12" height="24" fill="#5a2a20"/><path d="M5 44 L60 8 L115 44Z" fill="#f4f7fa"/><rect x="28" y="56" width="16" height="16" fill="#ffd27a"/><rect x="76" y="56" width="16" height="16" fill="#ffd27a"/><rect x="51" y="66" width="18" height="29" fill="#3d1f18"/>',
}

export const LANTERN_SVG =
  '<svg viewBox="0 0 22 46" aria-hidden="true"><rect x="10" y="14" width="2" height="32" fill="#3a2a22"/><path d="M5 4 H17 L15 15 H7Z" fill="#5a6474" stroke="#3a2a22" stroke-width="1.4"/><rect x="6" y="1" width="10" height="3" fill="#3a2a22"/></svg>'

export const SLED_SVG =
  '<svg viewBox="0 0 40 26" aria-hidden="true"><path d="M3 21 H33 Q38 21 38 15" stroke="#7a4a2a" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M9 21 V16 M27 21 V16" stroke="#7a4a2a" stroke-width="2"/><rect x="6" y="9" width="26" height="8" rx="2" fill="#c62828"/><circle cx="13" cy="5" r="4" fill="#f2c9a5"/><path d="M9 4 L13 -3 L17 4Z" fill="#2e7d4f"/><circle cx="24" cy="5" r="4" fill="#f2c9a5"/><path d="M20 4 L24 -3 L28 4Z" fill="#c62828"/></svg>'
