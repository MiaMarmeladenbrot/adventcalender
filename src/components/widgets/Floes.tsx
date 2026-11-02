import { useState } from 'react'

type Cell = [number, number]

interface Props {
  grid: number[][]
  start: Cell[]
  solved?: boolean
  onArrive: (values: number[]) => void
}

const STEPS: Cell[] = [
  [-1, 0],
  [0, -1],
  [0, 1],
  [1, 0],
]

function walk(grid: number[][], path: Cell[]): Cell[] | null {
  const [row, column] = path[path.length - 1]
  if (row === grid.length - 1) return path
  const expected = grid[row][column] + path.length
  for (const [dr, dc] of STEPS) {
    const next: Cell = [row + dr, column + dc]
    const value = grid[next[0]]?.[next[1]]
    const visited = path.some(([r, c]) => r === next[0] && c === next[1])
    if (value !== expected || visited) continue
    const found = walk(grid, [...path, next])
    if (found) return found
  }
  return null
}

export function Floes({ grid, start, solved = false, onArrive }: Props) {
  const [path, setPath] = useState<Cell[]>(() => (solved ? (walk(grid, start) ?? start) : start))
  const [message, setMessage] = useState('')
  const [shaking, setShaking] = useState(false)

  const onPath = (row: number, column: number) => path.some(([r, c]) => r === row && c === column)

  function jump(row: number, column: number) {
    if (solved || onPath(row, column)) return
    const [lastRow, lastColumn] = path[path.length - 1]
    const neighbour = Math.abs(lastRow - row) + Math.abs(lastColumn - column) === 1
    const expected = grid[lastRow][lastColumn] + path.length
    if (neighbour && grid[row][column] === expected) {
      const next: Cell[] = [...path, [row, column]]
      setPath(next)
      setMessage('')
      if (row === grid.length - 1) {
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
        <span className="lbl">Ufer</span>
        <div className={`floes${shaking ? ' shake' : ''}`}>
          {grid.map((row, rowIndex) =>
            row.map((value, columnIndex) => (
              <button
                key={`${rowIndex}-${columnIndex}`}
                type="button"
                className={`floe${onPath(rowIndex, columnIndex) ? ' on' : ''}`}
                disabled={solved}
                onClick={() => jump(rowIndex, columnIndex)}
              >
                {value}
              </button>
            )),
          )}
        </div>
        <span className="lbl">Mitte des Sees</span>
      </div>
      <p className="floemsg" aria-live="polite">
        {message}
      </p>
    </>
  )
}
