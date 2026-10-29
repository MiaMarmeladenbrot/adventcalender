export function MorseTape({ shown }: { shown: string }) {
  return (
    <div className="morse">
      <div className="dots" aria-live="polite">
        {shown}
      </div>
      {!shown && <p className="wnote">Tippe unten auf Rudolph.</p>}
    </div>
  )
}
