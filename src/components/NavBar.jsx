import { useRef } from 'react'
import ColourSlider from './ColourSlider'

const ITEMS = [
  { label: 'Home', route: '/' },
  { label: 'CV', route: '/cv' },
  { label: "Don't click", route: '/surprise' },
]

export default function NavBar({
  active,
  onNavigate,
  accent,
  onAccentChange,
  turbo,
  onToggleTurbo,
}) {
  const refs = useRef({})

  return (
    <nav className="nav">
      <span className="brand">Harry Bromley</span>
      <div className="nav-links">
        {ITEMS.map((it) => (
          <button
            key={it.route}
            ref={(el) => (refs.current[it.route] = el)}
            className={`nav-btn${active === it.route ? ' active' : ''}`}
            onClick={() => onNavigate(it.route, refs.current[it.route])}
          >
            {it.label}
          </button>
        ))}
      </div>
      <div className="nav-tools">
        <ColourSlider
          accent={accent}
          onChange={onAccentChange}
          turbo={turbo}
          onToggleTurbo={onToggleTurbo}
        />
      </div>
    </nav>
  )
}