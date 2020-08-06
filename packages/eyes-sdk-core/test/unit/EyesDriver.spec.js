const assert = require('assert')
const {Logger} = require('../../index')
const MockDriver = require('../utils/MockDriver')
const {Driver} = require('../utils/FakeSDK')

describe('EyesDriver', () => {
  let mock, driver

  before(async () => {
    mock = new MockDriver()
    mock.mockElements([
      {selector: 'frame0', frame: true},
      {
        selector: 'frame1',
        frame: true,
        isCORS: true,
        children: [
          {selector: 'frame1-0', frame: true, isCORS: true},
          {selector: 'frame1-1', frame: true},
          {selector: 'frame1-2', frame: true, isCORS: true},
        ],
      },
      {
        selector: 'frame2',
        frame: true,
        isCORS: true,
        children: [
          {selector: 'frame2-0', frame: true, isCORS: true},
          {
            selector: 'frame2-1',
            frame: true,
            isCORS: true,
            children: [
              {selector: 'frame2-1-0', frame: true, isCORS: true},
              {selector: 'frame2-1-1', frame: true},
              {selector: 'frame2-1-2', frame: true, isCORS: true},
            ],
          },
          {selector: 'frame2-2', frame: true},
        ],
      },
    ])
    driver = new Driver(new Logger(Boolean(process.env.APPLITOOLS_SHOW_LOGS)), mock)
    await driver.init()
  })

  afterEach(async () => {
    await driver.switchToMainContext()
  })

  it('getTitle()', async () => {
    assert.strictEqual(await driver.getTitle(), 'Default Page Title')
  })

  it('getUrl()', async () => {
    assert.strictEqual(await driver.getUrl(), 'http://default.url')
  })

  it('switchToChildContext(element)', async () => {
    const frameElement = await mock.findElement('frame0')
    await driver.switchToChildContext(frameElement)
    assert.strictEqual(driver.currentContext.path.length, 2)
    assert.ok(await driver.currentContext.equals(frameElement))
  })

  it('switchToChildContext(eyes-element)', async () => {
    const frameElement = await driver.element('frame0')
    await driver.switchToChildContext(frameElement)
    assert.strictEqual(driver.currentContext.path.length, 2)
    assert.ok(await driver.currentContext.equals(frameElement))
  })

  it('switchToMainContext()', async () => {
    const mainContextDocument = await driver.element('html')
    await driver.switchToChildContext('frame0')
    await driver.switchToMainContext(null)
    assert.strictEqual(driver.currentContext, driver.mainContext)
    const currentContextDocument = await driver.element('html')
    assert.ok(await mainContextDocument.equals(currentContextDocument))
  })

  it('switchToParentContext()', async () => {
    const mainContextDocument = await driver.element('html')
    await driver.switchToChildContext('frame1')
    const nestedContextDocument = await driver.element('html')
    await driver.switchToChildContext('frame1-1')
    assert.strictEqual(driver.currentContext.path.length, 3)

    await driver.switchToParentContext()
    assert.strictEqual(driver.currentContext.path.length, 2)
    const parentContextDocument = await driver.element('html')
    assert.ok(await parentContextDocument.equals(nestedContextDocument))

    await driver.switchToParentContext()
    assert.strictEqual(driver.currentContext, driver.mainContext)
    const grandparentContextDocument = await driver.element('html')
    assert.ok(await grandparentContextDocument.equals(mainContextDocument))
  })

  it('switchTo(context)', async () => {
    const contextDocuments = []
    contextDocuments.unshift(await driver.element('html'))
    for (const frameSelector of ['frame2', 'frame2-1', 'frame2-1-0']) {
      await driver.switchToChildContext(frameSelector)
      contextDocuments.unshift(await driver.element('html'))
    }
    assert.strictEqual(driver.currentContext.path.length, 4)
    const requiredContext = driver.currentContext

    await driver.switchToMainContext()
    assert.strictEqual(driver.currentContext, driver.mainContext)

    await driver.switchTo(requiredContext)
    assert.strictEqual(driver.currentContext, driver.currentContext)

    for (const contextDocument of contextDocuments) {
      const currentDocument = await driver.element('html')
      assert.ok(await currentDocument.equals(contextDocument))
      await driver.switchToParentContext()
    }
  })

  describe('refreshContexts()', () => {
    afterEach(async () => {
      await driver.switchToMainContext()
    })

    it('untracked same origin frame chain [(0-0)?]', async () => {
      const frameElements = [null]
      const frameElement = await mock.findElement('frame0')
      frameElements.push(frameElement)
      await mock.switchToFrame(frameElement)
      assert.strictEqual(driver.mainContext, driver.currentContext)
      await driver.refreshContexts()
      const contextPath = driver.currentContext.path
      assert.strictEqual(contextPath.length, frameElements.length)
      for (const frameIndex of frameElements.keys()) {
        assert.ok(await contextPath[frameIndex].equals(frameElements[frameIndex]))
      }
    })

    it('untracked cors frame chain [(0-1-2)?]', async () => {
      const frameElements = [null]
      const frameElement1 = await mock.findElement('frame1')
      frameElements.push(frameElement1)
      await mock.switchToFrame(frameElement1)
      const frameElement2 = await mock.findElement('frame1-2')
      frameElements.push(frameElement2)
      await mock.switchToFrame(frameElement2)
      assert.strictEqual(driver.mainContext, driver.currentContext)
      await driver.refreshContexts()
      const contextPath = driver.currentContext.path
      assert.strictEqual(contextPath.length, frameElements.length)
      for (const frameIndex of frameElements.keys()) {
        assert.ok(await contextPath[frameIndex].equals(frameElements[frameIndex]))
      }
    })

    it('untracked mixed frame chain [(0-1-0)?]', async () => {
      const frameElements = [null]
      const frameElement1 = await mock.findElement('frame1')
      frameElements.push(frameElement1)
      await mock.switchToFrame(frameElement1)
      const frameElement0 = await mock.findElement('frame1-0')
      frameElements.push(frameElement0)
      await mock.switchToFrame(frameElement0)
      assert.strictEqual(driver.mainContext, driver.currentContext)
      await driver.refreshContexts()
      const contextPath = driver.currentContext.path
      assert.strictEqual(contextPath.length, frameElements.length)
      for (const frameIndex of frameElements.keys()) {
        assert.ok(await contextPath[frameIndex].equals(frameElements[frameIndex]))
      }
    })

    it('untracked mixed frame chain [(0-1-1)?]', async () => {
      const frameElements = [null]
      const frameElement1 = await mock.findElement('frame1')
      frameElements.push(frameElement1)
      await mock.switchToFrame(frameElement1)
      const frameElement11 = await mock.findElement('frame1-1')
      frameElements.push(frameElement11)
      await mock.switchToFrame(frameElement11)
      assert.strictEqual(driver.mainContext, driver.currentContext)
      await driver.refreshContexts()
      const contextPath = driver.currentContext.path
      assert.strictEqual(contextPath.length, frameElements.length)
      for (const frameIndex of frameElements.keys()) {
        assert.ok(await contextPath[frameIndex].equals(frameElements[frameIndex]))
      }
    })

    it('partially tracked frame chain [0-2-1-(2)?]', async () => {
      const frameElements = [null]
      const frameElement2 = await mock.findElement('frame2')
      frameElements.push(frameElement2)
      await driver.switchToChildContext(frameElement2)
      const frameElement1 = await mock.findElement('frame2-1')
      frameElements.push(frameElement1)
      await driver.switchToChildContext(frameElement1)
      const frameElement22 = await mock.findElement('frame2-1-2')
      frameElements.push(frameElement22)
      await mock.switchToFrame(frameElement22)
      assert.strictEqual(driver.currentContext.path.length, 3)
      await driver.refreshContexts()
      const contextPath = driver.currentContext.path
      assert.strictEqual(contextPath.length, frameElements.length)
      for (const frameIndex of frameElements.keys()) {
        assert.ok(await contextPath[frameIndex].equals(frameElements[frameIndex]))
      }
    })

    it('partially tracked frame chain [(0-2)?-1-2]', async () => {
      const frameElements = [null]
      const frameElement2 = await mock.findElement('frame2')
      frameElements.push(frameElement2)
      await mock.switchToFrame(frameElement2)
      const frameElement1 = await mock.findElement('frame2-1')
      frameElements.push(frameElement1)
      await driver.switchToChildContext(frameElement1)
      const frameElement22 = await mock.findElement('frame2-1-2')
      frameElements.push(frameElement22)
      await driver.switchToChildContext(frameElement22)
      assert.strictEqual(driver.currentContext.path.length, 3)
      await driver.refreshContexts()
      const contextPath = driver.currentContext.path
      assert.strictEqual(contextPath.length, frameElements.length)
      for (const frameIndex of frameElements.keys()) {
        assert.ok(await contextPath[frameIndex].equals(frameElements[frameIndex]))
      }
    })

    it('tracked frame chain [0-2-1-2]', async () => {
      const frameElements = [null]
      const frameElement2 = await mock.findElement('frame2')
      frameElements.push(frameElement2)
      await driver.switchToChildContext(frameElement2)
      const frameElement1 = await mock.findElement('frame2-1')
      frameElements.push(frameElement1)
      await driver.switchToChildContext(frameElement1)
      const frameElement22 = await mock.findElement('frame2-1-2')
      frameElements.push(frameElement22)
      await driver.switchToChildContext(frameElement22)
      assert.strictEqual(driver.currentContext.path.length, frameElements.length)
      await driver.refreshContexts()
      const contextPath = driver.currentContext.path
      assert.strictEqual(contextPath.length, frameElements.length)
      for (const frameIndex of frameElements.keys()) {
        assert.ok(await contextPath[frameIndex].equals(frameElements[frameIndex]))
      }
    })
  })
})

describe('EyesDriver native', () => {
  let driver

  before(async () => {
    driver = new Driver(
      new Logger(Boolean(process.env.APPLITOOLS_SHOW_LOGS)),
      new MockDriver({isNative: true}),
    )
    await driver.init()
  })

  it('skip unnecessary method calls on native mode', async () => {
    const title = await driver.getTitle()
    const url = await driver.getUrl()
    assert.strictEqual(title, null)
    assert.strictEqual(url, null)
  })
})
