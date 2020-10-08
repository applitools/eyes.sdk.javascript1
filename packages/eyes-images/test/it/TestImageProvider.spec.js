'use strict'

const {ImageProvider, MutableImage, FileUtils} = require('@applitools/eyes-sdk-core')
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

  it('TestImageProvider', async function() {
    const eyes = setup(this.test.title)
    await eyes.open('TestEyesImages', 'TestImageProvider(Bitmap)', {width: 800, height: 500})

    const ImageProviderImpl = class ImageProviderImpl extends ImageProvider {
      /**
       * @override
       */
      async getImage() {
        const data = await FileUtils.readToBuffer(`${__dirname}/../fixtures/minions-800x500.png`)
        return new MutableImage(data)
      }
    }

    await eyes.checkImage(new ImageProviderImpl(), this.test.title)
    await teardown(eyes)
  })
})
