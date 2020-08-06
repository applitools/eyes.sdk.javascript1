'use strict'
const cwd = process.cwd()
const path = require('path')
const {getEyes} = require('../../src/test-setup')
const spec = require(path.resolve(cwd, 'src/SpecDriver'))
const {ProxySettings} = require(cwd)
const childProcess = require('child_process')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const expect = chai.expect

describe.skip('TestProxy', () => {
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
    const webDriver = await spec.build({browser: 'chrome'})
    const eyes = await getEyes({isVisualGrid: true})
    try {
      let conf = eyes.getConfiguration()
      conf.setProxy(new ProxySettings('http://127.0.0.1:8080', undefined, undefined, true))
      conf.setAppName('Eyes Selenium SDK - Test Proxy')
      conf.setTestName('proxy test')
      eyes.setConfiguration(conf)

      await spec.visit(webDriver, 'https://applitools.com/helloworld')
      await spec.sleep(webDriver, 2000)
      await eyes.open(webDriver)
      await eyes.checkWindow()
      await eyes.close()
      await expect(eyes.close()).to.be.rejectedWith(Error, 'IllegalState: Eyes not open')
    } finally {
      debugger
      await eyes.abortIfNotClosed()
      await spec.cleanup(webDriver)
    }
  }

  async function checkNetworkFailIfNoProxy() {
    const webDriver = await spec.build({browser: 'chrome'})
    const eyes = await getEyes({isVisualGrid: true})
    try {
      let conf = eyes.getConfiguration()
      conf.setProxy(new ProxySettings('http://127.0.0.1:8080', undefined, undefined, true))
      conf.setAppName('Eyes Selenium SDK - Test Proxy')
      conf.setTestName('proxy test')
      eyes.setConfiguration(conf)
      await expect(eyes.open(webDriver)).to.be.rejectedWith(
        Error,
        'tunneling socket could not be established',
      )
    } finally {
      await spec.cleanup(webDriver)
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
