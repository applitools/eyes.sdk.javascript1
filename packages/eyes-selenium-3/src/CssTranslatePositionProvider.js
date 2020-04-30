;(function() {
  'use strict'

  var EyesSDK = require('@applitools/eyes-sdk-core-legacy'),
    EyesUtils = require('@applitools/eyes-common-legacy'),
    EyesSeleniumUtils = require('./EyesSeleniumUtils').EyesSeleniumUtils
  var PositionProvider = EyesSDK.PositionProvider,
    ArgumentGuard = EyesUtils.ArgumentGuard

  /**
   * @constructor
   * @param {Logger} logger A Logger instance.
   * @param {EyesWebDriver} executor
   * @param {PromiseFactory} promiseFactory
   * @augments PositionProvider
   */
  function CssTranslatePositionProvider(logger, executor, promiseFactory) {
    ArgumentGuard.notNull(logger, 'logger')
    ArgumentGuard.notNull(executor, 'executor')

    this._logger = logger
    this._driver = executor
    this._promiseFactory = promiseFactory
    this._lastSetPosition = null
  }

  CssTranslatePositionProvider.prototype = new PositionProvider()
  CssTranslatePositionProvider.prototype.constructor = CssTranslatePositionProvider

  /**
   * @return {Promise<{x: number, y: number}>} The scroll position of the current frame.
   */
  CssTranslatePositionProvider.prototype.getCurrentPosition = function() {
    var that = this
    return that._promiseFactory.makePromise(function(resolve) {
      that._logger.verbose('getCurrentPosition()')
      that._logger.verbose('position to return: ', that._lastSetPosition)
      resolve(that._lastSetPosition)
    })
  }

  /**
   * Go to the specified location.
   * @param {{x: number, y: number}} location The position to scroll to.
   * @return {Promise<void>}
   */
  CssTranslatePositionProvider.prototype.setPosition = function(location) {
    var that = this
    that._logger.verbose('Setting position to:', location)

    var setFakeTransformScript = `document.documentElement.style.transform = 'translate(10px, -${location.y}px)';`
    var setTransformScript = `document.documentElement.style.transform = 'translate(-${location.x}px, -${location.y}px)';`

    return EyesSeleniumUtils.executeScript(
      that._driver,
      setFakeTransformScript,
      that._promiseFactory,
    )
      .then(function() {
        return EyesSeleniumUtils.executeScript(
          that._driver,
          setTransformScript,
          that._promiseFactory,
          250,
        )
      })
      .then(function() {
        that._logger.verbose('Done!')
        that._lastSetPosition = location
      })
  }

  /**
   * @return {Promise<{width: number, height: number}>} The entire size of the container which the position is relative to.
   */
  CssTranslatePositionProvider.prototype.getEntireSize = function() {
    var that = this
    return EyesSeleniumUtils.getEntirePageSize(this._driver, this._promiseFactory).then(function(
      result,
    ) {
      that._logger.verbose('Entire size: ', result)
      return result
    })
  }

  /**
   * @return {Promise<{transform: object, position: object}>}
   */
  CssTranslatePositionProvider.prototype.getState = function() {
    var that = this

    return EyesSeleniumUtils.executeScript(
      that._driver,
      'return document.documentElement.style.transform;',
      that._promiseFactory,
    ).then(function(transforms) {
      that._logger.verbose('Current transform', transforms)
      return {
        transform: transforms,
        position: that._lastSetPosition,
      }
    })
  }

  /**
   * @param {{transform: object, position: object}} state The initial state of position
   * @return {Promise<void>}
   */
  CssTranslatePositionProvider.prototype.restoreState = function(state) {
    var that = this
    const script =
      'var originalTransform = document.documentElement.style.transform;' +
      `document.documentElement.style.transform = '${state.transform}';` +
      'return originalTransform;'

    return EyesSeleniumUtils.executeScript(this._driver, script, this._promiseFactory).then(
      function() {
        that._logger.verbose('Transform (position) restored.')
        that._lastSetPosition = state.position
      },
    )
  }

  exports.CssTranslatePositionProvider = CssTranslatePositionProvider
})()
