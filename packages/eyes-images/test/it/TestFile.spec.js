'use strict'

const {Eyes, BatchInfo, ConsoleLogHandler, RectangleSize} = require('../../index')

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

  it('TestFile', async function() {
    const eyes = setup(this.test.title)
    await eyes.open('TestEyesImages', 'CheckImageFile', new RectangleSize(1024, 768))

    await eyes.checkImage(`${__dirname}/../fixtures/gbg1.png`, 'TestPath1')
    await eyes.checkImage(`${__dirname}/../fixtures/gbg2.png`, 'TestPath2')
    await teardown(eyes)
  })
})
