import { useState } from 'react'
import type { MemoryMotif } from '../../../content/types'
import { MEMORY_ART } from '../../memoryArt'

const STEP = 850

type Frame = { index: number; motif: MemoryMotif } | { index: number; text: string; prompt: string }

export function Memory({ items }: { items: MemoryMotif[] }) {
  const [frame, setFrame] = useState<Frame>({
    index: -1,
    text: 'Flockes Erinnerung',
    prompt: 'Tippen zum Abspielen',
  })
  const [playing, setPlaying] = useState(false)

  function play() {
    if (playing) return
    setPlaying(true)
    items.forEach((motif, index) => setTimeout(() => setFrame({ index, motif }), index * STEP))
    setTimeout(() => {
      setFrame({
        index: items.length,
        text: '… und weg ist die Erinnerung.',
        prompt: 'Nochmal tippen',
      })
      setPlaying(false)
    }, items.length * STEP)
  }

  return (
    <div className="memory">
      <button
        className="screen"
        type="button"
        aria-disabled={playing}
        aria-label={playing ? undefined : 'Flockes Erinnerung abspielen'}
        onClick={play}
      >
        <span aria-live="polite">
          {'motif' in frame ? (
            <svg
              key={frame.index}
              className="flash"
              viewBox="0 0 100 100"
              role="img"
              aria-label={MEMORY_ART[frame.motif].label}
              dangerouslySetInnerHTML={{ __html: MEMORY_ART[frame.motif].svg }}
            />
          ) : (
            <span key={frame.index} className="caption">
              {frame.text}
              <small>{frame.prompt}</small>
            </span>
          )}
        </span>
      </button>
    </div>
  )
}
