const assert = require('assert')
const {startFakeEyesServer} = require('@applitools/sdk-fake-eyes-server')
const MockDriver = require('../utils/MockDriver')
const FakeEyesClassic = require('../utils/FakeEyesClassic')
const FakeCheckSettings = require('../utils/FakeCheckSettings')
const EyesJsSnippet = require('../../lib/EyesJsSnippets')

describe('PreserveFakeCheckSettingsFrameAfterCheck', () => {
  let server, serverUrl, driver, eyes

  async function getDocumentElement() {
    return driver.executeScript(EyesJsSnippet.GET_DOCUMENT_ELEMENT)
  }

  before(async () => {
    driver = new MockDriver()
    driver.mockElements([
      {
        selector: 'frame1',
        frame: true,
        children: [
          {
            selector: 'frame1-cors',
            frame: true,
            children: [{selector: 'element_cors'}],
          },
          {
            selector: 'frame1-2',
            frame: true,
            children: [
              {
                selector: 'frame1-2-3',
                frame: true,
                children: [{selector: 'element_3'}],
              },
            ],
          },
        ],
      },
    ])
    eyes = new FakeEyesClassic()
    server = await startFakeEyesServer({logger: eyes._logger, matchMode: 'always'})
    serverUrl = `http://localhost:${server.port}`
    eyes.setServerUrl(serverUrl)
  })

  beforeEach(async () => {
    await driver.switchToFrame(null)
  })

  afterEach(async () => {
    await eyes.abort()
  })

  after(async () => {
    await server.close()
  })

  it('CheckWindow_WrappedDriver', async function() {
    const wrappedDriver = await eyes.open(driver, 'FakeApp', 'FakeTest')
    await wrappedDriver.switchToFrame('frame1')

    const frameElementBeforeCheck = await getDocumentElement()
    await eyes.check('window', FakeCheckSettings.window())
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return eyes.close()
  })

  it('CheckWindow_UnwrappedDriver', async function() {
    await eyes.open(driver, 'FakeApp', 'FakeTest')
    await driver.switchToFrame('frame1')

    const frameElementBeforeCheck = await getDocumentElement()
    await eyes.check('window', FakeCheckSettings.window())
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return eyes.close()
  })

  it('CheckNestedFrame_WrappedDriver', async function() {
    const wrappedDriver = await eyes.open(driver, 'FakeApp', 'FakeTest')
    await wrappedDriver.switchToFrame('frame1')

    const frameElementBeforeCheck = await getDocumentElement()
    await eyes.check('nested frame', FakeCheckSettings.frame('frame1-2').frame('frame1-2-3'))
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return eyes.close()
  })

  it('CheckNestedFrame_UnwrappedDriver', async function() {
    await eyes.open(driver, 'FakeApp', 'FakeTest')
    await driver.switchToFrame('frame1')

    const frameElementBeforeCheck = await getDocumentElement()
    await eyes.check('nested frame', FakeCheckSettings.frame('frame1-2').frame('frame1-2-3'))
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return eyes.close()
  })

  it('CheckRegionInsideFrameBySelector_WrappedDriver', async function() {
    const wrappedDriver = await eyes.open(driver, 'FakeApp', 'FakeTest')
    await wrappedDriver.switchToFrame('frame1')
    await wrappedDriver.switchToFrame('frame1-2')
    await wrappedDriver.switchToFrame('frame1-2-3')

    const frameElementBeforeCheck = await getDocumentElement()
    await eyes.check('region', FakeCheckSettings.region('element_3'))
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return eyes.close()
  })

  it('CheckRegionInsideFrameBySelector_UnwrappedDriver', async function() {
    await eyes.open(driver, 'FakeApp', 'FakeTest')
    await driver.switchToFrame('frame1')
    await driver.switchToFrame('frame1-2')
    await driver.switchToFrame('frame1-2-3')

    const frameElementBeforeCheck = await getDocumentElement()
    await eyes.check('region', FakeCheckSettings.region('element_3'))
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return eyes.close()
  })

  it('CheckRegionInsideFrameByElement_WrappedDriver', async function() {
    const wrappedDriver = await eyes.open(driver, 'FakeApp', 'FakeTest')
    await wrappedDriver.switchToFrame('frame1')
    await wrappedDriver.switchToFrame('frame1-2')
    await wrappedDriver.switchToFrame('frame1-2-3')

    const element = await wrappedDriver.findElement('element_3')

    const frameElementBeforeCheck = await getDocumentElement()
    await eyes.check('region', FakeCheckSettings.region(element))
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return eyes.close()
  })

  it('CheckRegionInsideFrameByElement_UnwrappedDriver', async function() {
    await eyes.open(driver, 'FakeApp', 'FakeTest')
    await driver.switchToFrame('frame1')
    await driver.switchToFrame('frame1-2')
    await driver.switchToFrame('frame1-2-3')

    const element = await driver.findElement('element_3')

    const frameElementBeforeCheck = await getDocumentElement()
    await eyes.check('region', FakeCheckSettings.region(element))
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return eyes.close()
  })

  it('CheckFrameFully_WrappedDriver', async function() {
    const wrappedDriver = await eyes.open(driver, 'FakeApp', 'FakeTest')
    await wrappedDriver.switchToFrame('frame1')
    await wrappedDriver.switchToFrame('frame1-2')

    const frameElementBeforeCheck = await getDocumentElement()
    await eyes.check('nested frame fully', FakeCheckSettings.frame('frame1-2-3').fully())
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return eyes.close()
  })

  it('CheckFrameFully_UnwrappedDriver', async function() {
    await eyes.open(driver, 'FakeApp', 'FakeTest')
    await driver.switchToFrame('frame1')
    await driver.switchToFrame('frame1-2')

    const frameElementBeforeCheck = await getDocumentElement()
    await eyes.check('nested frame fully', FakeCheckSettings.frame('frame1-2-3').fully())
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return eyes.close()
  })

  it('CheckCORSFrameRegionBySelector_WrappedDriver', async function() {
    const wrappedDriver = await eyes.open(driver, 'FakeApp', 'FakeTest')
    await wrappedDriver.switchToFrame('frame1')
    await wrappedDriver.switchToFrame('frame1-cors')

    const frameElementBeforeCheck = await getDocumentElement()
    await eyes.check('region in cors frame', FakeCheckSettings.region('element_cors'))
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return eyes.close()
  })

  it('CheckCORSFrameRegionBySelector_UnwrappedDriver', async function() {
    await eyes.open(driver, 'FakeApp', 'FakeTest')
    await driver.switchToFrame('frame1')
    await driver.switchToFrame('frame1-cors')

    const frameElementBeforeCheck = await getDocumentElement()
    await eyes.check('region in cors frame', FakeCheckSettings.region('element_cors'))
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return eyes.close()
  })

  it('CheckCORSFrameRegionByElement_WrappedDriver', async function() {
    const wrappedDriver = await eyes.open(driver, 'FakeApp', 'FakeTest')
    await wrappedDriver.switchToFrame('frame1')
    await wrappedDriver.switchToFrame('frame1-cors')

    const element = await wrappedDriver.findElement('element_cors')

    const frameElementBeforeCheck = await getDocumentElement()
    await eyes.check('region in cors frame', FakeCheckSettings.region(element))
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return eyes.close()
  })

  it('CheckCORSFrameRegionByElement_UnwrappedDriver', async function() {
    await eyes.open(driver, 'FakeApp', 'FakeTest')
    await driver.switchToFrame('frame1')
    await driver.switchToFrame('frame1-cors')

    const element = await driver.findElement('element_cors')

    const frameElementBeforeCheck = await getDocumentElement()
    await eyes.check('region in cors frame', FakeCheckSettings.region(element))
    const frameElementAfterCheck = await getDocumentElement()

    assert.deepStrictEqual(frameElementAfterCheck, frameElementBeforeCheck)

    return eyes.close()
  })
})
