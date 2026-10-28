import { useState } from 'react'

const STEP = 850

export function Memory({ items }: { items: string[] }) {
  const [shown, setShown] = useState('Flockes Erinnerung')
  const [playing, setPlaying] = useState(false)

  function play() {
    setPlaying(true)
    items.forEach((item, index) => setTimeout(() => setShown(item), index * STEP))
    setTimeout(() => {
      setShown('… und weg ist die Erinnerung.')
      setPlaying(false)
    }, items.length * STEP)
  }

  return (
    <div className="memory">
      <div className="screen" aria-live="polite">
        {shown}
      </div>
      <button className="go" type="button" disabled={playing} onClick={play}>
        Erinnerung abspielen
      </button>
    </div>
  )
}
