'use strict'
const childProcess = require('child_process')
const {getDriver, getEyes, getBatch} = require('./util/TestSetup')
const {Configuration, ProxySettings} = require('../../../index')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const expect = chai.expect
const batch = getBatch()
describe('TestProxy', () => {
  it('testNetworkThroughProxy', async () => {
    await checkNetworkFailIfNoProxy()
    try {
      await startProxy()
      await checkNetworkPassThroughProxy()
    } finally {
      await stopProxy()
    }
  })

  async function checkNetworkPassThroughProxy() {
    let browser = await getDriver('CHROME')
    let {eyes} = await getEyes('VG')
    try {
      let conf = new Configuration()
      conf.setBatch(batch)
      conf.setProxy(new ProxySettings('http://127.0.0.1:8080', undefined, undefined, true))
      conf.setAppName('Eyes Selenium SDK - Test Proxy')
      conf.setTestName('proxy test')
      eyes.setConfiguration(conf)

      await browser.url('https://applitools.com/helloworld')
      await eyes.open(browser)
      await eyes.checkWindow()
      await eyes.close()
      await expect(eyes.close()).to.be.rejectedWith(Error, 'IllegalState: Eyes not open')
    } finally {
      await eyes.abortIfNotClosed()
      await browser.deleteSession()
    }
  }

  async function checkNetworkFailIfNoProxy() {
    let browser = await getDriver('CHROME')
    let {eyes} = await getEyes('VG')
    try {
      let conf = new Configuration()
      conf.setBatch(batch)
      conf.setProxy(new ProxySettings('http://127.0.0.1:8080', undefined, undefined, true))
      conf.setAppName('Eyes Selenium SDK - Test Proxy')
      conf.setTestName('proxy test')
      eyes.setConfiguration(conf)
      await expect(eyes.open(browser)).to.be.rejectedWith(
        Error,
        'tunneling socket could not be established',
      )
    } finally {
      await browser.deleteSession()
      if (eyes.getIsOpen()) {
        await eyes.abort()
      }
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
