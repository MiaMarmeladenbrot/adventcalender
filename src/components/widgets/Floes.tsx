import { useState } from 'react'

type Cell = [number, number]

interface Props {
  grid: number[][]
  start: Cell[]
  onArrive: (values: number[]) => void
}

export function Floes({ grid, start, onArrive }: Props) {
  const [path, setPath] = useState<Cell[]>(start)
  const [message, setMessage] = useState('')
  const [shaking, setShaking] = useState(false)

  const onPath = (row: number, column: number) => path.some(([r, c]) => r === row && c === column)

  function jump(row: number, column: number) {
    if (onPath(row, column)) return
    const [lastRow, lastColumn] = path[path.length - 1]
    const neighbour = Math.abs(lastRow - row) + Math.abs(lastColumn - column) === 1
    const expected = grid[lastRow][lastColumn] + path.length
    if (neighbour && grid[row][column] === expected) {
      const next: Cell[] = [...path, [row, column]]
      setPath(next)
      setMessage('')
      if (row === 0) {
        onArrive(next.slice(start.length).map(([r, c]) => grid[r][c]))
      }
      return
    }
    setMessage(
      neighbour
        ? 'Platsch! Die Scholle trägt nicht. Zurück zu Bertas Spuren.'
        : 'Zu weit. Du kannst nur auf eine Nachbarscholle springen.',
    )
    if (neighbour) setPath(start)
    setShaking(true)
    setTimeout(() => setShaking(false), 400)
  }

  return (
    <>
      <div className="lake">
        <span className="lbl">Mitte des Sees</span>
        <div className={`floes${shaking ? ' shake' : ''}`}>
          {grid.map((row, rowIndex) =>
            row.map((value, columnIndex) => (
              <button
                key={`${rowIndex}-${columnIndex}`}
                type="button"
                className={`floe${onPath(rowIndex, columnIndex) ? ' on' : ''}`}
                onClick={() => jump(rowIndex, columnIndex)}
              >
                {value}
              </button>
            )),
          )}
        </div>
        <span className="lbl">Ufer</span>
      </div>
      <p className="floemsg" aria-live="polite">
        {message}
      </p>
    </>
  )
}
