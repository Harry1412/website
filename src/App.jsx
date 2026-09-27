import { useCallback, useEffect, useRef, useState } from 'react'
import RobotCanvas from './components/RobotCanvas'
import NavBar from './components/NavBar'
import HomePage from './pages/HomePage'
import CVPage from './pages/CVPage'
import SurprisePage from './pages/SurprisePage'
import { ACCENTS } from './components/ColourSlider'
import SocialLinks from './components/SocialLinks'

const EXPAND_MS = 340
const CONTRACT_MS = 420

function getRoute() {
  return window.location.hash.replace(/^#/, '') || '/'
}

function coverRadius(ox, oy) {
  const w = window.innerWidth
  const h = window.innerHeight
  return Math.max(
    Math.hypot(ox, oy),
    Math.hypot(w - ox, oy),
    Math.hypot(ox, h - oy),
    Math.hypot(w - ox, h - oy),
  )
}

export default function App() {
  const [route, setRoute] = useState(getRoute)
  const [cover, setCover] = useState(null)
  const [accent, setAccent] = useState(ACCENTS[1])
  const [turbo, setTurbo] = useState(false)
  const [robotOn, setRobotOn] = useState(true)
  const [solved, setSolved] = useState(false)
  const robotRef = useRef(null)
  const busyRef = useRef(false)
  const timersRef = useRef([])

  useEffect(() => {
    const onHashChange = () => setRoute(getRoute())
    window.addEventListener('hashchange', onHashChange)
    return () => {
      window.removeEventListener('hashchange', onHashChange)
      timersRef.current.forEach(clearTimeout)
    }
  }, [])

  useEffect(() => {
    if (robotRef.current) {
      robotRef.current.showFloor = route === '/surprise' && solved
    }
  }, [route, solved])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [route])

  const schedule = useCallback((fn, ms) => {
    timersRef.current.push(setTimeout(fn, ms))
  }, [])

  const navigate = useCallback(
    (nextRoute, node) => {
      if (!robotOn) {
        window.location.hash = nextRoute
        return
      }
      if (busyRef.current || !robotRef.current || !node) return
      busyRef.current = true
      const rect = node.getBoundingClientRect()
      const x = rect.left + rect.width / 2
      const y = Math.max(rect.bottom + 80, 130)
      const origin = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      }
      const full = coverRadius(origin.x, origin.y)
      const boost = turbo ? 2.5 : 1
      const expandMs = EXPAND_MS
      const contractMs = Math.round(CONTRACT_MS / boost)

      robotRef.current.walkTo(x, y, () => {
        robotRef.current.reach(() => {
          robotRef.current.unpack()
          setCover({ ...origin, radius: 0, duration: 0 })
          requestAnimationFrame(() => {
            setCover({ ...origin, radius: full, duration: expandMs })
          })
          schedule(() => {
            window.location.hash = nextRoute
            setCover({ ...origin, radius: 0, duration: contractMs })
          }, expandMs + 30)
          schedule(() => {
            setCover(null)
            busyRef.current = false
          }, expandMs + 30 + contractMs)
        })
      })
    },
    [schedule, turbo, robotOn],
  )
  const handleSocial = useCallback((node) => {
    if (!robotRef.current || !node) return
    const rect = node.getBoundingClientRect()
    const x = rect.left - 40
    const y = rect.top + rect.height / 2
    robotRef.current.walkTo(x, y, () => {
      robotRef.current.doWave()
    })
  }, [])

  let page
  if (route === '/cv') page = <CVPage />
  else if (route === '/surprise')
    page = (
      <SurprisePage
        solved={solved}
        onSolve={() => setSolved(true)}
        robotOn={robotOn}
      />
    )
  else page = <HomePage />

  return (
    <div className="app" style={{ '--accent': accent }}>
      <RobotCanvas robotRef={robotRef} accent={accent} turbo={turbo} enabled={robotOn} />
      <main className="page" key={route}>
        {page}
      </main>
      <NavBar
        active={route}
        onNavigate={navigate}
        accent={accent}
        onAccentChange={setAccent}
        turbo={turbo}
        onToggleTurbo={() => setTurbo((t) => !t)}
        robotOn={robotOn}
        onToggleRobot={() => setRobotOn((r) => !r)}
      />
      {route === '/' && <SocialLinks onActivate={handleSocial} />}
      {cover && (
        <div
          className="cover"
          style={{
            clipPath: `circle(${cover.radius}px at ${cover.x}px ${cover.y}px)`,
            transition: `clip-path ${cover.duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
          }}
        />
      )}
    </div>
  )
}