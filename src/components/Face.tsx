import { NAMES } from '../../content/constants'
import { faceSvg, rudolphSvg, type Mood } from '../characters'
import type { Line, Who } from '../lib/types'

export function Face({ who, size, mood }: { who: Who; size: number | string; mood?: Mood }) {
  return (
    <span
      className="face"
      style={{ width: size, aspectRatio: '5 / 6' }}
      dangerouslySetInnerHTML={{ __html: who === 'rudolph' && mood ? rudolphSvg(mood) : faceSvg(who) }}
    />
  )
}

export function Bubble({ line, tail = 'center' }: { line: Line; tail?: 'center' | 'left' | 'right' }) {
  const [who, text] = line
  return (
    <div className={`bubble tail-${tail}`} key={text}>
      <span className="who">{NAMES[who]}</span>
      {text}
    </div>
  )
}

export function PaperDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <filter id="pc" x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves={2} seed={4} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={2.2} xChannelSelector="R" yChannelSelector="G" result="d" />
          <feDropShadow in="d" dx={1.2} dy={2.2} stdDeviation={1.1} floodColor="#1a0f08" floodOpacity={0.32} />
        </filter>
        <filter id="pcGrain" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves={2} seed={7} result="g" />
          <feColorMatrix in="g" type="matrix" values="0 0 0 0 .2  0 0 0 0 .12  0 0 0 0 .05  .35 0 0 0 -.12" result="ga" />
          <feComposite in="ga" in2="SourceGraphic" operator="in" result="gm" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="gm" />
          </feMerge>
        </filter>
        <radialGradient id="noseGlow">
          <stop offset="0" stopColor="#ff6a4d" stopOpacity=".9" />
          <stop offset=".45" stopColor="#ff3b2f" stopOpacity=".35" />
          <stop offset="1" stopColor="#ff3b2f" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  )
}
