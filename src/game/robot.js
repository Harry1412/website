const TAU = Math.PI * 2
const UNPACK_RAISE = 0.2
const UNPACK_HOLD = 0.15
const UNPACK_LOWER = 0.25
const UNPACK_TOTAL = UNPACK_RAISE + UNPACK_HOLD + UNPACK_LOWER
const REACH_DURATION = 0.55
const EASE = (t) => t * t * (3 - 2 * t)
const FLOOR_CELLS = 3
const FLOOR_GAP = 4
const FLOOR_COLORS = [
  '#ff6b6b',
  '#ffd93d',
  '#6bcb77',
  '#4d96ff',
  '#6c5ce7',
  '#ff9f43',
  '#c780fa',
  '#4ecdc4',
  '#ff7eb6',
]

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
    this.onReachDone = null

    this.mouseX = null
    this.mouseY = null
    this.wave = 0
    this.showFloor = false
    this.dance = 0
    this.accent = '#ffffff'
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

  unpack() {
    this.state = 'unpacking'
    this.unpackTime = 0
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
      if (this.unpackTime >= UNPACK_TOTAL) {
        this.state = 'idle'
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

    const f = this.showFloor ? this.floorRect() : null
    const inFloor =
      !!f &&
      this.x >= f.left &&
      this.x <= f.right &&
      this.y >= f.top &&
      this.y <= f.bottom
    const wantDance = this.state === 'idle' && inFloor
    if (wantDance) this.dance = Math.min(1, this.dance + dt / 0.25)
    else this.dance = Math.max(0, this.dance - dt / 0.2)
  }

  draw(ctx) {
    if (!this.ready) return

    const walking = this.state === 'walking'
    const reaching = this.state === 'reaching'
    const unpacking = this.state === 'unpacking'
    let raise = 0
    if (unpacking) {
      const t = this.unpackTime
      if (t < UNPACK_RAISE) raise = EASE(t / UNPACK_RAISE)
      else if (t < UNPACK_RAISE + UNPACK_HOLD) raise = 1
      else raise = 1 - EASE((t - UNPACK_RAISE - UNPACK_HOLD) / UNPACK_LOWER)
    } else if (reaching) {
      raise = EASE(Math.min(this.unpackTime / REACH_DURATION, 1))
    }
    const shake = unpacking ? Math.sin(performance.now() / 12) * 2 * raise : 0
    const breathe = reaching ? Math.sin(this.clock * 3) * 1.2 : Math.sin(this.clock * 2.2) * 1.4
    const danceBob = this.dance > 0 ? -Math.abs(Math.sin(this.clock * 9)) * 10 * this.dance : 0
    const danceTilt = this.dance > 0 ? Math.sin(this.clock * 7) * 0.16 * this.dance : 0
    const danceArm = this.dance > 0 ? Math.sin(this.clock * 9) * 1.0 * this.dance : 0
    const bob = (walking ? -Math.abs(Math.sin(this.walkTime * 13)) * 5 : breathe) + danceBob
    const swing = walking ? Math.sin(this.walkTime * 13) : 0
    const stepLift = walking ? Math.abs(Math.sin(this.walkTime * 13)) * 6 : 0

    if (this.showFloor) this.drawFloor(ctx)

    ctx.save()
    ctx.translate(this.x, this.y + shake)

    this.drawActor(ctx, {
      bob,
      swing,
      stepLift,
      walking,
      raise,
      danceTilt,
      danceArm,
    })

    ctx.restore()
  }

  floorRect() {
    const s = 170
    const left = (this.w - s) / 2
    const top = this.h * 0.6 - s / 2
    return { left, top, right: left + s, bottom: top + s }
  }

  drawFloor(ctx) {
    const f = this.floorRect()
    const size = f.right - f.left
    const cell = (size - FLOOR_GAP * (FLOOR_CELLS - 1)) / FLOOR_CELLS
    for (let row = 0; row < FLOOR_CELLS; row++) {
      for (let col = 0; col < FLOOR_CELLS; col++) {
        const x = f.left + col * (cell + FLOOR_GAP)
        const y = f.top + row * (cell + FLOOR_GAP)
        ctx.fillStyle = FLOOR_COLORS[row * FLOOR_CELLS + col]
        ctx.beginPath()
        ctx.roundRect(x, y, cell, cell, 6)
        ctx.fill()
      }
    }
  }

  drawActor(ctx, s) {
    const { bob, swing, stepLift, walking, raise, danceTilt, danceArm } = s

    ctx.translate(0, bob)
    ctx.rotate(danceTilt)
    ctx.scale(this.facing, 1)

    ctx.beginPath()
    ctx.ellipse(0, 0, 26, 6, 0, 0, TAU)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.14)'
    ctx.fill()

    ctx.fillStyle = this.accent

    ctx.save()
    ctx.translate(0, -stepLift)
    limb(ctx, -9, -26, 26, 8, swing * 0.4)
    limb(ctx, 9, -26, 26, 8, -swing * 0.4)
    ctx.restore()

    const armSwing = walking ? -swing * 0.45 : 0
    const waveBase = -this.wave * Math.PI * 0.9
    const waveOsc = this.wave * Math.sin(this.clock * 8) * 0.35
    limb(ctx, -18, -62, 26, 7, armSwing - raise * Math.PI * 0.95 + danceArm)
    limb(ctx, 18, -62, 26, 7, -armSwing + raise * Math.PI * 0.95 + waveBase + waveOsc - danceArm)

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

    ctx.fillStyle = this.accent

    ctx.beginPath()
    ctx.roundRect(-15, -72, 30, 22, 6)
    ctx.fill()

    ctx.strokeStyle = this.accent
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
}