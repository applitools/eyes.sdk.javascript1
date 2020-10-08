'use strict'
const childProcess = require('child_process')
const {getDriver, getEyes} = require('./util/TestSetup')
const {ConsoleLogHandler} = require('../../../index')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const expect = chai.expect
describe.skip('TestProxy', () => {
  it('testNetworkThroughProxy', async () => {
    await checkNetworkFailIfNoProxy() // chai dont catch error throwed due to missed proxy
    try {
      await startProxy()
      await checkNetworkPassThroughProxy()
    } finally {
      await stopProxy()
    }
  })

  async function checkNetworkPassThroughProxy() {
    let webDriver = await getDriver('CHROME')
    let eyes = await getEyes('CSS')
    eyes.setLogHandler(new ConsoleLogHandler(true))
    try {
      eyes.setProxy('http://127.0.0.1:8080')

      await eyes.open(webDriver, 'Eyes Selenium SDK - Test Proxy', 'proxy test')
      await webDriver.get('https://applitools.com/helloworld')
      await eyes.checkWindow()
      await eyes.close()
      await expect(eyes.close()).to.be.rejectedWith('close called with Eyes not open')
    } catch (e) {
      console.log(e)
    } finally {
      await eyes.abortIfNotClosed()
      await webDriver.quit()
    }
  }

  async function checkNetworkFailIfNoProxy() {
    let webDriver = await getDriver('CHROME')
    let eyes = await getEyes('CSS')
    try {
      eyes.setProxy('http://127.0.0.1:8080')
      await eyes.open(webDriver, 'Eyes Selenium SDK - Test Proxy', 'proxy test')
    } catch (e) {
      console.log(e)
    } finally {
      await eyes.abortIfNotClosed()
      await webDriver.quit()
    }
  }
})

function startProxy() {
  childProcess.execSync(
    "docker run -d --name='tinyproxy' -p 8080:8888 dannydirect/tinyproxy:latest ANY",
  )
}
function stopProxy() {
  childProcess.execSync('docker stop tinyproxy')
  childProcess.execSync('docker rm tinyproxy')
}
