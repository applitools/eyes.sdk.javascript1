'use strict'

const {
  getProcessPagePoll,
  getPollResult,
  getProcessPagePollForIE,
  getPollResultForIE,
} = require('@applitools/dom-snapshot')
const ArgumentGuard = require('./ArgumentGuard')
const EyesUtils = require('../sdk/EyesUtils')
const deserializeDomSnapshotResult = require('./deserializeDomSnapshotResult')
const createFramesPaths = require('./createFramesPaths')

const EXECUTION_TIMEOUT = 5 * 60 * 1000
const POLL_TIMEOUT = 200
const DEFAULT_CHUNK_BYTE_LENGTH = 262144000 // 250MB (could be 256MB but decide to leave a 6MB buffer)

async function takeDomSnapshot(logger, driver, options = {}) {
  ArgumentGuard.notNull(logger, 'logger')
  ArgumentGuard.notNull(driver, 'driver')
  const {
    disableBrowserFetching: dontFetchResources,
    chunkByteLength = DEFAULT_CHUNK_BYTE_LENGTH,
    pollTimeout = POLL_TIMEOUT,
    executionTimeout = EXECUTION_TIMEOUT,
  } = options
  const isLegacyBrowser = driver.isIE || driver.isEdgeLegacy
  const arg = {
    chunkByteLength,
    dontFetchResources,
    serializeResources: true,
    compressResources: false,
  }
  const scripts = {
    main: {
      script: `return (${
        isLegacyBrowser ? await getProcessPagePollForIE() : await getProcessPagePoll()
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

  const snapshot = await takeContextDomSnapshot(driver.currentContext)
  return deserializeDomSnapshotResult(snapshot)

  async function takeContextDomSnapshot(context) {
    logger.verbose(
      `taking dom snapshot. ${
        context._reference ? `context referece: ${JSON.stringify(context._reference)}` : ''
      }`,
    )

    const snapshot = await EyesUtils.executePollScript(logger, context, scripts, {
      executionTimeout,
      pollTimeout,
    })

    const selectorMap = createFramesPaths({snapshot, logger})

    for (const {path, parentSnapshot, cdtNode} of selectorMap) {
      const references = path.reduce((parent, selector) => {
        return {reference: {type: 'css', selector}, parent}
      }, null)

      const frameContext = await context
        .context(references)
        .then(context => context.focus())
        .catch(err => {
          const pathMap = selectorMap.map(({path}) => path.join('->')).join(' | ')
          logger.verbose(
            `could not switch to frame during takeDomSnapshot. Path to frame: ${pathMap}`,
            err,
          )
        })
      if (frameContext) {
        const frameSnapshot = await takeContextDomSnapshot(frameContext)
        parentSnapshot.frames.push(frameSnapshot)
        cdtNode.attributes.push({name: 'data-applitools-src', value: frameSnapshot.url})
      }
    }

    return snapshot
  }
}

module.exports = takeDomSnapshot
