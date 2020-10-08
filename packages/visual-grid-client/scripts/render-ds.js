'use strict'
const makeRenderingGridClient = require('../src/sdk/renderingGridClient')
const {deserializeDomSnapshotResult} = require('@applitools/eyes-sdk-core')
const fs = require('fs')
const path = require('path')

;(async function main() {
  const domSnapshotResult = JSON.parse(
    fs.readFileSync(path.resolve(process.cwd(), process.argv[2])),
  )
  const domSnapshot = deserializeDomSnapshotResult(domSnapshotResult)
  const {openEyes} = makeRenderingGridClient({
    showLogs: process.env.APPLITOOLS_SHOW_LOGS,
    apiKey: process.env.APPLITOOLS_API_KEY,
  })

  const {checkWindow, close} = await openEyes({testName: 'render-ds', appName: 'render-ds'})
  await checkWindow(domSnapshot)
  const testResults = await close(false)
  console.log(testResults.getStatus(), testResults.getUrl())
})().catch(err => {
  console.log(err)
  process.exit(1)
})
