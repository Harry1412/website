const TAU = Math.PI * 2
const UNPACK_DURATION = 0.65
const UNPACK_RAISE = 0.2
const UNPACK_GROW = 0.35
const UNPACK_COLOR = '#f2f1ed'
const REACH_DURATION = 0.55
const EASE = (t) => t * t * (3 - 2 * t)

function limb(ctx, px, py, len, width, ang) {
  ctx.save()
  ctx.translate(px, py)
  ctx.rotate(ang)
  ctx.beginPath()
  ctx.roundRect(-width / 2, 0, width, len, 3)
  ctx.fill()
  ctx.restore()
}

export class Robot {
  constructor() {
    this.x = 0
    this.y = 0
    this.w = 0
    this.h = 0
    this.ready = false

    this.speed = 360
    this.state = 'idle'
    this.facing = 1
    this.clock = 0
    this.walkTime = 0
    this.unpackTime = 0

    this.target = null
    this.onArrive = null
    this.onUnpackDone = null
    this.onReachDone = null

    this.mouseX = null
    this.mouseY = null
    this.wave = 0
  }

  resetFor(size) {
    if (this.w === size.w && this.h === size.h && this.ready) return
    this.w = size.w
    this.h = size.h
    if (!this.ready) {
      this.x = this.w / 2
      this.y = this.h * 0.66
      this.ready = true
    }
  }

  walkTo(x, y, onArrive) {
    this.target = { x, y }
    this.onArrive = onArrive || null
    this.state = 'walking'
  }

  unpack(origin, onDone) {
    this.state = 'unpacking'
    this.unpackTime = 0
    this.coverOrigin = origin || { x: this.x, y: this.y }
    this.onUnpackDone = onDone || null
  }

  reach(onDone) {
    this.state = 'reaching'
    this.unpackTime = 0
    this.onReachDone = onDone || null
  }

  update(dt) {
    this.clock += dt

    if (this.state === 'walking') {
      const dx = this.target.x - this.x
      const dy = this.target.y - this.y
      const dist = Math.hypot(dx, dy)
      const step = this.speed * dt
      if (dist <= step) {
        this.x = this.target.x
        this.y = this.target.y
        this.target = null
        this.state = 'idle'
        const cb = this.onArrive
        this.onArrive = null
        if (cb) cb()
      } else {
        this.x += (dx / dist) * step
        this.y += (dy / dist) * step
        this.walkTime += dt
        if (Math.abs(dx) > 1) this.facing = dx >= 0 ? 1 : -1
      }
    } else if (this.state === 'reaching') {
      this.unpackTime += dt
      if (this.unpackTime >= REACH_DURATION) {
        this.state = 'idle'
        const cb = this.onReachDone
        this.onReachDone = null
        if (cb) cb()
      }
    } else if (this.state === 'unpacking') {
      this.unpackTime += dt
      if (this.unpackTime >= UNPACK_DURATION) {
        this.state = 'idle'
        const cb = this.onUnpackDone
        this.onUnpackDone = null
        if (cb) cb()
      }
    }

    if (this.state === 'idle') {
      const hovering =
        this.mouseX !== null &&
        this.mouseX >= this.x - 34 &&
        this.mouseX <= this.x + 34 &&
        this.mouseY >= this.y - 100 &&
        this.mouseY <= this.y + 4
      if (hovering) this.wave = Math.min(1, this.wave + dt / 0.18)
      else this.wave = Math.max(0, this.wave - dt / 0.25)
    } else {
      this.wave = Math.max(0, this.wave - dt / 0.2)
    }
  }

  draw(ctx) {
    if (!this.ready) return

    const walking = this.state === 'walking'
    const reaching = this.state === 'reaching'
    const unpacking = this.state === 'unpacking'
    const raise = unpacking
      ? EASE(Math.min(this.unpackTime / UNPACK_RAISE, 1))
      : reaching
        ? EASE(Math.min(this.unpackTime / REACH_DURATION, 1))
        : 0
    const shake = unpacking ? Math.sin(performance.now() / 12) * 2 * raise : 0
    const breathe = reaching ? Math.sin(this.clock * 3) * 1.2 : Math.sin(this.clock * 2.2) * 1.4
    const bob = walking ? -Math.abs(Math.sin(this.walkTime * 13)) * 5 : breathe
    const swing = walking ? Math.sin(this.walkTime * 13) : 0
    const stepLift = walking ? Math.abs(Math.sin(this.walkTime * 13)) * 6 : 0

    ctx.save()
    ctx.translate(this.x, this.y + shake)

    if (unpacking && raise >= 1) {
      ctx.restore()
      this.drawCover(ctx)
    } else {
      this.drawActor(ctx, {
        bob,
        swing,
        stepLift,
        walking,
        raise,
      })
      ctx.restore()
    }
  }

  drawActor(ctx, s) {
    const { bob, swing, stepLift, walking, raise } = s

    ctx.translate(0, bob)
    ctx.scale(this.facing, 1)

    ctx.fillStyle = '#ffffff'

    ctx.beginPath()
    ctx.ellipse(0, 0, 26, 6, 0, 0, TAU)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.14)'
    ctx.fill()

    ctx.fillStyle = '#ffffff'

    ctx.save()
    ctx.translate(0, -stepLift)
    limb(ctx, -9, -26, 26, 8, swing * 0.4)
    limb(ctx, 9, -26, 26, 8, -swing * 0.4)
    ctx.restore()

    const armSwing = walking ? -swing * 0.45 : 0
    const waveBase = -this.wave * Math.PI * 0.9
    const waveOsc = this.wave * Math.sin(this.clock * 8) * 0.35
    limb(ctx, -18, -62, 26, 7, armSwing - raise * Math.PI * 0.95)
    limb(ctx, 18, -62, 26, 7, -armSwing + raise * Math.PI * 0.95 + waveBase + waveOsc)

    ctx.beginPath()
    ctx.roundRect(-10, -30, 20, 8, 3)
    ctx.fill()

    ctx.beginPath()
    ctx.roundRect(-19, -62, 38, 34, 7)
    ctx.fill()

    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)'
    ctx.beginPath()
    ctx.roundRect(-9, -52, 18, 6, 2)
    ctx.fill()

    ctx.fillStyle = '#ffffff'

    ctx.beginPath()
    ctx.roundRect(-15, -72, 30, 22, 6)
    ctx.fill()

    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(1, -72)
    ctx.lineTo(1, -83)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(1, -87, 3.5, 0, TAU)
    ctx.fill()

    ctx.fillStyle = '#000000'
    ctx.beginPath()
    ctx.arc(-5, -63, 3, 0, TAU)
    ctx.arc(5, -63, 3, 0, TAU)
    ctx.fill()
  }

  drawCover(ctx) {
    const { x: ox, y: oy } = this.coverOrigin
    const corners = [
      [0, 0],
      [this.w, 0],
      [0, this.h],
      [this.w, this.h],
    ]
    const maxDist = Math.max(
      ...corners.map(([cx, cy]) => Math.hypot(cx - ox, cy - oy)),
    )
    const p = EASE(
      Math.min(Math.max((this.unpackTime - UNPACK_RAISE) / UNPACK_GROW, 0), 1),
    )
    const radius = Math.max(10, maxDist * p)
    ctx.fillStyle = UNPACK_COLOR
    ctx.beginPath()
    ctx.roundRect(ox - radius, oy - radius, radius * 2, radius * 2, 14)
    ctx.fill()
  }
}