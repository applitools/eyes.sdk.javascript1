const alias = require('module-alias')

exports.mochaHooks = {
  beforeAll() {
    if (!process.env.APPLITOOLS_WDIO_MAJOR_VERSION) {
      process.env.APPLITOOLS_WDIO_MAJOR_VERSION = '6'
    }

    alias.addAlias('webdriverio', `webdriverio-${process.env.APPLITOOLS_WDIO_MAJOR_VERSION}`)
  },
}
