# Canvas drawing

## [demo](https://garevna.github.io/canvas/)

## Import and Config

```js
import { Canvas } from './components/Canvas'

const { image } = require('./configs').default

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
```
