// check window fully with vg and cookies
const path = require('path')
const fs = require('fs')
const {setupEyes} = require('@applitools/test-utils')
const {testServerInProcess} = require('@applitools/test-server')
const cwd = process.cwd()
const spec = require(path.resolve(cwd, fs.existsSync('./dist') ? './dist' : './src', './spec-driver'))
// const CDP = require('chrome-remote-interface')

;(async function () {
  try {
    const [driver, destroyDriver] = await spec.build({
      browser: 'chrome',
      attach: true,
    })

    const staticPath = path.resolve(__dirname, '../fixtures/cookies')
    const corsStaticPath = `${staticPath}/cors_images`
    const middlewareFile = `${staticPath}/restrictCookies.js`

    const corsServer = await testServerInProcess({
      port: 4459,
      allowCors: true,
      staticPath: corsStaticPath,
      middlewareFile,
    })

    const server = await testServerInProcess({
      port: 4458,
      staticPath,
      middlewareFile: `${staticPath}/createCookie.js`,
    })

    const eyes = setupEyes({
      vg: true,
      displayName: 'check window fully with vg and cookies',
      baselineName: 'Cookies',
      saveNewTests: true,
      showLogs: true,
    })

    await spec.visit(driver, 'http://localhost:4458')

    // const cdpCookies = await driver.sendCommandAndGetResult('Network.getAllCookies', {})
    const cookies = await driver.getCookies()
    console.log(cookies)

    await eyes.open(driver, 'Eyes Selenium SDK - Cookies', 'Cookie test', {width: 800, height: 600})
    await eyes.check({isFully: true, disableBrowserFetching: true})
    const results = await eyes.close(true)
    console.log(results)
    await corsServer.close()
    await server.close()
    await destroyDriver(driver)
    // await eyes.abort()
  } catch (error) {
    throw error
  }
})()
