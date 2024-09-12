# Canvas drawing

Images or texts are ‘assembled’ from pixels.

When clicked, they are ‘scattered’ into pixels.

## 👀  [demo](https://garevna.github.io/canvas/)

## Install package

```console
yarn add garevna-package
```

## Import package

```js
import 'garevna-package'
```

## Create and Config

```js
const canvas = document.createElement('canvas-element')
```

If you do not configure the component, it will work with default settings.

You can set the colour of the backgound (transparent by default), for texts - font size and font family.

You can specify two texts, or two images, or one text and one image in the settings, so that when you click, one text is replaced by the other.

### ☕ For example, two texts:

```js
canvas.options = {
  startWith: {
    type: 'text',
    src: '✈'
  },
  switchTo: {
    type: 'text',
    src: '❤'
  },
  fontSize: 90,
  fontFamily: 'Verdana, Geneva, Sans-Serif',
  background: 'transparent'
}

document.body.appendChild(canvas)
```

### ☕ Image and text:

```js
const { image } = require('./configs').default

const canvas = document.createElement('canvas-element')

canvas.options = {
  startWith: {
    type: 'image',
    src: image
  },
  switchTo: {
    type: 'text',
    src: 'JS'
  },
  fontSize: 90,
  fontFamily: 'Verdana, Geneva, Sans-Serif',
  background: 'transparent'
}

document.body.appendChild(canvas)
```

⚠️ The image should be in base64 format (**data:image/png;base64,...**)

You can [convert your image to base64 format](https://www.base64-image.de/) online.
