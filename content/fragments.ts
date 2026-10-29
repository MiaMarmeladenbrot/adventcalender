const MORSE: Record<string, string> = {
  A: '·–',
  B: '–···',
  C: '–·–·',
  D: '–··',
  E: '·',
  F: '··–·',
  G: '––·',
  H: '····',
  I: '··',
  J: '·–––',
  K: '–·–',
  L: '·–··',
  M: '––',
  N: '–·',
  O: '–––',
  P: '·––·',
  Q: '––·–',
  R: '·–·',
  S: '···',
  T: '–',
  U: '··–',
  V: '···–',
  W: '·––',
  X: '–··–',
  Y: '–·––',
  Z: '––··',
}

export const MORSE_POSTER =
  '<div class="poster mono">' +
  Object.entries(MORSE)
    .map(([letter, code]) => `<span><b>${letter}</b> ${code}</span>`)
    .join('') +
  '</div>'

export const MIRRORED_CLOCK =
  '<div class="clock"><svg viewBox="0 0 100 100" aria-label="Foto der Stalluhr">' +
  '<circle cx="50" cy="50" r="46" fill="#fbf6ea" stroke="#2a1f1a" stroke-width="3"/>' +
  '<g transform="translate(100 0) scale(-1 1)" font-family="Georgia, serif" font-size="12" fill="#2a1f1a" text-anchor="middle">' +
  '<text x="50" y="19">12</text><text x="85" y="54">3</text><text x="50" y="90">6</text><text x="15" y="54">9</text>' +
  '<line x1="50" y1="50" x2="69.9" y2="40.7" stroke="#2a1f1a" stroke-width="4" stroke-linecap="round"/>' +
  '<line x1="50" y1="50" x2="77.7" y2="34" stroke="#2a1f1a" stroke-width="2.5" stroke-linecap="round"/>' +
  '</g><circle cx="50" cy="50" r="3" fill="#b3262d"/></svg></div>'

export const KEY_HOOKS =
  '<div class="hooks"><div><svg viewBox="0 0 60 40" aria-label="Hammer">' +
  '<rect x="10" y="6" width="28" height="12" rx="2" fill="#5a6474"/><rect x="21" y="16" width="6" height="22" rx="2" fill="#a0703f"/>' +
  '</svg><span class="mono">KDPPHU</span></div>' +
  '<div><span class="empty">leer</span><span class="mono">VFKOLWWHQ</span></div></div>'

export function shelves(rows: [number, string[]][]) {
  return (
    '<div class="shelves">' +
    rows
      .map(
        ([slot, items]) =>
          `<div class="shelf"><b>${slot}</b>${items.map((item) => `<span>${item}</span>`).join('')}</div>`,
      )
      .join('') +
    '</div>'
  )
}

export function cookieTray(slots: string[]) {
  return (
    '<div class="blech">' +
    slots
      .map((letter) => (letter ? `<span>${letter}</span>` : '<span class="crumb">·:·</span>'))
      .join('') +
    '</div>'
  )
}

export function auroraRow(colours: string[], label: string) {
  return (
    '<div class="arow">' +
    colours.map((colour) => `<i style="background:${colour}"></i>`).join('') +
    `<b class="mono">${label}</b></div>`
  )
}

export function timeCards(cards: [string, string][]) {
  return (
    '<div class="cards">' +
    cards
      .map(([letter, text]) => `<div class="tcard"><b>${letter}</b><span>${text}</span></div>`)
      .join('') +
    '</div>'
  )
}

export function letterGrid(rows: string[][], withHeaders = false) {
  const header = withHeaders
    ? '<tr><th></th>' + rows[0].map((_, index) => `<th>${index + 1}</th>`).join('') + '</tr>'
    : ''
  const body = rows
    .map(
      (row, index) =>
        '<tr>' +
        (withHeaders ? `<th>${String.fromCharCode(65 + index)}</th>` : '') +
        row.map((cell) => `<td>${cell}</td>`).join('') +
        '</tr>',
    )
    .join('')
  return `<table class="grid${withHeaders ? '' : ' mask-ready'}">${header}${body}</table>`
}

export const GREEN = '#3fd08a'
export const BLUE = '#3f8cff'
export const VIOLET = '#9b6bff'
