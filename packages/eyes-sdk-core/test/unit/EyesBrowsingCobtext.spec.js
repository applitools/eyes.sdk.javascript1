'use strict'
const assert = require('assert')
const {Logger} = require('../../index')
const MockDriver = require('../utils/MockDriver')
const FakeWrappedDriver = require('../utils/FakeWrappedDriver')
const EyesJsSnippets = require('../../lib/EyesJsSnippets')

describe('EyesBrowsingContext', () => {
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
    driver = new FakeWrappedDriver(new Logger(false), mock)
  })

  beforeEach(async () => {
    await driver.context.frameDefault()
  })

  it('frame(element)', async () => {
    const frameElement = await mock.findElement('frame0')
    await driver.context.frame(frameElement)
    assert.strictEqual(driver.context.frameChain.size, 1)
    const currentFrameElement = driver.context.frameChain.current.element
    assert.deepStrictEqual(currentFrameElement.elementId, frameElement.id)
  })

  it('frame(elementWrapper)', async () => {
    const frameElement = await driver.finder.findElement('frame0')
    await driver.context.frame(frameElement)
    assert.strictEqual(driver.context.frameChain.size, 1)
    const currentFrameElement = driver.context.frameChain.current.element
    assert.deepStrictEqual(currentFrameElement.elementId, frameElement.elementId)
  })

  it('frame(null)', async () => {
    const topContextDocument = await mock.executeScript(EyesJsSnippets.GET_DOCUMENT_ELEMENT)
    await driver.context.frame(await mock.findElement('frame0'))
    await driver.context.frame(null)
    assert.strictEqual(driver.context.frameChain.size, 0)
    const currentContextDocument = await mock.executeScript(EyesJsSnippets.GET_DOCUMENT_ELEMENT)
    assert.deepStrictEqual(currentContextDocument.id, topContextDocument.id)
  })

  it('frameParent()', async () => {
    const topContextDocument = await mock.executeScript(EyesJsSnippets.GET_DOCUMENT_ELEMENT)
    await driver.context.frame(await mock.findElement('frame1'))
    const nestedContextDocument = await mock.executeScript(EyesJsSnippets.GET_DOCUMENT_ELEMENT)
    await driver.context.frame(await mock.findElement('frame1-1'))
    assert.strictEqual(driver.context.frameChain.size, 2)

    await driver.context.frameParent()
    assert.strictEqual(driver.context.frameChain.size, 1)
    const parentContextDocument = await mock.executeScript(EyesJsSnippets.GET_DOCUMENT_ELEMENT)
    assert.deepStrictEqual(parentContextDocument.id, nestedContextDocument.id)

    await driver.context.frameParent()
    assert.strictEqual(driver.context.frameChain.size, 0)
    const grandparentContextDocument = await mock.executeScript(EyesJsSnippets.GET_DOCUMENT_ELEMENT)
    assert.deepStrictEqual(grandparentContextDocument.id, topContextDocument.id)
  })

  it('frames()', async () => {
    const frameSelectorsPath = ['frame1', 'frame1-1']
    const framePath = []
    const frameDocuments = []
    frameDocuments.push(await mock.executeScript(EyesJsSnippets.GET_DOCUMENT_ELEMENT))
    for (const frameSelector of frameSelectorsPath) {
      const frameElement = await mock.findElement(frameSelector)
      await driver.context.frame(frameElement)
      framePath.push(frameElement)
      frameDocuments.unshift(await mock.executeScript(EyesJsSnippets.GET_DOCUMENT_ELEMENT))
    }
    assert.strictEqual(driver.context.frameChain.size, frameSelectorsPath.length)

    await driver.context.frameDefault()
    assert.strictEqual(driver.context.frameChain.size, 0)

    await driver.context.frames(framePath)
    assert.strictEqual(driver.context.frameChain.size, framePath.length)

    for (const frameDocument of frameDocuments) {
      const currentDocument = await mock.executeScript(EyesJsSnippets.GET_DOCUMENT_ELEMENT)
      assert.deepStrictEqual(currentDocument.id, frameDocument.id)
      await driver.context.frameParent()
    }
  })

  describe('refreshFrames()', () => {
    it('untracked same origin frame chain [(0-0)?]', async () => {
      const frameElements = []
      const frameElement = await mock.findElement('frame0')
      frameElements.push(frameElement)
      await mock.switchToFrame(frameElement)
      assert.strictEqual(driver.context.frameChain.size, 0)
      await driver.context.framesRefresh()
      const frameChain = driver.context.frameChain
      assert.strictEqual(frameChain.size, frameElements.length)
      for (const frameIndex in frameElements) {
        assert.strictEqual(
          frameElements[frameIndex].id,
          frameChain.frameAt(frameIndex).element.elementId,
        )
      }
    })

    it('untracked cors frame chain [(0-1-2)?]', async () => {
      const frameElements = []
      const frameElement1 = await mock.findElement('frame1')
      frameElements.push(frameElement1)
      await mock.switchToFrame(frameElement1)
      const frameElement2 = await mock.findElement('frame1-2')
      frameElements.push(frameElement2)
      await mock.switchToFrame(frameElement2)
      assert.strictEqual(driver.context.frameChain.size, 0)
      await driver.context.framesRefresh()
      const frameChain = driver.context.frameChain
      assert.strictEqual(frameChain.size, frameElements.length)
      for (const frameIndex in frameElements) {
        assert.strictEqual(
          frameElements[frameIndex].id,
          frameChain.frameAt(frameIndex).element.elementId,
        )
      }
    })

    it('untracked mixed frame chain [(0-1-0)?]', async () => {
      const frameElements = []
      const frameElement1 = await mock.findElement('frame1')
      frameElements.push(frameElement1)
      await mock.switchToFrame(frameElement1)
      const frameElement0 = await mock.findElement('frame1-0')
      frameElements.push(frameElement0)
      await mock.switchToFrame(frameElement0)
      assert.strictEqual(driver.context.frameChain.size, 0)
      await driver.context.framesRefresh()
      const frameChain = driver.context.frameChain
      assert.strictEqual(frameChain.size, frameElements.length)
      for (const frameIndex in frameElements) {
        assert.strictEqual(
          frameElements[frameIndex].id,
          frameChain.frameAt(frameIndex).element.elementId,
        )
      }
    })

    it('untracked mixed frame chain [(0-1-1)?]', async () => {
      const frameElements = []
      const frameElement1 = await mock.findElement('frame1')
      frameElements.push(frameElement1)
      await mock.switchToFrame(frameElement1)
      const frameElement11 = await mock.findElement('frame1-1')
      frameElements.push(frameElement11)
      await mock.switchToFrame(frameElement11)
      assert.strictEqual(driver.context.frameChain.size, 0)
      await driver.context.framesRefresh()
      const frameChain = driver.context.frameChain
      assert.strictEqual(frameChain.size, frameElements.length)
      for (const frameIndex in frameElements) {
        assert.strictEqual(
          frameElements[frameIndex].id,
          frameChain.frameAt(frameIndex).element.elementId,
        )
      }
    })

    it('partially tracked frame chain [0-2-1-(2)?]', async () => {
      const frameElements = []
      const frameElement2 = await mock.findElement('frame2')
      frameElements.push(frameElement2)
      await driver.context.frame(frameElement2)
      const frameElement1 = await mock.findElement('frame2-1')
      frameElements.push(frameElement1)
      await driver.context.frame(frameElement1)
      const frameElement22 = await mock.findElement('frame2-1-2')
      frameElements.push(frameElement22)
      await mock.switchToFrame(frameElement22)
      assert.strictEqual(driver.context.frameChain.size, 2)
      await driver.context.framesRefresh()
      const frameChain = driver.context.frameChain
      assert.strictEqual(frameChain.size, frameElements.length)
      for (const frameIndex in frameElements) {
        assert.strictEqual(
          frameElements[frameIndex].id,
          frameChain.frameAt(frameIndex).element.elementId,
        )
      }
    })

    it('partially tracked frame chain [(0-2)?-1-2]', async () => {
      const frameElements = []
      const frameElement2 = await mock.findElement('frame2')
      frameElements.push(frameElement2)
      await mock.switchToFrame(frameElement2)
      const frameElement1 = await mock.findElement('frame2-1')
      frameElements.push(frameElement1)
      await driver.context.frame(frameElement1)
      const frameElement22 = await mock.findElement('frame2-1-2')
      frameElements.push(frameElement22)
      await driver.context.frame(frameElement22)
      assert.strictEqual(driver.context.frameChain.size, 2)
      await driver.context.framesRefresh()
      const frameChain = driver.context.frameChain
      assert.strictEqual(frameChain.size, frameElements.length)
      for (const frameIndex in frameElements) {
        assert.strictEqual(
          frameElements[frameIndex].id,
          frameChain.frameAt(frameIndex).element.elementId,
        )
      }
    })

    it('tracked frame chain [0-2-1-2]', async () => {
      const frameElements = []
      const frameElement2 = await mock.findElement('frame2')
      frameElements.push(frameElement2)
      await driver.context.frame(frameElement2)
      const frameElement1 = await mock.findElement('frame2-1')
      frameElements.push(frameElement1)
      await driver.context.frame(frameElement1)
      const frameElement22 = await mock.findElement('frame2-1-2')
      frameElements.push(frameElement22)
      await driver.context.frame(frameElement22)
      assert.strictEqual(driver.context.frameChain.size, frameElements.length)
      await driver.context.framesRefresh()
      const frameChain = driver.context.frameChain
      assert.strictEqual(frameChain.size, frameElements.length)
      for (const frameIndex in frameElements) {
        assert.strictEqual(
          frameElements[frameIndex].id,
          frameChain.frameAt(frameIndex).element.elementId,
        )
      }
    })
  })
})
