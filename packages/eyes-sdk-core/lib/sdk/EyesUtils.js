const snippets = require('@applitools/snippets')
const GeneralUtils = require('../utils/GeneralUtils')
const ArgumentGuard = require('../utils/ArgumentGuard')
const CoordinatesTypes = require('../geometry/CoordinatesType')
const Location = require('../geometry/Location')
const RectangleSize = require('../geometry/RectangleSize')
const Region = require('../geometry/Region')
const EyesError = require('../errors/EyesError')
const EyesDriverOperationError = require('../errors/EyesDriverOperationError')

/**
 * @typedef {import('../logging/Logger')} Logger
 * @typedef {import('./EyesElement')} EyesElement
 * @typedef {import('./EyesContext')} EyesContext
 * @typedef {import('./EyesElement')} EyesElement
 * @typedef {import('../positioning/PositionProvider')} PositionProvider
 */

/**
 * Returns viewport size of current context
 * @param {Logger} logger
 * @param {EyesContext} context
 * @return {RectangleSize} viewport size
 */
async function getViewportSize(logger, context) {
  logger.verbose('EyesUtils.getViewportSize()')
  let size
  if (!context.driver.isNative) {
    size = await context.execute(snippets.getViewportSize)
  } else {
    const rect = await context.driver.getWindowRect()
    size = {width: rect.getWidth(), height: rect.getHeight()}
    if (size.height > size.width) {
      const orientation = await context.driver.getOrientation()
      if (orientation === 'landscape') {
        size = {width: size.height, height: size.width}
      }
    }
  }
  logger.verbose('Done! Viewport size: ', size)
  return new RectangleSize(size)
}
/**
 * Set viewport size of the window
 * @param {Logger} logger
 * @param {EyesContext} context
 * @param {RectangleSize} requiredViewportSize - required viewport size to set
 */
async function setViewportSize(logger, context, requiredViewportSize) {
  ArgumentGuard.notNull(requiredViewportSize, 'requiredViewportSize')
  // First we will set the window size to the required size.
  // Then we'll check the viewport size and increase the window size accordingly.
  logger.verbose(`setViewportSize(${requiredViewportSize})`)

  let actualViewportSize = await getViewportSize(logger, context)
  logger.verbose(`Initial viewport size: ${actualViewportSize}`)
  // If the viewport size is already the required size
  if (actualViewportSize.equals(requiredViewportSize)) return true

  // We move the window to (0,0) to have the best chance to be able to
  // set the viewport size as requested.
  await context.driver.setWindowRect({x: 0, y: 0}).catch(err => {
    logger.verbose('Warning: Failed to move the browser window to (0,0)', err)
  })

  let actualWindowSize = await context.driver.getWindowRect()
  actualViewportSize = await getViewportSize(logger, context)

  const sleep = 3000
  let retries = 3

  while (retries >= 0) {
    const requiredWindowSize = new RectangleSize(
      actualWindowSize.getWidth() +
        (requiredViewportSize.getWidth() - actualViewportSize.getWidth()),
      actualWindowSize.getHeight() +
        (requiredViewportSize.getHeight() - actualViewportSize.getHeight()),
    )
    logger.verbose(`Attempt to set window size to ${requiredWindowSize}. Retries left: ${retries}`)
    await context.driver.setWindowRect(requiredWindowSize)
    await GeneralUtils.sleep(sleep)
    actualViewportSize = await getViewportSize(logger, context)
    if (requiredViewportSize.equals(actualViewportSize)) return true
    logger.verbose(
      `Attempt to set viewport size to ${requiredViewportSize} failed. actualViewportSize=${actualViewportSize}`,
    )
    actualWindowSize = requiredWindowSize
    retries -= 1
  }

  logger.verbose(
    `Failed attempt to set viewport size. actualViewportSize=${actualViewportSize}, requiredViewportSize=${requiredViewportSize}. Trying again...`,
  )

  throw new Error('Failed to set viewport size!')
}
/**
 * Get current context content size
 * @param {Logger} _logger
 * @param {EyesContext} context
 * @return {Region} current context content size
 */
async function getDocumentSize(_logger, context) {
  try {
    const {width = 0, height = 0} = await context.execute(snippets.getDocumentSize)
    return new RectangleSize(width, height)
  } catch (err) {
    throw new EyesDriverOperationError('Failed to extract entire size!', err)
  }
}
/**
 * Get content size of the specified element
 * @param {Logger} _logger
 * @param {EyesContext} context
 * @param {EyesElement} element
 * @returns {Promise<Region>} element content size
 */
async function getElementEntireSize(_logger, context, element) {
  try {
    const {width = 0, height = 0} = await context.execute(snippets.getElementContentSize, [element])
    return new RectangleSize(width, height)
  } catch (err) {
    throw new EyesDriverOperationError('Failed to extract element size!', err)
  }
}
/**
 * Get element client rect relative to the current context
 * @param {Logger} _logger
 * @param {EyesContext} context
 * @param {EyesElement} element
 * @return {Promise<Region>} element client rect
 */
async function getElementClientRect(_logger, context, element) {
  const rect = await context.execute(snippets.getElementRect, [element, true])
  return new Region({
    left: rect.x,
    top: rect.y,
    width: rect.width,
    height: rect.height,
    coordinatesType: CoordinatesTypes.CONTEXT_RELATIVE,
  })
}
/**
 * Get element rect relative to the current context
 * @param {Logger} _logger
 * @param {EyesContext} context
 * @param {EyesElement} element
 * @return {Promise<Region>} element rect
 */
async function getElementRect(_logger, context, element) {
  const rect = await context.execute(snippets.getElementRect, [element, false])
  return new Region({
    left: rect.x,
    top: rect.y,
    width: rect.width,
    height: rect.height,
    coordinatesType: CoordinatesTypes.CONTEXT_RELATIVE,
  })
}
/**
 * Get device pixel ratio
 * @param {Logger} _logger
 * @param {EyesContext} context
 * @return {Promise<number>} device pixel ratio
 */
async function getPixelRatio(_logger, context) {
  const pixelRatio = await context.execute(snippets.getPixelRatio)
  return Number.parseFloat(pixelRatio)
}
async function getUserAgent(_logger, context) {
  const userAgent = await context.execute(snippets.getUserAgent)
  return userAgent
}
async function getInnerOffset(_logger, context, element) {
  const {x = 0, y = 0} = await context.execute(snippets.getElementInnerOffset, [element])
  return new Location(x, y)
}
/**
 * Get current context scroll position of the specified element or default scrolling element
 * @param {Logger} _logger
 * @param {EyesContext} context
 * @param {EyesElement} [element] - element to extract scroll position
 * @return {Promise<Location>} scroll position
 */
async function getScrollOffset(_logger, context, element) {
  const {x = 0, y = 0} = await context.execute(snippets.getElementScrollOffset, [element])
  return new Location(x, y)
}
/**
 * Set current context scroll position for the specified element or default scrolling element
 * @param {Logger} _logger
 * @param {EyesContext} context
 * @param {Location} location - required scroll position
 * @param {EyesElement} [element] - element to set scroll position
 * @return {Promise<Location>} actual scroll position after set
 */
async function scrollTo(_logger, context, location, element) {
  const {x = 0, y = 0} = await context.execute(snippets.scrollTo, [
    element,
    {x: Math.round(location.getX()), y: Math.round(location.getY())},
  ])
  return new Location(x, y)
}
/**
 * Get translate position of the specified element or default scrolling element
 * @param {Logger} _logger
 * @param {EyesContext} context
 * @param {EyesElement} [element] - element to extract translate position
 * @return {Promise<Location>} translate position
 */
async function getTranslateOffset(_logger, context, element) {
  return context.execute(snippets.getElementTranslateOffset, [element])
}
/**
 * Set translate position of the specified element or default scrolling element
 * @param {Logger} _logger
 * @param {EyesContext} context
 * @param {Location} location - required translate position
 * @param {EyesElement} [element] - element to set translate position
 * @return {Promise<Location>} actual translate position after set
 */
async function translateTo(_logger, context, location, element) {
  const offset = await context.execute(snippets.translateTo, [
    element,
    {x: Math.round(location.getX()), y: Math.round(location.getY())},
  ])
  return new Location(offset)
}
/**
 * Check if the specified element or default scrolling element is scrollable
 * @param {Logger} _logger
 * @param {EyesContext} context
 * @param {EyesElement} [element] - element to check
 * @return {Promise<boolean>} true if element is scrollable, false otherwise
 */
async function isScrollable(_logger, context, element) {
  return context.execute(snippets.isElementScrollable, [element])
}
/**
 * Mark the specified element or default scrolling element with `data-applitools-scroll`
 * @param {Logger} _logger
 * @param {EyesContext} context
 * @param {EyesElement} [element] - element to mark
 */
async function markScrollRootElement(_logger, context, element) {
  return context.execute(snippets.setElementAttributes, [element, {'data-applitools-scroll': true}])
}
/**
 * Get transforms of the specified element or default scrolling element
 * @param {Logger} _logger
 * @param {EyesContext} context
 * @param {EyesElement} [element] - element to extract transforms
 * @return {Promise<Object>} element transforms
 */
async function getTransforms(_logger, context, element) {
  return context.execute(snippets.getElementStyleProperties, [
    element,
    ['transform', '-webkit-transform'],
  ])
}
/**
 * Set transforms for the specified element or default scrolling element
 * @param {Logger} _logger
 * @param {EyesContext} context
 * @param {Object} transforms - collection of transforms to set
 * @param {EyesElement} [element] - element to set transforms
 */
async function setTransforms(_logger, context, transforms, element) {
  return context.execute(snippets.setElementStyleProperties, [element, transforms])
}
/**
 * Get overflow style property of the specified element
 * @param {Logger} _logger
 * @param {EyesContext} context
 * @param {EyesElement} element - element to get overflow
 * @return {Promise<string?>} overflow value
 */
async function getOverflow(_logger, context, element) {
  const {overflow} = await context.execute(snippets.getElementStyleProperties, [
    element,
    ['overflow'],
  ])
  return overflow
}
/**
 * Set overflow style property of the specified element
 * @param {Logger} _logger
 * @param {EyesContext} context
 * @param {EyesElement} element - element to set overflow
 * @return {Promise<string?>} original overflow value before set
 */
async function setOverflow(_logger, context, overflow, element) {
  try {
    const original = await context.execute(snippets.setElementStyleProperties, [
      element,
      {overflow},
    ])
    await GeneralUtils.sleep(200)
    return original.overflow
  } catch (err) {
    throw new EyesError('Failed to set overflow', err)
  }
}
/**
 * Blur the specified element or current active element
 * @template TElement
 * @param {Logger} logger
 * @param {EyesContext} context
 * @param {EyesElement} [element] - element to blur
 * @return {Promise<TElement>} actually blurred element if there is any
 */
async function blurElement(logger, context, element) {
  return context.execute(snippets.blurElement, [element]).catch(err => {
    logger.verbose('WARNING: Cannot hide caret!', err)
    return null
  })
}
/**
 * Focus the specified element
 * @param {Logger} logger
 * @param {EyesContext} context
 * @param {EyesElement} element - element to focus
 */
async function focusElement(logger, context, element) {
  return context.execute(snippets.focusElement, [element]).catch(err => {
    logger.verbose('WARNING: Cannot restore caret!', err)
    return null
  })
}
/**
 * Get element xpath selector related to the current context
 * @param {Logger} logger
 * @param {EyesContext} context
 * @param {EyesElement} element - element to calculate xpath
 * @return {Promise<string>} xpath selector
 */
async function getElementXpath(logger, context, element) {
  return context.execute(snippets.getElementXpath, [element]).catch(err => {
    logger.verbose('Warning: Failed to get element selector (xpath)', err)
    return null
  })
}

async function setElementMarkers(_logger, context, elementsById) {
  const elements = Object.values(elementsById)
  const ids = Object.keys(elementsById)
  await context.execute(snippets.setElementMarkers, [elements, ids])
}

async function cleanupElementMarkers(_logger, context, elements) {
  await context.execute(snippets.cleanupElementMarkers, [elements])
}

/**
 * @template TElement
 * @typedef ContextInfo
 * @prop {boolean} isRoot - is root context
 * @prop {boolean} isCORS - is cors context related to the parent
 * @prop {TElement} document - context document element
 * @prop {string} frameSelector - xpath to the frame element related to the parent context
 *
 * Extract information about relations between current context and its parent
 * @template TElement
 * @param {Logger} _logger
 * @param {EyesContext} context
 * @return {Promise<ContextInfo<TElement>>} frame info
 */
async function getContextInfo(_logger, context) {
  const [documentElement, selector, isRoot, isCORS] = await context.execute(snippets.getContextInfo)
  return {documentElement, selector, isRoot, isCORS}
}
/**
 * Find by context information
 * @param {Logger} _logger
 * @param {EyesContext} context
 * @param {ContextInfo} contextInfo - target context info
 * @return {Promise<Frame>} frame
 */
async function getChildFramesInfo(_logger, context) {
  const info = await context.execute(snippets.getChildFramesInfo)
  return info.map(([element, isCORS, src]) => ({element, isCORS, src}))
}
/**
 * Ensure provided region is visible as much as possible
 * @param {Logger} logger
 * @param {EyesContext} context
 * @param {PositionProvider} positionProvider - position provider
 * @param {Promise<Region>} region - region to ensure visible
 */
async function ensureRegionVisible(logger, context, positionProvider, region) {
  if (!region) return
  if (context.driver.isNative) {
    logger.verbose(`NATIVE context identified, skipping 'ensure element visible'`)
    return
  }
  const elementContextRect = new Region(region)
  const contextViewportLocation = await context.getLocationInViewport()
  const elementViewportRect = elementContextRect.offset(
    contextViewportLocation.getX(),
    contextViewportLocation.getY(),
  )
  const viewportRect = await context.main.getRect()
  if (viewportRect.contains(elementViewportRect)) {
    return Location.ZERO
  }
  let currentContext = context
  let remainingOffset = elementContextRect.getLocation()
  while (currentContext) {
    const scrollRootElement = await currentContext.getScrollRootElement()
    const scrollRootOffset = scrollRootElement
      ? await scrollRootElement.getClientRect().then(rect => rect.getLocation())
      : Location.ZERO

    const actualOffset = await positionProvider.setPosition(
      remainingOffset.offsetNegative(scrollRootOffset),
      scrollRootElement,
    )

    remainingOffset = remainingOffset
      .offsetNegative(actualOffset)
      .offsetByLocation(await currentContext.getClientLocation())
    currentContext = currentContext.parent
  }
  return remainingOffset
}

async function executePollScript(
  logger,
  context,
  scripts,
  {executionTimeout = 5 * 60 * 1000, pollTimeout = 200} = {},
) {
  logger.verbose('Executing poll script')
  let isExecutionTimedOut = false
  const executionTimer = setTimeout(() => (isExecutionTimedOut = true), executionTimeout)
  try {
    const {script, args = []} = scripts.main
    let response = deserialize(await context.execute(script, ...args))
    let chunks = ''
    while (!isExecutionTimedOut) {
      if (response.status === 'ERROR') {
        throw new EyesError(`Error during execute poll script: '${response.error}'`, response.error)
      } else if (response.status === 'SUCCESS') {
        return response.value
      } else if (response.status === 'SUCCESS_CHUNKED') {
        chunks += response.value
        if (response.done) return deserialize(chunks)
      } else if (response.status === 'WIP') {
        await GeneralUtils.sleep(pollTimeout)
      }
      logger.verbose('Polling...')
      const {script, args = []} = scripts.poll
      response = deserialize(await context.execute(script, ...args))
    }
    throw new EyesError('Poll script execution is timed out')
  } finally {
    clearTimeout(executionTimer)
  }

  function deserialize(json) {
    try {
      return JSON.parse(json)
    } catch (err) {
      const firstChars = json.slice(0, 100)
      const lastChars = json.slice(-100)
      throw new Error(
        `Response is not a valid JSON string. length: ${json.length}, first 100 chars: "${firstChars}", last 100 chars: "${lastChars}". error: ${err}`,
      )
    }
  }
}

async function addPageMarker(_logger, context) {
  return context.execute(snippets.addPageMarker)
}

async function cleanupPageMarker(_logger, context) {
  await context.execute(snippets.cleanupPageMarker)
}

module.exports = {
  getViewportSize,
  setViewportSize,
  getDocumentSize,
  getElementEntireSize,
  getElementClientRect,
  getElementRect,
  getPixelRatio,
  getUserAgent,
  getScrollOffset,
  scrollTo,
  getTranslateOffset,
  translateTo,
  getInnerOffset,
  isScrollable,
  markScrollRootElement,
  getTransforms,
  setTransforms,
  getOverflow,
  setOverflow,
  blurElement,
  focusElement,
  getElementXpath,
  setElementMarkers,
  cleanupElementMarkers,
  getContextInfo,
  getChildFramesInfo,
  ensureRegionVisible,
  executePollScript,
  addPageMarker,
  cleanupPageMarker,
}
