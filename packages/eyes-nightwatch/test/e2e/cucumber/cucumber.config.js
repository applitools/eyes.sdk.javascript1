const path = require('path')
const {AfterAll, BeforeAll} = require('cucumber')
const {createSession, closeSession, startWebDriver, stopWebDriver} = require('nightwatch-api')

BeforeAll(async () => {
  await startWebDriver({
    env: process.env.NIGHTWATCH_ENV || 'default',
    configFile: path.join(__dirname, '../../nightwatch.conf.js'),
  })
  await createSession()
})

AfterAll(async () => {
  await closeSession()
  await stopWebDriver()
})

module.exports = {default: '--publish-quiet'}
