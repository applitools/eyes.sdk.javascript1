const utils = require('@applitools/utils')
const saveScreenshot = require('./saveScreenshot')
const findPattern = require('./findPattern')
const makeCalculateScaleRatio = require('./calculateScaleRatio')
const makeImage = require('./image')

function makeTakeScreenshot(options) {
  const {driver} = options
  if (driver.isNative) {
    return makeTakeNativeScreenshot(options)
  } else if (driver.userAgent) {
    if (driver.userAgent.browser === 'Firefox') {
      try {
        const browserVersion = Number.parseInt(driver.userAgent.browserMajorVersion, 10)
        if (browserVersion >= 48 && browserVersion <= 72) {
          return makeTakeMainContextScreenshot(options)
        }
      } catch (ignored) {}
    } else if (driver.userAgent.browser === 'Safari') {
      if (driver.userAgent.os === 'iOS' || driver.isIOS) {
        return makeTakeMarkedScreenshot(options)
      } else if (this._driver.userAgent.browserMajorVersion === '11') {
        return makeTakeSafari11Screenshot(options)
      }
    }
  }
  return makeTakeDefaultScreenshot(options)
}

function makeTakeDefaultScreenshot({logger, driver, stabilization = {}, debug = {}}) {
  let calculateScaleRatio
  return async function takeScreenshot({name} = {}) {
    logger.verbose('Taking screenshot...')
    const image = makeImage(await driver.takeScreenshot())
    await saveScreenshot(image, {path: debug.path, name, suffix: 'original', logger})

    if (stabilization.rotate) {
      await image.rotate(stabilization.rotate)
      await saveScreenshot(image, {path: debug.path, name, suffix: 'rotated', logger})
    }

    if (stabilization.crop) {
      await image.crop(stabilization.crop)
      await saveScreenshot(image, {path: debug.path, name, suffix: 'cropped', logger})
    }

    if (stabilization.scale) {
      await image.scale(stabilization.scale)
    } else {
      if (!calculateScaleRatio) {
        const viewportSize = await driver.getViewportSize()
        const documentSize = await driver.mainContext.getDocumentSize()
        calculateScaleRatio = makeCalculateScaleRatio({
          viewportWidth: viewportSize.width,
          documentWidth: documentSize.width,
          pixelRatio: await driver.getPixelRatio(),
        })
      }
      await image.scale(calculateScaleRatio(image.width))
    }
    await saveScreenshot(image, {path: debug.path, name, suffix: 'scaled', logger})

    return image
  }
}

function makeTakeMainContextScreenshot({logger, driver, stabilization = {}, debug = {}}) {
  let calculateScaleRatio
  return async function takeScreenshot({name} = {}) {
    logger.verbose('Taking screenshot...')
    const originalContext = driver.currentContext
    await driver.mainContext.focus()
    const image = makeImage(await driver.takeScreenshot())
    await originalContext.focus()
    await saveScreenshot(image, {path: debug.path, name, suffix: 'original', logger})

    if (stabilization.rotate) {
      await image.rotate(stabilization.rotate)
      await saveScreenshot(image, {path: debug.path, name, suffix: 'rotated', logger})
    }

    if (stabilization.crop) {
      await image.crop(stabilization.crop)
      await saveScreenshot(image, {path: debug.path, name, suffix: 'cropped', logger})
    }

    if (stabilization.scale) {
      await image.scale(stabilization.scale)
    } else {
      if (!calculateScaleRatio) {
        const viewportSize = await driver.getViewportSize()
        const documentSize = await driver.mainContext.getDocumentSize()
        calculateScaleRatio = makeCalculateScaleRatio({
          viewportWidth: viewportSize.width,
          documentWidth: documentSize.width,
          pixelRatio: await driver.getPixelRatio(),
        })
      }
      await image.scale(calculateScaleRatio(image.width))
    }
    await saveScreenshot(image, {path: debug.path, name, suffix: 'scaled', logger})

    return image
  }
}

function makeTakeSafari11Screenshot({logger, driver, stabilization = {}, debug = {}}) {
  let pixelRatio = null
  let viewportSize = null
  let calculateScaleRatio = null

  return async function takeScreenshot({name} = {}) {
    logger.verbose('Taking safari 11 driver screenshot...')
    const image = makeImage(await driver.takeScreenshot())
    await saveScreenshot(image, {path: debug.path, name, suffix: 'original', logger})

    if (stabilization.rotate) {
      await image.rotate(stabilization.rotate)
      await saveScreenshot(image, {path: debug.path, name, suffix: 'rotated', logger})
    }

    if (stabilization.crop) {
      await image.crop(stabilization.crop)
    } else {
      if (!pixelRatio) pixelRatio = await driver.getPixelRatio()
      if (!viewportSize) viewportSize = await driver.getViewportSize()
      const viewportLocation = await driver.mainContext.getScrollOffset()
      await image.crop(utils.geometry.scale({...viewportLocation, ...viewportSize}, pixelRatio))
    }
    await saveScreenshot(image, {path: debug.path, name, suffix: 'cropped', logger})

    if (stabilization.scale) {
      await image.scale(stabilization.scale)
    } else {
      if (!calculateScaleRatio) {
        if (!pixelRatio) pixelRatio = await driver.getPixelRatio()
        if (!viewportSize) viewportSize = await driver.getViewportSize()
        const documentSize = await driver.mainContext.getDocumentSize()
        calculateScaleRatio = makeCalculateScaleRatio({
          viewportWidth: viewportSize.width,
          documentWidth: documentSize.width,
          pixelRatio,
        })
      }
      await image.scale(calculateScaleRatio(image.width))
    }
    await saveScreenshot(image, {path: debug.path, name, suffix: 'scaled', logger})

    return image
  }
}

function makeTakeMarkedScreenshot({logger, driver, stabilization = {}, debug = {}}) {
  let calculateScaleRatio = null
  let viewportRegion = null

  return async function takeScreenshot({name} = {}) {
    logger.verbose('Taking viewport screenshot (using markers)...')
    const image = makeImage(await driver.takeScreenshot())
    await saveScreenshot(image, {path: debug.path, name, suffix: 'original', logger})

    if (stabilization.rotate) {
      await image.rotate(stabilization.rotate)
      await saveScreenshot(image, {path: debug.path, name, suffix: 'rotated', logger})
    }

    if (stabilization.crop) {
      await image.crop(stabilization.crop)
    } else {
      if (!viewportRegion) viewportRegion = await getViewportRegion()
      await image.crop(viewportRegion)
    }
    await saveScreenshot(image, {path: debug.path, name, suffix: 'cropped', logger})

    if (stabilization.scale) {
      await image.scale(stabilization.scale)
    } else {
      if (!calculateScaleRatio) {
        const viewportSize = await driver.getViewportSize()
        const documentSize = await driver.mainContext.getDocumentSize()
        calculateScaleRatio = makeCalculateScaleRatio({
          viewportWidth: viewportSize.width,
          documentWidth: documentSize.width,
          pixelRatio: await driver.getPixelRatio(),
        })
      }
      await image.scale(calculateScaleRatio(image.width))
    }
    await saveScreenshot(image, {path: debug.path, name, suffix: 'scaled', logger})

    return image
  }

  async function getViewportRegion() {
    const marker = await driver.addPageMarker()
    try {
      const image = makeImage(await driver.takeScreenshot())
      if (stabilization.rotate) await image.rotate(stabilization.rotate)

      await saveScreenshot(image, 'marker') // TODO fix

      const markerLocation = findPattern(await image.toObject(), marker)
      if (!markerLocation) return null

      const pixelRation = await driver.getPixelRatio()
      const viewportSize = await driver.getViewportSize()
      const scaledViewportSize = utils.geometry.scale(viewportSize, pixelRation)

      return {...markerLocation, ...scaledViewportSize}
    } finally {
      await driver.cleanupPageMarker()
    }
  }
}

function makeTakeNativeScreenshot({logger, driver, stabilization = {}, debug = {}}) {
  return async function takeScreenshot({name} = {}) {
    logger.verbose('Taking native driver screenshot...')
    const image = makeImage(
      stabilization.crop || process.env.APPLITOOLS_SKIP_MOBILE_NATIVE_SCREENSHOT_HOOK
        ? await driver.takeScreenshot()
        : await takeViewportScreenshot(),
    )
    await saveScreenshot(image, {path: debug.path, name, suffix: 'original', logger})

    if (stabilization.rotate) {
      await image.rotate(stabilization.rotate)
      await saveScreenshot(image, {path: debug.path, name, suffix: 'rotated', logger})
    }

    if (stabilization.crop) {
      await image.crop(stabilization.crop)
      await saveScreenshot(image, {path: debug.path, name, suffix: 'cropped', logger})
    }

    if (stabilization.scale) {
      await image.scale(stabilization.scale)
      await saveScreenshot(image, {path: debug.path, name, suffix: 'scaled', logger})
    }

    process.env.APPLITOOLS_SKIP_MOBILE_NATIVE_SCREENSHOT_HOOK = undefined // TODO remove

    return image
  }

  async function takeViewportScreenshot() {
    const base64 = await driver.execute('mobile: viewportScreenshot')
    // trimming line breaks since 3rd party grid providers can return them
    return base64.replace(/\r\n/g, '')
  }
}

module.exports = makeTakeScreenshot
