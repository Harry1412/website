import { useEffect, useRef } from 'react'
import { Robot } from '../game/robot'

export default function RobotCanvas({ robotRef, accent }) {
  const canvasRef = useRef(null)
  const robot = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let raf = 0
    let last = performance.now()

    robot.current = new Robot()
    robotRef.current = robot.current

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      robot.current.resetFor({ w, h })
    }

    resize()
    window.addEventListener('resize', resize)

    const loop = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      robot.current.update(dt)
      ctx.save()
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.restore()
      robot.current.draw(ctx)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      robotRef.current = null
    }
  }, [robotRef])

  useEffect(() => {
    if (robot.current) robot.current.accent = accent
  }, [accent])

  const handleClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    robot.current.walkTo(e.clientX - rect.left, e.clientY - rect.top)
  }

  const handleMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    robot.current.mouseX = e.clientX - rect.left
    robot.current.mouseY = e.clientY - rect.top
  }

  const handleLeave = () => {
    robot.current.mouseX = null
    robot.current.mouseY = null
  }

  return (
    <canvas
      ref={canvasRef}
      className="robot-canvas"
      onClick={handleClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      aria-hidden="true"
    />
  )
}