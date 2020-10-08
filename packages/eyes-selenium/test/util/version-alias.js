const alias = require('module-alias')

if (!process.env.APPLITOOLS_SELENIUM_MAJOR_VERSION) {
  process.env.APPLITOOLS_SELENIUM_MAJOR_VERSION = '4'
}

alias.addAlias(
  'selenium-webdriver',
  `selenium-webdriver-${process.env.APPLITOOLS_SELENIUM_MAJOR_VERSION}`,
)
