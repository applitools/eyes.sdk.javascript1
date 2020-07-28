const png = require('png-async')
const EyesJsSnippets = require('../../lib/EyesJsSnippets')
const {TypeUtils} = require('../../index')
const FakeDomSnapshot = require('./FakeDomSnapshot')

const DEFAULT_STYLES = {
  'border-left-width': '0px',
  'border-top-width': '0px',
  overflow: null,
}

const DEFAULT_PROPS = {
  clientWidth: 300,
  clientHeight: 400,
  overflow: null,
}

class MockDriver {
  constructor({isNative = false, isMobile = false} = {}) {
    this._isNative = isNative
    this._isMobile = isMobile
    this._window = {
      title: 'Default Page Title',
      url: 'http://default.url',
      rect: {x: 0, y: 0, width: 1000, height: 1000},
    }
    this._scripts = new Map()
    this._elements = new Map()
    this._contexts = new Map()
    this._contexts.set(null, {
      document: {id: Symbol('documentId')},
    })
    this._contextId = null
    this.mockElement('html', {scrollPosition: {x: 0, y: 0}})
    this.mockScript(EyesJsSnippets.GET_CURRENT_CONTEXT_INFO, () => {
      const context = this._contexts.get(this._contextId)
      const isRoot = !this._contextId
      const isCORS = !isRoot && context.isCORS
      const contentDocument = context.document
      const selector = !isCORS && !isRoot ? context.element.selector : null
      return {isRoot, isCORS, contentDocument, selector}
    })
    this.mockScript(EyesJsSnippets.GET_FRAMES, () => {
      return Array.from(this._contexts.values())
        .filter(frame => frame.parentId === this._contextId)
        .map(frame => ({isCORS: frame.isCORS, element: frame.element}))
    })
    this.mockScript(EyesJsSnippets.GET_DOCUMENT_ELEMENT, () => {
      const context = this._contexts.get(this._contextId)
      return context.document
    })
    this.mockScript(EyesJsSnippets.GET_SCROLL_POSITION, () => {
      return [0, 0]
    })
    this.mockScript(EyesJsSnippets.GET_ELEMENT_RECT, element => {
      return element.rect || {x: 0, y: 0, width: 100, height: 100}
    })
    this.mockScript(EyesJsSnippets.GET_ELEMENT_CLIENT_RECT, element => {
      return element.rect || {x: 2, y: 2, width: 200, height: 200}
    })
    this.mockScript(EyesJsSnippets.GET_ELEMENT_CSS_PROPERTIES, (properties, element) => {
      return properties.map(
        property => (element.styles || {})[property] || DEFAULT_STYLES[property],
      )
    })
    this.mockScript(EyesJsSnippets.GET_ELEMENT_PROPERTIES, (properties, element) => {
      return properties.map(property => (element.props || {})[property] || DEFAULT_PROPS[property])
    })
    this.mockScript(EyesJsSnippets.SCROLL_TO, (offset, element) => {
      let scrollingElement = element
      if (!element) {
        scrollingElement = this.findElement('html')
      }
      scrollingElement.scrollPosition = offset
      return [scrollingElement.scrollPosition.x, scrollingElement.scrollPosition.y]
    })
    this.mockScript(EyesJsSnippets.GET_SCROLL_POSITION, element => {
      let scrollingElement = element
      if (!element) {
        scrollingElement = this.findElement('html')
      }
      if (!scrollingElement.scrollPosition) {
        scrollingElement.scrollPosition = {x: 0, y: 0}
      }
      return [scrollingElement.scrollPosition.x, scrollingElement.scrollPosition.y]
    })
    this.mockScript('return window.devicePixelRatio', () => {
      return 1
    })
    this.mockScript(EyesJsSnippets.MARK_SCROLL_ROOT_ELEMENT, element => {
      element.attrs.isApplitoolsScroll = true
    })
    this.mockScript(EyesJsSnippets.GET_VIEWPORT_SIZE, () => {
      return [this._window.rect.width, this._window.rect.height]
    })
    this.mockScript(EyesJsSnippets.GET_ELEMENT_XPATH, element => {
      const elements = Array.from(this._elements.values()).reduce(
        (elements, array) => elements.concat(array),
        [],
      )
      const index = elements.findIndex(({id}) => id === element.id)
      return index >= 0
        ? `/HTML[1]/BODY[1]/DIV[${index + 1}]`
        : `//[data-fake-selector="${element.selector}"]`
    })
    this.mockScript(
      script => /^\/\* @applitools\/dom-snapshot@[\d.]+ \*\//.test(script),
      () => FakeDomSnapshot.generateDomSnapshot(this),
    )
  }
  mockScript(scriptMatcher, resultGenerator) {
    this._scripts.set(scriptMatcher, resultGenerator)
  }
  mockElement(selector, state) {
    const element = {
      id: Symbol('elementId'),
      attrs: {},
      selector,
      parentId: null,
      parentContextId: null,
      ...state,
    }
    let elements = this._elements.get(selector)
    if (!elements) {
      elements = []
      this._elements.set(selector, elements)
    }
    elements.push(element)
    if (element.frame) {
      const contextId = Symbol('contextId')
      this._contexts.set(contextId, {
        id: contextId,
        parentId: state.parentContextId,
        isCORS: state.isCORS,
        element,
        document: {id: Symbol('documentId')},
      })
      element.contextId = contextId
      this.mockElement('html', {
        parentContextId: contextId,
        scrollPosition: {x: 0, y: 0},
      })
    }
    return Object.freeze(element)
  }
  mockElements(nodes, {parentId = null, parentContextId = null} = {}) {
    for (const node of nodes) {
      const element = this.mockElement(node.selector, {...node, parentId, parentContextId})
      if (node.children) {
        this.mockElements(node.children, {
          parentId: element.frame ? null : element.id,
          parentContextId: element.frame
            ? this._contexts.get(element.contextId).id
            : parentContextId,
        })
      }
    }
  }
  async executeScript(script, args = []) {
    for (const [scriptMatcher, resultGenerator] of this._scripts.entries()) {
      if (
        TypeUtils.isFunction(scriptMatcher) ? scriptMatcher(script, args) : scriptMatcher === script
      ) {
        return TypeUtils.isFunction(resultGenerator) ? resultGenerator(...args) : resultGenerator
      }
    }
  }
  async findElement(selector) {
    const elements = this._elements.get(selector)
    return elements ? elements.find(element => element.parentContextId === this._contextId) : null
  }
  async findElements(selector) {
    const elements = this._elements.get(selector)
    return elements ? elements.filter(element => element.parentContextId === this._contextId) : []
  }
  async switchToFrame(reference) {
    if (reference === null) {
      return (this._contextId = null)
    }
    if (TypeUtils.isString(reference)) {
      reference = await this.findElement(reference)
    }
    const frame = this._contexts.get(reference.contextId)
    if (frame && this._contextId === frame.parentId) {
      return (this._contextId = frame.id)
    } else {
      throw new Error('Frame not found')
    }
  }
  async switchToParentFrame() {
    if (!this._contextId) return
    for (const frame of this._contexts.values()) {
      if (frame.id === this._contextId) {
        return (this._contextId = frame.parentId)
      }
    }
  }
  async getWindowRect() {
    return this._window.rect
  }
  async setWindowRect(rect) {
    Object.assign(this._window.rect, rect)
  }
  async getUrl() {
    if (this._isNative) throw new Error("Native context doesn't support this method")
    return this._window.url
  }
  async getTitle() {
    if (this._isNative) throw new Error("Native context doesn't support this method")
    return this._window.title
  }
  async visit(url) {
    if (this._isNative) throw new Error("Native context doesn't support this method")
    this._window.url = url
  }
  async takeScreenshot() {
    const image = new png.Image({
      width: this._window.rect.width,
      height: this._window.rect.height,
    })
    const stream = image.pack()
    return new Promise((resolve, reject) => {
      let buffer = Buffer.from([])
      stream.on('data', chunk => {
        buffer = Buffer.concat([buffer, chunk])
      })
      stream.on('end', () => resolve(buffer))
      stream.on('error', reject)
    })
  }
}

module.exports = MockDriver
