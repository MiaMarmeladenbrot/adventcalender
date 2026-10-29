import { useRef, type PointerEvent } from 'react'

const TREES = [
  [6, 58],
  [47, 8],
  [70, 60],
  [24, 12],
]

export function Torch({ digits }: { digits: { digit: string; left: number; top: number }[] }) {
  const dark = useRef<HTMLDivElement>(null)

  function shine(event: PointerEvent<HTMLDivElement>) {
    const box = event.currentTarget.getBoundingClientRect()
    dark.current?.style.setProperty('--x', `${event.clientX - box.left}px`)
    dark.current?.style.setProperty('--y', `${event.clientY - box.top}px`)
  }

  return (
    <>
      <div className="torch" onPointerMove={shine} onPointerDown={shine}>
        {TREES.map(([left, top]) => (
          <i key={`${left}-${top}`} className="tree" style={{ left: `${left}%`, top: `${top}%` }} />
        ))}
        {digits.map((spot) => (
          <span
            key={`${spot.left}-${spot.top}`}
            className="t"
            style={{ left: `${spot.left}%`, top: `${spot.top}%` }}
          >
            {spot.digit}
          </span>
        ))}
        <div className="dark" ref={dark} />
      </div>
      <p className="wnote">Mit dem Finger über die Fläche fahren.</p>
    </>
  )
}
