'use strict'

const {FileUtils} = require('@applitools/eyes-sdk-core')
const {Eyes, BatchInfo, ConsoleLogHandler} = require('../../index')

describe('TestEyesImages', function() {
  let batch

  before(() => {
    batch = new BatchInfo('TestEyesImages')
  })

  function setup(testTitle) {
    const eyes = new Eyes()
    eyes.setBatch(batch)
    eyes.setLogHandler(new ConsoleLogHandler())

    eyes.getLogger().log(`running test: ${testTitle}`)
    return eyes
  }

  async function teardown(eyes) {
    try {
      const results = await eyes.close()
      eyes.getLogger().log(`Mismatches: ${results.getMismatches()}`)
    } finally {
      await eyes.abort()
    }
  }

  it('TestBitmap', async function() {
    const eyes = setup(this.test.title)
    await eyes.open('TestEyesImages', 'CheckImage(Bitmap)')

    const gbg1Data = await FileUtils.readToBuffer(`${__dirname}/../fixtures/gbg1.png`)
    const gbg2Data = await FileUtils.readToBuffer(`${__dirname}/../fixtures/gbg2.png`)
    await eyes.checkImage(gbg1Data, 'TestBitmap1')
    await eyes.checkImage(gbg2Data, 'TestBitmap2')
    await teardown(eyes)
  })
})
