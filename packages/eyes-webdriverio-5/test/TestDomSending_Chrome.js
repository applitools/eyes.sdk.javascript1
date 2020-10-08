'use strict'

// eslint-disable-next-line node/no-missing-require
const {TestDomSending} = require('./TestDomSending')
const Common = require('./Common')

const appName = 'Eyes Selenium SDK - Dom Sending'
const testedPageUrl = 'http://applitools.github.io/demo/TestPages/DomTest/dom_capture.html'

const test = new Common({testedPageUrl: testedPageUrl, browserName: 'chrome'})

const platforms = ['Windows']
platforms.forEach(function(platform) {
  describe(appName, function() {
    before(function() {
      test.beforeTest({})
    })

    beforeEach(function() {
      return test.beforeEachTest({
        appName: appName,
        testName: this.currentTest.title,
        browserOptions: Common.CHROME,
        platform: platform,
      })
    })

    afterEach(function() {
      return test.afterEachTest()
    })

    after(function() {
      test.afterTest()
    })

    TestDomSending.shouldBehaveLike('TestDomSending', test)
  })
})
