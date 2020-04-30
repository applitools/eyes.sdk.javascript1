'use strict'
const {describe, it} = require('mocha')
const {expect} = require('chai')
const translateBrowserNameVersion = require('../../../src/sdk/translateBrowserNameVersion')

describe('translateBrowserNameVersion', () => {
  it('outputs the same input value if no translation is needed', async () => {
    expect(translateBrowserNameVersion('')).to.equal('')
    expect(translateBrowserNameVersion(undefined)).to.equal(undefined)
    expect(translateBrowserNameVersion('bla')).to.equal('bla')
    expect(translateBrowserNameVersion('chrome')).to.equal('chrome')
    expect(translateBrowserNameVersion('ie10')).to.equal('ie10')
    expect(translateBrowserNameVersion('bla-chrome-one-version-back-bla')).to.equal('bla-chrome-one-version-back-bla'); // eslint-disable-line prettier/prettier
  })

  it('translates to (1|2)-version(s)-back for supported browsers', async () => {
    expect(translateBrowserNameVersion('chrome-1')).to.equal('chrome-one-version-back')
    expect(translateBrowserNameVersion('chrome-2')).to.equal('chrome-two-versions-back')
    expect(translateBrowserNameVersion('firefox-1')).to.equal('firefox-one-version-back')
    expect(translateBrowserNameVersion('firefox-2')).to.equal('firefox-two-versions-back')
    expect(translateBrowserNameVersion('safari-1')).to.equal('safari-one-version-back')
    expect(translateBrowserNameVersion('safari-2')).to.equal('safari-two-versions-back')
    expect(translateBrowserNameVersion('edgechromium-1')).to.equal('edgechromium-one-version-back')
  })

  it("doesn't translate to (1|2)-version(s)-back for unsupported browsers", async () => {
    expect(translateBrowserNameVersion('edge-1')).to.equal('edge-1')
    expect(translateBrowserNameVersion('edge-2')).to.equal('edge-2')
    expect(translateBrowserNameVersion('ie11-1')).to.equal('ie11-1')
    expect(translateBrowserNameVersion('ie11-2')).to.equal('ie11-2')
    expect(translateBrowserNameVersion('ie10-1')).to.equal('ie10-1')
    expect(translateBrowserNameVersion('ie10-2')).to.equal('ie10-2')
    expect(translateBrowserNameVersion('edgechromium-2')).to.equal('edgechromium-2')
    expect(translateBrowserNameVersion('edgelegacy-1')).to.equal('edgelegacy-1')
    expect(translateBrowserNameVersion('edgelegacy-2')).to.equal('edgelegacy-2')
  })

  it("doesn't translate to three-versions-back and onwards", async () => {
    expect(translateBrowserNameVersion('chrome-3')).to.equal('chrome-3')
    expect(translateBrowserNameVersion('chrome-4')).to.equal('chrome-4')
    expect(translateBrowserNameVersion('firefox-5')).to.equal('firefox-5')
    expect(translateBrowserNameVersion('firefox-6')).to.equal('firefox-6')
    expect(translateBrowserNameVersion('safari-7')).to.equal('safari-7')
    expect(translateBrowserNameVersion('safari-8')).to.equal('safari-8')
    expect(translateBrowserNameVersion('edgechromium-3')).to.equal('edgechromium-3')
  })
})
