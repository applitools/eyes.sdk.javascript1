'use strict'

const assert = require('assert')
const {
  VisualGridRunner,
  EyesClassic,
  EyesVisualGrid,
  Configuration,
  StitchMode,
  RectangleSize,
  ProxySettings,
  BatchInfo,
  PropertyData,
} = require('../../index')
const {EyesFactory} = require('../utils/FakeSDK')

describe('EyesFactory', function() {
  it('should create EyesClassic by default', async function() {
    const eyes = new EyesFactory()
    assert.ok(!eyes.isVisualGrid())
    assert.ok(eyes instanceof EyesClassic)
  })

  it('should create EyesVisualGrid with VisualGridRunner', async function() {
    const eyes = new EyesFactory(new VisualGridRunner())
    assert.ok(eyes.isVisualGrid())
    assert.ok(eyes instanceof EyesVisualGrid)
  })

  it('should create an EyesClassic instance through fromBrowserInfo', () => {
    const eyes = EyesFactory.fromBrowserInfo()
    assert.ok(eyes instanceof EyesClassic)
  })

  it('should create an EyesVisualGrid instance through fromBrowserInfo', () => {
    const eyes = EyesFactory.fromBrowserInfo(undefined, undefined, {
      browser: [{name: 'iPhone 4', width: 400, height: 600}],
    })
    assert.ok(eyes instanceof EyesVisualGrid)
  })

  it('set configuration from object', async function() {
    const eyes = new EyesFactory(new VisualGridRunner())
    const date = new Date()
    eyes.setConfiguration({
      apiKey: 'sameApiKey',
      forceFullPageScreenshot: true,
      stitchMode: 'Scroll',
      browsersInfo: [
        {
          width: 800,
          height: 600,
          name: 'firefox',
        },
        {
          deviceName: 'iPhone 4',
          screenOrientation: 'portrait',
        },
      ],
      viewportSize: {
        width: 450,
        height: 500,
      },
      proxy: 'http://localhost:8888',
      batch: {
        id: 'randomId',
        name: 'Batch name',
        startedAt: date,
      },
      properties: [
        {
          name: 'prop',
          value: 'value',
        },
      ],
      baselineEnvName: 'baselineEnvName',
      sendDom: false,
    })

    assert.ok(eyes.getConfiguration() instanceof Configuration)
    assert.strictEqual(eyes.getApiKey(), 'sameApiKey')
    assert.strictEqual(eyes.getForceFullPageScreenshot(), true)
    assert.strictEqual(eyes.getStitchMode(), StitchMode.SCROLL)
    assert.strictEqual(eyes.getConfiguration().getBrowsersInfo().length, 2)
    assert.deepStrictEqual(eyes.getConfiguration().getBrowsersInfo()[0], {
      width: 800,
      height: 600,
      name: 'firefox',
    })
    assert.deepStrictEqual(eyes.getConfiguration().getBrowsersInfo()[1], {
      deviceName: 'iPhone 4',
      screenOrientation: 'portrait',
    })
    assert.deepStrictEqual(eyes.getConfiguration().getViewportSize(), new RectangleSize(450, 500))
    assert.deepStrictEqual(eyes.getProxy(), new ProxySettings('http://localhost:8888'))
    assert.deepStrictEqual(eyes.getBatch(), new BatchInfo('Batch name', date, 'randomId'))
    assert.strictEqual(eyes.getConfiguration().getProperties().length, 1)
    assert.deepStrictEqual(
      eyes.getConfiguration().getProperties()[0],
      new PropertyData('prop', 'value'),
    )
    assert.strictEqual(eyes.getBaselineEnvName(), 'baselineEnvName')
    assert.strictEqual(eyes.getSendDom(), false)
  })
})
