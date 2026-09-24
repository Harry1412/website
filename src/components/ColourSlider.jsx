export const ACCENTS = ['#ffffff', '#dadada', '#a0a0a0']

export default function ColourSlider({ accent, onChange }) {
  return (
    <div className="colour-slider" role="radiogroup" aria-label="Accent colour">
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
  )
}