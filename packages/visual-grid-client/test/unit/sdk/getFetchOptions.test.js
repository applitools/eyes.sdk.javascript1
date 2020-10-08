'use strict'

const {ProxySettings} = require('@applitools/eyes-sdk-core')
const getFetchOptions = require('../../../src/sdk/getFetchOptions')
const {expect} = require('chai')

describe('getFetchOptions', () => {
  it('adds user-agent and referer header', async () => {
    const referer = 'some referer'
    const userAgent = 'bla'
    expect(getFetchOptions({referer, userAgent})).to.eql({
      headers: {Referer: referer, 'User-Agent': userAgent},
    })
  })

  it("doesn't add user-agent header when fetching google fonts", async () => {
    const url = 'https://fonts.googleapis.com/css?family=Zilla+Slab'
    const referer = 'some referer'
    expect(getFetchOptions({url, referer, userAgent: 'bla'})).to.eql({headers: {Referer: referer}})
  })

  it('sets tunneling agent when proxySettings is isHttpOnly', async () => {
    const proxySettings = new ProxySettings('http://localhost:8888', 'user', 'pass', true)
    expect(getFetchOptions({proxySettings}).agent.constructor.name).to.equal('TunnelingAgent')
  })
})
