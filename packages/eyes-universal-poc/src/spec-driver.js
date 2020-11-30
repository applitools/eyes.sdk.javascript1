function makeSpecDriver({ref, deref, isRef}) {
  // #region HELPERS
  function transformSelector(selector) {
    // if (TypeUtils.has(selector, ['type', 'selector'])) {
    if (typeof selector === 'object' && 'type' in selector) {
      if (selector.type === 'css') return `css=${selector.selector}`
      else if (selector.type === 'xpath') return `xpath=${selector.selector}`
    }
    return selector
  }
  function extractContext(page) {
    return page.constructor.name === 'Page' ? page.mainFrame() : page
  }
  // #endregion

  // #region COMMANDS
  async function isEqualElements(frame, element1, element2) {
    return deref(frame)
      .evaluate(([element1, element2]) => element1 === element2, [deref(element1), deref(element2)])
      .catch(() => false)
  }
  async function executeScript(frame, script, arg) {
    script = new Function(
      script.startsWith('return') ? script : `return (${script}).apply(null, arguments)`,
    )
    const result = await deref(frame).evaluateHandle(script, deserialize(arg))
    return serialize(result)

    async function serialize(result) {
      const [_, type] = result.toString().split('@')
      if (type === 'array') {
        const map = await result.getProperties()
        return Promise.all(Array.from(map.values(), serialize))
      } else if (type === 'object') {
        const map = await result.getProperties()
        const chunks = await Promise.all(
          Array.from(map, async ([key, handle]) => ({[key]: await serialize(handle)})),
        )
        return Object.assign(...chunks)
      } else if (type === 'node') {
        return ref(result.asElement(), frame)
      } else {
        return result.jsonValue()
      }
    }

    function deserialize(arg) {
      if (!arg) {
        return arg
      } else if (isRef(arg)) {
        return deref(arg)
      } else if (Array.isArray(arg)) {
        return arg.map(deserialize)
      } else if (typeof arg === 'object') {
        return Object.entries(arg).reduce(
          (arg, [key, value]) => Object.assign(arg, {[key]: deserialize(value)}),
          {},
        )
      } else {
        return arg
      }
    }
  }
  async function mainContext(frame) {
    let mainFrame = extractContext(deref(frame))
    while (mainFrame.parentFrame()) {
      mainFrame = mainFrame.parentFrame()
    }
    return ref(mainFrame, frame)
  }
  async function parentContext(frame) {
    frame = extractContext(deref(frame))
    const parentFrame = frame.parentFrame()
    return ref(parentFrame, frame)
  }
  async function childContext(_frame, element) {
    const childFrame = deref(element).contentFrame()
    return ref(childFrame, element)
  }
  async function findElement(frame, selector) {
    const element = await deref(frame).$(transformSelector(selector))
    return element ? ref(element, frame) : null
  }
  async function findElements(frame, selector) {
    const elements = await deref(frame).$$(transformSelector(selector))
    return elements.map(element => ref(element, frame))
  }
  async function getViewportSize(page) {
    return deref(page).viewportSize()
  }
  async function setViewportSize(page, size = {}) {
    return deref(page).setViewportSize(size)
  }
  async function getTitle(page) {
    return deref(page).title()
  }
  async function getUrl(page) {
    return deref(page).url()
  }
  async function getDriverInfo(_page) {
    return {}
  }
  async function takeScreenshot(page) {
    return deref(page).screenshot()
  }
  // #endregion

  return {
    isEqualElements,
    executeScript,
    mainContext,
    parentContext,
    childContext,
    findElement,
    findElements,
    getViewportSize,
    setViewportSize,
    getTitle,
    getUrl,
    getDriverInfo,
    takeScreenshot,
  }
}

module.exports = makeSpecDriver
