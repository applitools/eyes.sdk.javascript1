'use strict'
const {describe, it} = require('mocha')
const {expect} = require('chai')
const {BatchInfo} = require('@applitools/eyes-sdk-core')
const EyesWrapper = require('../../src/sdk/EyesWrapper')
const {configureWrappers} = require('../../src/sdk/wrapperUtils')

describe('wrapperUtils', () => {
  const browsers = [{name: 'bla'}]
  const userAgents = {bla: 'bla-ua'}

  it('sets useDom & enablePatterns', () => {
    let wrapper = new EyesWrapper()
    configureWrappers({
      wrappers: [wrapper],
      browsers,
      useDom: true,
      enablePatterns: true,
      userAgents,
    })
    expect(wrapper.getUseDom()).to.be.true
    expect(wrapper.getEnablePatterns()).to.be.true

    wrapper = new EyesWrapper()
    configureWrappers({
      wrappers: [wrapper],
      browsers,
      useDom: false,
      enablePatterns: false,
      userAgents,
    })
    expect(wrapper.getUseDom()).to.be.false
    expect(wrapper.getEnablePatterns()).to.be.false

    wrapper = new EyesWrapper()
    configureWrappers({wrappers: [wrapper], browsers, userAgents})
    expect(wrapper.getUseDom()).to.be.false
    expect(wrapper.getEnablePatterns()).to.be.false
  })

  it('sets notifyOnCompletion', () => {
    let wrapper = new EyesWrapper()
    const batch = new BatchInfo({notifyOnCompletion: true})
    configureWrappers({
      wrappers: [wrapper],
      browsers,
      batch,
      userAgents,
    })
    expect(wrapper._configuration.getBatch().getNotifyOnCompletion()).to.be.true
  })
})
