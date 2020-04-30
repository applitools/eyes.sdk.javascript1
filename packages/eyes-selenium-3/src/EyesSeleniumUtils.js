;(function() {
  'use strict'

  var EyesSDK = require('@applitools/eyes-sdk-core-legacy'),
    EyesUtils = require('@applitools/eyes-common-legacy')
  var MutableImage = EyesSDK.MutableImage,
    CoordinatesType = EyesSDK.CoordinatesType,
    GeneralUtils = EyesUtils.GeneralUtils,
    GeometryUtils = EyesUtils.GeometryUtils,
    ImageUtils = EyesUtils.ImageUtils

  /**
   * Handles browser related functionality.
   */
  var EyesSeleniumUtils = {}

  /**
   * @private
   * @type {string}
   */
  var JS_GET_VIEWPORT_SIZE =
    'var height = undefined; ' +
    'var width = undefined; ' +
    'if (window.innerHeight) { height = window.innerHeight; } ' +
    'else if (document.documentElement && document.documentElement.clientHeight) { height = document.documentElement.clientHeight; } ' +
    "else { var b = document.getElementsByTagName('body')[0]; if (b.clientHeight) {height = b.clientHeight;} }; " +
    'if (window.innerWidth) { width = window.innerWidth; } ' +
    'else if (document.documentElement && document.documentElement.clientWidth) { width = document.documentElement.clientWidth; } ' +
    "else { var b = document.getElementsByTagName('body')[0]; if (b.clientWidth) { width = b.clientWidth;} }; " +
    'return [width, height];'

  /**
   * @private
   * @type {string}
   */
  var JS_GET_CURRENT_SCROLL_POSITION =
    'var doc = document.documentElement; ' +
    'var x = window.scrollX || ((window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0)); ' +
    'var y = window.scrollY || ((window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)); ' +
    'return [x, y];'

  /**
   * @private
   * @type {string}
   */
  var JS_GET_CONTENT_ENTIRE_SIZE =
    'var scrollWidth = document.documentElement.scrollWidth; ' +
    'var bodyScrollWidth = document.body.scrollWidth; ' +
    'var totalWidth = Math.max(scrollWidth, bodyScrollWidth); ' +
    'var clientHeight = document.documentElement.clientHeight; ' +
    'var bodyClientHeight = document.body.clientHeight; ' +
    'var scrollHeight = document.documentElement.scrollHeight; ' +
    'var bodyScrollHeight = document.body.scrollHeight; ' +
    'var maxDocElementHeight = Math.max(clientHeight, scrollHeight); ' +
    'var maxBodyHeight = Math.max(bodyClientHeight, bodyScrollHeight); ' +
    'var totalHeight = Math.max(maxDocElementHeight, maxBodyHeight); ' +
    'return [totalWidth, totalHeight];'

  /**
   * @return {string}
   */
  var JS_GET_COMPUTED_STYLE_FORMATTED_STR = function(propStyle) {
    return (
      "var elem = arguments[0]; var styleProp = '" +
      propStyle +
      "'; " +
      'if (window.getComputedStyle) { ' +
      'return window.getComputedStyle(elem, null).getPropertyValue(styleProp);' +
      '} else if (elem.currentStyle) { ' +
      'return elem.currentStyle[styleProp];' +
      '} else { ' +
      'return null;' +
      '}'
    )
  }

  /**
   * @return {string}
   */
  var JS_GET_SET_OVERFLOW_STR = function(elementName, overflowValue) {
    return (
      'var element = ' +
      elementName +
      ';' +
      'var overflowValue = "' +
      overflowValue +
      '";' +
      'var origOverflow = element.style.overflow;' +
      'element.style.overflow = overflowValue;' +
      'return origOverflow;'
    )
  }

  /**
   * @return {string}
   */
  var JS_GET_IS_BODY_OVERFLOW_HIDDEN =
    'var styles = window.getComputedStyle(document.body, null);' +
    "var overflow = styles.getPropertyValue('overflow');" +
    "var overflowX = styles.getPropertyValue('overflow-x');" +
    "var overflowY = styles.getPropertyValue('overflow-y');" +
    "return overflow == 'hidden' || overflowX == 'hidden' || overflowY == 'hidden'"

  /**
   * Executes a script using the browser's executeScript function - and optionally waits a timeout.
   *
   * @param {WebDriver} browser The driver using which to execute the script.
   * @param {string} script The code to execute on the given driver.
   * @param {PromiseFactory} promiseFactory
   * @param {number|undefined} [stabilizationTimeMs] The amount of time to wait after script execution to
   *        let the browser a chance to stabilize (e.g., finish rendering).
   * @param {WebElement} [element]
   * @return {Promise<void>} A promise which resolves to the result of the script's execution on the tab.
   */
  EyesSeleniumUtils.executeScript = function executeScript(
    browser,
    script,
    promiseFactory,
    stabilizationTimeMs,
    element,
  ) {
    return browser.executeScript(script, element).then(function(result) {
      if (stabilizationTimeMs) {
        return GeneralUtils.sleep(stabilizationTimeMs, promiseFactory).then(function() {
          return result
        })
      }

      return result
    })
  }

  /**
   * Returns the computed value of the style property for the current element.
   *
   * @param {WebDriver} browser The driver which will execute the script to get computed style.
   * @param {WebElement} element
   * @param {string} propStyle The style property which value we would like to extract.
   * @return {Promise<string>} The value of the style property of the element, or {@code null}.
   */
  EyesSeleniumUtils.getComputedStyle = function(browser, element, propStyle) {
    var scriptToExec = JS_GET_COMPUTED_STYLE_FORMATTED_STR(propStyle)
    return browser.executeScript(scriptToExec, element).then(function(computedStyle) {
      return computedStyle
    })
  }

  /**
   * Returns a location based on the given location.
   *
   * @param {Logger} logger The logger to use.
   * @param {WebElement|EyesRemoteWebElement} element The element for which we want to find the content's location.
   * @param {{x: number, y: number}} location The location of the element.
   * @param {PromiseFactory} promiseFactory
   * @return {Promise<{x: number, y: number}>} The location of the content of the element.
   */
  EyesSeleniumUtils.getLocationWithBordersAddition = function(
    logger,
    element,
    location,
    promiseFactory,
  ) {
    logger.verbose(
      'BordersAdditionFrameLocationProvider(logger, element, [' +
        location.x +
        ',' +
        location.y +
        '])',
    )
    if (element.getRemoteWebElement !== undefined) {
      element = element.getRemoteWebElement()
    }

    var leftBorderWidth, topBorderWidth
    return _getLeftBorderWidth(logger, promiseFactory, element)
      .then(function(val) {
        leftBorderWidth = val
        return _getTopBorderWidth(logger, promiseFactory, element)
      })
      .then(function(val) {
        topBorderWidth = val
        logger.verbose('Done!')
        // Frame borders also have effect on the frame's location.
        return GeometryUtils.locationOffset(location, {x: leftBorderWidth, y: topBorderWidth})
      })
  }

  /**
   * Return width of left border
   *
   * @private
   * @param {Logger} logger
   * @param {PromiseFactory} promiseFactory
   * @param {WebElement} element
   * @return {Promise<number>}
   */
  function _getLeftBorderWidth(logger, promiseFactory, element) {
    return promiseFactory.makePromise(function(resolve) {
      logger.verbose('Get element border left width...')
      return EyesSeleniumUtils.getComputedStyle(element.getDriver(), element, 'border-left-width')
        .then(
          function(styleValue) {
            return styleValue
          },
          function(err) {
            logger.verbose('Using getComputedStyle failed: ', err)
            logger.verbose('Using getCssValue...')
            return element.getCssValue('border-left-width')
          },
        )
        .then(
          function(propValue) {
            logger.verbose('Done!')
            var leftBorderWidth = Math.round(parseFloat(propValue.trim().replace('px', '')))
            logger.verbose('border-left-width: ', leftBorderWidth)
            resolve(leftBorderWidth)
          },
          function(err) {
            logger.verbose(
              "Couldn't get the element's border-left-width: ",
              err,
              '. Falling back to default',
            )
            resolve(0)
          },
        )
    })
  }

  /**
   * Return width of top border
   *
   * @private
   * @param {Logger} logger
   * @param {PromiseFactory} promiseFactory
   * @param {WebElement} element
   * @return {Promise<number>}
   */
  function _getTopBorderWidth(logger, promiseFactory, element) {
    return promiseFactory.makePromise(function(resolve) {
      logger.verbose("Get element's border top width...")
      return EyesSeleniumUtils.getComputedStyle(element.getDriver(), element, 'border-top-width')
        .then(
          function(styleValue) {
            return styleValue
          },
          function(err) {
            logger.verbose('Using getComputedStyle failed: ', err)
            logger.verbose('Using getCssValue...')
            return element.getCssValue('border-top-width')
          },
        )
        .then(
          function(propValue) {
            logger.verbose('Done!')
            var topBorderWidth = Math.round(parseFloat(propValue.trim().replace('px', '')))
            logger.verbose('border-top-width: ', topBorderWidth)
            resolve(topBorderWidth)
          },
          function(err) {
            logger.verbose(
              "Couldn't get the element's border-top-width: ",
              err,
              '. Falling back to default',
            )
            resolve(0)
          },
        )
    })
  }

  /**
   * Gets the device pixel ratio.
   *
   * @param {WebDriver} browser The driver which will execute the script to get the ratio.
   * @param {PromiseFactory} promiseFactory
   * @return {Promise<number>} A promise which resolves to the device pixel ratio (float type).
   */
  EyesSeleniumUtils.getDevicePixelRatio = function getDevicePixelRatio(browser, promiseFactory) {
    return EyesSeleniumUtils.executeScript(
      browser,
      'return window.devicePixelRatio',
      promiseFactory,
      undefined,
    ).then(function(results) {
      return parseFloat(results)
    })
  }

  /**
   * Scroll to the specified position.
   *
   * @param {WebDriver} browser - The driver which will execute the script to set the scroll position.
   * @param {{x: number, y: number}} point Point to scroll to
   * @param {PromiseFactory} promiseFactory
   * @return {Promise<void>} A promise which resolves after the action is performed and timeout passed.
   */
  EyesSeleniumUtils.scrollTo = function scrollTo(browser, point, promiseFactory) {
    return EyesSeleniumUtils.executeScript(
      browser,
      'window.scrollTo(' + parseInt(point.x, 10) + ', ' + parseInt(point.y, 10) + ');',
      promiseFactory,
      250,
    )
  }

  /**
   * Gets the current scroll position.
   *
   * @param {WebDriver} browser The driver which will execute the script to get the scroll position.
   * @param {PromiseFactory} promiseFactory
   * @return {Promise<{x: number, y: number}>} A promise which resolves to the current scroll position.
   */
  EyesSeleniumUtils.getCurrentScrollPosition = function getCurrentScrollPosition(
    browser,
    promiseFactory,
  ) {
    return EyesSeleniumUtils.executeScript(
      browser,
      JS_GET_CURRENT_SCROLL_POSITION,
      promiseFactory,
      undefined,
    ).then(function(results) {
      // If we can't find the current scroll position, we use 0 as default.
      var x = parseInt(results[0], 10) || 0
      var y = parseInt(results[1], 10) || 0
      return {x: x, y: y}
    })
  }

  /**
   * Get the entire page size.
   *
   * @param {WebDriver} browser The driver used to query the web page.
   * @param {PromiseFactory} promiseFactory
   * @return {Promise<{width: number, height: number}>} A promise which resolves to an object containing the width/height of the page.
   */
  EyesSeleniumUtils.getEntirePageSize = function getEntirePageSize(browser, promiseFactory) {
    // IMPORTANT: Notice there's a major difference between scrollWidth
    // and scrollHeight. While scrollWidth is the maximum between an
    // element's width and its content width, scrollHeight might be
    // smaller (!) than the clientHeight, which is why we take the
    // maximum between them.
    return EyesSeleniumUtils.executeScript(
      browser,
      JS_GET_CONTENT_ENTIRE_SIZE,
      promiseFactory,
    ).then(function(results) {
      var totalWidth = parseInt(results[0], 10) || 0
      var totalHeight = parseInt(results[1], 10) || 0
      return {width: totalWidth, height: totalHeight}
    })
  }

  /**
   * Updates the document's documentElement "overflow" value (mainly used to remove/allow scrollbars).
   *
   * @param {WebDriver} browser The driver used to update the web page.
   * @param {string} overflowValue The values of the overflow to set.
   * @param {WebElement} scrollRootElement
   * @param {PromiseFactory} promiseFactory
   * @return {Promise<string>} A promise which resolves to the original overflow of the document.
   */
  EyesSeleniumUtils.setOverflow = function setOverflow(
    browser,
    overflowValue,
    scrollRootElement,
    promiseFactory,
  ) {
    var script = JS_GET_SET_OVERFLOW_STR(
      scrollRootElement ? 'arguments[0]' : 'document.documentElement',
      overflowValue === null ? 'undefined' : overflowValue,
    )
    return EyesSeleniumUtils.executeScript(browser, script, promiseFactory, 100, scrollRootElement)
  }

  /**
   * Updates the document's body "overflow" value
   *
   * @param {WebDriver} browser The driver used to update the web page.
   * @param {string} overflowValue The values of the overflow to set.
   * @param {PromiseFactory} promiseFactory
   * @return {Promise<string>} A promise which resolves to the original overflow of the document.
   */
  EyesSeleniumUtils.setBodyOverflow = function setBodyOverflow(
    browser,
    overflowValue,
    promiseFactory,
  ) {
    var script = JS_GET_SET_OVERFLOW_STR(
      'document.body',
      overflowValue === null ? 'undefined' : overflowValue,
    )
    return EyesSeleniumUtils.executeScript(browser, script, promiseFactory, 100)
  }

  /**
   * Hides the scrollbars of the current context's document element.
   *
   * @param {WebDriver} browser The browser to use for hiding the scrollbars.
   * @param {PromiseFactory} promiseFactory
   * @return {Promise<string>} The previous value of the overflow property (could be {@code null}).
   */
  EyesSeleniumUtils.hideScrollbars = function(browser, promiseFactory) {
    return EyesSeleniumUtils.setOverflow(browser, 'hidden', undefined, promiseFactory)
  }

  /**
   * Tries to get the viewport size using Javascript. If fails, gets the entire browser window size!
   *
   * @param {WebDriver} browser The browser to use.
   * @param {PromiseFactory} promiseFactory
   * @return {Promise<{width: number, height: number}>} The viewport size.
   */
  EyesSeleniumUtils.getViewportSize = function(browser, promiseFactory) {
    return promiseFactory.makePromise(function(resolve, reject) {
      return EyesSeleniumUtils.executeScript(
        browser,
        JS_GET_VIEWPORT_SIZE,
        promiseFactory,
        undefined,
      ).then(
        function(results) {
          if (Number.isNaN(results[0]) || Number.isNaN(results[1])) {
            reject("Can't parse values.")
          } else {
            resolve({
              width: parseInt(results[0], 10) || 0,
              height: parseInt(results[1], 10) || 0,
            })
          }
        },
        function(err) {
          reject(err)
        },
      )
    })
  }

  /**
   * @param {Logger} logger
   * @param {WebDriver} browser The browser to use.
   * @param {PromiseFactory} promiseFactory
   * @return {Promise<{width: number, height: number}>} The viewport size of the current context, or the display size if the viewport size cannot be retrieved.
   */
  EyesSeleniumUtils.getViewportSizeOrDisplaySize = function(logger, browser, promiseFactory) {
    logger.verbose('getViewportSizeOrDisplaySize()')

    return EyesSeleniumUtils.getViewportSize(browser, promiseFactory).catch(function(err) {
      logger.verbose('Failed to extract viewport size using Javascript:', err)

      // If we failed to extract the viewport size using JS, will use the window size instead.
      logger.verbose('Using window size as viewport size.')
      return browser
        .manage()
        .window()
        .getSize()
        .then(function(size) {
          logger.verbose('Done! Size is', size)
          return size
        })
    })
  }

  /**
   * @param {Logger} logger
   * @param {WebDriver} browser The browser to use.
   * @param {{width: number, height: number}} requiredSize
   * @param {PromiseFactory} promiseFactory
   * @return {Promise<boolean>}
   */
  EyesSeleniumUtils.setBrowserSize = function(logger, browser, requiredSize, promiseFactory) {
    return _setBrowserSize(logger, browser, requiredSize, 3, promiseFactory).then(
      function() {
        return true
      },
      function() {
        return false
      },
    )
  }

  function _setBrowserSize(logger, browser, requiredSize, retries, promiseFactory) {
    return promiseFactory.makePromise(function(resolve, reject) {
      logger.verbose('Trying to set browser size to:', requiredSize)

      return browser
        .manage()
        .window()
        .setSize(requiredSize.width, requiredSize.height)
        .then(function() {
          return GeneralUtils.sleep(1000, promiseFactory)
        })
        .then(function() {
          return browser
            .manage()
            .window()
            .getSize()
        })
        .then(function(currentSize) {
          logger.log('Current browser size:', currentSize)
          if (
            currentSize.width === requiredSize.width &&
            currentSize.height === requiredSize.height
          ) {
            resolve()
            return
          }

          if (retries === 0) {
            reject('Failed to set browser size: retries is out.')
            return
          }

          _setBrowserSize(logger, browser, requiredSize, retries - 1, promiseFactory).then(
            function() {
              resolve()
            },
            function(err) {
              reject(err)
            },
          )
        })
    })
  }

  /**
   * @param {Logger} logger
   * @param {WebDriver} browser The browser to use.
   * @param {{width: number, height: number}} actualViewportSize
   * @param {{width: number, height: number}} requiredViewportSize
   * @param {PromiseFactory} promiseFactory
   * @return {Promise<boolean>}
   */
  EyesSeleniumUtils.setBrowserSizeByViewportSize = function(
    logger,
    browser,
    actualViewportSize,
    requiredViewportSize,
    promiseFactory,
  ) {
    return browser
      .manage()
      .window()
      .getSize()
      .then(function(browserSize) {
        logger.verbose('Current browser size:', browserSize)
        var requiredBrowserSize = {
          width: browserSize.width + (requiredViewportSize.width - actualViewportSize.width),
          height: browserSize.height + (requiredViewportSize.height - actualViewportSize.height),
        }
        return EyesSeleniumUtils.setBrowserSize(
          logger,
          browser,
          requiredBrowserSize,
          promiseFactory,
        )
      })
  }

  /**
   * Tries to set the viewport
   *
   * @param {Logger} logger
   * @param {WebDriver} browser The browser to use.
   * @param {{width: number, height: number}} requiredSize The viewport size.
   * @param {PromiseFactory} promiseFactory
   * @return {Promise<void>}
   */
  EyesSeleniumUtils.setViewportSize = function(logger, browser, requiredSize, promiseFactory) {
    // First we will set the window size to the required size.
    // Then we'll check the viewport size and increase the window size accordingly.
    logger.verbose('setViewportSize(', requiredSize, ')')
    return promiseFactory.makePromise(function(resolve, reject) {
      try {
        var actualViewportSize
        EyesSeleniumUtils.getViewportSize(browser, promiseFactory)
          .then(function(viewportSize) {
            actualViewportSize = viewportSize
            logger.verbose('Initial viewport size:', actualViewportSize)

            // If the viewport size is already the required size
            if (
              actualViewportSize.width === requiredSize.width &&
              actualViewportSize.height === requiredSize.height
            ) {
              resolve()
              return
            }

            // We move the window to (0,0) to have the best chance to be able to
            // set the viewport size as requested.
            browser
              .manage()
              .window()
              .setPosition(0, 0)
              .catch(function() {
                logger.verbose('Warning: Failed to move the browser window to (0,0)')
              })
              .then(function() {
                return EyesSeleniumUtils.setBrowserSizeByViewportSize(
                  logger,
                  browser,
                  actualViewportSize,
                  requiredSize,
                  promiseFactory,
                )
              })
              .then(function() {
                return EyesSeleniumUtils.getViewportSize(browser, promiseFactory)
              })
              .then(function(actualViewportSize) {
                if (
                  actualViewportSize.width === requiredSize.width &&
                  actualViewportSize.height === requiredSize.height
                ) {
                  resolve()
                  return
                }

                // Additional attempt. This Solves the "maximized browser" bug
                // (border size for maximized browser sometimes different than non-maximized, so the original browser size calculation is wrong).
                logger.verbose('Trying workaround for maximization...')
                return EyesSeleniumUtils.setBrowserSizeByViewportSize(
                  logger,
                  browser,
                  actualViewportSize,
                  requiredSize,
                  promiseFactory,
                )
                  .then(function() {
                    return EyesSeleniumUtils.getViewportSize(browser, promiseFactory)
                  })
                  .then(function(viewportSize) {
                    actualViewportSize = viewportSize
                    logger.verbose('Current viewport size:', actualViewportSize)

                    if (
                      actualViewportSize.width === requiredSize.width &&
                      actualViewportSize.height === requiredSize.height
                    ) {
                      resolve()
                      return
                    }

                    return browser
                      .manage()
                      .window()
                      .getSize()
                      .then(function(browserSize) {
                        var MAX_DIFF = 3
                        var widthDiff = actualViewportSize.width - requiredSize.width
                        var widthStep = widthDiff > 0 ? -1 : 1 // -1 for smaller size, 1 for larger
                        var heightDiff = actualViewportSize.height - requiredSize.height
                        var heightStep = heightDiff > 0 ? -1 : 1

                        var currWidthChange = 0
                        var currHeightChange = 0
                        // We try the zoom workaround only if size difference is reasonable.
                        if (Math.abs(widthDiff) <= MAX_DIFF && Math.abs(heightDiff) <= MAX_DIFF) {
                          logger.verbose('Trying workaround for zoom...')
                          var retriesLeft =
                            Math.abs(
                              (widthDiff === 0 ? 1 : widthDiff) *
                                (heightDiff === 0 ? 1 : heightDiff),
                            ) * 2
                          var lastRequiredBrowserSize = null
                          return _setWindowSize(
                            logger,
                            browser,
                            requiredSize,
                            actualViewportSize,
                            browserSize,
                            widthDiff,
                            widthStep,
                            heightDiff,
                            heightStep,
                            currWidthChange,
                            currHeightChange,
                            retriesLeft,
                            lastRequiredBrowserSize,
                            promiseFactory,
                          ).then(
                            function() {
                              resolve()
                            },
                            function() {
                              reject('Failed to set viewport size: zoom workaround failed.')
                            },
                          )
                        }

                        reject('Failed to set viewport size!')
                      })
                  })
              })
          })
          .catch(function(err) {
            reject(err)
          })
      } catch (err) {
        reject(new Error(err))
      }
    })
  }

  /**
   * @private
   * @param {Logger} logger
   * @param {WebDriver} browser
   * @param {{width: number, height: number}} requiredSize
   * @param actualViewportSize
   * @param browserSize
   * @param widthDiff
   * @param widthStep
   * @param heightDiff
   * @param heightStep
   * @param currWidthChange
   * @param currHeightChange
   * @param retriesLeft
   * @param lastRequiredBrowserSize
   * @param {PromiseFactory} promiseFactory
   * @return {Promise<void>}
   */
  function _setWindowSize(
    logger,
    browser,
    requiredSize,
    actualViewportSize,
    browserSize,
    widthDiff,
    widthStep,
    heightDiff,
    heightStep,
    currWidthChange,
    currHeightChange,
    retriesLeft,
    lastRequiredBrowserSize,
    promiseFactory,
  ) {
    return promiseFactory.makePromise(function(resolve, reject) {
      logger.verbose('Retries left: ' + retriesLeft)
      // We specifically use "<=" (and not "<"), so to give an extra resize attempt
      // in addition to reaching the diff, due to floating point issues.
      if (
        Math.abs(currWidthChange) <= Math.abs(widthDiff) &&
        actualViewportSize.width !== requiredSize.width
      ) {
        currWidthChange += widthStep
      }

      if (
        Math.abs(currHeightChange) <= Math.abs(heightDiff) &&
        actualViewportSize.height !== requiredSize.height
      ) {
        currHeightChange += heightStep
      }

      var requiredBrowserSize = {
        width: browserSize.width + currWidthChange,
        height: browserSize.height + currHeightChange,
      }

      if (
        lastRequiredBrowserSize &&
        requiredBrowserSize.width === lastRequiredBrowserSize.width &&
        requiredBrowserSize.height === lastRequiredBrowserSize.height
      ) {
        logger.verbose('Browser size is as required but viewport size does not match!')
        logger.verbose(
          'Browser size: ' + requiredBrowserSize + ' , Viewport size: ' + actualViewportSize,
        )
        logger.verbose('Stopping viewport size attempts.')
        resolve()
        return
      }

      return EyesSeleniumUtils.setBrowserSize(logger, browser, requiredBrowserSize, promiseFactory)
        .then(function() {
          lastRequiredBrowserSize = requiredBrowserSize
          return EyesSeleniumUtils.getViewportSize(browser, promiseFactory)
        })
        .then(function(actualViewportSize) {
          logger.verbose('Current viewport size:', actualViewportSize)
          if (
            actualViewportSize.width === requiredSize.width &&
            actualViewportSize.height === requiredSize.height
          ) {
            resolve()
            return
          }

          if (
            (Math.abs(currWidthChange) <= Math.abs(widthDiff) ||
              Math.abs(currHeightChange) <= Math.abs(heightDiff)) &&
            --retriesLeft > 0
          ) {
            return _setWindowSize(
              logger,
              browser,
              requiredSize,
              actualViewportSize,
              browserSize,
              widthDiff,
              widthStep,
              heightDiff,
              heightStep,
              currWidthChange,
              currHeightChange,
              retriesLeft,
              lastRequiredBrowserSize,
              promiseFactory,
            ).then(
              function() {
                resolve()
              },
              function(err) {
                reject(err)
              },
            )
          }

          reject('Failed to set window size!')
        })
    })
  }

  /**
   * @private
   * @param {{left: number, top: number, width: number, height: number}} part
   * @param {{position: {x: number, y: number}, size: {width: number, height: number}, image: Buffer}[]} parts
   * @param {{imageBuffer: Buffer, width: number, height: number}} imageObj
   * @param {WebDriver} browser
   * @param {Promise<void>} promise
   * @param {PromiseFactory} promiseFactory
   * @param {ImageProvider} imageProvider
   * @param {{width: number, height: number}} viewportSize
   * @param {PositionProvider} positionProvider
   * @param {ScaleProviderFactory} scaleProviderFactory
   * @param {CutProvider} cutProvider
   * @param {{width: number, height: number}} entirePageSize
   * @param {number} pixelRatio
   * @param {number} rotationDegrees
   * @param {boolean} automaticRotation
   * @param {number} automaticRotationDegrees
   * @param {boolean} isLandscape
   * @param {number} waitBeforeScreenshots
   * @param {{left: number, top: number, width: number, height: number}} regionInScreenshot
   * @param {boolean} [saveDebugScreenshots=false]
   * @param {string} [debugScreenshotsPath=null]
   * @return {Promise<void>}
   */
  var _processPart = function(
    part,
    parts,
    imageObj,
    browser,
    promise,
    promiseFactory,
    imageProvider,
    viewportSize,
    positionProvider,
    scaleProviderFactory,
    cutProvider,
    entirePageSize,
    pixelRatio,
    rotationDegrees,
    automaticRotation,
    automaticRotationDegrees,
    isLandscape,
    waitBeforeScreenshots,
    regionInScreenshot,
    saveDebugScreenshots,
    debugScreenshotsPath,
  ) {
    return promise.then(function() {
      return promiseFactory.makePromise(function(resolve) {
        // Skip 0,0 as we already got the screenshot
        if (part.left === 0 && part.top === 0) {
          parts.push({
            image: imageObj.imageBuffer,
            size: {width: imageObj.width, height: imageObj.height},
            position: {x: 0, y: 0},
          })

          resolve()
          return
        }

        var partPosition = {x: part.left, y: part.top}
        return positionProvider
          .setPosition(partPosition)
          .then(function() {
            return positionProvider.getCurrentPosition()
          })
          .then(function(currentPosition) {
            return _captureViewport(
              browser,
              promiseFactory,
              imageProvider,
              viewportSize,
              scaleProviderFactory,
              cutProvider,
              entirePageSize,
              pixelRatio,
              rotationDegrees,
              automaticRotation,
              automaticRotationDegrees,
              isLandscape,
              waitBeforeScreenshots,
              regionInScreenshot,
              saveDebugScreenshots,
              debugScreenshotsPath,
            )
              .then(function(partImage) {
                return partImage.asObject()
              })
              .then(function(partObj) {
                parts.push({
                  image: partObj.imageBuffer,
                  size: {width: partObj.width, height: partObj.height},
                  position: {x: currentPosition.x, y: currentPosition.y},
                })

                resolve()
              })
          })
      })
    })
  }

  /**
   * @private
   * @param {WebDriver} browser
   * @param {PromiseFactory} promiseFactory
   * @param {ImageProvider} imageProvider
   * @param {{width: number, height: number}} viewportSize
   * @param {ScaleProviderFactory} scaleProviderFactory
   * @param {CutProvider} cutProvider
   * @param {{width: number, height: number}} entirePageSize
   * @param {number} pixelRatio
   * @param {number} rotationDegrees
   * @param {boolean} automaticRotation
   * @param {number} automaticRotationDegrees
   * @param {boolean} isLandscape
   * @param {number} waitBeforeScreenshots
   * @param {{left: number, top: number, width: number, height: number}} [regionInScreenshot]
   * @param {boolean} [saveDebugScreenshots=false]
   * @param {string} [debugScreenshotsPath=null]
   * @return {Promise<MutableImage>}
   */
  var _captureViewport = function(
    browser,
    promiseFactory,
    imageProvider,
    viewportSize,
    scaleProviderFactory,
    cutProvider,
    entirePageSize,
    pixelRatio,
    rotationDegrees,
    automaticRotation,
    automaticRotationDegrees,
    isLandscape,
    waitBeforeScreenshots,
    regionInScreenshot,
    saveDebugScreenshots,
    debugScreenshotsPath,
  ) {
    var mutableImage,
      scaleRatio = 1
    return GeneralUtils.sleep(waitBeforeScreenshots, promiseFactory).then(function() {
      return imageProvider
        .getImage()
        .then(function(image) {
          mutableImage = image
          if (saveDebugScreenshots) {
            var filename = 'screenshot ' + new Date().getTime() + ' original.png'
            return mutableImage.saveImage(debugScreenshotsPath + filename.replace(/ /g, '_'))
          }
        })
        .then(function() {
          var imageSize = mutableImage.getSize()
          if (isLandscape && automaticRotation && imageSize.height > imageSize.width) {
            rotationDegrees = automaticRotationDegrees
          }

          if (scaleProviderFactory) {
            var scaleProvider = scaleProviderFactory.getScaleProvider(imageSize.width)
            scaleRatio = scaleProvider.getScaleRatio()
          }

          if (cutProvider) {
            cutProvider = cutProvider.scale(1 / scaleRatio)
            return cutProvider.cut(mutableImage, promiseFactory).then(function(image) {
              mutableImage = image
            })
          }
        })
        .then(function() {
          if (regionInScreenshot) {
            var scaledRegion = GeometryUtils.scaleRegion(regionInScreenshot, 1 / scaleRatio)
            return mutableImage.cropImage(scaledRegion)
          }
        })
        .then(function() {
          if (saveDebugScreenshots) {
            var filename = 'screenshot ' + new Date().getTime() + ' cropped.png'
            return mutableImage.saveImage(debugScreenshotsPath + filename.replace(/ /g, '_'))
          }
        })
        .then(function() {
          if (scaleRatio !== 1) {
            return mutableImage.scaleImage(scaleRatio)
          }
        })
        .then(function() {
          if (saveDebugScreenshots) {
            var filename = 'screenshot ' + new Date().getTime() + ' scaled.png'
            return mutableImage.saveImage(debugScreenshotsPath + filename.replace(/ /g, '_'))
          }
        })
        .then(function() {
          if (rotationDegrees !== 0) {
            return mutableImage.rotateImage(rotationDegrees)
          }
        })
        .then(function() {
          var imageSize = mutableImage.getSize()
          // If the image is a viewport screenshot, we want to save the current scroll position (we'll need it for check region).
          if (imageSize.width <= viewportSize.width && imageSize.height <= viewportSize.height) {
            return EyesSeleniumUtils.getCurrentScrollPosition(browser, promiseFactory).then(
              function(scrollPosition) {
                return mutableImage.setCoordinates(scrollPosition)
              },
              function() {
                // Failed to get Scroll position, setting coordinates to default.
                return mutableImage.setCoordinates({x: 0, y: 0})
              },
            )
          }
        })
        .then(function() {
          return mutableImage
        })
    })
  }

  /**
   * Capture screenshot from given driver
   *
   * @param {WebDriver} browser
   * @param {PromiseFactory} promiseFactory
   * @param {ImageProvider} imageProvider
   * @param {{width: number, height: number}} viewportSize
   * @param {PositionProvider} positionProvider
   * @param {ScaleProviderFactory} scaleProviderFactory
   * @param {CutProvider} cutProvider
   * @param {boolean} fullPage
   * @param {boolean} hideScrollbars
   * @param {?WebElement} scrollRootElement
   * @param {boolean} useCssTransition
   * @param {number} rotationDegrees
   * @param {boolean} automaticRotation
   * @param {number} automaticRotationDegrees
   * @param {boolean} isLandscape
   * @param {number} waitBeforeScreenshots
   * @param {boolean} checkFrameOrElement
   * @param {?RegionProvider} [regionProvider]
   * @param {?boolean} [saveDebugScreenshots=false]
   * @param {?string} [debugScreenshotsPath]
   * @return {Promise<MutableImage>}
   */
  EyesSeleniumUtils.getScreenshot = function getScreenshot(
    browser,
    promiseFactory,
    imageProvider,
    viewportSize,
    positionProvider,
    scaleProviderFactory,
    cutProvider,
    fullPage,
    hideScrollbars,
    scrollRootElement,
    useCssTransition,
    rotationDegrees,
    automaticRotation,
    automaticRotationDegrees,
    isLandscape,
    waitBeforeScreenshots,
    checkFrameOrElement,
    regionProvider,
    saveDebugScreenshots,
    debugScreenshotsPath,
  ) {
    var MIN_SCREENSHOT_PART_HEIGHT = 10,
      MAX_SCROLLBAR_SIZE = 50
    var originalPosition,
      originalOverflow,
      originalBodyOverflow,
      entirePageSize,
      regionInScreenshot,
      pixelRatio,
      imageObject,
      screenshot

    hideScrollbars = hideScrollbars === null ? useCssTransition : hideScrollbars

    // step #1 - get entire page size for future use (scaling and stitching)
    return positionProvider
      .getEntireSize()
      .then(
        function(pageSize) {
          entirePageSize = pageSize
        },
        function() {
          // Couldn't get entire page size, using viewport size as default.
          entirePageSize = viewportSize
        },
      )
      .then(function() {
        // step #2 - get the device pixel ratio (scaling)
        return EyesSeleniumUtils.getDevicePixelRatio(browser, promiseFactory).then(
          function(ratio) {
            pixelRatio = ratio
          },
          function() {
            // Couldn't get pixel ratio, using 1 as default.
            pixelRatio = 1
          },
        )
      })
      .then(function() {
        // step #3 - hide the scrollbars if instructed
        if (hideScrollbars) {
          return EyesSeleniumUtils.setOverflow(
            browser,
            'hidden',
            scrollRootElement,
            promiseFactory,
          ).then(function(originalVal) {
            originalOverflow = originalVal

            if (useCssTransition) {
              return EyesSeleniumUtils.executeScript(
                browser,
                JS_GET_IS_BODY_OVERFLOW_HIDDEN,
                promiseFactory,
              ).then(function(isBodyOverflowHidden) {
                if (isBodyOverflowHidden) {
                  return EyesSeleniumUtils.setBodyOverflow(browser, 'initial', promiseFactory).then(
                    function(originalBodyVal) {
                      originalBodyOverflow = originalBodyVal
                    },
                  )
                }
              })
            }
          })
        }
      })
      .then(function() {
        // step #4 - if this is a full page screenshot we need to scroll to position 0,0 before taking the first
        if (fullPage) {
          return positionProvider
            .getState()
            .then(function(state) {
              originalPosition = state
              return positionProvider.setPosition({x: 0, y: 0})
            })
            .then(function() {
              return positionProvider.getCurrentPosition()
            })
            .then(function(location) {
              if (location.x !== 0 || location.y !== 0) {
                throw new Error('Could not scroll to the x/y corner of the screen')
              }
            })
        }
      })
      .then(function() {
        if (regionProvider) {
          return _captureViewport(
            browser,
            promiseFactory,
            imageProvider,
            viewportSize,
            scaleProviderFactory,
            cutProvider,
            entirePageSize,
            pixelRatio,
            rotationDegrees,
            automaticRotation,
            automaticRotationDegrees,
            isLandscape,
            waitBeforeScreenshots,
          )
            .then(function(image) {
              return regionProvider.getRegionInLocation(
                image,
                CoordinatesType.SCREENSHOT_AS_IS,
                promiseFactory,
              )
            })
            .then(function(region) {
              regionInScreenshot = region
            })
        }
      })
      .then(function() {
        // step #5 - Take screenshot of the 0,0 tile / current viewport
        return _captureViewport(
          browser,
          promiseFactory,
          imageProvider,
          viewportSize,
          scaleProviderFactory,
          cutProvider,
          entirePageSize,
          pixelRatio,
          rotationDegrees,
          automaticRotation,
          automaticRotationDegrees,
          isLandscape,
          waitBeforeScreenshots,
          checkFrameOrElement ? regionInScreenshot : null,
          saveDebugScreenshots,
          debugScreenshotsPath,
        )
          .then(function(image) {
            screenshot = image
            return screenshot.asObject()
          })
          .then(function(imageObj) {
            imageObject = imageObj
          })
      })
      .then(function() {
        return promiseFactory.makePromise(function(resolve) {
          if (!fullPage && !checkFrameOrElement) {
            resolve()
            return
          }
          // IMPORTANT This is required! Since when calculating the screenshot parts for full size,
          // we use a screenshot size which is a bit smaller (see comment below).
          if (
            imageObject.width >= entirePageSize.width &&
            imageObject.height >= entirePageSize.height
          ) {
            resolve()
            return
          }

          // We use a smaller size than the actual screenshot size in order to eliminate duplication
          // of bottom scroll bars, as well as footer-like elements with fixed position.
          var screenshotPartSize = {
            width: imageObject.width,
            height: Math.max(imageObject.height - MAX_SCROLLBAR_SIZE, MIN_SCREENSHOT_PART_HEIGHT),
          }

          var screenshotParts = GeometryUtils.getSubRegions(
            {
              left: 0,
              top: 0,
              width: entirePageSize.width,
              height: entirePageSize.height,
            },
            screenshotPartSize,
            false,
          )

          var parts = []
          var promise = promiseFactory.makePromise(function(resolve) {
            resolve()
          })

          screenshotParts.forEach(function(part) {
            promise = _processPart(
              part,
              parts,
              imageObject,
              browser,
              promise,
              promiseFactory,
              imageProvider,
              viewportSize,
              positionProvider,
              scaleProviderFactory,
              cutProvider,
              entirePageSize,
              pixelRatio,
              rotationDegrees,
              automaticRotation,
              automaticRotationDegrees,
              isLandscape,
              waitBeforeScreenshots,
              checkFrameOrElement ? regionInScreenshot : null,
              saveDebugScreenshots,
              debugScreenshotsPath,
            )
          })
          promise.then(function() {
            return ImageUtils.stitchImage(entirePageSize, parts, promiseFactory).then(function(
              stitchedBuffer,
            ) {
              screenshot = new MutableImage(stitchedBuffer, promiseFactory)
              resolve()
            })
          })
        })
      })
      .then(function() {
        if (hideScrollbars) {
          return EyesSeleniumUtils.setOverflow(
            browser,
            originalOverflow,
            scrollRootElement,
            promiseFactory,
          )
        }
      })
      .then(function() {
        if (originalBodyOverflow) {
          return EyesSeleniumUtils.setBodyOverflow(browser, originalBodyOverflow, promiseFactory)
        }
      })
      .then(function() {
        if (fullPage) {
          return positionProvider.restoreState(originalPosition)
        }
      })
      .then(function() {
        if (!checkFrameOrElement && regionInScreenshot) {
          return screenshot.cropImage(regionInScreenshot)
        }
      })
      .then(function() {
        return screenshot
      })
  }

  exports.EyesSeleniumUtils = EyesSeleniumUtils
})()
