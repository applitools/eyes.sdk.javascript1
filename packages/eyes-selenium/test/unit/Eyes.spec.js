'use strict';

const assert = require('assert');

const { Eyes, EyesSelenium, EyesVisualGrid, SeleniumConfiguration, StitchMode, RectangleSize, ProxySettings, BatchInfo, PropertyData } = require('../../index');

describe('Eyes', function () {

  it('should create EyesSelenium by default', async function () {
    const eyes = new Eyes();
    assert.ok(!eyes.isVisualGrid());
    assert.ok(eyes instanceof EyesSelenium);
  });

  it('should create EyesSelenium with `false`', async function () {
    const eyes = new Eyes(undefined, undefined, false);
    assert.ok(!eyes.isVisualGrid());
    assert.ok(eyes instanceof EyesSelenium);
  });

  it('should create EyesVisualGrid with `true`', async function () {
    const eyes = new Eyes(undefined, undefined, true);
    assert.ok(eyes.isVisualGrid());
    assert.ok(eyes instanceof EyesVisualGrid);
  });

  it('should create EyesSelenium with `false` first argument', async function () {
    const eyes = new Eyes(false);
    assert.ok(!eyes.isVisualGrid());
    assert.ok(eyes instanceof EyesSelenium);
  });

  it('should create EyesVisualGrid with `true` first argument', async function () {
    const eyes = new Eyes(true);
    assert.ok(eyes.isVisualGrid());
    assert.ok(eyes instanceof EyesVisualGrid);
  });

  it('set configuration from object', async function () {
    const eyes = new Eyes(true);
    const date = new Date();
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
    });

    assert.ok(eyes.getConfiguration() instanceof SeleniumConfiguration);
    assert.strictEqual(eyes.getApiKey(), 'sameApiKey');
    assert.strictEqual(eyes.getForceFullPageScreenshot(), true);
    assert.strictEqual(eyes.getStitchMode(), StitchMode.SCROLL);
    assert.strictEqual(eyes.getConfiguration().browsersInfo.length, 2);
    assert.deepStrictEqual(eyes.getConfiguration().browsersInfo[0], { width: 800, height: 600, name: 'firefox' });
    assert.deepStrictEqual(eyes.getConfiguration().browsersInfo[1], { deviceName: 'iPhone 4', screenOrientation: 'portrait' });
    assert.deepStrictEqual(eyes.getConfiguration().viewportSize, new RectangleSize(450, 500));
    assert.deepStrictEqual(eyes.getProxy(), new ProxySettings('http://localhost:8888'));
    assert.deepStrictEqual(eyes.getBatch(), new BatchInfo('Batch name', date, 'randomId'));
    assert.strictEqual(eyes.getConfiguration().properties.length, 1);
    assert.deepStrictEqual(eyes.getConfiguration().properties[0], new PropertyData('prop', 'value'));
    assert.strictEqual(eyes.getBaselineEnvName(), 'baselineEnvName');
    assert.strictEqual(eyes.getSendDom(), false);
  });
});
