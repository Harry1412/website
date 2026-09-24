import { useRef } from 'react'
import ColourSlider from './ColourSlider'

const ITEMS = [
  { label: 'Home', route: '/' },
  { label: 'About', route: '/about' },
  { label: 'Surprise', route: '/surprise' },
]

export default function NavBar({ active, onNavigate, accent, onAccentChange }) {
  const refs = useRef({})

  return (
    <nav className="nav">
      <span className="brand">Harry Bromley</span>
      <div className="nav-right">
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
        <ColourSlider accent={accent} onChange={onAccentChange} />
      </div>
    </nav>
  )
}