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

  it('TestUrl', async function() {
    const eyes = setup(this.test.title)
    await eyes.open('TestEyesImages', 'CheckImageAtUrl', new RectangleSize(1024, 768))

    await eyes.checkImage('https://applitools.github.io/demo/images/gbg1.png', 'TestUrl1')
    await eyes.checkImage('https://applitools.github.io/demo/images/gbg2.png', 'TestUrl2')
    await teardown(eyes)
  })
})
