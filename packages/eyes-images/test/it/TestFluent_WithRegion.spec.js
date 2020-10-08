'use strict'

const {Eyes, BatchInfo, ConsoleLogHandler, Region, Target} = require('../../index')

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

  it('TestFluent_WithRegion', async function() {
    const eyes = setup(this.test.title)
    await eyes.open('TestEyesImages', 'CheckImage_WithRegion_Fluent')

    await eyes.check(
      'CheckImage_WithRegion_Fluent',
      Target.image(`${__dirname}/../fixtures/gbg1.png`).region(new Region(10, 20, 30, 40)),
    )
    await teardown(eyes)
  })
})
