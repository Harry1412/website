import { useEffect, useRef, useState } from 'react'
import ColourSlider from './ColourSlider'

const ITEMS = [
  { label: 'Home', route: '/' },
  { label: 'CV', route: '/cv' },
  { label: 'Gallery', route: '/gallery' },
  { label: "Don't click", route: '/surprise' },
]

// bulbs are 9px wide with a 24px gap; 16px padding each side
const LIGHT_PITCH = 33
const LIGHT_MARGIN = 16

function lightCount(width) {
  return Math.max(1, Math.floor((width - LIGHT_MARGIN * 2) / LIGHT_PITCH))
}

function XmasTree() {
  return (
    <svg
      className="xmas-tree"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      role="img"
      aria-label="Christmas tree"
    >
      <path
        d="M12 2l4.5 6h-3l3.5 5h-3l3 4.5H7l3-4.5H7l3.5-5h-3L12 2z"
        fill="#2e7d32"
      />
      <rect x="10.5" y="17.5" width="3" height="3.5" fill="#6d4c41" />
      <path d="M12 0.5l0.9 1.9 2.1 0.3-1.5 1.5 0.35 2.1L12 5.3l-1.85 1 0.35-2.1L9 2.7l2.1-0.3L12 0.5z" fill="#ffd740" />
      <circle cx="12" cy="8.5" r="1" fill="#ff5252" />
      <circle cx="10" cy="12" r="1" fill="#40c4ff" />
      <circle cx="14" cy="14.5" r="1" fill="#ffd740" />
    </svg>
  )
}

export default function NavBar({
  active,
  onNavigate,
  accent,
  onAccentChange,
  robotOn,
  onToggleRobot,
  christmas,
}) {
  const refs = useRef({})
  const [lights, setLights] = useState(() =>
    christmas ? lightCount(window.innerWidth) : 0,
  )

  useEffect(() => {
    if (!christmas) return
    const onResize = () => setLights(lightCount(window.innerWidth))
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [christmas])

  return (
    <nav className="nav">
      {christmas && (
        <div className="xmas-lights" aria-hidden="true">
          {Array.from({ length: lights }, (_, i) => (
            <span key={i} className={`xmas-bulb b${i % 4}`} />
          ))}
        </div>
      )}
      <span className="brand">
        {christmas && <XmasTree />}
        Harry Bromley
      </span>
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
          robotOn={robotOn}
          onToggleRobot={onToggleRobot}
          christmas={christmas}
        />
      </div>
    </nav>
  )
}