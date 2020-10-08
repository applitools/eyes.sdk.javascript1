/* global browser */
'use strict'
const {Target} = require('@applitools/eyes-webdriverio')

describe('EyesServiceTest', () => {
  it('checkWindow', () => {
    browser.url('https://applitools.github.io/demo/TestPages/FramesTestPage/index.html')
    browser.eyesCheck('', Target.window())
  })
})
