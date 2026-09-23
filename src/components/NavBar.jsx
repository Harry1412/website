import { useRef } from 'react'

const ITEMS = [
  { label: 'Home', route: '/' },
  { label: 'About', route: '/about' },
  { label: 'Projects', route: '/projects' },
]

export default function NavBar({ active, onNavigate }) {
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
    </nav>
  )
}