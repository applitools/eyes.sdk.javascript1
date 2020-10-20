'use strict'

const Axios = require('axios')
const {URL} = require('url')
const {
  getCaptureDomPoll,
  getPollResult,
  getCaptureDomPollForIE,
  getPollResultForIE,
} = require('@applitools/dom-capture')
const ArgumentGuard = require('./ArgumentGuard')
const GeneralUtils = require('./GeneralUtils')
const PerformanceUtils = require('./PerformanceUtils')
const EyesUtils = require('../sdk/EyesUtils')

const EXECUTION_TIMEOUT = 5 * 60 * 1000
const POLL_TIMEOUT = 200
const IOS_CHUNK_BYTE_LENGTH = 100000
const DEFAULT_CHUNK_BYTE_LENGTH = 262144000 // 250MB (could be 256MB but decide to leave a 6MB buffer)

async function takeDomCapture(logger, driver, options = {}) {
  ArgumentGuard.notNull(logger, 'logger')
  ArgumentGuard.notNull(driver, 'driver')
  const {
    axios = Axios.create(),
    chunkByteLength = driver.isIOS ? IOS_CHUNK_BYTE_LENGTH : DEFAULT_CHUNK_BYTE_LENGTH,
    pollTimeout = POLL_TIMEOUT,
    executionTimeout = EXECUTION_TIMEOUT,
  } = options
  const isLegacyBrowser = driver.isIE || driver.isEdgeLegacy
  const arg = {chunkByteLength}
  const scripts = {
    main: {
      script: `return (${
        isLegacyBrowser ? await getCaptureDomPollForIE() : await getCaptureDomPoll()
      }).apply(null, arguments);`,
      args: [arg],
    },
    poll: {
      script: `return (${
        isLegacyBrowser ? await getPollResultForIE() : await getPollResult()
      }).apply(null, arguments);`,
      args: [arg],
    },
  }

  const url = await driver.getUrl()
  const dom = await captureContextDom(driver.mainContext)

  return dom

  async function captureContextDom(context) {
    const capture = await EyesUtils.executePollScript(logger, context, scripts, {
      executionTimeout,
      pollTimeout,
    })
    if (!capture) return {}
    const raws = capture.split('\n')
    const tokens = JSON.parse(raws[0])
    const cssEndIndex = raws.indexOf(tokens.separator)
    const frameEndIndex = raws.indexOf(tokens.separator, cssEndIndex + 1)
    let dom = raws[frameEndIndex + 1]

    const cssResources = await Promise.all(
      raws.slice(1, cssEndIndex).reduce((cssResources, href) => {
        return href ? cssResources.concat(fetchCss(url, href)) : cssResources
      }, []),
    )

    for (const {href, css} of cssResources) {
      dom = dom.replace(`${tokens.cssStartToken}${href}${tokens.cssEndToken}`, css)
    }

    const framePaths = raws.slice(cssEndIndex + 1, frameEndIndex)

    for (const xpaths of framePaths) {
      if (!xpaths) continue
      const references = xpaths.split(',').reduce((parent, selector) => {
        return {reference: {type: 'xpath', selector}, parent}
      }, null)
      let contextDom
      try {
        const frame = await context.context(references)
        contextDom = await captureContextDom(frame)
      } catch (ignored) {
        logger.log('Switching to frame failed')
        contextDom = {}
      }
      dom = dom.replace(`${tokens.iframeStartToken}${xpaths}${tokens.iframeEndToken}`, contextDom)
    }

    return dom
  }

  async function fetchCss(baseUri, href, retriesCount = 1) {
    try {
      logger.verbose(`Given URL to download: ${href}`)
      let absHref = href
      if (!GeneralUtils.isAbsoluteUrl(href)) {
        absHref = new URL(href.toString(), baseUri).href
      }

      const timeStart = PerformanceUtils.start()
      const response = await axios(absHref)
      const css = response.data
      logger.verbose(
        `downloading CSS in length of ${css.length} chars took ${timeStart.end().summary}`,
      )
      const escapedCss = GeneralUtils.cleanStringForJSON(css)
      return {href: absHref, css: escapedCss}
    } catch (err) {
      logger.verbose(err.toString())
      retriesCount -= 1
      if (retriesCount > 0) {
        return fetchCss(baseUri, href, retriesCount)
      }
      return {href, css: ''}
    }
  }
}

module.exports = takeDomCapture
