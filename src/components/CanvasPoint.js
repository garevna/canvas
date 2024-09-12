const { colors } = require('../configs').default
const { getSign } = require('../helpers').default

export class CanvasPoint {
  constructor ({ width, height }, { x, y }) {
    const broken = {
      x: Math.round(Math.random() * width),
      y: Math.round(Math.random() * height)
    }

    const maxDistance = Math.sqrt(Math.pow(x - broken.x, 2) + Math.pow(y - broken.y, 2))

    Object.assign(this, {
      normal: this.clone({ x, y }),
      current: this.clone(broken),
      broken: this.clone(broken),
      maxDistance,
      color: colors[Math.round(Math.random() * (colors.length - 1))],
      mode: 'restore'
    })

    Object.defineProperty(this, 'target', {
      get () {
        const { x, y } = this.clone(this.mode === 'restore' ? this.normal : this.broken)
        return { x, y }
      }
    })

    Object.defineProperty(this, 'distance', {
      get () {
        return Math.sqrt(Math.pow(this.dx, 2) + Math.pow(this.dy, 2))
      }
    })

    Object.defineProperty(this, 'dx', {
      get () {
        return this.target.x - this.current.x
      }
    })

    Object.defineProperty(this, 'dy', {
      get () {
        return this.target.y - this.current.y
      }
    })

    Object.defineProperty(this, 'sign', {
      get () {
        return {
          x: Math.round(this.dx / Math.abs(this.dx)),
          y: Math.round(this.dy / Math.abs(this.dy))
        }
      }
    })

    Object.defineProperty(this, 'opacity', {
      get () {
        return this.mode === 'restore'
          ? (1 - this.distance / this.maxDistance).toFixed(2)
          : (this.distance / this.maxDistance).toFixed(2)
      }
    })
  }

  setVelocity (value) {
    CanvasPoint.prototype.velocity = value
  }

  clone (object) {
    return JSON.parse(JSON.stringify(object))
  }

  move () {
    if (!this.distance) return

    let { x, y } = this.current

    x += this.dx
      ? this.dy
        ? this.sign.x * Math.min(Math.abs(this.dx), this.velocity || 1)
        : this.sign.x * Math.abs(this.dx)
      : 0
    y += this.dy ? this.sign.y * Math.min(Math.abs(this.dy), this.velocity || 1) : 0

    Object.assign(this.current, { x, y })
  }
}
