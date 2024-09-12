export function getTextSize (text, font = 'Arial', size = 72, tagName = 'div') {
  const elem = document.body.appendChild(document.createElement(tagName))
  Object.assign(elem, {
    innerText: text,
    style: `display: inline-block; box-sizing: border-box; position: fixed; top: -500px; font-family: ${font}; font-size: ${size}px; font-weight: bold;`
  })
  const { width, height } = elem.getBoundingClientRect()
  elem.remove()
  return { width, height }
}
