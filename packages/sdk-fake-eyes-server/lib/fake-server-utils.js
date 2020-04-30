'use strict'
const fetch = require('node-fetch')
const zlib = require('zlib')

async function getDom(session) {
  const compressedDom = await fetch(session.steps[0].matchWindowData.appOutput.domUrl).then(r =>
    r.buffer(),
  )

  return JSON.parse(zlib.unzipSync(compressedDom).toString())
}

async function getSession(testResults, serverUrl) {
  const sessionUrl = `${serverUrl}/api/sessions/batches/${encodeURIComponent(
    testResults.getBatchId(),
  )}/${encodeURIComponent(testResults.getId())}`
  const session = await fetch(sessionUrl).then(r => r.json())
  return session
}

module.exports = {
  getDom,
  getSession,
}
