let audio: AudioContext | null = null

function chime(notes: number[]) {
  if (!audio) audio = new AudioContext()
  if (audio.state === 'suspended') void audio.resume()
  const start = audio.currentTime + 0.05
  notes.forEach((frequency, index) => {
    const at = start + index * 0.4
    for (const [overtone, volume] of [
      [1, 0.22],
      [2.76, 0.06],
      [5.4, 0.03],
    ]) {
      const oscillator = audio!.createOscillator()
      const gain = audio!.createGain()
      oscillator.frequency.value = frequency * overtone
      gain.gain.setValueAtTime(0, at)
      gain.gain.linearRampToValueAtTime(volume, at + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.0001, at + 1.1)
      oscillator.connect(gain)
      gain.connect(audio!.destination)
      oscillator.start(at)
      oscillator.stop(at + 1.2)
    }
  })
}

interface Props {
  bells: { name: string; notes: number[] }[]
  recording: number[]
}

export function Bells({ bells, recording }: Props) {
  return (
    <div className="bells">
      <button className="go" type="button" onClick={() => chime(recording)}>
        Aufnahme abspielen
      </button>
      <div className="pills">
        {bells.map((bell) => (
          <button key={bell.name} className="pill" type="button" onClick={() => chime(bell.notes)}>
            Glöckchen {bell.name}
          </button>
        ))}
      </div>
      <p className="wnote">Ton an.</p>
    </div>
  )
}
