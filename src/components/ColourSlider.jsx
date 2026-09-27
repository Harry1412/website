export const ACCENTS = ['#ffffff', '#dadada', '#a0a0a0']

const BOLT = 'M13 2 3 14h7l-1 8 11-12h-7l1-8z'

export default function ColourSlider({ accent, onChange, turbo, onToggleTurbo }) {
  return (
    <div className="colour-slider">
      <div role="radiogroup" aria-label="Accent colour" className="colour-dots">
        {ACCENTS.map((c) => (
          <button
            key={c}
            type="button"
            role="radio"
            aria-checked={accent === c}
            aria-label={`Accent ${c}`}
            className={`colour-dot${accent === c ? ' active' : ''}`}
            style={{ background: c }}
            onClick={() => onChange(c)}
          />
        ))}
      </div>
      <button
        type="button"
        className="colour-bolt"
        onClick={onToggleTurbo}
        aria-pressed={turbo}
        aria-label="Turbo speed"
        title="Turbo speed"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path
            d={BOLT}
            fill={turbo ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  )
}