'use strict'

const {Location, RectangleSize, ArgumentGuard, TypeUtils} = require('@applitools/eyes-sdk-core')

const Frame = require('../frames/Frame')
const FrameChain = require('../frames/FrameChain')
const ScrollPositionProvider = require('../positioning/ScrollPositionProvider')
const WDIOJSExecutor = require('../WDIOJSExecutor')
const EyesWebElement = require('./EyesWebElement')
const TargetLocator = require('../TargetLocator')
const WebElement = require('./WebElement')

/**
 * Wraps a target locator so we can keep track of which frames have been switched to.
 */
class EyesTargetLocator extends TargetLocator {
  /**
   * Initialized a new EyesTargetLocator object.
   *
   * @param {Logger} logger A Logger instance.
   * @param {EyesWebDriver} driver The WebDriver from which the targetLocator was received.
   * @param {TargetLocator} targetLocator The actual TargetLocator object.
   */
  constructor(logger, driver, targetLocator = null) {
    ArgumentGuard.notNull(logger, 'logger')
    ArgumentGuard.notNull(driver, 'driver')
    ArgumentGuard.notNull(targetLocator, 'targetLocator')

    super(driver.webDriver)

    this._logger = logger
    this._tsInstance = driver
    this._targetLocator = targetLocator
    this._jsExecutor = new WDIOJSExecutor(driver)
    this._scrollPosition = new ScrollPositionProvider(this._logger, this._jsExecutor)
  }

  /**
   * Schedules a command to switch the focus of all future commands to another
   * frame on the page. The target frame may be specified as one of the following:
   *
   * - A number that specifies a (zero-based) index into [window.frames](
   *   https://developer.mozilla.org/en-US/docs/Web/API/Window.frames).
   * - A string, which correspond to a `id` or `name` of element.
   * - A {@link WebElement} reference, which correspond to a `frame` or `iframe` DOM element.
   * - The `null` value, to select the topmost frame on the page. Passing `null`
   *   is the same as calling {@link #defaultContent defaultContent()}.
   *
   * @override
   * @param {number|string|WebElement|EyesWebElement|null} [arg1] The frame locator.
   * @return {Promise.<void>}
   */
  async frame(arg1) {
    if (!arg1) {
      this._logger.verbose('EyesTargetLocator.frame(null)')
      await this.defaultContent()
      return
    }

    let frameElement

    if (TypeUtils.isInteger(arg1)) {
      const frameIndex = arg1
      this._logger.verbose(`EyesTargetLocator.frame(${frameIndex})`)
      // Finding the target element so and reporting it using onWillSwitch.
      this._logger.verbose('Getting frames list...')
      const frames = await this._tsInstance.findElementsByCssSelector('frame, iframe')
      if (frameIndex > frames.length) {
        throw new TypeError(`Frame index [${frameIndex}] is invalid!`)
      }
      this._logger.verbose('Done! getting the specific frame...')
      frameElement = frames[frameIndex]
    } else if (TypeUtils.isString(arg1)) {
      const frameNameOrId = arg1
      this._logger.verbose(`EyesTargetLocator.frame(${frameNameOrId})`)
      // Finding the target element so we can report it.
      // We use find elements(plural) to avoid exception when the element is not found.
      this._logger.verbose('Getting frames by name...')
      let frames = await this._tsInstance.findElementsByName(frameNameOrId)
      if (frames.length === 0) {
        this._logger.verbose('No frames Found! Trying by id...')
        // If there are no frames by that name, we'll try the id
        frames = await this._tsInstance.findElementsById(frameNameOrId)
        if (frames.length === 0) {
          // No such frame, bummer
          throw new TypeError(`No frame with name or id '${frameNameOrId}' exists!`)
        }
      }
      frameElement = frames[0]
    } else {
      frameElement = arg1
    }

    this._logger.verbose('EyesTargetLocator.frame(element)')
    this._logger.verbose('Making preparations...')
    await this.willSwitchToFrame(frameElement)
    this._logger.verbose('Done! Switching to frame...')
    await this._targetLocator.frame(frameElement.jsonElement)
    this._logger.verbose('Done!')
  }

  /**
   * Change focus to the parent context. If the current context is the top level browsing context, the context remains unchanged.
   *
   * @return {Promise.<EyesWebDriver>}
   */
  parentFrame() {
    const that = this
    this._logger.verbose('EyesTargetLocator.parentFrame()')
    if (this._tsInstance.getFrameChain().size() !== 0) {
      this._logger.verbose('Making preparations...')
      this._tsInstance.getFrameChain().pop()
      this._logger.verbose('Done! Switching to parent frame..')
      return this._tsInstance.remoteWebDriver.switchToParentFrame().then(() => {
        that._logger.verbose('Done!')
        return that._tsInstance
      })
    } else {
      return this._tsInstance
    }
  }

  /**
   * @param {TargetLocator} targetLocator
   * @param {FrameChain} frameChainToParent
   * @return {Promise}
   */
  static async tryParentFrame(targetLocator, frameChainToParent) {
    try {
      await targetLocator.parentFrame()
    } catch (ignored) {
      await targetLocator.defaultContent()
      for (const frame of frameChainToParent) {
        await targetLocator.frame(frame.getReference())
      }
    }
  }

  /**
   * Switches into every frame in the frame chain. This is used as way to switch into nested frames (while considering scroll) in a single call.
   *
   * @param {FrameChain} frameChain The path to the frame to switch to.
   * @return {Promise.<void>} The WebDriver with the switched context.
   */
  async framesDoScroll(frameChain) {
    this._logger.verbose('EyesTargetLocator.framesDoScroll(frameChain)')
    await this._tsInstance.switchTo().defaultContent()
    this._defaultContentPositionMemento = await this._scrollPosition.getState()

    for (const frame of frameChain.getFrames()) {
      this._logger.verbose('Scrolling by parent scroll position...')
      const frameLocation = frame.getLocation()
      await this._scrollPosition.setPosition(frameLocation)
      this._logger.verbose('Done! Switching to frame...')
      await this._tsInstance.switchTo().frame(frame.getReference())
      this._logger.verbose('Done!')
    }

    this._logger.verbose('Done switching into nested frames!')
  }

  /**
   * Switches into every frame in the frame chain. This is used as way to switch into nested frames (while considering scroll) in a single call.
   *
   * @param {FrameChain|string[]} varArg The path to the frame to switch to. Or the path to the frame to check. This is a list of frame names/IDs (where each frame is nested in the previous frame).
   * @return {Promise.<void>} The WebDriver with the switched context.
   */
  async frames(varArg) {
    if (varArg instanceof FrameChain) {
      this._logger.verbose('EyesTargetLocator.frames(frameChain)')
      await this._tsInstance.switchTo().defaultContent()

      for (const frame of varArg.getFrames()) {
        this._logger.verbose('Switching to frame...')
        try {
          await this._tsInstance.switchTo().frame(frame.getReference())
        } catch (error) {
          console.error(error)
        }
        this._logger.verbose('Done!')
      }

      this._logger.verbose('Done switching into nested frames!')
      return
    }

    if (Array.isArray(varArg)) {
      this._logger.verbose('EyesTargetLocator.frames(framesPath)')

      for (const frameNameOrId of varArg) {
        this._logger.verbose('Switching to frame...')
        await this._tsInstance.switchTo().frame(frameNameOrId)
        this._logger.verbose('Done!')
      }

      this._logger.verbose('Done switching into nested frames!')
    }
  }

  /**
   * Schedules a command to switch the focus of all future commands to another window.
   * Windows may be specified by their {@code window.name} attribute or by its handle.
   *
   * @override
   * @param {string} nameOrHandle The name or window handle of the window to switch focus to.
   * @return {Promise.<EyesWebDriver>}
   */
  window(nameOrHandle) {
    const that = this
    that._logger.verbose('EyesTargetLocator.window()')
    that._tsInstance.getFrameChain().clear()
    that._logger.verbose('Done! Switching to window...')
    return that._targetLocator.window(nameOrHandle).then(() => {
      that._logger.verbose('Done!')
      return that._tsInstance
    })
  }

  /**
   * Schedules a command to switch focus of all future commands to the topmost frame on the page.
   *
   * @override
   */
  async defaultContent() {
    this._logger.verbose('EyesTargetLocator.defaultContent()')
    if (this._tsInstance.getFrameChain().size() !== 0) {
      this._logger.verbose('Making preparations...')
      this._tsInstance.getFrameChain().clear()
      this._logger.verbose('Done! Switching to default content...')
    }
    await this._targetLocator.defaultContent()
    this._logger.verbose('Done!')
  }

  /**
   * Schedules a command retrieve the {@code document.activeElement} element on the current document,
   * or {@code document.body} if activeElement is not available.
   *
   * @override
   * @return {!EyesWebElement}
   */
  activeElement() {
    this._logger.verbose('EyesTargetLocator.activeElement()')
    this._logger.verbose('Switching to element...')

    const element = this._tsInstance.remoteWebDriver.elementActive()
    // const element = this._tsInstance.schedule(new command.Command(command.Name.GET_ACTIVE_ELEMENT), 'WebDriver.switchTo().activeElement()');
    this._logger.verbose('Done!')
    return new EyesWebElement(
      this._logger,
      this._tsInstance,
      new WebElement(this._tsInstance.remoteWebDriver, element),
    )
  }

  /**
   * Schedules a command to change focus to the active modal dialog, such as those opened by `window.alert()`, `window.confirm()`, and `window.prompt()`.
   * The returned promise will be rejected with a {@linkplain error.NoSuchAlertError} if there are no open alerts.
   *
   * @return {!AlertPromise} The open alert.
   */
  alert() {
    this._logger.verbose('EyesTargetLocator.alert()')
    this._logger.verbose('Switching to alert...')
    const result = this._targetLocator.alert()
    this._logger.verbose('Done!')
    return result
  }

  /**
   * @return {Promise}
   */
  async resetScroll() {
    this._logger.verbose('enter')
    if (this._defaultContentPositionMemento != null) {
      const scrollRootElement = await this._driver.eyes.getCurrentFrameScrollRootElement()
      const scrollProvider = new ScrollPositionProvider(
        this._logger,
        this._jsExecutor,
        scrollRootElement,
      )
      await scrollProvider.restoreState(this._defaultContentPositionMemento)
    }
  }

  /**
   * Will be called before switching into a frame.
   *
   * @param {WebElement|EyesWebElement} targetFrame The element about to be switched to.
   * @return {Promise}
   */
  willSwitchToFrame(targetFrame) {
    ArgumentGuard.notNull(targetFrame, 'targetFrame')

    this._logger.verbose('willSwitchToFrame()')
    this._logger.verbose('Frame')

    const eyesFrame =
      targetFrame instanceof EyesWebElement
        ? targetFrame
        : new EyesWebElement(this._logger, this._tsInstance, targetFrame)

    const that = this
    // eslint-disable-next-line
    let location, elementSize, clientSize, contentLocation, originalLocation, originalOverflow
    return eyesFrame
      .getLocation()
      .then(pl => {
        location = new Location(pl)
      })
      .then(() => {
        return eyesFrame.getSize().then(ds => {
          elementSize = new RectangleSize(ds)
        })
      })
      .then(() => {
        return eyesFrame.getClientWidth().then(clientWidth => {
          return eyesFrame.getClientHeight().then(clientHeight => {
            clientSize = new RectangleSize(clientWidth, clientHeight)
          })
        })
      })
      .then(() => {
        return eyesFrame.getComputedStyleInteger('border-left-width').then(borderLeftWidth => {
          return eyesFrame.getComputedStyleInteger('border-top-width').then(borderTopWidth => {
            contentLocation = new Location(
              location.getX() + borderLeftWidth,
              location.getY() + borderTopWidth,
            )
          })
        })
      })
      .then(() => {
        return that._scrollPosition.getCurrentPosition().then(location => {
          originalLocation = location
        })
      })
      .then(() => {
        return eyesFrame.getOverflow().then(overflow => {
          originalOverflow = overflow
        })
      })
      .then(() => {
        const frame = new Frame(
          that._logger,
          targetFrame,
          contentLocation,
          elementSize,
          clientSize,
          originalLocation,
          that._tsInstance,
        )
        that._tsInstance.getFrameChain().push(frame)
      })
  }
}

module.exports = EyesTargetLocator
