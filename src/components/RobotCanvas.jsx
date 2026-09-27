import { useEffect, useRef } from 'react'
import { Robot } from '../game/robot'

export default function RobotCanvas({ robotRef, accent, turbo, enabled }) {
  const canvasRef = useRef(null)
  const robot = useRef(null)
  const enabledRef = useRef(enabled)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let raf = 0
    let last = performance.now()
    let needsClear = true
    let lastW = 0
    let lastH = 0
    let lastDpr = 0

    robot.current = new Robot()
    robotRef.current = robot.current

    // viewport-sized canvas; the robot lives in viewport coordinates. we only
    // reallocate the backing store when the size actually changes, since
    // resizing a canvas is costly and mobile safari fires resize as its
    // toolbar collapses/expands.
    const sync = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      // cap the backing resolution lower on phones to cut per-frame fill cost
      const dpr = Math.min(window.devicePixelRatio || 1, w < 768 ? 1.5 : 2)
      if (w === lastW && h === lastH && dpr === lastDpr) return
      lastW = w
      lastH = h
      lastDpr = dpr
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const nav = document.querySelector('.nav')
      const navBottom = nav ? nav.getBoundingClientRect().bottom : 56
      robot.current.resetFor({ w, h, vh: h, navBottom })
    }

    const clear = () => {
      ctx.save()
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.restore()
    }

    sync()
    window.addEventListener('resize', sync)

    const loop = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      if (enabledRef.current && robot.current.ready) {
        clear()
        robot.current.update(dt)
        robot.current.draw(ctx)
        needsClear = true
      } else if (needsClear) {
        clear()
        needsClear = false
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', sync)
      robotRef.current = null
    }
  }, [robotRef])

  useEffect(() => {
    if (robot.current) robot.current.accent = accent
  }, [accent])

  useEffect(() => {
    if (robot.current) robot.current.turbo = turbo
  }, [turbo])

  useEffect(() => {
    enabledRef.current = enabled
  }, [enabled])

  const handleClick = (e) => {
    if (!enabled) return
    robot.current.walkTo(e.clientX, e.clientY)
  }

  const handleMove = (e) => {
    robot.current.mouseX = e.clientX
    robot.current.mouseY = e.clientY
  }

  const handleLeave = () => {
    robot.current.mouseX = null
    robot.current.mouseY = null
  }

  return (
    <>
      <div
        className="robot-catcher"
        onClick={handleClick}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
      />
      <canvas ref={canvasRef} className="robot-canvas" aria-hidden="true" />
    </>
  )
}