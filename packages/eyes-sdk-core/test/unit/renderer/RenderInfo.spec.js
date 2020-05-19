'use strict'

const assert = require('assert')

const {
  RenderInfo,
  Region,
  RectangleSize,
  EmulationInfo,
  ScreenOrientation,
} = require('../../../index')

describe('RenderInfo', () => {
  it('constructor', () => {
    const renderInfo = new RenderInfo()
    assert.strictEqual(Object.prototype.hasOwnProperty.call(renderInfo, '_width'), true)
    assert.strictEqual(Object.prototype.hasOwnProperty.call(renderInfo, '_height'), true)
    assert.strictEqual(Object.prototype.hasOwnProperty.call(renderInfo, '_sizeMode'), true)
    assert.strictEqual(Object.prototype.hasOwnProperty.call(renderInfo, '_selector'), true)
    assert.strictEqual(Object.prototype.hasOwnProperty.call(renderInfo, '_region'), true)
    assert.strictEqual(Object.prototype.hasOwnProperty.call(renderInfo, '_emulationInfo'), true)
    assert.strictEqual(Object.prototype.hasOwnProperty.call(renderInfo, '_iosDeviceInfo'), true)
  })

  it('constructor with object', () => {
    const regionObj = {left: 3, top: 4, width: 5, height: 6}
    const emulationInfoObj = {deviceName: 'deviceName'}
    const iosDeviceInfoObj = {
      name: 'iPhone 11 Pro',
      screenOrientation: 'landscapeLeft',
      version: 'latest',
    }

    const renderInfo = new RenderInfo({
      width: 1,
      height: 2,
      sizeMode: 'some size mode',
      selector: 'some selector',
      region: regionObj,
      emulationInfo: emulationInfoObj,
      iosDeviceInfo: iosDeviceInfoObj,
    })

    const region = new Region(regionObj)
    const emulationInfo = new EmulationInfo(emulationInfoObj)

    assert.strictEqual(renderInfo.getWidth(), 1)
    assert.strictEqual(renderInfo.getHeight(), 2)
    assert.strictEqual(renderInfo.getSizeMode(), 'some size mode')
    assert.strictEqual(renderInfo.getSelector(), 'some selector')
    assert.deepStrictEqual(renderInfo.getRegion(), region)
    assert.deepStrictEqual(renderInfo.getEmulationInfo(), emulationInfo)
    assert.deepStrictEqual(renderInfo.getIosDeviceInfo(), iosDeviceInfoObj)
  })

  it('constructor handles undefined region', () => {
    const renderInfo = new RenderInfo()
    assert.strictEqual(renderInfo.getRegion(), undefined)
  })

  it('fromRectangleSize', () => {
    const rectangleSize = new RectangleSize({width: 1, height: 2})
    const renderInfo = RenderInfo.fromRectangleSize(rectangleSize, 'some size mode')

    assert.strictEqual(renderInfo.getWidth(), 1)
    assert.strictEqual(renderInfo.getHeight(), 2)
    assert.strictEqual(renderInfo.getSizeMode(), 'some size mode')
    assert.strictEqual(renderInfo.getSelector(), undefined)
    assert.strictEqual(renderInfo.getRegion(), undefined)
  })

  it('fromRectangleSize has a default sizeMode', () => {
    const rectangleSize = new RectangleSize({width: 1, height: 2})
    const renderInfo = RenderInfo.fromRectangleSize(rectangleSize)

    assert.strictEqual(renderInfo.getWidth(), 1)
    assert.strictEqual(renderInfo.getHeight(), 2)
    assert.strictEqual(renderInfo.getSizeMode(), 'full-page')
    assert.strictEqual(renderInfo.getSelector(), undefined)
    assert.strictEqual(renderInfo.getRegion(), undefined)
  })

  it('toJSON', () => {
    const regionObj = {left: 3, top: 4, width: 5, height: 6}
    const emulationInfo = {deviceName: 'deviceName', screenOrientation: ScreenOrientation.PORTRAIT}
    const iosDeviceInfo = {
      name: 'iPhone 11 Pro',
      screenOrientation: 'landscapeLeft',
      version: 'latest',
    }
    const renderInfoObj = {
      width: 1,
      height: 2,
      sizeMode: 'some size mode',
      selector: 'some selector',
      region: regionObj,
      emulationInfo,
      iosDeviceInfo,
    }

    const renderInfo = new RenderInfo(renderInfoObj)
    const renderInfoWithAdjustedLeftTop = Object.assign(renderInfoObj, {
      region: {x: 3, y: 4, width: 5, height: 6, coordinatesType: 'SCREENSHOT_AS_IS'},
    })

    assert.deepStrictEqual(renderInfo.toJSON(), renderInfoWithAdjustedLeftTop)
  })

  it('toString', () => {
    const regionObj = {left: 3, top: 4, width: 5, height: 6}
    const emulationInfo = {deviceName: 'deviceName', screenOrientation: ScreenOrientation.PORTRAIT}
    const iosDeviceInfo = {
      name: 'iPhone 11 Pro',
      screenOrientation: 'landscapeLeft',
      version: 'latest',
    }
    const renderInfoObj = {
      width: 1,
      height: 2,
      sizeMode: 'some size mode',
      selector: 'some selector',
      region: regionObj,
      emulationInfo,
      iosDeviceInfo,
    }

    const renderInfo = new RenderInfo(renderInfoObj)
    assert.deepStrictEqual(
      renderInfo.toString(),
      'RenderInfo { {"width":1,"height":2,"sizeMode":"some size mode","selector":"some selector","region":{"width":5,"height":6,"coordinatesType":"SCREENSHOT_AS_IS","x":3,"y":4},"emulationInfo":{"deviceName":"deviceName","screenOrientation":"portrait"},"iosDeviceInfo":{"name":"iPhone 11 Pro","screenOrientation":"landscapeLeft","version":"latest"}} }',
    )
  })
})
