import { CanvasPoint } from './CanvasPoint'

const { getTextSize, getVelocity } = require('../helpers').default
const { defaults } = require('../configs').default

export class Canvas extends HTMLElement {
  constructor (section = document.body) {
    super()

    Object.assign(this, {
      section,
      image: null,
      text: '',
      current: 0,
      shadow: this.attachShadow({ mode: 'closed' })
    })
  }

  clear () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  getKey () {
    return ['startWith', 'switchTo'][this.current]
  }

  connectedCallback () {
    const {
      fontFamily = defaults.fontFamily,
      fontSize = defaults.fontSize
    } = this.options || defaults

    Object.assign(this, {
      canvas: Object.assign(this.shadow.appendChild(document.createElement('canvas')), {
        style: `background: ${this.getAttribute('background') || 'transparent'}`
      }),
      fontFamily,
      fontSize,
      points: []
    })

    this.ctx = Object.assign(this.canvas.getContext('2d'), {
      willReadFrequently: true,
      textBaseline: 'top'
    })

    this.onclick = function (event) {
      this.points.forEach(point => Object.assign(point, { mode: 'break' }))
      this.loop.bind(this)()
        .then(function () {
          this.clear()
          this.current = Math.abs(1 - this.current)
          this.createPoints()
          this.loop()
        }.bind(this))
    }.bind(this)

    this.current = 0
    this.createPoints()
    this.loop()
  }

  drawPoint (point) {
    Object.assign(this.ctx, {
      fillStyle: point.color,
      globalAlpha: point.opacity
    })
    this.ctx.fillRect(point.current.x, point.current.y, 1, 1)
  }

  loop (callback) {
    const recurse = function (callback) {
      const active = this.points.filter(point => !!point.distance)

      if (!active.length) callback()

      this.clear()

      this.points.forEach(point => {
        point.move()
        this.drawPoint(point)
      })

      if (active.length) requestAnimationFrame(recurse.bind(this, callback))
      else callback()
    }.bind(this)

    return new Promise(resolve => recurse(resolve))
  }

  drawText (text) {
    const { width, height } = getTextSize(text, this.fontFamily, this.fontSize)

    Object.assign(this.canvas, { width: width + 64, height })

    this.clear()

    Object.assign(this.ctx, {
      font: `bold ${this.fontSize}px ${this.fontFamily}`,
      lineWidth: 0,
      strokeStyle: '#555',
      fillStyle: '#555'
    })

    this.ctx.fillText(text, 32, Math.round(height * 0.72))

    return this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
  }

  drawImage (src) {
    const image = Object.assign(new Image(), { src })
    return new Promise(function (resolve) {
      image.onload = function (event) {
        const { width, height } = event.target
        const area = Math.round(Math.max(width, height)) * 2
        Object.assign(this.canvas, { width: area, height: area })
        Object.assign(this.ctx, { lineWidth: 0 })
        this.ctx.drawImage(image, Math.round((area - width) / 2), Math.round((area - height) / 2))
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
        resolve(imageData)
      }.bind(this)
    }.bind(this))
  }

  getImageData () {
    const { [this.getKey()]: { type, src } } = this.options

    return new Promise(function (resolve) {
      if (type === 'image') {
        this.drawImage(src)
          .then(result => resolve(result))
      } else {
        resolve(this.drawText(src))
      }
    }.bind(this))
  }

  createPoints () {
    this.points = []
    this.clear()

    this.getImageData()
      .then(function (imageData) {
        const ctxData = imageData.data
        const { width, height } = this.canvas

        for (let point = 0; point < ctxData.length; point += 4) {
          if (ctxData[point] || ctxData[point + 1] || ctxData[point + 2]) {
            this.points.push(new CanvasPoint({ width, height },
              {
                x: Math.round((point % (width * 4)) / 4),
                y: Math.round(point / (width * 4))
              }))
          }
        }
        this.clear()
        this.points[0].setVelocity(getVelocity(this.points.length))
        this.points.forEach(point => this.drawPoint(point))

        this.loop.bind(this)()
      }.bind(this))
  }
}

customElements.define('canvas-element', Canvas)
