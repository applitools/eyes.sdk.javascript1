const takeDomSnapshot = require('../../lib/utils/takeDomSnapshot')
const {expect} = require('chai')
const {Driver: FakeEyesDriver} = require('../utils/FakeSDK')
const MockDriver = require('../utils/MockDriver')
const Logger = require('../../lib/logging/Logger')
const {presult} = require('../../lib/utils/GeneralUtils')

const logger = new Logger(!!process.env.APPLITOOLS_SHOW_LOGS)

describe('takeDomSnapshot', () => {
  let driver, eyesDriver

  beforeEach(async () => {
    driver = new MockDriver()
    eyesDriver = await new FakeEyesDriver(logger, driver).init()
  })

  it('should throw an error if snapshot failed', async () => {
    driver.mockScript('dom-snapshot', function() {
      return JSON.stringify({status: 'ERROR', error: 'some error'})
    })
    const [error] = await presult(takeDomSnapshot(logger, eyesDriver))
    expect(error).not.to.be.undefined
    expect(error.message).to.equal("Error during execute poll script: 'some error'")
  })

  it('should throw an error if timeout is reached', async () => {
    driver.mockScript('dom-snapshot', function() {
      return JSON.stringify({status: 'WIP'})
    })
    const [error] = await presult(takeDomSnapshot(logger, eyesDriver, {executionTimeout: 0}))
    expect(error).not.to.be.undefined
    expect(error.message).to.equal('Poll script execution is timed out')
  })

  it('should take a dom snapshot', async () => {
    driver.mockScript('dom-snapshot', function() {
      return generateSnapshotResponse({
        cdt: 'cdt',
        resourceUrls: 'resourceUrls',
        blobs: [],
        frames: [],
      })
    })
    const actualSnapshot = await takeDomSnapshot(logger, eyesDriver)
    expect(actualSnapshot).to.eql({
      cdt: 'cdt',
      frames: [],
      resourceContents: {},
      resourceUrls: 'resourceUrls',
      frames: [],
      srcAttr: null,
      scriptVersion: 'mock value',
    })
  })

  it('should take a dom snapshot with cross origin frames', async () => {
    driver.mockScript('dom-snapshot', function() {
      return this.name === '[data-applitools-selector="123"]'
        ? generateSnapshotResponse({cdt: 'frame-cdt'})
        : generateSnapshotResponse({crossFramesSelectors: ['[data-applitools-selector="123"]']})
    })
    driver.mockElements([
      {
        selector: '[data-applitools-selector="123"]',
        frame: true,
      },
    ])
    const snapshot = await takeDomSnapshot(logger, eyesDriver)
    expect(snapshot).to.eql({
      cdt: [],
      resourceContents: {},
      resourceUrls: [],
      scriptVersion: 'mock value',
      srcAttr: null,
      frames: [
        {
          cdt: 'frame-cdt',
          frames: [],
          resourceContents: {},
          resourceUrls: [],
          scriptVersion: 'mock value',
          srcAttr: null,
        },
      ],
    })
  })

  it('should take a dom snapshot ith nested cross origin frames', async () => {
    driver.mockElements([
      {
        selector: '[data-applitools-selector="123"]',
        frame: true,
        children: [
          {
            selector: '[data-applitools-selector="456"]',
            frame: true,
          },
        ],
      },
    ])

    driver.mockScript('dom-snapshot', function() {
      switch (this.name) {
        case '[data-applitools-selector="123"]':
          return generateSnapshotResponse({
            cdt: 'frame',
            crossFramesSelectors: ['[data-applitools-selector="456"]'],
          })
        case '[data-applitools-selector="456"]':
          return generateSnapshotResponse({cdt: 'nested frame'})
        default:
          return generateSnapshotResponse({
            cdt: 'top page',
            crossFramesSelectors: ['[data-applitools-selector="123"]'],
          })
      }
    })

    const snapshot = await takeDomSnapshot(logger, eyesDriver)
    expect(snapshot).to.eql({
      cdt: 'top page',
      frames: [
        {
          cdt: 'frame',
          frames: [
            {
              cdt: 'nested frame',
              frames: [],
              resourceContents: {},
              resourceUrls: [],
              scriptVersion: 'mock value',
              srcAttr: null,
            },
          ],
          resourceContents: {},
          resourceUrls: [],
          scriptVersion: 'mock value',
          srcAttr: null,
        },
      ],
      resourceContents: {},
      resourceUrls: [],
      scriptVersion: 'mock value',
      srcAttr: null,
    })
  })

  it('should take a dom snapshot with nested frames containing cross origin frames', async () => {
    driver.mockElements([
      {
        selector: '[data-applitools-selector="123"]',
        frame: true,
        children: [
          {
            selector: '[data-applitools-selector="456"]',
            frame: true,
          },
        ],
      },
    ])

    driver.mockScript('dom-snapshot', function() {
      switch (this.name) {
        case '[data-applitools-selector="456"]':
          return generateSnapshotResponse({
            cdt: 'nested frame',
            selector: '[data-applitools-selector="456"]',
          })
        default:
          return generateSnapshotResponse({
            cdt: 'top page',
            frames: [
              generateSnapshotObject({
                cdt: 'frame',
                selector: '[data-applitools-selector="123"]',
                crossFramesSelectors: ['[data-applitools-selector="456"]'],
              }),
            ],
          })
      }
    })

    const snapshot = await takeDomSnapshot(logger, eyesDriver)
    expect(snapshot).to.eql({
      cdt: 'top page',
      frames: [
        {
          cdt: 'frame',
          frames: [
            {
              cdt: 'nested frame',
              frames: [],
              resourceContents: {},
              resourceUrls: [],
              scriptVersion: 'mock value',
              srcAttr: null,
            },
          ],
          resourceContents: {},
          resourceUrls: [],
          scriptVersion: 'mock value',
          srcAttr: null,
        },
      ],
      resourceContents: {},
      resourceUrls: [],
      scriptVersion: 'mock value',
      srcAttr: null,
    })
  })

  it('should handle failure to switch to frame', async () => {
    driver.mockElements([
      {
        selector: '[data-applitools-selector="123"]',
      },
    ])
    driver.mockScript('dom-snapshot', function() {
      return generateSnapshotResponse({
        cdt: 'top frame',
        crossFramesSelectors: ['[data-applitools-selector="123"]'],
      })
    })

    const snapshot = await takeDomSnapshot(logger, eyesDriver)
    expect(snapshot.frames).to.deep.equal([])
  })

  it('should handle failure to switch to nested frame', async () => {
    driver.mockElements([
      {
        selector: '[data-applitools-selector="123"]',
        frame: true,
        children: [
          {
            selector: '[data-applitools-selector="456"]',
          },
        ],
      },
    ])
    driver.mockScript('dom-snapshot', function() {
      switch (this.name) {
        case '[data-applitools-selector="123"]':
          return generateSnapshotResponse({
            cdt: 'inner parent frame',
            crossFramesSelectors: ['[data-applitools-selector="456"]'],
          })
        default:
          return generateSnapshotResponse({
            cdt: 'top frame',
            crossFramesSelectors: ['[data-applitools-selector="123"]'],
          })
      }
    })

    const snapshot = await takeDomSnapshot(logger, eyesDriver)
    expect(snapshot.frames).to.deep.equal([
      {
        cdt: 'inner parent frame',
        resourceContents: {},
        resourceUrls: [],
        frames: [],
        scriptVersion: 'mock value',
        srcAttr: null,
      },
    ])
  })
})

function generateSnapshotResponse(overrides) {
  return JSON.stringify({status: 'SUCCESS', value: generateSnapshotObject(overrides)})
}

function generateSnapshotObject(overrides) {
  return {
    cdt: [],
    srcAttr: null,
    resourceUrls: [],
    blobs: [],
    frames: [],
    crossFramesSelectors: undefined,
    scriptVersion: 'mock value',
    ...overrides,
  }
}
