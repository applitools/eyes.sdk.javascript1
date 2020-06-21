const {
  GeneralUtils,
  ArgumentGuard,
  CoordinatesType,
  Location,
  RectangleSize,
  Region,
  MutableImage,
  EyesError,
} = require('..')
const {EyesDriverOperationError} = require('./errors/EyesDriverOperationError')
const EyesJsSnippets = require('./EyesJsSnippets')

/**
 * @typedef {import('./logging/Logger').Logger} Logger
 * @typedef {import('./wrappers/EyesBrowsingContext')} EyesBrowsingContext
 * @typedef {import('./wrappers/EyesDriverController')} EyesDriverController
 * @typedef {import('./wrappers/EyesElementFinder')} EyesElementFinder
 * @typedef {import('./wrappers/EyesJsExecutor')} EyesJsExecutor
 * @typedef {import('./wrappers/EyesWrappedElement')} EyesWrappedElement
 * @typedef {import('./wrappers/EyesWrappedElement').UnwrappedElement} UnwrappedElement
 * @typedef {import('./wrappers/EyesWrappedElement').SupportedSelector} SupportedSelector
 * @typedef {import('./positioning/PositionProvider')} PositionProvider
 */

/**
 * Returns viewport size of current context
 * @param {Logger} _logger - logger instance
 * @param {EyesJsExecutor} executor - js executor
 * @return {RectangleSize} viewport size
 */
async function getViewportSize(_logger, {executor}) {
  const [width, height] = await executor.executeScript(EyesJsSnippets.GET_VIEWPORT_SIZE)
  return new RectangleSize(Number.parseInt(width, 10) || 0, Number.parseInt(height, 10) || 0)
}
/**
 * Set viewport size of the window
 * @param {Logger} logger - logger instance
 * @param {Object} driver
 * @param {EyesDriverController} driver.controller - driver controller
 * @param {EyesJsExecutor} driver.executor - js executor
 * @param {EyesBrowsingContext} driver.context - browsing context
 * @param {RectangleSize} requiredViewportSize - required viewport size to set
 */
async function setViewportSize(logger, {controller, executor, context}, requiredViewportSize) {
  ArgumentGuard.notNull(requiredViewportSize, 'requiredViewportSize')
  // First we will set the window size to the required size.
  // Then we'll check the viewport size and increase the window size accordingly.
  logger.verbose(`setViewportSize(${requiredViewportSize})`)

  return context.framesSwitchAndReturn(null, async () => {
    let actualViewportSize = await getViewportSize(logger, {executor})
    logger.verbose(`Initial viewport size: ${actualViewportSize}`)

    // If the viewport size is already the required size
    if (actualViewportSize.equals(requiredViewportSize)) return true

    // We move the window to (0,0) to have the best chance to be able to
    // set the viewport size as requested.
    await controller.setWindowLocation({x: 0, y: 0}).catch(() => {
      logger.verbose('Warning: Failed to move the browser window to (0,0)')
    })

    await _setWindowSizeByViewportSize(
      logger,
      {controller},
      actualViewportSize,
      requiredViewportSize,
    )
    actualViewportSize = await getViewportSize(logger, {executor})
    if (actualViewportSize.equals(requiredViewportSize)) return true

    // Additional attempt. This Solves the "maximized browser" bug
    // (border size for maximized browser sometimes different than non-maximized, so the original browser size calculation is wrong).
    logger.verbose(
      `Failed attempt to set viewport size. actualViewportSize=${actualViewportSize}, requiredViewportSize=${requiredViewportSize}. Trying workaround for maximization...`,
    )
    await _setWindowSizeByViewportSize(
      logger,
      {controller},
      actualViewportSize,
      requiredViewportSize,
    )
    actualViewportSize = await getViewportSize(logger, {executor})
    if (actualViewportSize.equals(requiredViewportSize)) return true

    const MAX_DIFF = 3
    const widthDiff = Math.abs(actualViewportSize.getWidth() - requiredViewportSize.getWidth())
    const heightDiff = Math.abs(actualViewportSize.getHeight() - requiredViewportSize.getHeight())

    // We try the zoom workaround only if size difference is reasonable.
    if (widthDiff <= MAX_DIFF && heightDiff <= MAX_DIFF) {
      logger.verbose('Trying workaround for zoom...')

      return _adjustWindowSizeByViewportSize(
        logger,
        {controller, executor},
        actualViewportSize,
        requiredViewportSize,
      )
    } else {
      throw new Error('Failed to set viewport size!')
    }
  })
}
/**
 * Set window size by the actual size of the top-level context viewport
 * @param {Logger} logger - logger instance
 * @param {Object} driver
 * @param {EyesDriverController} driver.controller - driver controller
 * @param {RectangleSize} actualViewportSize - actual viewport size
 * @param {RectangleSize} requiredViewportSize - required size to set
 */
async function _setWindowSizeByViewportSize(
  logger,
  {controller},
  actualViewportSize,
  requiredViewportSize,
) {
  const actualWindowSize = await controller.getWindowSize()
  const requiredWindowSize = new RectangleSize(
    actualWindowSize.getWidth() + (requiredViewportSize.getWidth() - actualViewportSize.getWidth()),
    actualWindowSize.getHeight() +
      (requiredViewportSize.getHeight() - actualViewportSize.getHeight()),
  )
  return _setWindowSize(logger, {controller}, requiredWindowSize)
}
/**
 * Adjust the size of the preview window so that the size of the top-level context window matches the required value
 * @param {Logger} logger - logger instance
 * @param {Object} driver
 * @param {EyesDriverController} driver.controller - driver controller
 * @param {EyesJsExecutor} driver.executor - js executor
 * @param {RectangleSize} actualViewportSize - actual viewport size
 * @param {RectangleSize} requiredViewportSize - required viewport size to set
 */
async function _adjustWindowSizeByViewportSize(
  logger,
  {controller, executor},
  actualViewportSize,
  requiredViewportSize,
) {
  const widthDiff = actualViewportSize.getWidth() - requiredViewportSize.getWidth()
  const widthStep = widthDiff > 0 ? -1 : 1 // -1 for smaller size, 1 for larger
  const heightDiff = actualViewportSize.getHeight() - requiredViewportSize.getHeight()
  const heightStep = heightDiff > 0 ? -1 : 1

  const actualWindowSize = await controller.getWindowSize()
  let lastRequiredBrowserSize = null
  let retries = Math.abs((widthDiff || 1) * (heightDiff || 1)) * 2
  let widthChange = 0
  let heightChange = 0
  while (
    --retries > 0 &&
    (Math.abs(widthChange) <= Math.abs(widthDiff) || Math.abs(heightChange) <= Math.abs(heightDiff))
  ) {
    logger.verbose(`Retries left: ${retries}`)
    // We specifically use "<=" (and not "<"), so to give an extra resize attempt
    // in addition to reaching the diff, due to floating point issues.
    if (
      Math.abs(widthChange) <= Math.abs(widthDiff) &&
      actualViewportSize.getWidth() !== requiredViewportSize.getWidth()
    ) {
      widthChange += widthStep
    }

    if (
      Math.abs(heightChange) <= Math.abs(heightDiff) &&
      actualViewportSize.getHeight() !== requiredViewportSize.getHeight()
    ) {
      heightChange += heightStep
    }

    const requiredWindowSize = new RectangleSize(
      actualWindowSize.getWidth() + widthChange,
      actualWindowSize.getHeight() + heightChange,
    )

    if (requiredWindowSize.equals(lastRequiredBrowserSize)) {
      logger.verbose('Browser size is as required but viewport size does not match!')
      logger.verbose(`Browser size: ${requiredWindowSize}, Viewport size: ${actualViewportSize}`)
      logger.verbose('Stopping viewport size attempts.')
      return true
    }

    await _setWindowSize(logger, {controller}, requiredWindowSize)
    lastRequiredBrowserSize = requiredWindowSize
    actualViewportSize = getViewportSize(logger, {executor})

    logger.verbose('Current viewport size:', actualViewportSize)
    if (actualViewportSize.equals(requiredViewportSize)) {
      return true
    }
  }
  throw new Error('EyesError: failed to set window size! Zoom workaround failed.')
}
/**
 * Set window size with retries
 * @param {Logger} logger - logger instance
 * @param {Object} driver
 * @param {EyesDriverController} driver.controller - driver controller
 * @param {RectangleSize} requiredViewportSize - required viewport size to set
 * @param {number} [sleep=3000] - delay between retries
 * @param {number} [retries=3] - number of retries
 * @return {boolean} true if operation finished successfully, false otherwise
 */
async function _setWindowSize(logger, {controller}, requiredWindowSize, sleep = 3000, retries = 3) {
  try {
    while (retries >= 0) {
      logger.verbose(
        `Attempt to set window size to ${requiredWindowSize}. Retries left: ${retries}`,
      )
      await controller.setWindowSize(requiredWindowSize)
      await GeneralUtils.sleep(sleep)
      const actualWindowSize = await controller.getWindowSize()
      if (actualWindowSize.equals(requiredWindowSize)) return true
      logger.verbose(
        `Attempt to set window size to ${requiredWindowSize} failed. actualWindowSize=${actualWindowSize}`,
      )
      retries -= 1
    }
    logger.verbose('Failed to set browser size: no more retries.')
    return false
  } catch (ex) {
    logger.verbose('Failed to set browser size: error thrown.', ex)
    return false
  }
}
/**
 * Get top-level context viewport region, where location of the region is top-level scroll position
 * @param {Logger} logger - logger instance
 * @param {Object} driver
 * @param {EyesDriverController} driver.controller - driver controller
 * @param {EyesJsExecutor} driver.executor - js executor
 * @param {EyesBrowsingContext} driver.context - browsing context
 * @return {Region} top-level context region
 */
async function getTopContextViewportRect(logger, {controller, executor, context}) {
  return context.framesSwitchAndReturn(null, async () => {
    const location = await getTopContextScrollLocation(logger, {executor, context})
    const size = await getTopContextViewportSize(logger, {controller, executor, context})
    return new Region(location, size)
  })
}
/**
 * Get top-level context viewport size with fallback to the window size if fail to extract top-level context viewport size
 * @param {Logger} logger - logger instance
 * @param {Object} driver
 * @param {EyesDriverController} driver.controller - driver controller
 * @param {EyesJsExecutor} driver.executor - js executor
 * @param {EyesBrowsingContext} driver.context - browsing context
 * @return {Region} top-level context size
 */
async function getTopContextViewportSize(logger, {controller, context, executor}) {
  logger.verbose('getTopContextViewportSize')
  return context.framesSwitchAndReturn(null, async () => {
    logger.verbose('Extracting viewport size...')
    let viewportSize
    try {
      viewportSize = await getViewportSize(logger, {executor})
    } catch (err) {
      logger.verbose('Failed to extract viewport size using Javascript:', err)
      // If we failed to extract the viewport size using JS, will use the window size instead.
      logger.verbose('Using window size as viewport size.')

      const windowSize = await controller.getWindowSize()
      let width = windowSize.getWidth()
      let height = windowSize.getHeight()
      const isLandscapeOrientation = await controller.isLandscapeOrientation().catch(() => {
        // Not every IWebDriver supports querying for orientation.
      })
      if (isLandscapeOrientation && height > width) {
        const temp = width
        width = height
        height = temp
      }
      viewportSize = new RectangleSize(width, height)
    }
    logger.verbose('Done! Viewport size: ', viewportSize)
    return viewportSize
  })
}
/**
 * Get current context content size
 * @param {Logger} _logger - logger instance
 * @param {EyesJsExecutor} executor - js executor
 * @return {Region} current context content size
 */
async function getCurrentFrameContentEntireSize(_logger, executor) {
  try {
    const [width, height] = await executor.executeScript(EyesJsSnippets.GET_CONTENT_ENTIRE_SIZE)
    return new RectangleSize(Number.parseInt(width, 10) || 0, Number.parseInt(height, 10) || 0)
  } catch (err) {
    throw new EyesDriverOperationError('Failed to extract entire size!', err)
  }
}
/**
 * Get content size of the specified element
 * @param {Logger} _logger - logger instance
 * @param {EyesJsExecutor} executor - js executor
 * @param {EyesWrappedElement|UnwrappedElement} element - element to get size
 * @returns {Promise<Region>} element content size
 */
async function getElementEntireSize(_logger, executor, element) {
  try {
    const [width, height] = await executor.executeScript(
      EyesJsSnippets.GET_ELEMENT_ENTIRE_SIZE,
      element,
    )
    return new RectangleSize(Number.parseInt(width, 10) || 0, Number.parseInt(height, 10) || 0)
  } catch (err) {
    throw new EyesDriverOperationError('Failed to extract element size!', err)
  }
}
/**
 * Get element client rect relative to the current context
 * @param {Logger} _logger - logger instance
 * @param {EyesJsExecutor} executor - js executor
 * @param {EyesWrappedElement|UnwrappedElement} element - element to get client rect
 * @return {Promise<Region>} element client rect
 */
async function getElementClientRect(_logger, executor, element) {
  const rect = await executor.executeScript(EyesJsSnippets.GET_ELEMENT_CLIENT_RECT, element)
  return new Region({
    left: Math.ceil(rect.x),
    top: Math.ceil(rect.y),
    width: Math.ceil(rect.width),
    height: Math.ceil(rect.height),
    coordinatesType: CoordinatesType.CONTEXT_RELATIVE,
  })
}
/**
 * Get element rect relative to the current context
 * @param {Logger} _logger - logger instance
 * @param {EyesJsExecutor} executor - js executor
 * @param {EyesWrappedElement|UnwrappedElement} element - element to get rect
 * @return {Promise<Region>} element rect
 */
async function getElementRect(_logger, executor, element) {
  const rect = await executor.executeScript(EyesJsSnippets.GET_ELEMENT_RECT, element)
  return new Region({
    left: Math.ceil(rect.x),
    top: Math.ceil(rect.y),
    width: Math.ceil(rect.width),
    height: Math.ceil(rect.height),
    coordinatesType: CoordinatesType.CONTEXT_RELATIVE,
  })
}
/**
 * Extract values of specified properties for specified element
 * @param {Logger} _logger - logger instance
 * @param {EyesJsExecutor} executor - js executor
 * @param {string[]} properties - names of properties to extract
 * @param {EyesWrappedElement|UnwrappedElement} element - element to extract properties
 * @return {*[]} extracted values
 */
async function getElementProperties(_logger, executor, properties, element) {
  return executor.executeScript(EyesJsSnippets.GET_ELEMENT_PROPERTIES, properties, element)
}
/**
 * Extract css values of specified css properties for specified element
 * @param {Logger} _logger - logger instance
 * @param {EyesJsExecutor} executor - js executor
 * @param {string[]} properties - names of css properties to extract
 * @param {EyesWrappedElement|UnwrappedElement} element - element to extract css properties
 * @return {string[]} extracted css values
 */
async function getElementCssProperties(_logger, executor, properties, element) {
  return executor.executeScript(EyesJsSnippets.GET_ELEMENT_CSS_PROPERTIES, properties, element)
}
/**
 * Get device pixel ratio
 * @param {Logger} _logger - logger instance
 * @param {Object} driver
 * @param {EyesJsExecutor} driver.executor - js executor
 * @return {Promise<number>} device pixel ratio
 */
async function getDevicePixelRatio(_logger, {executor}) {
  const devicePixelRatio = await executor.executeScript('return window.devicePixelRatio')
  return Number.parseFloat(devicePixelRatio)
}
/**
 * Get mobile device pixel ratio
 * @param {Logger} _logger - logger instance
 * @param {Object} driver
 * @param {EyesDriverController} driver.controller - driver controller
 * @return {Promise<number>} mobile device pixel ratio
 */
async function getMobilePixelRatio(_logger, {controller}, viewportSize) {
  const screenshot64 = await controller.takeScreenshot()
  const screenshot = new MutableImage(screenshot64)
  return screenshot.getWidth() / viewportSize.getWidth()
}

async function getInnerOffsets(_logger, executor, element) {
  const offsets = await executor.executeScript(EyesJsSnippets.GET_INNER_OFFSETS, element)
  const scroll = new Location(offsets.scroll)
  const translate = new Location(offsets.translate)
  return scroll.offsetByLocation(translate)
}
/**
 * Get top-level context scroll position
 * @param {Logger} logger - logger instance
 * @param {Object} driver
 * @param {EyesJsExecutor} driver.executor - js executor
 * @param {EyesBrowsingContext} driver.context - browsing context
 * @return {Promise<Location>} top-level context scroll position
 */
async function getTopContextScrollLocation(logger, {context, executor}) {
  // TODO I think we can use here Frame::parentScrollLocation
  return context.framesSwitchAndReturn(null, async () => getScrollLocation(logger, executor))
}
/**
 * Get current context scroll position of the specified element or default scrolling element
 * @param {Logger} _logger - logger instance
 * @param {EyesJsExecutor} executor - js executor
 * @param {EyesWrappedElement|UnwrappedElement} [element] - element to extract scroll position
 * @return {Promise<Location>} scroll position
 */
async function getScrollLocation(_logger, executor, element) {
  const [x, y] = await executor.executeScript(EyesJsSnippets.GET_SCROLL_POSITION, element)
  return new Location(Math.ceil(Number.parseFloat(x)) || 0, Math.ceil(Number.parseFloat(y)) || 0)
}
/**
 * Set current context scroll position for the specified element or default scrolling element
 * @param {Logger} _logger - logger instance
 * @param {EyesJsExecutor} executor - js executor
 * @param {Location} location - required scroll position
 * @param {EyesWrappedElement|UnwrappedElement} [element] - element to set scroll position
 * @return {Promise<Location>} actual scroll position after set
 */
async function scrollTo(_logger, executor, location, element) {
  const [x, y] = await executor.executeScript(
    EyesJsSnippets.SCROLL_TO,
    {x: location.getX(), y: location.getY()},
    element,
  )
  return new Location(Math.ceil(Number.parseFloat(x)) || 0, Math.ceil(Number.parseFloat(y)) || 0)
}
/**
 * Get transforms of the specified element or default scrolling element
 * @param {Logger} _logger - logger instance
 * @param {EyesJsExecutor} executor - js executor
 * @param {EyesWrappedElement|UnwrappedElement} [element] - element to extract transforms
 * @return {Promise<Object>} element transforms
 */
async function getTransforms(_logger, executor, element) {
  return executor.executeScript(EyesJsSnippets.GET_TRANSFORMS, element)
}
/**
 * Set transforms for the specified element or default scrolling element
 * @param {Logger} _logger - logger instance
 * @param {EyesJsExecutor} executor - js executor
 * @param {Object} transforms - collection of transforms to set
 * @param {EyesWrappedElement|UnwrappedElement} [element] - element to set transforms
 */
async function setTransforms(_logger, executor, transforms, element) {
  return executor.executeScript(EyesJsSnippets.SET_TRANSFORMS(transforms), element)
}
/**
 * Get translate position of the specified element or default scrolling element
 * @param {Logger} _logger - logger instance
 * @param {EyesJsExecutor} executor - js executor
 * @param {EyesWrappedElement|UnwrappedElement} [element] - element to extract translate position
 * @return {Promise<Location>} translate position
 */
async function getTranslateLocation(_logger, executor, element) {
  const transforms = await getTransforms(_logger, executor, element)
  const translateLocations = Object.values(transforms)
    .filter(transform => Boolean(transform))
    .map(transform => {
      const data = transform.match(/^translate\(\s*(\-?[\d, \.]+)px,\s*(\-?[\d, \.]+)px\s*\)/)
      if (!data) {
        throw new Error(`Can't parse CSS transition: ${transform}!`)
      }
      const [_, x, y] = data
      return new Location(Math.round(-Number.parseFloat(x)), Math.round(-Number.parseFloat(y)))
    })
  if (translateLocations.some(location => !translateLocations[0].equals(location))) {
    throw new Error('Got different css positions!')
  }
  return translateLocations[0] || Location.ZERO
}
/**
 * Set translate position of the specified element or default scrolling element
 * @param {Logger} _logger - logger instance
 * @param {EyesJsExecutor} executor - js executor
 * @param {Location} location - required translate position
 * @param {EyesWrappedElement|UnwrappedElement} [element] - element to set translate position
 * @return {Promise<Location>} actual translate position after set
 */
async function translateTo(_logger, executor, location, element) {
  await executor.executeScript(
    EyesJsSnippets.TRANSLATE_TO(location.getX(), location.getY()),
    element,
  )
  return location
}
/**
 * Check if the specified element or default scrolling element is scrollable
 * @param {Logger} _logger - logger instance
 * @param {EyesJsExecutor} executor - js executor
 * @param {EyesWrappedElement|UnwrappedElement} [element] - element to check
 * @return {Promise<boolean>} true if element is scrollable, false otherwise
 */
async function isScrollable(_logger, executor, element) {
  return executor.executeScript(EyesJsSnippets.IS_SCROLLABLE, element)
}
/**
 * Mark the specified element or default scrolling element with `data-applitools-scroll`
 * @param {Logger} _logger - logger instance
 * @param {EyesJsExecutor} executor - js executor
 * @param {EyesWrappedElement|UnwrappedElement} [element] - element to mark
 */
async function markScrollRootElement(_logger, executor, element) {
  return executor.executeScript(EyesJsSnippets.MARK_SCROLL_ROOT_ELEMENT, element)
}
/**
 * Get overflow style property of the specified element
 * @param {Logger} _logger - logger instance
 * @param {EyesJsExecutor} executor - js executor
 * @param {EyesWrappedElement|UnwrappedElement} element - element to get overflow
 * @return {Promise<string?>} overflow value
 */
async function getOverflow(_logger, executor, element) {
  ArgumentGuard.notNull(executor, 'executor')
  ArgumentGuard.notNull(element, 'element')
  return executor.executeScript(EyesJsSnippets.GET_OVERFLOW, element)
}
/**
 * Set overflow style property of the specified element
 * @param {Logger} _logger - logger instance
 * @param {EyesJsExecutor} executor - js executor
 * @param {EyesWrappedElement|UnwrappedElement} element - element to set overflow
 * @return {Promise<string?>} original overflow value before set
 */
async function setOverflow(_logger, executor, overflow, element) {
  ArgumentGuard.notNull(executor, 'executor')
  ArgumentGuard.notNull(element, 'element')

  try {
    const result = await executor.executeScript(
      EyesJsSnippets.SET_OVERFLOW_AND_RETURN_ORIGIN_VALUE(overflow),
      element,
    )
    await GeneralUtils.sleep(200)
    return result
  } catch (err) {
    throw new EyesError('Failed to set overflow', err)
  }
}
/**
 * Blur the specified element or current active element
 * @param {Logger} logger - logger instance
 * @param {EyesJsExecutor} executor - js executor
 * @param {EyesWrappedElement|UnwrappedElement} [element] - element to blur
 * @return {Promise<UnwrappedElement?>} actually blurred element if there is any
 */
async function blurElement(logger, executor, element) {
  try {
    return await executor.executeScript(EyesJsSnippets.BLUR_ELEMENT, element)
  } catch (err) {
    logger.verbose(`WARNING: Cannot hide caret! ${err}`)
  }
}
/**
 * Focus the specified element
 * @param {Logger} logger - logger instance
 * @param {EyesJsExecutor} executor - js executor
 * @param {EyesWrappedElement|UnwrappedElement} element - element to focus
 */
async function focusElement(logger, executor, element) {
  try {
    return await executor.executeScript(EyesJsSnippets.FOCUS_ELEMENT, element)
  } catch (err) {
    logger.verbose(`WARNING: Cannot hide caret! ${err}`)
  }
}
/**
 * Get element absolute xpath selector related to the top-level context
 * @param {Logger} _logger - logger instance
 * @param {EyesJsExecutor} executor - js executor
 * @param {EyesWrappedElement|UnwrappedElement} element - element to calculate xpath
 * @return {Promise<string>} xpath selector
 */
async function getElementAbsoluteXpath(_logger, executor, element) {
  return executor.executeScript(EyesJsSnippets.GET_ELEMENT_XPATH, element)
}
/**
 * Get element xpath selector related to the current context
 * @param {Logger} logger - logger instance
 * @param {EyesJsExecutor} executor - js executor
 * @param {EyesWrappedElement|UnwrappedElement} element - element to calculate xpath
 * @return {Promise<string>} xpath selector
 */
async function getElementXpath(logger, executor, element) {
  try {
    return await executor.executeScript(EyesJsSnippets.GET_ELEMENT_XPATH, element)
  } catch (err) {
    logger.verbose('Warning: Failed to get element selector (xpath)')
    return null
  }
}
/**
 * Translate element selector to the persisted regions
 * @param {Logger} logger - logger instance
 * @param {Object} driver
 * @param {EyesElementFinder} driver.finder - element finder
 * @param {EyesJsExecutor} driver.executor - js executor
 * @param {SupportedSelector} selector - element selector
 * @return {Promise<{type: string, selector: string}[]>} persisted regions for selector
 */
async function locatorToPersistedRegions(logger, {finder, executor}, selector) {
  const eyesSelector = finder.specs.toEyesSelector(selector)
  if (eyesSelector.type === 'css' || eyesSelector.type === 'xpath') {
    return [eyesSelector]
  }
  const elements = await finder.findElements(selector)
  return Promise.all(
    elements.map(async element => ({
      type: 'xpath',
      selector: await getElementXpath(logger, executor, element),
    })),
  )
}
/**
 * @typedef {Object} ContextInfo
 * @property {boolean} isRoot - is root context
 * @property {boolean} isCORS - is cors context related to the parent
 * @property {UnwrappedElement} document - context document element
 * @property {string} frameSelector - xpath to the frame element related to the parent context
 *
 * Extract information about relations between current context and its parent
 * @param {Logger} _logger - logger instance
 * @param {EyesJsExecutor} executor - js executor
 * @return {Promise<ContextInfo>} frame info
 */
async function getCurrentContextInfo(_logger, executor) {
  return executor.executeScript(EyesJsSnippets.GET_CURRENT_CONTEXT_INFO)
}
/**
 * Get frame element by name or id
 * @param {Logger} _logger - logger instance
 * @param {EyesJsExecutor} executor - js executor
 * @param {string} nameOrId - name or id of the element
 * @return {UnwrappedElement} frame element
 */
async function getFrameByNameOrId(_logger, executor, nameOrId) {
  return executor.executeScript(EyesJsSnippets.GET_FRAME_BY_NAME_OR_ID, nameOrId)
}
/**
 * @typedef {Object} FrameInfo
 * @property {boolean} isCORS - is cors frame related to the current context
 * @property {UnwrappedElement} element - frame element
 * @property {string} selector - xpath to the frame element related to the parent context
 *
 * Find by context information
 * @param {Logger} _logger - logger instance
 * @param {Object} driver
 * @param {EyesElementFinder} driver.finder - element finder
 * @param {EyesJsExecutor} driver.executor - js executor
 * @param {ContextInfo} contextInfo - target context info
 * @param {(left: UnwrappedElement, right: UnwrappedElement) => Promise<boolean>} comparator - check if two document elements are equal
 * @return {Promise<Frame>} frame
 */
async function findFrameByContext(_logger, {executor, context}, contextInfo, comparator) {
  const framesInfo = await executor.executeScript(EyesJsSnippets.GET_FRAMES)
  for (const frameInfo of framesInfo) {
    if (frameInfo.isCORS !== contextInfo.isCORS) continue
    await context.frame(frameInfo.element)
    const frame = context.frameChain.current
    const contentDocument = await executor.executeScript(EyesJsSnippets.GET_DOCUMENT_ELEMENT)
    await context.frameParent()
    if (await comparator(contentDocument, contextInfo.contentDocument)) return frame
  }
}
/**
 * Ensure provided region is visible as much as possible
 * @param {Logger} logger - logger instance
 * @param {Object} driver
 * @param {EyesDriverController} driver.controller - driver controller
 * @param {EyesBrowsingContext} driver.context - browsing context
 * @param {EyesJsExecutor} driver.executor - js executor
 * @param {PositionProvider} positionProvider - position provider
 * @param {Promise<Region>} region - region to ensure visible
 */
async function ensureRegionVisible(
  logger,
  {controller, context, executor},
  positionProvider,
  region,
) {
  if (!region) return
  if (await controller.isNative()) {
    logger.verbose(`NATIVE context identified, skipping 'ensure element visible'`)
    return
  }
  const frameChain = context.frameChain
  const frameOffset = frameChain.getCurrentFrameOffset()
  const elementFrameRect = new Region(region)
  const elementViewportRect = elementFrameRect.offset(frameOffset.getX(), frameOffset.getY())
  const viewportRect = await getTopContextViewportRect(logger, {controller, context, executor})
  if (!viewportRect.contains(elementViewportRect)) {
    let remainingOffset = elementFrameRect.getLocation()
    const scrollRootElement = frameChain.isEmpty
      ? context.topContext.scrollRootElement
      : frameChain.current.scrollRootElement

    const scrollRootOffset = scrollRootElement
      ? await scrollRootElement.getClientRect().then(rect => rect.getLocation())
      : Location.ZERO

    const actualOffset = await positionProvider.setPosition(
      remainingOffset.offsetNegative(scrollRootOffset),
      scrollRootElement,
    )
    remainingOffset = remainingOffset.offsetNegative(actualOffset)

    await ensureFrameVisible(logger, context, positionProvider, remainingOffset)
    return remainingOffset
  }
  return Location.ZERO
}
/**
 * Ensure provided region is visible as much as possible
 * @param {Logger} _logger - logger instance
 * @param {EyesBrowsingContext} context - browsing context
 * @param {PositionProvider} positionProvider - position provider
 * @param {Location} [offset=Location.ZERO] - offset from the top-left frame's corner
 * @return {Promise<Location>} remaining offset to the frame
 */
async function ensureFrameVisible(_logger, context, positionProvider, offset = Location.ZERO) {
  const frameChain = context.frameChain
  let remainingOffset = new Location(offset)
  for (let index = frameChain.size - 1; index >= 0; --index) {
    await context.frameParent()
    const prevFrame = frameChain.frameAt(index)
    const currentFrame = frameChain.frameAt(index - 1)
    remainingOffset = remainingOffset.offsetByLocation(prevFrame.location)
    const scrollRootElement = currentFrame ? currentFrame.scrollRootElement : null
    const scrollRootOffset = scrollRootElement
      ? await scrollRootElement.getClientRect().then(rect => rect.getLocation())
      : Location.ZERO
    const actualOffset = await positionProvider.setPosition(
      remainingOffset.offsetNegative(scrollRootOffset),
      scrollRootElement,
    )
    remainingOffset = remainingOffset.offsetNegative(actualOffset)
  }
  // passing array of frame references instead of frame chain to be sure that frame metrics will be re-calculated
  await context.frames(Array.from(frameChain, frame => frame.toReference()))
  return remainingOffset
}

module.exports = {
  getViewportSize,
  setViewportSize,
  getTopContextViewportRect,
  getTopContextViewportSize,
  getCurrentFrameContentEntireSize,
  getElementEntireSize,
  getElementClientRect,
  getElementRect,
  getElementProperties,
  getElementCssProperties,
  getDevicePixelRatio,
  getMobilePixelRatio,
  getInnerOffsets,
  getTopContextScrollLocation,
  getScrollLocation,
  scrollTo,
  getTransforms,
  setTransforms,
  getTranslateLocation,
  translateTo,
  isScrollable,
  markScrollRootElement,
  getOverflow,
  setOverflow,
  blurElement,
  focusElement,
  getElementXpath,
  getElementAbsoluteXpath,
  locatorToPersistedRegions,
  ensureRegionVisible,
  ensureFrameVisible,
  getCurrentContextInfo,
  getFrameByNameOrId,
  findFrameByContext,
}
