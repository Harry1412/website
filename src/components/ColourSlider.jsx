export const ACCENTS = ['#ffffff', '#dadada', '#a0a0a0']

function RobotFace({ filled }) {
  return (
    <svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true">
      {filled ? (
        <>
          <rect x="11.2" y="4" width="1.6" height="4.5" fill="currentColor" />
          <circle cx="12" cy="3.2" r="1.6" fill="currentColor" />
          <rect x="4.5" y="8" width="15" height="12.5" rx="3.5" fill="currentColor" />
          <circle cx="9" cy="14.25" r="1.7" fill="#000" />
          <circle cx="15" cy="14.25" r="1.7" fill="#000" />
        </>
      ) : (
        <>
          <line
            x1="12"
            y1="8"
            x2="12"
            y2="4.6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <circle
            cx="12"
            cy="3.4"
            r="1.4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <rect
            x="4.5"
            y="8"
            width="15"
            height="12.5"
            rx="3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle cx="9" cy="14.25" r="1.5" fill="currentColor" />
          <circle cx="15" cy="14.25" r="1.5" fill="currentColor" />
        </>
      )}
    </svg>
  )
}

export default function ColourSlider({
  accent,
  onChange,
  robotOn,
  onToggleRobot,
}) {
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
        className="robot-toggle"
        onClick={onToggleRobot}
        aria-pressed={robotOn}
        aria-label={robotOn ? 'Disable robot' : 'Enable robot'}
        title={robotOn ? 'Disable robot' : 'Enable robot'}
      >
        <RobotFace filled={robotOn} />
      </button>
    </div>
  )
}