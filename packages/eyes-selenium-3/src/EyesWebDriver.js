;(function() {
  'use strict'

  var webdriver = require('selenium-webdriver'),
    GeneralUtils = require('@applitools/eyes-common-legacy').GeneralUtils,
    Frame = require('./Frame').Frame,
    FrameChain = require('./FrameChain').FrameChain,
    EyesSeleniumUtils = require('./EyesSeleniumUtils').EyesSeleniumUtils,
    EyesRemoteWebElement = require('./EyesRemoteWebElement').EyesRemoteWebElement,
    ScrollPositionProvider = require('./ScrollPositionProvider').ScrollPositionProvider,
    EyesTargetLocator = require('./EyesTargetLocator').EyesTargetLocator

  /**
   * Wraps a Remote Web Driver.
   *
   * @constructor
   * @param {WebDriver} driver
   * @param {Eyes} eyes An instance of Eyes
   * @param {Logger} logger
   * @mixin WebDriver
   **/
  function EyesWebDriver(driver, eyes, logger) {
    this._logger = logger
    this._eyes = eyes
    this._driver = undefined
    this.setRemoteWebDriver(driver)

    /** @deprecated */
    this._promiseFactory = this._eyes._promiseFactory
    /** @type {webdriver.By|ProtractorBy} */
    this._byFunctions = eyes._isProtractorLoaded ? global.by : webdriver.By

    this._frameChain = new FrameChain(this._logger, null)

    this._defaultContentViewportSize = null
    this._isMobileDevice = undefined
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * @return {Eyes}
   */
  EyesWebDriver.prototype.getEyes = function() {
    return this._eyes
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * @return {PromiseFactory}
   */
  EyesWebDriver.prototype.getPromiseFactory = function() {
    return this._eyes._promiseFactory
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * @return {WebDriver}
   */
  EyesWebDriver.prototype.getRemoteWebDriver = function() {
    return this._driver.driver || this._driver
  }

  //noinspection JSUnusedGlobalSymbols
  EyesWebDriver.prototype.setRemoteWebDriver = function(driver) {
    this._driver = driver

    GeneralUtils.mixin(this, driver)

    // TODO: is there a way to override bindings?
    delete this.then
    delete this.catch
    delete this.cancel
  }

  //noinspection JSUnusedGlobalSymbols
  EyesWebDriver.prototype.getUserAgent = function() {
    var that = this
    return this.isMobileDevice().then(function(isMobileDevice) {
      if (isMobileDevice) return
      return that._driver.executeScript('return navigator.userAgent')
    })
  }

  //noinspection JSUnusedGlobalSymbols
  EyesWebDriver.prototype.getCurrentUrl = function() {
    var that = this
    return this.isMobileDevice().then(function(isMobileDevice) {
      if (isMobileDevice) return
      return that._driver.getCurrentUrl()
    })
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * @package
   * @return {Promise<boolean>}
   */
  EyesWebDriver.prototype.isMobileDevice = function() {
    if (this._isMobileDevice !== undefined) {
      return this.getPromiseFactory().resolve(this._isMobileDevice)
    }

    var that = this
    return this._driver.getCapabilities().then(function(capabilities) {
      const platformName = capabilities.get('platformName')
      const browserName = capabilities.get('browserName')
      that._isMobileDevice =
        platformName && ['ANDROID', 'IOS'].includes(platformName.toUpperCase()) && !browserName
      return that._isMobileDevice
    })
  }

  //noinspection JSCheckFunctionSignatures
  /**
   * @param {webdriver.By|ProtractorBy} locator
   * @return {EyesRemoteWebElement}
   */
  EyesWebDriver.prototype.findElement = function(locator) {
    return new EyesRemoteWebElement(this._driver.findElement(locator), this, this._logger)
  }

  //noinspection JSCheckFunctionSignatures
  /**
   * @param {webdriver.By|ProtractorBy} locator
   * @return {Promise<EyesRemoteWebElement[]>}
   */
  EyesWebDriver.prototype.findElements = function(locator) {
    var that = this
    return this._driver.findElements(locator).then(function(elements) {
      return elements.map(function(element) {
        return new EyesRemoteWebElement(element, that, that._logger)
      })
    })
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * @param {string} cssSelector
   * @return {EyesRemoteWebElement}
   */
  EyesWebDriver.prototype.findElementByCssSelector = function(cssSelector) {
    return this.findElement(this._byFunctions.css(cssSelector))
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * @param {string} cssSelector
   * @return {Promise<EyesRemoteWebElement[]>}
   */
  EyesWebDriver.prototype.findElementsByCssSelector = function(cssSelector) {
    return this.findElements(this._byFunctions.css(cssSelector))
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * @param {string} name
   * @return {EyesRemoteWebElement}
   */
  EyesWebDriver.prototype.findElementById = function(name) {
    return this.findElement(this._byFunctions.id(name))
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * @param {string} name
   * @return {Promise<EyesRemoteWebElement[]>}
   */
  EyesWebDriver.prototype.findElementsById = function(name) {
    return this.findElements(this._byFunctions.id(name))
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * @param {string} name
   * @return {EyesRemoteWebElement}
   */
  EyesWebDriver.prototype.findElementByName = function(name) {
    return this.findElement(this._byFunctions.name(name))
  }

  //noinspection JSUnusedGlobalSymbols
  /**
   * @param {string} name
   * @return {Promise<EyesRemoteWebElement[]>}
   */
  EyesWebDriver.prototype.findElementsByName = function(name) {
    return this.findElements(this._byFunctions.name(name))
  }

  //  EyesWebDriver.prototype.init = function () {
  //    return new Promise(function (resolve) {
  //      this._driver.getCapabilities().then(function (capabilities) {
  //        if (!capabilities.has(webdriver.Capability.TAKES_SCREENSHOT)) {
  //          this._screenshotTaker = new ScreenshotTaker();
  //        }
  //        resolve();
  //      }.bind(this));
  //    }.bind(this));
  //  };

  /**
   * @return {EyesTargetLocator}
   */
  EyesWebDriver.prototype.switchTo = function() {
    var that = this
    this._logger.verbose('switchTo()')

    var OnWillSwitch = function() {}

    /**
     * @param {EyesTargetLocator.TargetType} targetType
     * @param {EyesRemoteWebElement|WebElement} targetFrame
     * @return {Promise<void>}
     */
    OnWillSwitch.willSwitchToFrame = function(targetType, targetFrame) {
      that._logger.verbose('willSwitchToFrame()')
      switch (targetType) {
        case EyesTargetLocator.TargetType.DEFAULT_CONTENT:
          that._logger.verbose('Default content.')
          that._frameChain.clear()
          return that.getPromiseFactory().resolve()
        case EyesTargetLocator.TargetType.PARENT_FRAME:
          that._logger.verbose('Parent frame.')
          that._frameChain.pop()
          return that.getPromiseFactory().resolve()
        default:
          // Switching into a frame
          that._logger.verbose('Frame')

          var frameId, pl, sp, size
          return targetFrame
            .getId()
            .then(function(_id) {
              frameId = _id
              return targetFrame.getLocation()
            })
            .then(function(_location) {
              pl = _location
              return targetFrame.getSize()
            })
            .then(function(_size) {
              size = _size
              return new ScrollPositionProvider(
                that._logger,
                that._driver,
                that.getPromiseFactory(),
              ).getCurrentPosition()
            })
            .then(function(_scrollPosition) {
              sp = _scrollPosition

              // Get the frame's content location.
              return EyesSeleniumUtils.getLocationWithBordersAddition(
                that._logger,
                targetFrame,
                pl,
                that.getPromiseFactory(),
              )
            })
            .then(function(contentLocation) {
              that._frameChain.push(
                new Frame(that._logger, targetFrame, frameId, contentLocation, size, sp),
              )
              that._logger.verbose('Done!')
            })
      }
    }

    //noinspection JSUnusedLocalSymbols
    OnWillSwitch.willSwitchToWindow = function(nameOrHandle) {
      that._logger.verbose('willSwitchToWindow()')
      that._frameChain.clear()
      that._logger.verbose('Done!')
      return that.getPromiseFactory().resolve()
    }

    return new EyesTargetLocator(
      this._logger,
      this,
      this._driver.switchTo(),
      OnWillSwitch,
      this.getPromiseFactory(),
    )
  }

  /**
   * @param {boolean} forceQuery If true, we will perform the query even if we have a cached viewport size.
   * @return {Promise<{width: number, height: number}>} The viewport size of the default content (outer most frame).
   */
  EyesWebDriver.prototype.getDefaultContentViewportSize = function(forceQuery) {
    var that = this
    return this.getPromiseFactory().makePromise(function(resolve) {
      that._logger.verbose('getDefaultContentViewportSize()')

      if (that._defaultContentViewportSize !== null && !forceQuery) {
        that._logger.verbose('Using cached viewport size: ', that._defaultContentViewportSize)
        resolve(that._defaultContentViewportSize)
        return
      }

      var currentFrames = that.getFrameChain()
      var promise = that.getPromiseFactory().resolve()

      if (currentFrames.size() > 0) {
        promise = promise.then(function() {
          return that.switchTo().defaultContent()
        })
      }

      promise = promise
        .then(function() {
          that._logger.verbose('Extracting viewport size...')
          return EyesSeleniumUtils.getViewportSizeOrDisplaySize(
            that._logger,
            that._driver,
            that.getPromiseFactory(),
          )
        })
        .then(function(viewportSize) {
          that._defaultContentViewportSize = viewportSize
          that._logger.verbose('Done! Viewport size: ', that._defaultContentViewportSize)
        })

      if (currentFrames.size() > 0) {
        promise = promise.then(function() {
          return that.switchTo().frames(currentFrames)
        })
      }

      promise.then(function() {
        resolve(that._defaultContentViewportSize)
      })
    })
  }

  /**
   *
   * @return {FrameChain} A copy of the current frame chain.
   */
  EyesWebDriver.prototype.getFrameChain = function() {
    return new FrameChain(this._logger, this._frameChain)
  }

  exports.EyesWebDriver = EyesWebDriver
})()
