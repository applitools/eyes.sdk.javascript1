/* eslint-disable no-undef */
'use strict'

const {deepStrictEqual} = require('assert')

describe('EyesServiceTest', () => {
  beforeEach(() => {
    browser.url('http://applitools.github.io/demo/TestPages/FramesTestPage/')
  })

  it('checkWindow', () => {
    const viewportSize = {width: 500, height: 400}
    const configuration = browser.eyesGetConfiguration()
    configuration.setViewportSize(viewportSize)
    browser.eyesSetConfiguration(configuration)

    browser.eyesCheck('window')

    const actualViewportSize = browser.eyesGetConfiguration().getViewportSize()

    deepStrictEqual(viewportSize, actualViewportSize.toJSON())
  })
})
