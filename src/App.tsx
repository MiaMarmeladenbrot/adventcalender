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
      document.querySelectorAll('.rud').forEach((rudolph) => {
        setTimeout(() => {
          rudolph.classList.add('blink')
          setTimeout(() => rudolph.classList.remove('blink'), 140)
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

  async function mark(item: string, crossed: boolean) {
    if (!code || !player || !state) return
    setState({ ...state, marks: { ...state.marks, [item]: crossed } })
    await api.mark(code, player, item, crossed)
  }

  function backToMap(day?: number) {
    if (day !== undefined) setSelected(day)
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

  if (!player || !state) {
    return (
      <main className="wrap">
        <PaperDefs />
        <header className="top">
          <span className="eyebrow">Soko Schlitten</span>
          <h1>Wo ist der Schlitten?</h1>
        </header>
        {error && <p className="wrong">{error}</p>}
        {player ? (
          <p className="wnote">Einen Moment …</p>
        ) : (
          <Prolog
            code={code}
            nickname={null}
            onJoined={(id) => {
              storePlayer(code, id)
              setError('')
              setView({ kind: 'map' })
              setPlayer(id)
            }}
            onContinue={() => undefined}
          />
        )}
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
          onNotebook={() => setView({ kind: 'book' })}
        />
      </main>
    )
  }

  return (
    <main className="wrap">
      <PaperDefs />
      <button type="button" className="back" onClick={() => backToMap(view.kind === 'day' ? view.day : undefined)}>
        ‹ Zur Landschaft
      </button>
      {view.kind === 'prolog' && (
        <Prolog code={code} nickname={state.me.nickname} onJoined={() => undefined} onContinue={() => backToMap()} />
      )}
      {view.kind === 'book' && <Notebook state={state} onMark={mark} />}
      {view.kind === 'day' && (
        <DayView
          key={view.day}
          code={code}
          player={player}
          day={view.day}
          unlocked={state.unlocked}
          nickname={state.me.nickname}
          finalMessage={state.family.finalMessage}
          onSolved={() => void refresh()}
          onNavigate={(day) => setView({ kind: 'day', day })}
        />
      )}
    </main>
  )
}
