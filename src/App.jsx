import { useCallback, useEffect, useRef, useState } from 'react'
import RobotCanvas from './components/RobotCanvas'
import NavBar from './components/NavBar'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ProjectsPage from './pages/ProjectsPage'

function getRoute() {
  return window.location.hash.replace(/^#/, '') || '/'
}

export default function App() {
  const [route, setRoute] = useState(getRoute)
  const robotRef = useRef(null)
  const busyRef = useRef(false)

  useEffect(() => {
    const onHashChange = () => setRoute(getRoute())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const navigate = useCallback((nextRoute, node) => {
    if (busyRef.current || !robotRef.current || !node) return
    busyRef.current = true
    const rect = node.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = Math.max(rect.bottom + 80, 130)
    robotRef.current.walkTo(x, y, () => {
      robotRef.current.reach(() => {
        const origin = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        }
        robotRef.current.unpack(origin, () => {
          window.location.hash = nextRoute
          busyRef.current = false
        })
      })
    })
  }, [])

  let page
  if (route === '/about') page = <AboutPage />
  else if (route === '/projects') page = <ProjectsPage />
  else page = <HomePage />

  return (
    <div className="app">
      <RobotCanvas robotRef={robotRef} />
      <main className="page" key={route}>
        {page}
      </main>
      <NavBar active={route} onNavigate={navigate} />
    </div>
  )
}