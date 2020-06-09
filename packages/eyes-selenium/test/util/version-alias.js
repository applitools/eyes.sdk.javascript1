const alias = require('module-alias')

if (!process.env.SELENIUM_MAJOR_VERSION) {
  process.env.SELENIUM_MAJOR_VERSION = '4'
}

alias.addAlias('selenium-webdriver', `selenium-webdriver-${process.env.SELENIUM_MAJOR_VERSION}`)
