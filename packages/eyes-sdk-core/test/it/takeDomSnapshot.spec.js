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
    driver.mockElements([
      {
        selector: '[data-applitools-selector="123"]',
        frame: true,
      },
    ])
    driver.mockScript('dom-snapshot', function() {
      return this.name === '[data-applitools-selector="123"]'
        ? generateSnapshotResponse({cdt: 'frame-cdt', url: 'http://cors.com'})
        : generateSnapshotResponse({
            cdt: [{nodeName: 'IFRAME', attributes: []}],
            crossFrames: [{selector: '[data-applitools-selector="123"]', index: 0}],
          })
    })
    const snapshot = await takeDomSnapshot(logger, eyesDriver)
    expect(snapshot).to.eql({
      cdt: [
        {nodeName: 'IFRAME', attributes: [{name: 'data-applitools-src', value: 'http://cors.com'}]},
      ],
      resourceContents: {},
      resourceUrls: [],
      scriptVersion: 'mock value',
      srcAttr: null,
      frames: [
        {
          cdt: 'frame-cdt',
          frames: [],
          url: 'http://cors.com',
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
            cdt: [{nodeName: 'IFRAME', attributes: []}],
            url: 'http://cors.com',
            crossFrames: [{selector: '[data-applitools-selector="456"]', index: 0}],
          })
        case '[data-applitools-selector="456"]':
          return generateSnapshotResponse({
            cdt: 'nested frame',
            url: 'http://cors-2.com',
          })
        default:
          return generateSnapshotResponse({
            cdt: [{nodeName: 'IFRAME', attributes: []}],
            crossFrames: [{selector: '[data-applitools-selector="123"]', index: 0}],
          })
      }
    })

    const snapshot = await takeDomSnapshot(logger, eyesDriver)
    expect(snapshot).to.eql({
      cdt: [
        {nodeName: 'IFRAME', attributes: [{name: 'data-applitools-src', value: 'http://cors.com'}]},
      ],
      frames: [
        {
          cdt: [
            {
              nodeName: 'IFRAME',
              attributes: [{name: 'data-applitools-src', value: 'http://cors-2.com'}],
            },
          ],
          frames: [
            {
              cdt: 'nested frame',
              frames: [],
              url: 'http://cors-2.com',
              resourceContents: {},
              resourceUrls: [],
              scriptVersion: 'mock value',
              srcAttr: null,
            },
          ],
          url: 'http://cors.com',
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
            url: 'http://cors.com',
            selector: '[data-applitools-selector="456"]',
          })
        default:
          return generateSnapshotResponse({
            cdt: 'top page',
            frames: [
              generateSnapshotObject({
                cdt: [{nodeName: 'IFRAME', attributes: []}],
                selector: '[data-applitools-selector="123"]',
                crossFrames: [{selector: '[data-applitools-selector="456"]', index: 0}],
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
          cdt: [
            {
              nodeName: 'IFRAME',
              attributes: [{name: 'data-applitools-src', value: 'http://cors.com'}],
            },
          ],
          frames: [
            {
              cdt: 'nested frame',
              url: 'http://cors.com',
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
        crossFrames: [{selector: '[data-applitools-selector="123"]', index: 0}],
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
        isCORS: true,
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
            crossFrames: [{selector: '[data-applitools-selector="456"]', index: 0}],
          })
        default:
          return generateSnapshotResponse({
            cdt: [{nodeName: 'IFRAME', attributes: []}],
            crossFrames: [{selector: '[data-applitools-selector="123"]', index: 0}],
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

  it('should add data-applitools-src to the cors frame cdt node', async () => {
    driver.mockElements([
      {
        name: 'cors-frame',
        selector: '[data-applitools-selector="1"]',
        frame: true,
        isCORS: true,
      },
    ])
    driver.mockScript('dom-snapshot', function() {
      switch (this.name) {
        case 'cors-frame':
          return generateSnapshotResponse({
            cdt: 'cors frame',
            url: 'http://cors.com',
          })
        default:
          return generateSnapshotResponse({
            cdt: [{nodeName: 'IFRAME', attributes: []}],
            crossFrames: [{selector: '[data-applitools-selector="1"]', index: 0}],
          })
      }
    })

    const {cdt} = await takeDomSnapshot(logger, eyesDriver)
    expect(cdt).to.deep.equal([
      {nodeName: 'IFRAME', attributes: [{name: 'data-applitools-src', value: 'http://cors.com'}]},
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
    crossFrames: undefined,
    scriptVersion: 'mock value',
    ...overrides,
  }
}
