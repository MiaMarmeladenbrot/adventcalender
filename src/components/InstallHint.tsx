import { useState, useSyncExternalStore } from 'react'
import {
  alreadyInstalled,
  askToInstall,
  installWaiting,
  onHandheld,
  subscribeToInstall,
  usesIosSafari,
} from '../lib/install'

const PUT_AWAY = 'adventskalender-startbildschirm'

const SHARE_ICON =
  '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="M8 7l4-4 4 4"/><path d="M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1"/></svg>'

function wasPutAway() {
  try {
    return localStorage.getItem(PUT_AWAY) !== null
  } catch {
    return false
  }
}

function rememberPutAway() {
  try {
    localStorage.setItem(PUT_AWAY, '1')
  } catch {
    return
  }
}

export function InstallHint() {
  const waiting = useSyncExternalStore(subscribeToInstall, installWaiting, () => null)
  const [putAway, setPutAway] = useState(wasPutAway)

  const inReach = onHandheld() && !alreadyInstalled()
  const steps = inReach && usesIosSafari()
  const offer = inReach && Boolean(waiting)

  if (putAway || (!steps && !offer)) return null

  return (
    <div className="install-hint" role="note">
      <p>
        {steps ? (
          <>
            Leg den Kalender auf deinen Startbildschirm: unten auf{' '}
            <span
              className="share"
              aria-label="Teilen"
              dangerouslySetInnerHTML={{ __html: SHARE_ICON }}
            />{' '}
            tippen, dann „Zum Home-Bildschirm“. Beim ersten Öffnen dort einfach deinen Spitznamen
            nochmal eingeben.
          </>
        ) : (
          'Leg den Kalender auf deinen Startbildschirm, dann ist er jeden Morgen gleich zur Hand.'
        )}
      </p>
      {offer && (
        <button type="button" className="install-go" onClick={() => void askToInstall()}>
          Zum Startbildschirm hinzufügen
        </button>
      )}
      <button
        type="button"
        className="install-close"
        aria-label="Hinweis ausblenden"
        onClick={() => {
          setPutAway(true)
          rememberPutAway()
        }}
      >
        ×
      </button>
    </div>
  )
}
