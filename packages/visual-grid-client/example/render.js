'use strict'

const puppeteer = require('puppeteer')
const {makeVisualGridClient} = require('../src/visual-grid-client')
const {getProcessPageAndSerialize} = require('@applitools/dom-snapshot')
const {Logger, deserializeDomSnapshotResult} = require('@applitools/eyes-sdk-core')
const {delay: _delay} = require('@applitools/functional-commons')
const debug = require('debug')('eyes:render')

;(async function() {
  const website = process.argv[2]

  if (!website) {
    console.log('No website passed')
    return
  }

  console.log('Checking website:', website)

  const {testWindow} = makeVisualGridClient({
    apiKey: process.env.APPLITOOLS_API_KEY,
    logger: new Logger(!!process.env.APPLITOOLS_SHOW_LOGS, 'eyes:vgc'),
    proxy: process.env.APPLITOOLS_PROXY,
  })

  const browser = await puppeteer.launch({headless: true})
  const page = await browser.newPage()
  const processPageAndSerialize = `(${await getProcessPageAndSerialize()})()`

  await page.setViewport({width: 1024, height: 768})
  await page.goto(website)

  debug('navigation done')

  await _delay(1000)
  const frame = await page.evaluate(processPageAndSerialize).then(deserializeDomSnapshotResult)

  debug('processPage done')

  const openParams = {
    appName: 'render script',
    testName: `render script ${website}`,
    batchName: 'Render VGC',
    browser: [{width: 1024, height: 768, name: 'chrome'}],
  }

  const results = await testWindow({openParams, checkParams: frame, throwEx: false})

  debug('testWindow done')

  if (results.some(r => r instanceof Error)) {
    console.log(
      'Test error:\n\t',
      results.map(r => r.message || r).reduce((acc, m) => ((acc = `${acc}\n\t${m}`), acc), ''),
    )
  } else {
    console.log(
      '\nTest result:\n\t',
      results
        .map(
          r =>
            `Status: ${r.getStatus()}\n\t RenderId: ${r
              .getStepsInfo()[0]
              .getRenderId()}\n\t Url: ${r.getUrl()}\n`,
        )
        .join('\n\t'),
    )
  }
  await browser.close()

  debug('browser closed')
})()
