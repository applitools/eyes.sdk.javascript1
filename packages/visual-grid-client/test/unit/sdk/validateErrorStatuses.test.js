const {describe, it} = require('mocha')
const {expect} = require('chai')
const makeRenderingGridClient = require('../../../src/sdk/renderingGridClient')

describe('validate error satuses', () => {
  it('validate wrong api key error message', async () => {
    let apiKey = '123'
    let errMessage

    const {getSetRenderInfo} = await makeRenderingGridClient({
      apiKey,
    })

    try {
      await getSetRenderInfo()
    } catch (e) {
      errMessage = e.message
    } finally {
      expect(errMessage).to.equal('Request failed with status code 401(Unauthorized)')
    }
  })
})
