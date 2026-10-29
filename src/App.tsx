import { useCallback, useEffect, useState } from 'react'
import { DayView } from './components/DayView'
import { PaperDefs } from './components/Face'
import { Landscape } from './components/Landscape'
import { Notebook } from './components/Notebook'
import { Prolog } from './components/Prolog'
import { api, rememberPreviewToken } from './lib/api'
import { familyCode, storedPlayer, storePlayer } from './lib/session'
import type { GameState, View } from './lib/types'

const BLINK_EVERY = 3600

function useBlinking() {
  useEffect(() => {
    const timer = setInterval(() => {
      document.querySelectorAll('.fig').forEach((figure) => {
        setTimeout(() => {
          figure.classList.add('blink')
          setTimeout(() => figure.classList.remove('blink'), 140)
        }, Math.random() * 1200)
      })
    }, BLINK_EVERY)
    return () => clearInterval(timer)
  }, [])
}

function firstOpenDay(state: GameState) {
  return state.doors.find((door) => !state.solved.includes(door.day))?.day ?? state.unlocked
}

export default function App() {
  const [code] = useState(familyCode)
  const [player, setPlayer] = useState(() => (code ? storedPlayer(code) : null))
  const [state, setState] = useState<GameState | null>(null)
  const [view, setView] = useState<View>({ kind: 'map' })
  const [selected, setSelected] = useState<number | null>(null)
  const [book, setBook] = useState<'closed' | 'open' | 'closing'>('closed')
  const [fresh, setFresh] = useState<number | null>(null)
  const [error, setError] = useState('')
  useBlinking()

  useEffect(rememberPreviewToken, [])

  const refresh = useCallback(async () => {
    if (!code || !player) return
    try {
      setState(await api.state(code, player))
    } catch (failure) {
      storePlayer(code, null)
      setPlayer(null)
      setError(failure instanceof Error ? failure.message : 'Das hat nicht geklappt.')
    }
  }, [code, player])

  useEffect(() => {
    void refresh()
  }, [refresh])

  useEffect(() => {
    if (state && selected === null) setSelected(firstOpenDay(state))
  }, [state, selected])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [view])

  const closeBook = useCallback(() => {
    setBook('closed')
    setFresh(null)
  }, [])

  async function mark(item: string, crossed: boolean) {
    if (!code || !player || !state) return
    setState({ ...state, marks: { ...state.marks, [item]: crossed } })
    await api.mark(code, player, item, crossed)
  }

  function backToMap(day?: number) {
    if (day !== undefined && state) setSelected(state.solved.includes(day) ? firstOpenDay(state) : day)
    setView({ kind: 'map' })
  }

  if (!code) {
    return (
      <main className="wrap">
        <h1>Wo ist der Schlitten?</h1>
        <p className="lede">Dieser Kalender öffnet sich nur über den Link, den du von deiner Familie bekommen hast.</p>
      </main>
    )
  }

  if (!player) {
    return (
      <main className="stageview">
        <PaperDefs />
        <Prolog
          code={code}
          nickname={null}
          notice={error}
          onJoined={(id) => {
            storePlayer(code, id)
            setError('')
            setView({ kind: 'map' })
            setPlayer(id)
          }}
          onContinue={() => undefined}
        />
      </main>
    )
  }

  if (!state) {
    return (
      <main className="wrap">
        <h1>Wo ist der Schlitten?</h1>
        <p className="wnote">Einen Moment …</p>
      </main>
    )
  }

  if (view.kind === 'map') {
    return (
      <main className="mapview">
        <PaperDefs />
        <Landscape
          state={state}
          selected={selected ?? 0}
          onSelect={setSelected}
          onOpen={(day) => setView(day === 0 ? { kind: 'prolog' } : { kind: 'day', day })}
          onNotebook={() => setBook('open')}
        />
        {book !== 'closed' && (
          <Notebook
            state={state}
            closing={book === 'closing'}
            onMark={mark}
            onRequestClose={() => setBook('closing')}
            onClosed={closeBook}
            fresh={fresh}
          />
        )}
      </main>
    )
  }

  if (view.kind === 'day') {
    return (
      <main className="pageview">
        <PaperDefs />
        <DayView
          key={view.day}
          code={code}
          player={player}
          day={view.day}
          door={state.doors.find((entry) => entry.day === view.day)}
          nickname={state.me.nickname}
          finalMessage={state.family.finalMessage}
          onSolved={() => void refresh()}
          onBack={() => backToMap(view.day)}
          onNotebook={() => {
            backToMap(view.day)
            setFresh(view.day)
            setBook('open')
          }}
        />
      </main>
    )
  }

  return (
    <main className="stageview">
      <PaperDefs />
      <Prolog
        code={code}
        nickname={state.me.nickname}
        onJoined={() => undefined}
        onContinue={() => backToMap()}
        onBack={() => backToMap()}
      />
    </main>
  )
}
