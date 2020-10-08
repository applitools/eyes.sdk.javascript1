import {
  FullPageCaptureAlgorithm,
  NullDebugScreenshotProvider,
  NullCutProvider,
  FixedScaleProviderFactory,
  FixedScaleProvider,
  ReadOnlyPropertyHandler,
  EyesSimpleScreenshotFactory,
  Region,
} from '@applitools/eyes-images'
import ScrollPositionProvider from './ScrollPositionProvider'
import CSSTranslatePositionProvider from './CSSTranslatePositionProvider'
import WebExtensionImageProvider from './WebExtensionImageProvider'
import { hideCaret, hideScrollbars } from './polish'

const REGION_POSITION_COMPENSATION = undefined
const DEFAULT_WAIT_BEFORE_SCREENSHOTS = 100 // Milliseconds
const DEFAULT_STITCHING_OVERLAP = 50 // pixels

export function buildCheckWindowFullFunction(eyes, tabId, devicePixelRatio) {
  const fullPageCapture = initFullPageCapture(eyes._logger, tabId, devicePixelRatio)
  return buildCheckFunction(tabId, () =>
    fullPageCapture.getStitchedRegion(Region.EMPTY, null, new CSSTranslatePositionProvider(eyes._logger, tabId))
  )
}

export function buildCheckRegionFunction(eyes, tabId, devicePixelRatio, rect) {
  const fullPageCapture = initFullPageCapture(eyes._logger, tabId, devicePixelRatio)
  return buildCheckFunction(tabId, () =>
    fullPageCapture.getStitchedRegion(
      Region.EMPTY,
      new Region(rect.x, rect.y, rect.width, rect.height),
      new CSSTranslatePositionProvider(eyes._logger, tabId)
    )
  )
}

function buildCheckFunction(tabId, fn) {
  return async () => {
    const restoreCaret = await hideCaret(tabId)
    const restoreScrollbars = await hideScrollbars(tabId)

    let result
    try {
      result = await fn()
    } catch (e) {
      await restoreCaret()
      await restoreScrollbars()

      throw e
    }

    await restoreCaret()
    await restoreScrollbars()
    return result
  }
}

function initFullPageCapture(logger, tabId, devicePixelRatio) {
  return new FullPageCaptureAlgorithm(
    logger,
    REGION_POSITION_COMPENSATION,
    DEFAULT_WAIT_BEFORE_SCREENSHOTS,
    new NullDebugScreenshotProvider(),
    new EyesSimpleScreenshotFactory(),
    new ScrollPositionProvider(logger, tabId),
    new FixedScaleProviderFactory(
      1 / devicePixelRatio,
      new ReadOnlyPropertyHandler(logger, new FixedScaleProvider(1 / devicePixelRatio))
    ),
    new NullCutProvider(),
    DEFAULT_STITCHING_OVERLAP,
    new WebExtensionImageProvider(tabId)
  )
}
