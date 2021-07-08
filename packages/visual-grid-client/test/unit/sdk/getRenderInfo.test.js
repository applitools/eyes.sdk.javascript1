'use strict'

const {describe, it} = require('mocha')
const {expect} = require('chai')
const makeRenderingGridClient = require('../../../src/sdk/renderingGridClient')
const createFakeWrapper = require('../../util/createFakeWrapper')

describe('getRenderInfo', () => {
  it('make sure getSetRenderInfo sets renderInfo and is not called twice', async () => {
    let apiKey = process.env.APPLITOOLS_API_KEY
    let getRenderInfoCallCount = 0

    const wrapper = createFakeWrapper('http://bla')

    wrapper.getRenderInfo = async () => {
      getRenderInfoCallCount++
    }
    const {openEyes, getSetRenderInfo} = await makeRenderingGridClient({
      apiKey,
      renderWrapper: wrapper,
    })

    await getSetRenderInfo()

    // getRenderInfoCallCount should be 1 as this is the first time getRenderInfo is called
    expect(getRenderInfoCallCount).to.equal(1)

    // getRenderInfoCallCount should stay 1 as doGetInitialData was already called
    await openEyes({
      wrappers: [wrapper],
      appName: 'bla',
    })

    expect(getRenderInfoCallCount).to.equal(1)
  })
})
