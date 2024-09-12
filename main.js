/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/components/Canvas.js":
/*!**********************************!*\
  !*** ./src/components/Canvas.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Canvas: () => (/* binding */ Canvas)\n/* harmony export */ });\n/* harmony import */ var _CanvasPoint__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CanvasPoint */ \"./src/components/CanvasPoint.js\");\n\r\n\r\nconst { getTextSize, getVelocity } = (__webpack_require__(/*! ../helpers */ \"./src/helpers/index.js\")[\"default\"])\r\nconst { defaults } = (__webpack_require__(/*! ../configs */ \"./src/configs/index.js\")[\"default\"])\r\n\r\nclass Canvas extends HTMLElement {\r\n  constructor (section = document.body) {\r\n    super()\r\n\r\n    Object.assign(this, {\r\n      section,\r\n      image: null,\r\n      text: '',\r\n      current: 0,\r\n      shadow: this.attachShadow({ mode: 'closed' })\r\n    })\r\n  }\r\n\r\n  clear () {\r\n    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)\r\n  }\r\n\r\n  getKey () {\r\n    return ['startWith', 'switchTo'][this.current]\r\n  }\r\n\r\n  connectedCallback () {\r\n    const {\r\n      fontFamily = defaults.fontFamily,\r\n      fontSize = defaults.fontSize\r\n    } = this.options || defaults\r\n\r\n    Object.assign(this, {\r\n      canvas: Object.assign(this.shadow.appendChild(document.createElement('canvas')), {\r\n        style: `background: ${this.getAttribute('background') || 'transparent'}`\r\n      }),\r\n      fontFamily,\r\n      fontSize,\r\n      points: []\r\n    })\r\n\r\n    this.ctx = Object.assign(this.canvas.getContext('2d'), {\r\n      willReadFrequently: true,\r\n      textBaseline: 'top'\r\n    })\r\n\r\n    this.onclick = function (event) {\r\n      this.points.forEach(point => Object.assign(point, { mode: 'break' }))\r\n      this.loop.bind(this)()\r\n        .then(function () {\r\n          this.clear()\r\n          this.current = Math.abs(1 - this.current)\r\n          this.createPoints()\r\n          this.loop()\r\n        }.bind(this))\r\n    }.bind(this)\r\n\r\n    this.current = 0\r\n    this.createPoints()\r\n    this.loop()\r\n  }\r\n\r\n  drawPoint (point) {\r\n    Object.assign(this.ctx, {\r\n      fillStyle: point.color,\r\n      globalAlpha: point.opacity\r\n    })\r\n    this.ctx.fillRect(point.current.x, point.current.y, 1, 1)\r\n  }\r\n\r\n  loop (callback) {\r\n    const recurse = function (callback) {\r\n      const active = this.points.filter(point => !!point.distance)\r\n\r\n      if (!active.length) callback()\r\n\r\n      this.clear()\r\n\r\n      this.points.forEach(point => {\r\n        point.move()\r\n        this.drawPoint(point)\r\n      })\r\n\r\n      if (active.length) requestAnimationFrame(recurse.bind(this, callback))\r\n      else callback()\r\n    }.bind(this)\r\n\r\n    return new Promise(resolve => recurse(resolve))\r\n  }\r\n\r\n  drawText (text) {\r\n    const { width, height } = getTextSize(text, this.fontFamily, this.fontSize)\r\n\r\n    Object.assign(this.canvas, { width: width + 64, height })\r\n\r\n    this.clear()\r\n\r\n    Object.assign(this.ctx, {\r\n      font: `bold ${this.fontSize}px ${this.fontFamily}`,\r\n      lineWidth: 0,\r\n      strokeStyle: '#555',\r\n      fillStyle: '#555'\r\n    })\r\n\r\n    this.ctx.fillText(text, 32, Math.round(height * 0.72))\r\n\r\n    return this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)\r\n  }\r\n\r\n  drawImage (src) {\r\n    const image = Object.assign(new Image(), { src })\r\n    return new Promise(function (resolve) {\r\n      image.onload = function (event) {\r\n        const { width, height } = event.target\r\n        const area = Math.round(Math.max(width, height)) * 2\r\n        Object.assign(this.canvas, { width: area, height: area })\r\n        Object.assign(this.ctx, { lineWidth: 0 })\r\n        this.ctx.drawImage(image, Math.round((area - width) / 2), Math.round((area - height) / 2))\r\n        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)\r\n        resolve(imageData)\r\n      }.bind(this)\r\n    }.bind(this))\r\n  }\r\n\r\n  getImageData () {\r\n    const { [this.getKey()]: { type, src } } = this.options\r\n\r\n    return new Promise(function (resolve) {\r\n      if (type === 'image') {\r\n        this.drawImage(src)\r\n          .then(result => resolve(result))\r\n      } else {\r\n        resolve(this.drawText(src))\r\n      }\r\n    }.bind(this))\r\n  }\r\n\r\n  createPoints () {\r\n    this.points = []\r\n    this.clear()\r\n\r\n    this.getImageData()\r\n      .then(function (imageData) {\r\n        const ctxData = imageData.data\r\n        const { width, height } = this.canvas\r\n\r\n        for (let point = 0; point < ctxData.length; point += 4) {\r\n          if (ctxData[point] || ctxData[point + 1] || ctxData[point + 2]) {\r\n            this.points.push(new _CanvasPoint__WEBPACK_IMPORTED_MODULE_0__.CanvasPoint({ width, height },\r\n              {\r\n                x: Math.round((point % (width * 4)) / 4),\r\n                y: Math.round(point / (width * 4))\r\n              }))\r\n          }\r\n        }\r\n        this.clear()\r\n        this.points[0].setVelocity(getVelocity(this.points.length))\r\n        this.points.forEach(point => this.drawPoint(point))\r\n\r\n        this.loop.bind(this)()\r\n      }.bind(this))\r\n  }\r\n}\r\n\r\ncustomElements.define('canvas-element', Canvas)\r\n\n\n//# sourceURL=webpack://canvas/./src/components/Canvas.js?");

/***/ }),

/***/ "./src/components/CanvasPoint.js":
/*!***************************************!*\
  !*** ./src/components/CanvasPoint.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   CanvasPoint: () => (/* binding */ CanvasPoint)\n/* harmony export */ });\nconst { colors } = (__webpack_require__(/*! ../configs */ \"./src/configs/index.js\")[\"default\"])\r\nconst { getSign } = (__webpack_require__(/*! ../helpers */ \"./src/helpers/index.js\")[\"default\"])\r\n\r\nclass CanvasPoint {\r\n  constructor ({ width, height }, { x, y }) {\r\n    const broken = {\r\n      x: Math.round(Math.random() * width),\r\n      y: Math.round(Math.random() * height)\r\n    }\r\n\r\n    const maxDistance = Math.sqrt(Math.pow(x - broken.x, 2) + Math.pow(y - broken.y, 2))\r\n\r\n    Object.assign(this, {\r\n      normal: this.clone({ x, y }),\r\n      current: this.clone(broken),\r\n      broken: this.clone(broken),\r\n      maxDistance,\r\n      color: colors[Math.round(Math.random() * (colors.length - 1))],\r\n      mode: 'restore'\r\n    })\r\n\r\n    Object.defineProperty(this, 'target', {\r\n      get () {\r\n        const { x, y } = this.clone(this.mode === 'restore' ? this.normal : this.broken)\r\n        return { x, y }\r\n      }\r\n    })\r\n\r\n    Object.defineProperty(this, 'distance', {\r\n      get () {\r\n        return Math.sqrt(Math.pow(this.dx, 2) + Math.pow(this.dy, 2))\r\n      }\r\n    })\r\n\r\n    Object.defineProperty(this, 'dx', {\r\n      get () {\r\n        return this.target.x - this.current.x\r\n      }\r\n    })\r\n\r\n    Object.defineProperty(this, 'dy', {\r\n      get () {\r\n        return this.target.y - this.current.y\r\n      }\r\n    })\r\n\r\n    Object.defineProperty(this, 'sign', {\r\n      get () {\r\n        return {\r\n          x: Math.round(this.dx / Math.abs(this.dx)),\r\n          y: Math.round(this.dy / Math.abs(this.dy))\r\n        }\r\n      }\r\n    })\r\n\r\n    Object.defineProperty(this, 'opacity', {\r\n      get () {\r\n        return this.mode === 'restore'\r\n          ? (1 - this.distance / this.maxDistance).toFixed(2)\r\n          : (this.distance / this.maxDistance).toFixed(2)\r\n      }\r\n    })\r\n  }\r\n\r\n  setVelocity (value) {\r\n    CanvasPoint.prototype.velocity = value\r\n  }\r\n\r\n  clone (object) {\r\n    return JSON.parse(JSON.stringify(object))\r\n  }\r\n\r\n  move () {\r\n    if (!this.distance) return\r\n\r\n    let { x, y } = this.current\r\n\r\n    x += this.dx\r\n      ? this.dy\r\n        ? this.sign.x * Math.min(Math.abs(this.dx), this.velocity || 1)\r\n        : this.sign.x * Math.abs(this.dx)\r\n      : 0\r\n    y += this.dy ? this.sign.y * Math.min(Math.abs(this.dy), this.velocity || 1) : 0\r\n\r\n    Object.assign(this.current, { x, y })\r\n  }\r\n}\r\n\n\n//# sourceURL=webpack://canvas/./src/components/CanvasPoint.js?");

/***/ }),

/***/ "./src/configs/colors.js":
/*!*******************************!*\
  !*** ./src/configs/colors.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   colors: () => (/* binding */ colors)\n/* harmony export */ });\nconst colors = [\r\n  '#fdf',\r\n  '#9f9',\r\n  '#fa5',\r\n  '#9df',\r\n  '#fdd'\r\n]\r\n\n\n//# sourceURL=webpack://canvas/./src/configs/colors.js?");

/***/ }),

/***/ "./src/configs/defaults.js":
/*!*********************************!*\
  !*** ./src/configs/defaults.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   defaults: () => (/* binding */ defaults)\n/* harmony export */ });\n/* harmony import */ var _image__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./image */ \"./src/configs/image.js\");\n\r\n\r\nconst defaults = {\r\n  fontSize: 72,\r\n  fontFamily: 'Comic Sans MS, Textile, Cursive',\r\n  image: _image__WEBPACK_IMPORTED_MODULE_0__.image,\r\n  text: 'garevna'\r\n}\r\n\n\n//# sourceURL=webpack://canvas/./src/configs/defaults.js?");

/***/ }),

/***/ "./src/configs/image.js":
/*!******************************!*\
  !*** ./src/configs/image.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   image: () => (/* binding */ image)\n/* harmony export */ });\nconst image = 'data:image/png;base64,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'\r\n\n\n//# sourceURL=webpack://canvas/./src/configs/image.js?");

/***/ }),

/***/ "./src/configs/index.js":
/*!******************************!*\
  !*** ./src/configs/index.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nconst context = __webpack_require__(\"./src/configs sync ^\\\\.\\\\/.*$\")\n\nconst moduleNames = context.keys().filter(key => key !== './' && key !== './index' && key !== './index.js')\n\nconst modules = Object.assign({}, ...moduleNames.map(name => ({ [name.split('./').join('').split('.js').join('')]: context(name) })))\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Object.assign({}, ...Object.keys(modules).map(key => ({ [key]: modules[key][key] }))));\n\n\n//# sourceURL=webpack://canvas/./src/configs/index.js?");

/***/ }),

/***/ "./src/configs sync ^\\.\\/.*$":
/*!*************************************************!*\
  !*** ./src/configs/ sync nonrecursive ^\.\/.*$ ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var map = {\n\t\"./\": \"./src/configs/index.js\",\n\t\"./colors\": \"./src/configs/colors.js\",\n\t\"./colors.js\": \"./src/configs/colors.js\",\n\t\"./defaults\": \"./src/configs/defaults.js\",\n\t\"./defaults.js\": \"./src/configs/defaults.js\",\n\t\"./image\": \"./src/configs/image.js\",\n\t\"./image.js\": \"./src/configs/image.js\",\n\t\"./index\": \"./src/configs/index.js\",\n\t\"./index.js\": \"./src/configs/index.js\"\n};\n\n\nfunction webpackContext(req) {\n\tvar id = webpackContextResolve(req);\n\treturn __webpack_require__(id);\n}\nfunction webpackContextResolve(req) {\n\tif(!__webpack_require__.o(map, req)) {\n\t\tvar e = new Error(\"Cannot find module '\" + req + \"'\");\n\t\te.code = 'MODULE_NOT_FOUND';\n\t\tthrow e;\n\t}\n\treturn map[req];\n}\nwebpackContext.keys = function webpackContextKeys() {\n\treturn Object.keys(map);\n};\nwebpackContext.resolve = webpackContextResolve;\nmodule.exports = webpackContext;\nwebpackContext.id = \"./src/configs sync ^\\\\.\\\\/.*$\";\n\n//# sourceURL=webpack://canvas/./src/configs/_sync_nonrecursive_^\\.\\/.*$?");

/***/ }),

/***/ "./src/helpers/getSign.js":
/*!********************************!*\
  !*** ./src/helpers/getSign.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   getSign: () => (/* binding */ getSign)\n/* harmony export */ });\nconst getSign = num => Math.round(num / Math.abs(num))\r\n\n\n//# sourceURL=webpack://canvas/./src/helpers/getSign.js?");

/***/ }),

/***/ "./src/helpers/getTextSize.js":
/*!************************************!*\
  !*** ./src/helpers/getTextSize.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   getTextSize: () => (/* binding */ getTextSize)\n/* harmony export */ });\nfunction getTextSize (text, font = 'Arial', size = 72, tagName = 'div') {\r\n  const elem = document.body.appendChild(document.createElement(tagName))\r\n  Object.assign(elem, {\r\n    innerText: text,\r\n    style: `display: inline-block; box-sizing: border-box; position: fixed; top: -500px; font-family: ${font}; font-size: ${size}px; font-weight: bold;`\r\n  })\r\n  const { width, height } = elem.getBoundingClientRect()\r\n  elem.remove()\r\n  return { width, height }\r\n}\r\n\n\n//# sourceURL=webpack://canvas/./src/helpers/getTextSize.js?");

/***/ }),

/***/ "./src/helpers/getVelocity.js":
/*!************************************!*\
  !*** ./src/helpers/getVelocity.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   getVelocity: () => (/* binding */ getVelocity)\n/* harmony export */ });\nconst getVelocity = points => {\r\n  return points < 3000\r\n    ? 1\r\n    : points < 7000\r\n      ? 2\r\n      : points < 12000\r\n        ? 3\r\n        : 4\r\n}\r\n\n\n//# sourceURL=webpack://canvas/./src/helpers/getVelocity.js?");

/***/ }),

/***/ "./src/helpers/index.js":
/*!******************************!*\
  !*** ./src/helpers/index.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nconst context = __webpack_require__(\"./src/helpers sync ^\\\\.\\\\/.*$\")\n\nconst moduleNames = context.keys().filter(key => key !== './' && key !== './index' && key !== './index.js')\n\nconst modules = Object.assign({}, ...moduleNames.map(name => ({ [name.split('./').join('').split('.js').join('')]: context(name) })))\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Object.assign({}, ...Object.keys(modules).map(key => ({ [key]: modules[key][key] }))));\n\n\n//# sourceURL=webpack://canvas/./src/helpers/index.js?");

/***/ }),

/***/ "./src/helpers sync ^\\.\\/.*$":
/*!*************************************************!*\
  !*** ./src/helpers/ sync nonrecursive ^\.\/.*$ ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var map = {\n\t\"./\": \"./src/helpers/index.js\",\n\t\"./getSign\": \"./src/helpers/getSign.js\",\n\t\"./getSign.js\": \"./src/helpers/getSign.js\",\n\t\"./getTextSize\": \"./src/helpers/getTextSize.js\",\n\t\"./getTextSize.js\": \"./src/helpers/getTextSize.js\",\n\t\"./getVelocity\": \"./src/helpers/getVelocity.js\",\n\t\"./getVelocity.js\": \"./src/helpers/getVelocity.js\",\n\t\"./index\": \"./src/helpers/index.js\",\n\t\"./index.js\": \"./src/helpers/index.js\"\n};\n\n\nfunction webpackContext(req) {\n\tvar id = webpackContextResolve(req);\n\treturn __webpack_require__(id);\n}\nfunction webpackContextResolve(req) {\n\tif(!__webpack_require__.o(map, req)) {\n\t\tvar e = new Error(\"Cannot find module '\" + req + \"'\");\n\t\te.code = 'MODULE_NOT_FOUND';\n\t\tthrow e;\n\t}\n\treturn map[req];\n}\nwebpackContext.keys = function webpackContextKeys() {\n\treturn Object.keys(map);\n};\nwebpackContext.resolve = webpackContextResolve;\nmodule.exports = webpackContext;\nwebpackContext.id = \"./src/helpers sync ^\\\\.\\\\/.*$\";\n\n//# sourceURL=webpack://canvas/./src/helpers/_sync_nonrecursive_^\\.\\/.*$?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _components_Canvas__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/Canvas */ \"./src/components/Canvas.js\");\n\r\n\r\nconst { image } = (__webpack_require__(/*! ./configs */ \"./src/configs/index.js\")[\"default\"])\r\n\r\ndocument.body.style = 'background: #000'\r\n\r\nconst canvas = document.createElement('canvas-element')\r\n\r\ncanvas.options = {\r\n  startWith: {\r\n    type: 'image',\r\n    src: image\r\n  },\r\n  switchTo: {\r\n    type: 'text',\r\n    src: 'garevna'\r\n  },\r\n  fontSize: 90,\r\n  fontFamily: 'Verdana, Geneva, Sans-Serif',\r\n  background: 'transparent'\r\n}\r\n\r\ndocument.body.appendChild(canvas)\r\n\n\n//# sourceURL=webpack://canvas/./src/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;