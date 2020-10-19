'use strict'

const assert = require('assert')

const {RenderStatusResults} = require('../../../index')

describe('RenderStatusResults', () => {
  it('constructor', () => {
    const results = new RenderStatusResults()
    assert.strictEqual(Object.prototype.hasOwnProperty.call(results, '_status'), true)
    assert.strictEqual(Object.prototype.hasOwnProperty.call(results, '_imageLocation'), true)
    assert.strictEqual(Object.prototype.hasOwnProperty.call(results, '_domLocation'), true)
    assert.strictEqual(Object.prototype.hasOwnProperty.call(results, '_error'), true)
    assert.strictEqual(Object.prototype.hasOwnProperty.call(results, '_os'), true)
    assert.strictEqual(Object.prototype.hasOwnProperty.call(results, '_userAgent'), true)
    assert.strictEqual(Object.prototype.hasOwnProperty.call(results, '_deviceSize'), true)
    assert.strictEqual(Object.prototype.hasOwnProperty.call(results, '_selectorRegions'), true)
  })

  it('constructor empty', () => {
    const results = new RenderStatusResults({})
    assert.strictEqual(results.getStatus(), undefined)
  })

  it('constructor with object', () => {
    const status = 'some status'
    const error = 'some error'
    const imageLocation = 'some image location'
    const domLocation = 'some dom location'
    const os = 'some os'
    const userAgent = 'some user agent'
    const deviceSize = {width: 1, height: 2}
    const selectorRegions = [[{x: 1, y: 2, width: 3, height: 4}]]
    const results = new RenderStatusResults({
      status,
      error,
      imageLocation,
      domLocation,
      os,
      userAgent,
      deviceSize,
      selectorRegions,
    })

    assert.strictEqual(results.getStatus(), status)
    assert.strictEqual(results.getError(), error)
    assert.strictEqual(results.getImageLocation(), imageLocation)
    assert.strictEqual(results.getDomLocation(), domLocation)
    assert.strictEqual(results.getOS(), os)
    assert.strictEqual(results.getUserAgent(), userAgent)
    assert.deepStrictEqual(results.getDeviceSize().toJSON(), deviceSize)
    assert.deepStrictEqual(
      results.getSelectorRegions().map(region => region.map(r => r.toJSON())),
      [[{left: 1, top: 2, width: 3, height: 4, coordinatesType: 'SCREENSHOT_AS_IS'}]],
    )
  })

  it('toJSON', () => {
    const status = 'some status'
    const error = 'some error'
    const imageLocation = 'some image location'
    const domLocation = 'some dom location'
    const os = 'some os'
    const userAgent = 'some user agent'
    const deviceSize = {width: 1, height: 2}
    const selectorRegions = [[{x: 1, y: 2, width: 3, height: 4}]]
    const results = new RenderStatusResults({
      status,
      error,
      imageLocation,
      domLocation,
      os,
      userAgent,
      deviceSize,
      selectorRegions,
    })

    assert.strictEqual(
      JSON.stringify(results),
      '{"status":"some status","imageLocation":"some image location","domLocation":"some dom location","error":"some error","os":"some os","userAgent":"some user agent","deviceSize":{"width":1,"height":2},"selectorRegions":[[{"left":1,"top":2,"width":3,"height":4,"coordinatesType":"SCREENSHOT_AS_IS"}]]}',
    )
  })

  it('toString', () => {
    const status = 'some status'
    const error = 'some error'
    const imageLocation = 'some image location'
    const domLocation = 'some dom location'
    const os = 'some os'
    const userAgent = 'some user agent'
    const deviceSize = {width: 1, height: 2}
    const selectorRegions = [[{x: 1, y: 2, width: 3, height: 4}]]
    const results = new RenderStatusResults({
      status,
      error,
      imageLocation,
      domLocation,
      os,
      userAgent,
      deviceSize,
      selectorRegions,
    })

    assert.strictEqual(
      results.toString(),
      'RenderStatusResults { {"status":"some status","imageLocation":"some image location","domLocation":"some dom location","error":"some error","os":"some os","userAgent":"some user agent","deviceSize":{"width":1,"height":2},"selectorRegions":[[{"left":1,"top":2,"width":3,"height":4,"coordinatesType":"SCREENSHOT_AS_IS"}]]} }',
    )
  })
})
