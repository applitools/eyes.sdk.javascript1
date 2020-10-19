'use strict'
const {presult} = require('@applitools/functional-commons')

const psetTimeout = t =>
  new Promise(res => {
    setTimeout(res, t)
  })

/*******************************
 *    This is THE STATUSER!    *
 *******************************/

function makeGetRenderStatus({logger, doGetRenderStatus, getStatusInterval = 500}) {
  let isRunning = false
  let pendingRenders = {}
  return function getRenderStatus(renderId) {
    return new Promise(async (resolve, reject) => {
      log(`adding job for ${renderId} isRunning=${isRunning}`)
      if (!pendingRenders[renderId]) {
        pendingRenders[renderId] = {resolve, reject}
      }
      if (!isRunning) {
        isRunning = true
        await psetTimeout(100)
        getRenderStatusJob()
      }
    })
  }

  async function getRenderStatusJob() {
    const renderIds = Object.keys(pendingRenders)
    log(`render status job (${renderIds.length}): ${renderIds}`)
    if (renderIds.length === 0) {
      isRunning = false
      return
    }

    const pendingRendersForJob = pendingRenders
    pendingRenders = {}

    const [err, renderStatuses] = await presult(doGetRenderStatus(renderIds))

    if (err) {
      log(`error during getRenderStatus: ${err}`)
      for (const renderId of renderIds) {
        pendingRendersForJob[renderId].reject(err)
      }
    } else {
      renderStatuses.forEach((rs, i) => {
        const renderId = renderIds[i]
        pendingRendersForJob[renderId].resolve(rs)
      })
    }

    await psetTimeout(getStatusInterval)
    getRenderStatusJob()
  }

  function log(msg) {
    logger.verbose(`[getRenderStatus] ${msg}`)
  }
}

module.exports = makeGetRenderStatus
