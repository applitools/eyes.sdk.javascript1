'use strict'

const {MouseTrigger, Location, FileUtils} = require('@applitools/eyes-sdk-core')
const {Eyes, BatchInfo, ConsoleLogHandler, Region} = require('../../index')

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

  it('TestRegion', async function() {
    const eyes = setup(this.test.title)
    await eyes.open('TestEyesImages', 'TestRegion(Bitmap)')

    eyes.addMouseTrigger(
      MouseTrigger.MouseAction.Click,
      new Region(288, 44, 92, 36),
      new Location(10, 10),
    )

    const gbg1Data = await FileUtils.readToBuffer(`${__dirname}/../fixtures/gbg1.png`)
    await eyes.checkRegion(gbg1Data, new Region(309, 227, 381, 215), this.test.title)
    await teardown(eyes)
  })
})
