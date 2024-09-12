import 'garevna-canvas'

const { image } = require('./configs').default

document.body.style = 'background: #000'

const canvas = document.createElement('canvas-element')

canvas.options = {
  startWith: {
    type: 'image',
    src: image
  },
  switchTo: {
    type: 'text',
    src: 'garevna'
  },
  fontSize: 90,
  fontFamily: 'Verdana, Geneva, Sans-Serif',
  background: 'transparent'
}

document.body.appendChild(canvas)
