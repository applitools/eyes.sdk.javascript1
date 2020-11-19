'use strict'
const {describe, it, before, after, beforeEach, afterEach} = require('mocha')
const {expect} = require('chai')
const makeRenderingGridClient = require('../../src/sdk/renderingGridClient')
const FakeEyesWrapper = require('../util/FakeEyesWrapper')
const FakeRunningRender = require('../util/FakeRunningRender')
const createFakeWrapper = require('../util/createFakeWrapper')
const testServer = require('@applitools/sdk-shared/src/run-test-server')
const {loadJsonFixture, loadFixtureBuffer} = require('../util/loadFixture')
const {failMsg} = require('../../src/sdk/waitForRenderedStatus')
const {promisify: p} = require('util')
const nock = require('nock')
const psetTimeout = p(setTimeout)
const {presult} = require('@applitools/functional-commons')
const {
  RenderStatus,
  RenderStatusResults,
  Region,
  IgnoreRegionByRectangle,
  FloatingRegionByRectangle,
  AccessibilityRegionByRectangle,
  TestResults,
} = require('@applitools/eyes-sdk-core')
const {
  apiKeyFailMsg,
  authorizationErrMsg,
  appNameFailMsg,
  blockedAccountErrMsg,
  badRequestErrMsg,
} = require('../../src/sdk/wrapperUtils')

describe('openEyes', () => {
  let baseUrl, closeServer, openEyes, prevEnv, APPLITOOLS_SHOW_LOGS
  let wrapper
  const apiKey = 'some api key'
  const appName = 'some app name'

  before(async () => {
    const server = await testServer({port: 3454}) // TODO fixed port avoids 'need-more-resources' for dom. Is this desired? should both paths be tested?
    baseUrl = `http://localhost:${server.port}`
    closeServer = server.close
  })

  after(async () => {
    await closeServer()
  })

  beforeEach(() => {
    APPLITOOLS_SHOW_LOGS = process.env.APPLITOOLS_SHOW_LOGS
    prevEnv = process.env
    process.env = {}

    wrapper = createFakeWrapper(baseUrl)
    openEyes = makeRenderingGridClient({
      testConcurrency: 10,
      showLogs: APPLITOOLS_SHOW_LOGS,
      apiKey,
      renderWrapper: wrapper,
      fetchResourceTimeout: 2000,
      // logger: console,
    }).openEyes

    nock(wrapper.baseUrl)
      .persist()
      .post(wrapper.resultsRoute)
      .reply(201, (_url, body) => body, {
        location: (_req, _res, body) => body,
      })
  })

  afterEach(() => {
    process.env = prevEnv
  })

  it('passes with correct dom', async () => {
    const {checkWindow, close} = await openEyes({
      wrappers: [wrapper],
      appName,
    })

    const resourceUrls = wrapper.goodResourceUrls
    const cdt = loadJsonFixture('test.cdt.json')
    checkWindow({snapshot: {resourceUrls, cdt}, tag: 'good1', url: `${baseUrl}/test.html`})
    expect((await close())[0].getStepsInfo().map(r => r.result.getAsExpected())).to.eql([true])
  })

  it('fails with incorrect dom', async () => {
    const {checkWindow, close} = await openEyes({
      wrappers: [wrapper],
      appName,
    })
    const resourceUrls = [`${baseUrl}/smurfs.jpg`, `${baseUrl}/test.css`]
    const cdt = loadJsonFixture('test.cdt.json')
    cdt.find(node => node.nodeValue === "hi, I'm red").nodeValue = "hi, I'm green"

    checkWindow({snapshot: {resourceUrls, cdt}, tag: 'good1', url: `${baseUrl}/test.html`})
    const result = (await presult(close()))[0]
    expect(result[0].message).to.equal('mismatch')
  })

  it('renders multiple viewport sizes', async () => {
    const {checkWindow, close} = await openEyes({
      wrappers: [
        createFakeWrapper(baseUrl),
        createFakeWrapper(baseUrl),
        createFakeWrapper(baseUrl),
      ],
      browser: [
        {width: 320, height: 480},
        {width: 640, height: 768},
        {width: 1600, height: 900},
      ],
      appName,
    })

    const resourceUrls = wrapper.goodResourceUrls
    const cdt = loadJsonFixture('test.cdt.json')
    checkWindow({snapshot: {resourceUrls, cdt}, tag: 'good1', url: `${baseUrl}/test.html`})
    expect(
      (await close()).map(wrapperResult =>
        wrapperResult.getStepsInfo().map(r2 => r2.result.getAsExpected()),
      ),
    ).to.eql([[true], [true], [true]])
  })

  it('handles `batchName`, `batchId` and `batchSequence` param', async () => {
    const batchSequence = `some batch sequence ${Date.now()}`
    const batchName = `some batch name ${Date.now()}`
    const batchId = `some batch ID ${Date.now()}`
    await openEyes({
      wrappers: [wrapper],
      batchSequence,
      batchName,
      batchId,
      appName,
    })

    expect(wrapper.getBatch().getSequenceName()).to.equal(batchSequence)
    expect(wrapper.getBatch().getName()).to.equal(batchName)
    expect(wrapper.getBatch().getId()).to.equal(batchId)
  })

  it('sets batch isGeneratedId property', async () => {
    await openEyes({wrappers: [wrapper], appName})
    const batch = wrapper.getBatch()
    expect(batch.getIsGeneratedId()).to.be.true

    await openEyes({wrappers: [wrapper], appName, batchId: `batchId_${Date.now()}`})
    const userSetBatch = wrapper.getBatch()
    expect(userSetBatch.getIsGeneratedId()).to.be.false
  })

  it('sets batch properties passed to makeRenderingGridClient', async () => {
    const now = Date.now()
    const batchId = `batchId_${now}`
    const batchName = `batchName_${now}`
    const batchSequence = `batchSequence_${now}`

    openEyes = makeRenderingGridClient({
      testConcurrency: 500,
      showLogs: APPLITOOLS_SHOW_LOGS,
      apiKey,
      renderWrapper: wrapper,
      fetchResourceTimeout: 2000,
      // logger: console,

      // These are the properties that are relevant for the tests:
      batchId,
      batchName,
      batchSequence,
      batchNotify: true,
    }).openEyes

    await openEyes({wrappers: [wrapper], appName})
    const batch = wrapper.getBatch()
    expect(batch.getIsGeneratedId()).to.be.false
    expect(batch.getId()).to.equal(batchId)
    expect(batch.getName()).to.equal(batchName)
    expect(batch.getSequenceName()).to.equal(batchSequence)
    expect(batch.getNotifyOnCompletion()).to.be.true
  })

  it("doesn't create race condition on batch object", async () => {
    const wrapper1 = createFakeWrapper(baseUrl)
    const wrapper2 = createFakeWrapper(baseUrl)

    await openEyes({appName, wrappers: [wrapper1], batchId: 'batch 1'})
    await openEyes({appName, wrappers: [wrapper2], batchId: 'batch 2'})
    const batch1 = wrapper1.getBatch()
    const batch2 = wrapper2.getBatch()

    expect(batch1.getId()).to.equal('batch 1')
    expect(batch2.getId()).to.equal('batch 2')
  })

  it('renders the correct target', async () => {
    const {checkWindow, close} = await openEyes({
      wrappers: [wrapper],
      browser: {width: 320, height: 480},
      appName,
    })

    const resourceUrls = wrapper.goodResourceUrls
    const cdt = loadJsonFixture('test.cdt.json')
    checkWindow({
      snapshot: {resourceUrls, cdt},
      tag: 'good1',
      target: 'some target',
      url: `${baseUrl}/test.html`,
    })
    expect((await close())[0].getStepsInfo().map(r => r.result.getAsExpected())).to.eql([true])
  })

  it('runs matchWindow in the correct order', async () => {
    const wrapper1 = new FakeEyesWrapper({goodFilename: 'test.cdt.json', goodResourceUrls: []})
    const wrapper2 = new FakeEyesWrapper({goodFilename: 'test.cdt.json', goodResourceUrls: []})

    wrapper1.checkWindow = async function({tag}) {
      if (tag === 'one') {
        await psetTimeout(200)
      } else if (tag === 'two') {
        await psetTimeout(50)
      }
      this.results.push(`${tag}1`)
    }

    wrapper2.checkWindow = async function({tag}) {
      if (tag === 'one') {
        await psetTimeout(150)
      } else if (tag === 'two') {
        await psetTimeout(150)
      }
      this.results.push(`${tag}2`)
    }

    wrapper1.close = wrapper2.close = async function() {
      return wrapper2.resultsToTestResults(this.results)
    }

    const {checkWindow, close} = await openEyes({
      wrappers: [wrapper1, wrapper2],
      browser: [
        {width: 320, height: 480},
        {width: 640, height: 768},
      ],
      appName,
    })

    const resourceUrls = wrapper.goodResourceUrls
    const cdt = loadJsonFixture('test.cdt.json')
    checkWindow({snapshot: {resourceUrls, cdt}, tag: 'one', url: `${baseUrl}/test.html`})
    checkWindow({snapshot: {resourceUrls, cdt}, tag: 'two', url: `${baseUrl}/test.html`})
    checkWindow({snapshot: {resourceUrls, cdt}, tag: 'three', url: `${baseUrl}/test.html`})
    expect((await close()).map(r => r.getStepsInfo().map(s => s.result))).to.eql([
      ['one1', 'two1', 'three1'],
      ['one2', 'two2', 'three2'],
    ])
  })

  it('handles resourceContents in checkWindow', async () => {
    const {checkWindow, close} = await openEyes({
      wrappers: [wrapper],
      appName,
    })

    const blobUrl = `${baseUrl}/blob.css`
    const imageUrl = `${baseUrl}/smurfs4.jpg`
    const resourceContents = {
      [blobUrl]: {
        url: blobUrl,
        type: 'text/css',
        value: loadFixtureBuffer('blob.css'),
      },
      [imageUrl]: {
        url: imageUrl,
        type: 'image/jpeg',
        value: loadFixtureBuffer('smurfs.jpg'),
      },
    }

    wrapper.goodResourceUrls = [blobUrl, imageUrl]

    checkWindow({snapshot: {cdt: [], resourceContents}, tag: 'good1', url: `${baseUrl}/test.html`})
    expect((await close())[0].getStepsInfo().map(r => r.result.getAsExpected())).to.eql([true])
  })

  it('handles "selector" region', async () => {
    const {checkWindow, close} = await openEyes({
      wrappers: [wrapper],
      appName,
    })

    checkWindow({snapshot: {cdt: []}, url: 'some url', selector: '.some selector'})
    expect((await close())[0].getStepsInfo().map(r => r.result.getAsExpected())).to.eql([true])
  })

  it('handles "region" target', async () => {
    const {checkWindow, close} = await openEyes({
      wrappers: [wrapper],
      appName,
    })

    checkWindow({
      snapshot: {cdt: []},
      url: 'some url',
      region: {width: 1, height: 2, left: 3, top: 4},
      target: 'region',
    })
    expect((await close())[0].getStepsInfo().map(r => r.result.getAsExpected())).to.eql([true])
  })

  it('renders the correct browser', async () => {
    const {checkWindow, close} = await openEyes({
      wrappers: [wrapper],
      browser: {width: 320, height: 480, name: 'firefox'},
      url: `${baseUrl}/test.html`,
      appName,
    })

    const resourceUrls = wrapper.goodResourceUrls
    const cdt = loadJsonFixture('test.cdt.json')
    checkWindow({
      snapshot: {resourceUrls, cdt},
      tag: 'good1',
      sizeMode: 'some size mode',
      url: `${baseUrl}/test.html`,
    })
    await close()
    expect(await wrapper.getAppEnvironment().hostingApp).to.equal('firefox')
  })

  it('throws error on empty browser', async () => {
    const [err] = await presult(
      openEyes({
        wrappers: [wrapper],
        url: `${baseUrl}/test.html`,
        appName,
        browser: [],
      }),
    )
    expect(err.message).to.equal('invalid browser configuration provided.')
  })

  it('throws error on invalid browser name', async () => {
    const [err] = await presult(
      openEyes({
        wrappers: [wrapper],
        browser: {width: 320, height: 480, name: 'firefox-1'},
        url: `${baseUrl}/test.html`,
        appName,
      }),
    )
    expect(err.message).to.equal(
      `browser name should be one of the following:
* chrome
* chrome-canary
* firefox
* ie10
* ie11
* edgechromium
* edgelegacy
* ie
* safari
* chrome-one-version-back
* chrome-two-versions-back
* firefox-one-version-back
* firefox-two-versions-back
* safari-one-version-back
* safari-two-versions-back
* edgechromium-one-version-back
* edgechromium-two-versions-back

Received: 'firefox-1'.`,
    )
  })

  it('allows edgelegacy and edgechromium', async () => {
    const [noErr] = await presult(
      openEyes({
        wrappers: [wrapper],
        browser: [
          {width: 320, height: 480, name: 'edgelegacy'},
          {width: 320, height: 480, name: 'edgechromium'},
        ],
        url: `${baseUrl}/test.html`,
        appName,
      }),
    )
    expect(noErr).to.be.undefined
  })

  it('throws error on browser with no size', async () => {
    const [err] = await presult(
      openEyes({
        wrappers: [wrapper],
        browser: {width: 320, name: 'firefox'},
        url: `${baseUrl}/test.html`,
        appName,
      }),
    )
    expect(err.message).to.equal(
      `browser 'firefox' should include 'height' and 'width' parameters.`,
    )
  })

  it("throws error on emulationInfo for browser that's not chrome", async () => {
    const [errForMobile] = await presult(
      openEyes({
        wrappers: [wrapper],
        browser: {width: 320, height: 400, mobile: true, name: 'firefox'},
        url: `${baseUrl}/test.html`,
        appName,
      }),
    )
    expect(errForMobile.message).to.equal(
      `browser 'firefox' does not support mobile device emulation. Please remove 'mobile:true' or 'deviceName' from the browser configuration`,
    )

    const [errForDeviceName] = await presult(
      openEyes({
        wrappers: [wrapper],
        browser: {deviceName: 'iPhone X', name: 'firefox'},
        url: `${baseUrl}/test.html`,
        appName,
      }),
    )
    expect(errForDeviceName.message).to.equal(
      `browser 'firefox' does not support mobile device emulation. Please remove 'mobile:true' or 'deviceName' from the browser configuration`,
    )

    const [noErr] = await presult(
      openEyes({
        wrappers: [wrapper],
        browser: [
          {deviceName: 'iPhone X', name: 'chrome-one-version-back'},
          {deviceName: 'iPhone X', name: 'chrome-two-versions-back'},
          {deviceName: 'iPhone X', name: 'chrome-canary'},
        ],
        url: `${baseUrl}/test.html`,
        appName,
      }),
    )
    expect(noErr).to.be.undefined

    const [noErrForMissingBrowserName] = await presult(
      openEyes({
        wrappers: [wrapper],
        browser: {deviceName: 'iPhone X'},
        url: `${baseUrl}/test.html`,
        appName,
      }),
    )
    expect(noErrForMissingBrowserName).to.be.undefined
  })

  it('doesnt throw when browser is emulated', async () => {
    const [err] = await presult(
      openEyes({
        wrappers: [wrapper],
        browser: {
          deviceName: 'iPhone X',
          screenOrientation: 'landscape',
          name: 'chrome',
        },
        url: `${baseUrl}/test.html`,
        appName,
      }),
    )
    expect(err).to.equal(undefined)
  })

  it('openEyes handles error during getRenderInfo', async () => {
    wrapper.getRenderInfo = async () => {
      await psetTimeout(0)
      throw new Error('getRenderInfo')
    }

    openEyes = makeRenderingGridClient({
      testConcurrency: 500,
      showLogs: APPLITOOLS_SHOW_LOGS,
      apiKey,
      renderWrapper: wrapper,
    }).openEyes

    await psetTimeout(50)

    const [error] = await presult(
      openEyes({
        wrappers: [wrapper],
        appName,
      }),
    )
    expect(error.message).to.equal('getRenderInfo')
  })

  it('openEyes handles authorization error during getRenderInfo', async () => {
    wrapper.getRenderInfo = async () => {
      await psetTimeout(0)
      const err = new Error('')
      err.response = {status: 401}
      throw err
    }

    openEyes = makeRenderingGridClient({
      testConcurrency: 500,
      showLogs: APPLITOOLS_SHOW_LOGS,
      apiKey,
      renderWrapper: wrapper,
    }).openEyes

    await psetTimeout(50)

    const [error] = await presult(
      openEyes({
        wrappers: [wrapper],
        appName,
      }),
    )
    expect(error.message).to.equal(authorizationErrMsg)
  })

  it('openEyes handles blocked account error during getRenderInfo', async () => {
    wrapper.getRenderInfo = async () => {
      await psetTimeout(0)
      const err = new Error('')
      err.response = {status: 403}
      throw err
    }

    openEyes = makeRenderingGridClient({
      showLogs: APPLITOOLS_SHOW_LOGS,
      apiKey,
      renderWrapper: wrapper,
    }).openEyes

    await psetTimeout(50)

    const [error] = await presult(
      openEyes({
        wrappers: [wrapper],
        appName,
      }),
    )
    expect(error.message).to.equal(blockedAccountErrMsg)
  })

  it('openEyes handles blocked account error during getRenderInfo', async () => {
    wrapper.getRenderInfo = async () => {
      await psetTimeout(0)
      const err = new Error('')
      err.response = {status: 400}
      throw err
    }

    openEyes = makeRenderingGridClient({
      showLogs: APPLITOOLS_SHOW_LOGS,
      apiKey,
      renderWrapper: wrapper,
    }).openEyes

    await psetTimeout(50)

    const [error] = await presult(
      openEyes({
        wrappers: [wrapper],
        appName,
      }),
    )
    expect(error.message).to.equal(badRequestErrMsg)
  })

  it('openEyes handles missing appName', async () => {
    const [error] = await presult(openEyes({wrappers: [wrapper], apiKey}))
    expect(error.message).to.equal(appNameFailMsg)
  })

  it('handles error during rendering', async () => {
    let error
    wrapper.renderBatch = async () => {
      throw new Error('renderBatch')
    }
    openEyes = makeRenderingGridClient({
      showLogs: APPLITOOLS_SHOW_LOGS,
      apiKey,
      renderWrapper: wrapper,
    }).openEyes
    const {checkWindow, close} = await openEyes({
      wrappers: [wrapper],
      url: `bla`,
      appName,
    })

    checkWindow({snapshot: {resourceUrls: [], cdt: []}, url: `bla`})
    await psetTimeout(0)
    checkWindow({snapshot: {resourceUrls: [], cdt: []}, url: `bla`})
    error = await close().then(
      x => x,
      err => err,
    )
    expect(error[0].message).to.equal('renderBatch')
  })

  it('handles error during checkWindow', async () => {
    let error
    wrapper.checkWindow = async () => {
      throw new Error('checkWindow')
    }
    const {checkWindow, close} = await openEyes({
      wrappers: [wrapper],
      appName,
    })

    checkWindow({snapshot: {resourceUrls: [], cdt: []}, url: `bla`})
    await psetTimeout(0)
    checkWindow({snapshot: {resourceUrls: [], cdt: []}, url: `bla`})
    error = await close().then(
      x => x,
      err => err,
    )
    expect(error[0].message).to.equal('checkWindow')
  })

  it('throws error during close', async () => {
    let error
    wrapper.close = async () => {
      await psetTimeout(0)
      throw new Error('close')
    }
    const {close} = await openEyes({
      wrappers: [wrapper],
      appName,
    })

    error = await close().then(
      x => x,
      err => err,
    )
    expect(error[0].message).to.equal('close')
  })

  describe('concurrency', () => {
    it('runs open/close with max concurrency', async () => {
      const wrapper1 = createFakeWrapper(baseUrl)
      const wrapper2 = createFakeWrapper(baseUrl)
      const wrapper3 = createFakeWrapper(baseUrl)

      let flag
      wrapper3.open = async () => {
        flag = true
      }

      openEyes = makeRenderingGridClient({
        testconcurrency: 2,
        apiKey,
        showLogs: APPLITOOLS_SHOW_LOGS,
        renderWrapper: wrapper,
      }).openEyes

      const {close} = await openEyes({
        wrappers: [wrapper1],
        appName,
      })
      await openEyes({
        wrappers: [wrapper2],
        appName,
      })
      openEyes({
        wrappers: [wrapper3],
        appName,
      })
      expect(flag).to.equal(undefined)
      await close()
      expect(flag).to.equal(true)
    })

    it('ends throat job when close throws', async () => {
      wrapper.close = async () => {
        await psetTimeout(0)
        throw new Error('close')
      }

      openEyes = makeRenderingGridClient({
        testConcurrency: 1,
        apiKey,
        showLogs: APPLITOOLS_SHOW_LOGS,
        renderWrapper: wrapper,
      }).openEyes

      const {close} = await openEyes({
        wrappers: [wrapper],
        appName,
      })
      const err1 = await close().then(
        x => x,
        err => err,
      )
      expect(err1[0].message).to.equal('close')
      const {close: close2} = await Promise.race([
        openEyes({
          wrappers: [wrapper],
          appName,
        }),
        psetTimeout(100).then(() => ({close: 'not resolved'})),
      ])
      expect(close2).not.to.equal('not resolved')
      const err2 = await close2().then(
        x => x,
        err => err,
      )
      expect(err2[0].message).to.equal('close')
    })

    it('ends throat job when render throws', async () => {
      let count = 0
      const renderBatch = wrapper.renderBatch
      wrapper.renderBatch = async function() {
        await psetTimeout(0)
        if (count++) {
          return renderBatch.apply(this, arguments)
        } else {
          throw new Error('renderBatch')
        }
      }

      openEyes = makeRenderingGridClient({
        testConcurrency: 1,
        apiKey,
        showLogs: APPLITOOLS_SHOW_LOGS,
        renderWrapper: wrapper,
      }).openEyes

      const {checkWindow, close} = await openEyes({
        wrappers: [wrapper],
        appName,
      })
      checkWindow({snapshot: {cdt: []}, url: 'url'})
      const err1 = await close().then(
        x => x,
        err => err,
      )
      expect(err1[0].message).to.equal('renderBatch')
      const {checkWindow: checkWindow2, close: close2} = await Promise.race([
        openEyes({
          wrappers: [wrapper],
          appName,
        }),
        psetTimeout(100).then(() => ({close: 'not resolved'})),
      ])
      expect(close2).not.to.equal('not resolved')
      checkWindow2({snapshot: {cdt: []}, url: 'url'})
      const result2 = await close2().then(
        x => x,
        err => err,
      )
      expect(result2).not.to.be.an.instanceOf(Error)
    })

    it('waits for session to start in order to perform renderings', async () => {
      const wrapper = createFakeWrapper(baseUrl)

      const counters = {
        open: 0,
        session: 0,
        checkWindow: 0,
        render: 0,
      }

      wrapper.open = async () => {
        await psetTimeout(50)
        counters.open++
      }

      wrapper.renderBatch = async () => {
        await psetTimeout(50)
        counters.render++
        return [new FakeRunningRender(`renderId${counters.render}`, RenderStatus.RENDERING)]
      }

      wrapper.getRenderStatus = async () => {
        await psetTimeout(0)
        return [new RenderStatusResults({status: RenderStatus.RENDERED})]
      }

      wrapper.ensureRunningSession = async () => {
        await psetTimeout(50)
        counters.session++
      }

      wrapper.checkWindow = async () => {
        await psetTimeout(50)
        counters.checkWindow++
      }

      wrapper.close = async () => {
        await psetTimeout(0)
        return new TestResults({stepsInfo: [{}]})
      }

      openEyes = makeRenderingGridClient({
        renderTimeout: 0,
        renderJobInfoTimeout: 0,
        putResourcesTimeout: 0,
        testConcurrency: 1,
        apiKey,
        showLogs: APPLITOOLS_SHOW_LOGS,
        renderWrapper: wrapper,
      }).openEyes

      const {checkWindow, close} = await openEyes({
        wrappers: [wrapper],
        appName,
      })

      // t0
      await psetTimeout(0)
      expect(counters.open).to.equal(0)
      await checkWindow({snapshot: {cdt: []}, url: 'url'})
      //t1
      await psetTimeout(55)
      expect(counters.open).to.equal(1)
      expect(counters.session).to.equal(0)
      expect(counters.render).to.equal(0)
      expect(counters.checkWindow).to.equal(0)
      //t2
      await psetTimeout(55)
      expect(counters.open).to.equal(1)
      expect(counters.session).to.equal(1)
      expect(counters.render).to.equal(0)
      expect(counters.checkWindow).to.equal(0)
      //t3
      await psetTimeout(55)
      expect(counters.open).to.equal(1)
      expect(counters.session).to.equal(1)
      expect(counters.render).to.equal(1)
      expect(counters.checkWindow).to.equal(0)
      //t4
      await psetTimeout(200)
      expect(counters.open).to.equal(1)
      expect(counters.session).to.equal(1)
      expect(counters.render).to.equal(1)
      expect(counters.checkWindow).to.equal(1)

      await close()
    })
  })

  describe('max concurrency for render', () => {
    let renderCount
    let renderStatusCount
    let runningStatuses
    beforeEach(() => {
      renderCount = 0
      renderStatusCount = 0
      runningStatuses = []
      wrapper.open = async function() {}
      wrapper.checkWindow = async function() {}
      wrapper.ensureRunningSession = async function() {}
      const renderBatch = wrapper.renderBatch
      wrapper.renderBatch = function(renderRequests) {
        renderCount += renderRequests.length
        runningStatuses = runningStatuses.concat(renderRequests.map(() => RenderStatus.RENDERING))
        return renderBatch.apply(this, arguments)
      }
      wrapper.getRenderStatus = async renderIds => {
        renderStatusCount++
        const statuses = runningStatuses
          .filter(x => !!x)
          .map(
            status =>
              new RenderStatusResults({
                status: status,
                imageLocation: JSON.stringify({isGood: true}),
              }),
          )
        runningStatuses = runningStatuses.map(status =>
          status === RenderStatus.RENDERED ? false : status,
        )

        expect(renderIds.length).to.equal(statuses.length)

        return statuses
      }
      wrapper.close = async () => {
        return new TestResults({stepsInfo: Array(runningStatuses.length).fill({})})
      }
    })

    beforeEach(() => {
      openEyes = makeRenderingGridClient({
        renderJobInfoTimeout: 0,
        putResourcesTimeout: 0,
        renderTimeout: 0,
        testConcurrency: 2,
        apiKey,
        showLogs: APPLITOOLS_SHOW_LOGS,
        renderWrapper: wrapper,
      }).openEyes
    })

    it('runs renders with concurrency', async () => {
      const {checkWindow, close} = await openEyes({
        wrappers: [wrapper],
        appName,
      })
      checkWindow({url: '', snapshot: {cdt: []}, target: null, sizeMode: null})
      await psetTimeout(10)
      expect(renderCount).to.equal(1)
      expect(renderStatusCount).to.equal(0) // still batching initial renderIds for /render-status request

      checkWindow({url: '', snapshot: {cdt: []}, target: null, sizeMode: null})
      await psetTimeout(10)
      expect(renderCount).to.equal(1) // only after render status will be RENDERED, will the second render be sent
      expect(renderStatusCount).to.equal(0) // still batching initial renderIds for /render-status request

      checkWindow({url: '', snapshot: {cdt: []}, target: null, sizeMode: null})
      await psetTimeout(10)
      expect(renderCount).to.equal(1) // only after render status will be RENDERED, will the second render be sent
      expect(renderStatusCount).to.equal(0) // still batching initial renderIds for /render-status request

      await psetTimeout(150)

      expect(renderCount).to.equal(1)
      expect(renderStatusCount).to.equal(1)

      runningStatuses[0] = RenderStatus.RENDERED
      await psetTimeout(600)
      expect(renderCount).to.equal(2)
      expect(renderStatusCount).to.equal(2)

      runningStatuses[1] = RenderStatus.RENDERED
      await psetTimeout(500)
      expect(renderCount).to.equal(3)
      expect(renderStatusCount).to.equal(3)

      runningStatuses[2] = RenderStatus.RENDERED
      await close()
    })

    it('runs renders with concurrency for multiple browsers', async () => {
      const {checkWindow, close} = await openEyes({
        wrappers: [wrapper, wrapper],
        browser: [
          {width: 1, height: 1},
          {width: 2, height: 2},
        ],
        appName,
      })

      checkWindow({url: '', snapshot: {cdt: []}, sizeMode: 'aaa'})
      await psetTimeout(10)
      checkWindow({url: '', snapshot: {cdt: []}, sizeMode: 'bbb'})
      await psetTimeout(300)
      expect(renderCount).to.equal(2)

      runningStatuses[0] = RenderStatus.RENDERED
      await psetTimeout(500)
      expect(renderCount).to.equal(3)

      runningStatuses[1] = RenderStatus.RENDERED
      await psetTimeout(500)
      expect(renderCount).to.equal(4)

      runningStatuses[2] = RenderStatus.RENDERED
      runningStatuses[3] = RenderStatus.RENDERED
      await close()
    })

    // TODO (amit): unskip
    it.skip('runs renders with concurrency between open/close', async () => {
      const {checkWindow, close} = await openEyes({
        wrappers: [wrapper],
        appName,
      })

      const {checkWindow: checkWindow2, close: close2} = await openEyes({
        wrappers: [wrapper],
        appName,
      })

      checkWindow({url: '', snapshot: {cdt: []}, sizeMode: null, target: null})
      await psetTimeout(0)

      checkWindow2({url: '', snapshot: {cdt: []}, sizeMode: null, target: null})
      await psetTimeout(0)

      checkWindow({url: '', snapshot: {cdt: []}, sizeMode: null, target: null})
      await psetTimeout(0)

      checkWindow2({url: '', snapshot: {cdt: []}, sizeMode: null, target: null})
      await psetTimeout(0)

      const expected1 = renderCount
      runningStatuses[0] = RenderStatus.RENDERED
      await psetTimeout(600)

      const expected2 = renderCount
      runningStatuses[1] = RenderStatus.RENDERED
      runningStatuses[2] = RenderStatus.RENDERED
      runningStatuses[3] = RenderStatus.RENDERED

      await close()
      await close2()
      expect(expected1).to.equal(2)
      expect(expected2).to.equal(4)
      expect(renderCount).to.equal(4)
    })

    it('resolves render job when error in getRenderStatus happens', async () => {
      openEyes = makeRenderingGridClient({
        renderJobInfoTimeout: 0,
        putResourcesTimeout: 0,
        renderTimeout: 0,
        testConcurrency: 1,
        apiKey,
        showLogs: APPLITOOLS_SHOW_LOGS,
        renderWrapper: wrapper,
      }).openEyes

      const {checkWindow, close} = await openEyes({
        wrappers: [wrapper],
        appName,
      })

      checkWindow({url: '', snapshot: {cdt: []}, selector: '111'})
      await psetTimeout(10)
      expect(renderCount).to.equal(1)
      expect(renderStatusCount).to.equal(0)

      await psetTimeout(150)
      expect(renderStatusCount).to.equal(1)

      checkWindow({url: '', snapshot: {cdt: []}, selector: '222'})
      await psetTimeout(10)
      expect(renderCount).to.equal(1)
      expect(renderStatusCount).to.equal(1)

      runningStatuses[0] = RenderStatus.ERROR
      await psetTimeout(600)
      expect(renderCount).to.equal(2)
      expect(renderStatusCount).to.equal(2)

      const [err] = await presult(close())
      expect(err[0]).to.be.an.instanceOf(Error)
      expect(err[0].message).to.have.string(failMsg())
    })

    it.skip('resolves render job when error in happens while in getRenderStatus (but not because of that specific render)', async () => {
      // TODO
    })
  })

  it('handles render status timeout when second checkWindow starts AFTER timeout of previous checkWindow', async () => {
    wrapper.getRenderStatus = async renderIds => {
      await psetTimeout(0)
      return renderIds.map(_renderId => new RenderStatusResults({status: RenderStatus.RENDERING}))
    }

    openEyes = makeRenderingGridClient({
      showLogs: APPLITOOLS_SHOW_LOGS,
      apiKey,
      renderStatusTimeout: 50,
      renderStatusInterval: 50,
      renderWrapper: wrapper,
    }).openEyes

    const {checkWindow, close} = await openEyes({
      wrappers: [wrapper],
      appName,
    })

    checkWindow({snapshot: {resourceUrls: [], cdt: []}, url: 'bla', tag: 'good1'})
    await psetTimeout(150)
    checkWindow({snapshot: {resourceUrls: [], cdt: []}, url: 'bla', tag: 'good1'})

    const [err3] = await presult(close())
    expect(err3[0].message).to.have.string(failMsg())
  })

  it('handles render status timeout when second checkWindow starts BEFORE timeout of previous checkWindow', async () => {
    wrapper.getRenderStatus = async renderIds => {
      await psetTimeout(0)
      return renderIds.map(_renderId => new RenderStatusResults({status: RenderStatus.RENDERING}))
    }

    openEyes = makeRenderingGridClient({
      showLogs: APPLITOOLS_SHOW_LOGS,
      apiKey,
      renderStatusTimeout: 150,
      renderStatusInterval: 50,
      renderWrapper: wrapper,
    }).openEyes

    const {checkWindow, close} = await openEyes({
      wrappers: [wrapper],
      appName,
    })

    checkWindow({snapshot: {resourceUrls: [], cdt: []}, url: 'bla', tag: 'good1'})
    await psetTimeout(0)
    checkWindow({snapshot: {resourceUrls: [], cdt: []}, url: 'bla', tag: 'good1'})
    await psetTimeout(200)
    const [err3] = await presult(close())
    expect(err3[0].message).have.string(failMsg())
  })

  it('sets configuration on wrappers', async () => {
    const wrappers = [
      createFakeWrapper(baseUrl),
      createFakeWrapper(baseUrl),
      createFakeWrapper(baseUrl),
    ]

    openEyes = makeRenderingGridClient({
      showLogs: APPLITOOLS_SHOW_LOGS,
      apiKey,
      renderWrapper: wrapper,
      serverUrl: 'serverUrl',
      proxy: 'proxy',
      agentId: 'agentId',
    }).openEyes

    await openEyes({
      wrappers,
      url: 'bla',
      appName,
      baselineBranch: 'baselineBranch',
      baselineEnvName: 'baselineEnvName',
      baselineName: 'baselineName',
      envName: 'envName',
      ignoreCaret: 'ignoreCaret',
      isDisabled: false,
      matchLevel: 'matchLevel',
      accessibilitySettings: 'accessibilitySettings',
      parentBranch: 'parentBranch',
      branch: 'branch',
      saveFailedTests: 'saveFailedTests',
      saveNewTests: 'saveNewTests',
      compareWithParentBranch: 'compareWithParentBranch',
      ignoreBaseline: 'ignoreBaseline',
      browser: [{deviceName: 'device1'}, {deviceName: 'device2'}, {}],
      agentId: 'agentId',
      batchNotify: true,
    })

    for (const wrapper of wrappers) {
      expect(wrapper.baselineBranchName).to.equal('baselineBranch')
      expect(wrapper.baselineEnvName).to.equal('baselineEnvName')
      expect(wrapper.baselineName).to.equal('baselineName')
      expect(wrapper.envName).to.equal('envName')
      expect(wrapper.ignoreCaret).to.equal('ignoreCaret')
      expect(wrapper.isDisabled).to.equal(false)
      expect(wrapper.matchLevel).to.equal('matchLevel')
      expect(wrapper.accessibilitySettings).to.equal('accessibilitySettings')
      expect(wrapper.parentBranchName).to.equal('parentBranch')
      expect(wrapper.branchName).to.equal('branch')
      expect(wrapper.proxy).to.equal('proxy')
      expect(wrapper.saveFailedTests).to.equal('saveFailedTests')
      expect(wrapper.saveNewTests).to.equal('saveNewTests')
      expect(wrapper.compareWithParentBranch).to.equal('compareWithParentBranch')
      expect(wrapper.ignoreBaseline).to.equal('ignoreBaseline')
      expect(wrapper.serverUrl).to.equal('serverUrl')
      expect(wrapper.baseAgentId).to.equal('agentId')
      expect(wrapper.batch.getNotifyOnCompletion()).to.be.true
    }

    expect(wrappers[0].deviceInfo).to.equal('device1 (Chrome emulation)')
    expect(wrappers[1].deviceInfo).to.equal('device2 (Chrome emulation)')
    expect(wrappers[2].deviceInfo).to.equal('Desktop')
  })

  it('sets configuration on wrappers in makeRenderingGridClient', async () => {
    const wrappers = [
      createFakeWrapper(baseUrl),
      createFakeWrapper(baseUrl),
      createFakeWrapper(baseUrl),
    ]

    openEyes = makeRenderingGridClient({
      showLogs: APPLITOOLS_SHOW_LOGS,
      apiKey,
      renderWrapper: wrapper,
      serverUrl: 'serverUrl',
      proxy: 'proxy',
      appName,
      baselineBranch: 'baselineBranch',
      baselineEnvName: 'baselineEnvName',
      baselineName: 'baselineName',
      envName: 'envName',
      ignoreCaret: 'ignoreCaret',
      isDisabled: false,
      matchLevel: 'matchLevel',
      accessibilitySettings: 'accessibilitySettings',
      parentBranch: 'parentBranch',
      branch: 'branch',
      saveFailedTests: 'saveFailedTests',
      saveNewTests: 'saveNewTests',
      compareWithParentBranch: 'compareWithParentBranch',
      ignoreBaseline: 'ignoreBaseline',
      browser: [{deviceName: 'device1'}, {deviceName: 'device2'}, {}],
      agentId: 'agentId',
    }).openEyes

    await openEyes({
      wrappers,
      url: 'bla',
    })

    for (const wrapper of wrappers) {
      expect(wrapper.baselineBranchName).to.equal('baselineBranch')
      expect(wrapper.baselineEnvName).to.equal('baselineEnvName')
      expect(wrapper.baselineName).to.equal('baselineName')
      expect(wrapper.envName).to.equal('envName')
      expect(wrapper.ignoreCaret).to.equal('ignoreCaret')
      expect(wrapper.isDisabled).to.equal(false)
      expect(wrapper.matchLevel).to.equal('matchLevel')
      expect(wrapper.accessibilitySettings).to.equal('accessibilitySettings')
      expect(wrapper.parentBranchName).to.equal('parentBranch')
      expect(wrapper.branchName).to.equal('branch')
      expect(wrapper.proxy).to.equal('proxy')
      expect(wrapper.saveFailedTests).to.equal('saveFailedTests')
      expect(wrapper.saveNewTests).to.equal('saveNewTests')
      expect(wrapper.compareWithParentBranch).to.equal('compareWithParentBranch')
      expect(wrapper.ignoreBaseline).to.equal('ignoreBaseline')
      expect(wrapper.serverUrl).to.equal('serverUrl')
      expect(wrapper.baseAgentId).to.equal('agentId')
    }

    expect(wrappers[0].deviceInfo).to.equal('device1 (Chrome emulation)')
    expect(wrappers[1].deviceInfo).to.equal('device2 (Chrome emulation)')
    expect(wrappers[2].deviceInfo).to.equal('Desktop')
  })

  it('sets proxy with username/password wrappers', async () => {
    openEyes = makeRenderingGridClient({
      showLogs: APPLITOOLS_SHOW_LOGS,
      apiKey,
      renderWrapper: wrapper,
      proxy: {uri: 'uri', username: 'user', password: 'pass'},
    }).openEyes

    await openEyes({
      wrappers: [wrapper],
      appName,
    })

    expect(wrapper.proxy).to.eql({uri: 'uri', username: 'user', password: 'pass'})

    openEyes = makeRenderingGridClient({
      showLogs: APPLITOOLS_SHOW_LOGS,
      apiKey,
      renderWrapper: wrapper,
      proxy: null,
    }).openEyes

    await openEyes({
      wrappers: [wrapper],
      appName,
    })

    expect(wrapper.proxy).to.be.null
  })

  it("doesn't do anything when isDisabled", async () => {
    const {checkWindow, close, abort} = await openEyes({
      isDisabled: true,
      wrappers: [{_logger: console}],
    })

    checkWindow({})
    expect(await close()).to.eql([])
    expect(await abort()).to.equal(undefined)
  })

  it('throws missing apiKey msg', async () => {
    try {
      makeRenderingGridClient({}).openEyes
    } catch (err) {
      expect(err.message).to.equal(apiKeyFailMsg)
    }
  })

  it("doesn't init wrapper when isDisabled", async () => {
    const result = await openEyes({isDisabled: true}).then(
      x => x,
      err => err,
    )
    expect(result).not.to.be.instanceof(Error)
  })

  it('handles ignore and accessibility regions', async () => {
    const {checkWindow, close} = await openEyes({
      wrappers: [wrapper],
      appName,
    })
    const region = {left: 1, top: 2, width: 3, height: 4}
    const region2 = {left: 11, top: 22, width: 33, height: 44, accessibilityType: 'LargeText'}
    checkWindow({
      url: '',
      snapshot: {cdt: []},
      ignore: [region],
      accessibility: [region2],
    })
    const [results] = await close()
    const r = results.getStepsInfo()[0].result
    expect(r.getAsExpected()).to.equal(true)
    expect(r.__checkSettings.getIgnoreRegions()).to.eql([
      new IgnoreRegionByRectangle(new Region(region)),
    ])
    expect(r.__checkSettings.getAccessibilityRegions()).to.eql([
      new AccessibilityRegionByRectangle(new Region(region2), region2.accessibilityType),
    ])
  })

  it('handles layout and strict and content regions', async () => {
    const {checkWindow, close} = await openEyes({
      wrappers: [wrapper],
      appName,
    })

    const regionLayout = {left: 1, top: 2, width: 3, height: 4}
    const regionStrict = {left: 10, top: 20, width: 30, height: 40}
    const regionContent = {left: 11, top: 21, width: 31, height: 41}
    checkWindow({
      url: '',
      snapshot: {cdt: []},
      layout: [regionLayout],
      strict: [regionStrict],
      content: [regionContent],
    })
    const [results] = await close()
    const r = results.getStepsInfo()[0].result
    expect(r.getAsExpected()).to.equal(true)
    expect(r.__checkSettings.getLayoutRegions()).to.eql([
      new IgnoreRegionByRectangle(new Region(regionLayout)),
    ])
    expect(r.__checkSettings.getStrictRegions()).to.eql([
      new IgnoreRegionByRectangle(new Region(regionStrict)),
    ])
    expect(r.__checkSettings.getContentRegions()).to.eql([
      new IgnoreRegionByRectangle(new Region(regionContent)),
    ])
  })

  it('handles ignore, layout, content, accessibility and strict regions with selector', async () => {
    const {checkWindow, close} = await openEyes({
      wrappers: [wrapper],
      appName,
    })

    const ignoreSelector1 = {type: 'css', selector: 'sel1'}
    const region1FromStatusResults = FakeEyesWrapper.selectorsToLocations['sel1']
    const region1 = new Region({
      left: region1FromStatusResults.x,
      top: region1FromStatusResults.y,
      width: region1FromStatusResults.width,
      height: region1FromStatusResults.height,
    })

    const layoutSelector1 = {type: 'css', selector: 'sel2'}
    const regionLayout1FromStatusResults = FakeEyesWrapper.selectorsToLocations['sel2']
    const regionLayout1 = new Region({
      left: regionLayout1FromStatusResults.x,
      top: regionLayout1FromStatusResults.y,
      width: regionLayout1FromStatusResults.width,
      height: regionLayout1FromStatusResults.height,
    })

    const strictSelector1 = {type: 'css', selector: 'sel3'}
    const regionStrict1FromStatusResults = FakeEyesWrapper.selectorsToLocations['sel3']
    const regionStrict1 = new Region({
      left: regionStrict1FromStatusResults.x,
      top: regionStrict1FromStatusResults.y,
      width: regionStrict1FromStatusResults.width,
      height: regionStrict1FromStatusResults.height,
    })

    const contentSelector1 = {type: 'css', selector: 'sel9'}
    const regionContent1FromStatusResults = FakeEyesWrapper.selectorsToLocations['sel9']
    const regionContent1 = new Region({
      left: regionContent1FromStatusResults.x,
      top: regionContent1FromStatusResults.y,
      width: regionContent1FromStatusResults.width,
      height: regionContent1FromStatusResults.height,
    })

    const accessibilitySelector1 = {type: 'css', selector: 'sel4', accessibilityType: 'LargeText'}
    const regionAaccessibility1FromStatusResults = FakeEyesWrapper.selectorsToLocations['sel4']
    const regionAccessibility1 = new Region({
      left: regionAaccessibility1FromStatusResults.x,
      top: regionAaccessibility1FromStatusResults.y,
      width: regionAaccessibility1FromStatusResults.width,
      height: regionAaccessibility1FromStatusResults.height,
    })

    const ignoreSelector2 = {type: 'css', selector: 'sel5'}
    const region2FromStatusResults = FakeEyesWrapper.selectorsToLocations['sel5']
    const region2 = new Region({
      left: region2FromStatusResults.x,
      top: region2FromStatusResults.y,
      width: region2FromStatusResults.width,
      height: region2FromStatusResults.height,
    })

    const layoutSelector2 = {type: 'css', selector: 'sel6'}
    const regionLayout2FromStatusResults = FakeEyesWrapper.selectorsToLocations['sel6']
    const regionLayout2 = new Region({
      left: regionLayout2FromStatusResults.x,
      top: regionLayout2FromStatusResults.y,
      width: regionLayout2FromStatusResults.width,
      height: regionLayout2FromStatusResults.height,
    })

    const strictSelector2 = {type: 'css', selector: 'sel7'}
    const regionStrict2FromStatusResults = FakeEyesWrapper.selectorsToLocations['sel7']
    const regionStrict2 = new Region({
      left: regionStrict2FromStatusResults.x,
      top: regionStrict2FromStatusResults.y,
      width: regionStrict2FromStatusResults.width,
      height: regionStrict2FromStatusResults.height,
    })

    const contentSelector2 = {type: 'css', selector: 'sel10'}
    const regionContentFromStatusResults = FakeEyesWrapper.selectorsToLocations['sel10']
    const regionContent2 = new Region({
      left: regionContentFromStatusResults.x,
      top: regionContentFromStatusResults.y,
      width: regionContentFromStatusResults.width,
      height: regionContentFromStatusResults.height,
    })

    const accessibilitySelector2 = {type: 'css', selector: 'sel8', accessibilityType: 'RegularText'}
    const regionAaccessibility2FromStatusResults = FakeEyesWrapper.selectorsToLocations['sel8']
    const regionAccessibility2 = new Region({
      left: regionAaccessibility2FromStatusResults.x,
      top: regionAaccessibility2FromStatusResults.y,
      width: regionAaccessibility2FromStatusResults.width,
      height: regionAaccessibility2FromStatusResults.height,
    })

    checkWindow({
      url: '',
      snapshot: {cdt: []},
      ignore: [ignoreSelector1, ignoreSelector2],
      layout: [layoutSelector1, layoutSelector2],
      strict: [strictSelector1, strictSelector2],
      content: [contentSelector1, contentSelector2],
      accessibility: [accessibilitySelector1, accessibilitySelector2],
    })
    const [results] = await close()
    const r = results.getStepsInfo()[0].result
    expect(r.getAsExpected()).to.equal(true)
    expect(r.__checkSettings.getIgnoreRegions()).to.eql([
      new IgnoreRegionByRectangle(region1),
      new IgnoreRegionByRectangle(region2),
    ])
    expect(r.__checkSettings.getLayoutRegions()).to.eql([
      new IgnoreRegionByRectangle(regionLayout1),
      new IgnoreRegionByRectangle(regionLayout2),
    ])
    expect(r.__checkSettings.getStrictRegions()).to.eql([
      new IgnoreRegionByRectangle(regionStrict1),
      new IgnoreRegionByRectangle(regionStrict2),
    ])
    expect(r.__checkSettings.getContentRegions()).to.eql([
      new IgnoreRegionByRectangle(regionContent1),
      new IgnoreRegionByRectangle(regionContent2),
    ])
    expect(r.__checkSettings.getAccessibilityRegions()).to.eql([
      new AccessibilityRegionByRectangle(regionAccessibility1, 'LargeText'),
      new AccessibilityRegionByRectangle(regionAccessibility2, 'RegularText'),
    ])
  })

  it('handles ignore, layout, content, accessibility and strict regions with selector, when target=region and selector', async () => {
    const {checkWindow, close} = await openEyes({
      wrappers: [wrapper],
      appName,
    })
    const selector = 'sel1'
    const ignoreRegion = {left: 1, top: 2, width: 3, height: 4}
    const layoutRegion = {left: 10, top: 20, width: 30, height: 40}
    const strictRegion = {left: 100, top: 200, width: 300, height: 400}
    const contentRegion = {left: 101, top: 201, width: 301, height: 401}
    const accessibilityRegion = {
      left: 1000,
      top: 2000,
      width: 3000,
      height: 4000,
      accessibilityType: 'LargeText',
    }
    const ignoreSelector = {type: 'css', selector: 'sel2'}
    const layoutSelector = {type: 'css', selector: 'sel1'}
    const strictSelector = {type: 'css', selector: 'sel3'}
    const contentSelector = {type: 'css', selector: 'sel5'}
    const accessibilitySelector = {type: 'css', selector: 'sel4', accessibilityType: 'RegularText'}
    const imageOffset = FakeEyesWrapper.selectorsToLocations[selector]
    const expectedIgnoreSelectorRegion = FakeEyesWrapper.selectorsToLocations['sel2']
    const expectedLayoutSelectorRegion = FakeEyesWrapper.selectorsToLocations['sel1']
    const expectedStrictSelectorRegion = FakeEyesWrapper.selectorsToLocations['sel3']
    const expectedContentSelectorRegion = FakeEyesWrapper.selectorsToLocations['sel5']
    const expectedAccessibilitySelectorRegion = FakeEyesWrapper.selectorsToLocations['sel4']

    checkWindow({
      url: '',
      snapshot: {cdt: []},
      target: 'region',
      selector,
      ignore: [ignoreRegion, ignoreSelector],
      layout: [layoutRegion, layoutSelector],
      strict: [strictRegion, strictSelector],
      content: [contentRegion, contentSelector],
      accessibility: [accessibilityRegion, accessibilitySelector],
    })

    const [results] = await close()
    const r = results.getStepsInfo()[0].result
    expect(r.getAsExpected()).to.equal(true)
    expect(r.__checkSettings.getIgnoreRegions()).to.eql([
      new IgnoreRegionByRectangle(new Region(ignoreRegion)),
      new IgnoreRegionByRectangle(
        new Region({
          left: expectedIgnoreSelectorRegion.x - imageOffset.x,
          top: expectedIgnoreSelectorRegion.y - imageOffset.y,
          width: expectedIgnoreSelectorRegion.width,
          height: expectedIgnoreSelectorRegion.height,
        }),
      ),
    ])
    expect(r.__checkSettings.getLayoutRegions()).to.eql([
      new IgnoreRegionByRectangle(new Region(layoutRegion)),
      new IgnoreRegionByRectangle(
        new Region({
          left: expectedLayoutSelectorRegion.x - imageOffset.x,
          top: expectedLayoutSelectorRegion.y - imageOffset.y,
          width: expectedLayoutSelectorRegion.width,
          height: expectedLayoutSelectorRegion.height,
        }),
      ),
    ])
    expect(r.__checkSettings.getContentRegions()).to.eql([
      new IgnoreRegionByRectangle(new Region(contentRegion)),
      new IgnoreRegionByRectangle(
        new Region({
          left: expectedContentSelectorRegion.x - imageOffset.x,
          top: expectedContentSelectorRegion.y - imageOffset.y,
          width: expectedContentSelectorRegion.width,
          height: expectedContentSelectorRegion.height,
        }),
      ),
    ])
    expect(r.__checkSettings.getStrictRegions()).to.eql([
      new IgnoreRegionByRectangle(new Region(strictRegion)),
      new IgnoreRegionByRectangle(
        new Region({
          left: expectedStrictSelectorRegion.x - imageOffset.x,
          top: expectedStrictSelectorRegion.y - imageOffset.y,
          width: expectedStrictSelectorRegion.width,
          height: expectedStrictSelectorRegion.height,
        }),
      ),
    ])
    expect(r.__checkSettings.getAccessibilityRegions()).to.eql([
      new AccessibilityRegionByRectangle(new Region(accessibilityRegion), 'LargeText'),
      new AccessibilityRegionByRectangle(
        new Region({
          left: expectedAccessibilitySelectorRegion.x - imageOffset.x,
          top: expectedAccessibilitySelectorRegion.y - imageOffset.y,
          width: expectedAccessibilitySelectorRegion.width,
          height: expectedAccessibilitySelectorRegion.height,
        }),
        'RegularText',
      ),
    ])
  })

  it('handles ignore, layout, content, accessibility and strict regions with selector and floating regions with selector, when target=region and selector', async () => {
    const {checkWindow, close} = await openEyes({
      wrappers: [wrapper],
      appName,
    })
    const selector = 'sel1'
    const ignoreRegion = {left: 1, top: 2, width: 3, height: 4}
    const layoutRegion = {left: 10, top: 20, width: 30, height: 40}
    const strictRegion = {left: 100, top: 200, width: 300, height: 400}
    const contentRegion = {left: 101, top: 201, width: 301, height: 401}
    const accessibilityRegion = {
      left: 1000,
      top: 2000,
      width: 3000,
      height: 4000,
      accessibilityType: 'LargeText',
    }
    const ignoreSelector = {type: 'css', selector: 'sel2'}
    const layoutSelector = {type: 'css', selector: 'sel1'}
    const strictSelector = {type: 'css', selector: 'sel3'}
    const contentSelector = {type: 'css', selector: 'sel5'}
    const accessibilitySelector = {type: 'css', selector: 'sel4', accessibilityType: 'RegularText'}
    const imageOffset = FakeEyesWrapper.selectorsToLocations[selector]
    const expectedIgnoreSelectorRegion = FakeEyesWrapper.selectorsToLocations['sel2']
    const expectedLayoutSelectorRegion = FakeEyesWrapper.selectorsToLocations['sel1']
    const expectedStrictSelectorRegion = FakeEyesWrapper.selectorsToLocations['sel3']
    const expectedContentSelectorRegion = FakeEyesWrapper.selectorsToLocations['sel5']
    const expectedAccessibilitySelectorRegion = FakeEyesWrapper.selectorsToLocations['sel4']

    const floatingRegion = {
      left: 10,
      top: 11,
      width: 12,
      height: 13,
      maxUpOffset: 14,
      maxDownOffset: 15,
      maxLeftOffset: 16,
      maxRightOffset: 17,
    }

    const expectedFloatingRegion = FakeEyesWrapper.selectorsToLocations['sel3']
    const floatingSelector = {
      type: 'css',
      selector: 'sel3',
      maxUpOffset: 18,
      maxDownOffset: 19,
      maxLeftOffset: 20,
      maxRightOffset: 21,
    }

    checkWindow({
      url: '',
      snapshot: {cdt: []},
      target: 'region',
      selector,
      ignore: [ignoreRegion, ignoreSelector],
      layout: [layoutRegion, layoutSelector],
      strict: [strictRegion, strictSelector],
      content: [contentRegion, contentSelector],
      accessibility: [accessibilityRegion, accessibilitySelector],
      floating: [floatingRegion, floatingSelector],
    })

    const [results] = await close()
    const r = results.getStepsInfo()[0].result
    expect(r.getAsExpected()).to.equal(true)
    expect(r.__checkSettings.getIgnoreRegions()).to.eql([
      new IgnoreRegionByRectangle(new Region(ignoreRegion)),
      new IgnoreRegionByRectangle(
        new Region({
          left: expectedIgnoreSelectorRegion.x - imageOffset.x,
          top: expectedIgnoreSelectorRegion.y - imageOffset.y,
          width: expectedIgnoreSelectorRegion.width,
          height: expectedIgnoreSelectorRegion.height,
        }),
      ),
    ])
    expect(r.__checkSettings.getLayoutRegions()).to.eql([
      new IgnoreRegionByRectangle(new Region(layoutRegion)),
      new IgnoreRegionByRectangle(
        new Region({
          left: expectedLayoutSelectorRegion.x - imageOffset.x,
          top: expectedLayoutSelectorRegion.y - imageOffset.y,
          width: expectedLayoutSelectorRegion.width,
          height: expectedLayoutSelectorRegion.height,
        }),
      ),
    ])
    expect(r.__checkSettings.getContentRegions()).to.eql([
      new IgnoreRegionByRectangle(new Region(contentRegion)),
      new IgnoreRegionByRectangle(
        new Region({
          left: expectedContentSelectorRegion.x - imageOffset.x,
          top: expectedContentSelectorRegion.y - imageOffset.y,
          width: expectedContentSelectorRegion.width,
          height: expectedContentSelectorRegion.height,
        }),
      ),
    ])
    expect(r.__checkSettings.getStrictRegions()).to.eql([
      new IgnoreRegionByRectangle(new Region(strictRegion)),
      new IgnoreRegionByRectangle(
        new Region({
          left: expectedStrictSelectorRegion.x - imageOffset.x,
          top: expectedStrictSelectorRegion.y - imageOffset.y,
          width: expectedStrictSelectorRegion.width,
          height: expectedStrictSelectorRegion.height,
        }),
      ),
    ])
    expect(r.__checkSettings.getAccessibilityRegions()).to.eql([
      new AccessibilityRegionByRectangle(new Region(accessibilityRegion), 'LargeText'),
      new AccessibilityRegionByRectangle(
        new Region({
          left: expectedAccessibilitySelectorRegion.x - imageOffset.x,
          top: expectedAccessibilitySelectorRegion.y - imageOffset.y,
          width: expectedAccessibilitySelectorRegion.width,
          height: expectedAccessibilitySelectorRegion.height,
        }),
        'RegularText',
      ),
    ])

    expect(r.__checkSettings.getFloatingRegions()).to.eql([
      new FloatingRegionByRectangle(
        new Region(floatingRegion),
        floatingRegion.maxUpOffset,
        floatingRegion.maxDownOffset,
        floatingRegion.maxLeftOffset,
        floatingRegion.maxRightOffset,
      ),
      new FloatingRegionByRectangle(
        new Region({
          left: expectedFloatingRegion.x - imageOffset.x,
          top: expectedFloatingRegion.y - imageOffset.y,
          width: expectedFloatingRegion.width,
          height: expectedFloatingRegion.height,
        }),
        floatingSelector.maxUpOffset,
        floatingSelector.maxDownOffset,
        floatingSelector.maxLeftOffset,
        floatingSelector.maxRightOffset,
      ),
    ])
  })

  it('handles useDom and enablePatterns', async () => {
    const {checkWindow, close} = await openEyes({
      wrappers: [wrapper],
      appName,
    })
    checkWindow({
      url: '',
      snapshot: {cdt: []},
      useDom: true,
      enablePatterns: false,
      ignoreDisplacements: false,
    })
    checkWindow({url: '', snapshot: {cdt: []}})
    const [results] = await close()
    const r = results.getStepsInfo()[0].result
    const r2 = results.getStepsInfo()[1].result
    expect(r.__checkSettings.getUseDom()).to.be.true
    expect(r.__checkSettings.getEnablePatterns()).to.be.false
    expect(r.__checkSettings.getIgnoreDisplacements()).to.be.false
    expect(r2.__checkSettings.getUseDom()).to.be.undefined
    expect(r2.__checkSettings.getEnablePatterns()).to.be.undefined
    expect(r2.__checkSettings.getIgnoreDisplacements()).to.be.undefined
  })

  it('handles abort', async () => {
    const wrapper1 = createFakeWrapper(baseUrl)
    const wrapper2 = createFakeWrapper(baseUrl)
    const {abort} = await openEyes({
      wrappers: [wrapper1, wrapper2],
      browser: [
        {width: 1, height: 2},
        {width: 3, height: 4},
      ],
      appName,
    })

    await abort()
    expect(wrapper1.aborted).to.equal(true)
    expect(wrapper2.aborted).to.equal(true)
  })

  it('handles abort by waiting for checkWindow to end', async () => {
    const wrapper1 = createFakeWrapper(baseUrl)
    const {checkWindow, abort} = await openEyes({
      wrappers: [wrapper1],
      browser: [{width: 1, height: 2}],
      appName,
    })

    let done
    const donePromise = new Promise(res => {
      done = res
      setTimeout(done, 1000)
    })

    let checkEndedAfterAbort = false
    wrapper1.on('checkWindowEnd', () => {
      checkEndedAfterAbort = aborted
      done()
    })
    let aborted = false
    wrapper1.on('aborted', () => {
      aborted = true
    })

    await checkWindow({url: '', snapshot: {cdt: []}})
    await abort()
    await donePromise
    expect(checkEndedAfterAbort).to.be.false
  })

  it('handles abort by waiting for open to end', async () => {
    const wrapper1 = createFakeWrapper(baseUrl)
    wrapper1.checkWindow = () => {
      throw new Error('CHECK_WINDOW NOT WAITING FOR OPEN SINCE THREW ERROR')
    }
    const {checkWindow, abort} = await openEyes({
      wrappers: [wrapper1],
      browser: [{width: 1, height: 2}],
      appName,
    })

    let done
    const donePromise = new Promise(res => {
      done = res
      setTimeout(done, 1000)
    })

    let openEndedAfterAbort = false
    wrapper1.on('openEnd', () => {
      openEndedAfterAbort = aborted
      done()
    })
    let aborted = false
    wrapper1.on('aborted', () => {
      aborted = true
    })

    await checkWindow({url: '', snapshot: {cdt: []}})
    await abort()
    await donePromise
    expect(openEndedAfterAbort).to.be.false
  })

  it('renders deviceEmulation', async () => {
    const deviceName = 'iPhone 4'
    const {checkWindow, close} = await openEyes({
      wrappers: [wrapper],
      browser: {deviceName, screenOrientation: 'bla'},
      appName,
    })

    checkWindow({url: '', snapshot: {cdt: []}})
    const [results] = await close()
    expect(wrapper.getAppEnvironment().displaySize).to.eql(FakeEyesWrapper.devices['iPhone 4'])
    expect(wrapper.getDeviceInfo()).to.equal(`${deviceName} (Chrome emulation)`)
    expect(results.getStepsInfo()[0].result.getAsExpected()).to.equal(true)
  })

  it('renders iosDeviceInfo', async () => {
    const deviceName = 'iPhone 4'
    const iosDeviceInfo = {screenOrientation: 'portrait', version: 'latest', deviceName}
    const {checkWindow, close} = await openEyes({
      wrappers: [wrapper],
      browser: {
        name: 'safari',
        iosDeviceInfo,
      },
      appName,
    })

    checkWindow({url: '', snapshot: {cdt: []}})
    const [results] = await close()
    expect(wrapper.getDeviceInfo()).to.equal(deviceName)
    expect(wrapper.iosDeviceInfo).to.eql(iosDeviceInfo)
    expect(wrapper.getAppEnvironment().displaySize).to.eql(FakeEyesWrapper.devices[deviceName])
    expect(results.getStepsInfo()[0].result.getAsExpected()).to.equal(true)
  })

  it('adds "safari" browser name and "ios" platform if "iosDeviceInfo" is defined', async () => {
    const deviceName = 'iPhone 4'
    const {checkWindow, close} = await openEyes({
      wrappers: [wrapper],
      browser: {
        iosDeviceInfo: {screenOrientation: 'portrait', version: 'latest', deviceName},
      },
      appName,
    })

    checkWindow({url: '', snapshot: {cdt: []}})
    const [results] = await close()
    expect(wrapper.results[0].__browserName).to.equal('safari')
    expect(wrapper.results[0].__platform).to.equal('ios')
    expect(wrapper.getDeviceInfo()).to.equal(deviceName)
    expect(results.getStepsInfo()[0].result.getAsExpected()).to.equal(true)
  })

  it("does't call getRenderInfo on wrapper passed to openEyes", async () => {
    let flag = true
    wrapper.getRenderInfo = async function() {
      await psetTimeout(50)
      flag = false
      return 'bla'
    }

    const p = openEyes({
      wrappers: [wrapper],
      appName,
    })
    await psetTimeout(0)
    expect(flag).to.equal(true)
    expect(wrapper.renderingInfo).not.to.equal('bla')
    await p
  })

  it('handles iframes', async () => {
    const frameUrl = `${baseUrl}/test.html`
    const frames = [
      {
        url: frameUrl,
        cdt: loadJsonFixture('test.cdt.json'),
        resourceUrls: wrapper.goodResourceUrls,
        resourceContents: wrapper.goodResources,
      },
    ]

    const url = `${baseUrl}/inner-frame.html`

    const {checkWindow, close} = await openEyes({
      wrappers: [wrapper],
      appName,
    })
    checkWindow({snapshot: {cdt: [], frames}, url})
    const ttt = await close()
    expect(ttt[0].getStepsInfo().map(r => r.result.getAsExpected())).to.eql([true])
  })

  it('handles empty tests', async () => {
    openEyes = makeRenderingGridClient({
      testConcurrency: 1,
      apiKey,
      showLogs: APPLITOOLS_SHOW_LOGS,
      renderWrapper: wrapper,
    }).openEyes

    const {close} = await openEyes({
      wrappers: [wrapper],
      appName,
    })

    const {close: close2} = await openEyes({
      wrappers: [wrapper],
      appName,
    })

    const promise = presult(close2()).then(([err, result]) => {
      expect(err).to.be.undefined
      expect(result).not.to.be.an.instanceOf(Error)
    })

    await psetTimeout(50)
    const [err, result] = await presult(close())
    expect(err).to.be.undefined
    expect(result).not.to.be.an.instanceOf(Error)
    await promise
  })

  it('sets matchLevel in checkWindow', async () => {
    wrapper.checkWindow = async ({tag, checkSettings}) => {
      await psetTimeout(20)
      if (tag === 2) {
        expect(checkSettings.getMatchLevel()).to.equal('Layout')
      } else {
        expect(wrapper.getMatchLevel()).to.equal('Strict')
      }
      wrapper.setDummyTestResults()
    }
    const {checkWindow, close} = await openEyes({
      wrappers: [wrapper],
      appName,
    })
    checkWindow({tag: 1, snapshot: {cdt: []}, url: ''})
    await psetTimeout(0)
    checkWindow({matchLevel: 'Layout', tag: 2, snapshot: {cdt: []}, url: ''})
    await psetTimeout(0)
    checkWindow({tag: 3, snapshot: {cdt: []}, url: ''})
    await close()
  })

  it('sets matchLevel in checkWindow and override argument to openEyes', async () => {
    wrapper.checkWindow = async ({tag, checkSettings}) => {
      await psetTimeout(20)
      if (tag === 2) {
        expect(checkSettings.getMatchLevel()).to.equal('Layout')
      } else {
        expect(wrapper.getMatchLevel()).to.equal('Content')
      }
      wrapper.setDummyTestResults()
    }
    const {checkWindow, close} = await openEyes({
      wrappers: [wrapper],
      appName,
      matchLevel: 'Content',
    })
    checkWindow({tag: 1, snapshot: {cdt: []}, url: ''})
    await psetTimeout(0)
    checkWindow({matchLevel: 'Layout', tag: 2, snapshot: {cdt: []}, url: ''})
    await psetTimeout(0)
    checkWindow({tag: 3, snapshot: {cdt: []}, url: ''})
    await close()
  })

  it('sets matchLevel in checkWindow and override argument to makeRenderingGridClient', async () => {
    openEyes = makeRenderingGridClient({
      apiKey,
      showLogs: APPLITOOLS_SHOW_LOGS,
      renderWrapper: wrapper,
      matchLevel: 'Content',
    }).openEyes

    wrapper.checkWindow = async ({tag, checkSettings}) => {
      await psetTimeout(20)
      if (tag === 2) {
        expect(checkSettings.getMatchLevel()).to.equal('Layout')
      } else {
        expect(wrapper.getMatchLevel()).to.equal('Content')
      }
      wrapper.setDummyTestResults()
    }
    const {checkWindow, close} = await openEyes({
      apiKey,
      wrappers: [wrapper],
      appName,
    })
    checkWindow({tag: 1, snapshot: {cdt: []}, url: ''})
    await psetTimeout(0)
    checkWindow({matchLevel: 'Layout', tag: 2, snapshot: {cdt: []}, url: ''})
    await psetTimeout(0)
    checkWindow({tag: 3, snapshot: {cdt: []}, url: ''})
    await close()
  })

  it('sets useDom & enablePatterns in makeRenderingGridClient', async () => {
    openEyes = makeRenderingGridClient({
      apiKey,
      showLogs: APPLITOOLS_SHOW_LOGS,
      renderWrapper: wrapper,
      useDom: true,
      enablePatterns: true,
    }).openEyes
    const {close} = await openEyes({
      apiKey,
      wrappers: [wrapper],
      appName,
    })

    expect(wrapper.getUseDom()).to.be.true
    expect(wrapper.getEnablePatterns()).to.be.true
    await close()
  })

  it('has correct default value for useDom & enablePatterns', async () => {
    openEyes = makeRenderingGridClient({
      apiKey,
      showLogs: APPLITOOLS_SHOW_LOGS,
      renderWrapper: wrapper,
    }).openEyes
    const {close} = await openEyes({
      apiKey,
      wrappers: [wrapper],
      appName,
    })

    expect(wrapper.getUseDom()).to.be.undefined
    expect(wrapper.getEnablePatterns()).to.be.undefined
    await close()
  })

  it('has correct values for useDom & enablePatterns', async () => {
    openEyes = makeRenderingGridClient({
      testConcurrency: 500,
      apiKey,
      showLogs: APPLITOOLS_SHOW_LOGS,
      renderWrapper: wrapper,
      useDom: false,
      enablePatterns: false,
    }).openEyes
    const {close} = await openEyes({
      apiKey,
      wrappers: [wrapper],
      appName,
    })

    expect(wrapper.getUseDom()).to.be.false
    expect(wrapper.getEnablePatterns()).to.be.false
    await close()
  })

  it('openEyes overrides useDom & enablePatterns', async () => {
    openEyes = makeRenderingGridClient({
      apiKey,
      showLogs: APPLITOOLS_SHOW_LOGS,
      renderWrapper: wrapper,
      useDom: false,
      enablePatterns: false,
    }).openEyes
    const {close} = await openEyes({
      apiKey,
      wrappers: [wrapper],
      appName,
      useDom: true,
      enablePatterns: true,
    })

    expect(wrapper.getUseDom()).to.be.true
    expect(wrapper.getEnablePatterns()).to.be.true
    await close()
  })

  it('checkWindow overrides openEyes useDom & enablePatterns', async () => {
    openEyes = makeRenderingGridClient({
      apiKey,
      showLogs: APPLITOOLS_SHOW_LOGS,
      renderWrapper: wrapper,
      useDom: false,
      enablePatterns: false,
    }).openEyes
    const {checkWindow, close} = await openEyes({
      apiKey,
      wrappers: [wrapper],
      appName,
      useDom: false,
      enablePatterns: false,
    })

    let done
    const donePromise = new Promise(res => {
      done = res
      setTimeout(done, 1000)
    })
    wrapper.on('checkWindowEnd', done)

    await checkWindow({
      snapshot: {cdt: []},
      url: '',
      tag: 'good1',
      useDom: true,
      enablePatterns: true,
    })
    await donePromise
    const [results] = await close()
    const r = results.getStepsInfo()[0].result
    expect(r.__checkSettings.getUseDom()).to.be.true
    expect(r.__checkSettings.getEnablePatterns()).to.be.true
  })

  it('checkWindow overrides openEyes useDom & enablePatterns with false', async () => {
    openEyes = makeRenderingGridClient({
      apiKey,
      showLogs: APPLITOOLS_SHOW_LOGS,
      renderWrapper: wrapper,
      useDom: true,
      enablePatterns: true,
    }).openEyes
    const {checkWindow, close} = await openEyes({
      apiKey,
      wrappers: [wrapper],
      appName,
      useDom: true,
      enablePatterns: true,
    })

    let done
    const donePromise = new Promise(res => {
      done = res
      setTimeout(done, 1000)
    })
    wrapper.on('checkWindowEnd', done)

    await checkWindow({
      snapshot: {cdt: []},
      url: '',
      tag: 'good1',
      useDom: false,
      enablePatterns: false,
    })
    await donePromise
    const [results] = await close()
    const r = results.getStepsInfo()[0].result
    expect(r.__checkSettings.getUseDom()).to.be.false
    expect(r.__checkSettings.getEnablePatterns()).to.be.false
  })

  it('handles visualGridOptions in renderingGridClient', async () => {
    openEyes = makeRenderingGridClient({
      apiKey,
      renderWrapper: wrapper,
      visualGridOptions: {aaa: true},
    }).openEyes

    const {checkWindow, close} = await openEyes({
      apiKey,
      wrappers: [wrapper],
      appName,
    })

    await checkWindow({snapshot: {cdt: []}, url: ''})
    const [results] = await close()
    const r = results.getStepsInfo()[0].getRenderId()
    expect(JSON.parse(r).visualGridOptions).to.eql({aaa: true})
  })

  it('handles visualGridOptions in openEyes', async () => {
    openEyes = makeRenderingGridClient({
      apiKey,
      renderWrapper: wrapper,
    }).openEyes

    const {checkWindow, close} = await openEyes({
      apiKey,
      wrappers: [wrapper],
      appName,
      visualGridOptions: {aaa: true},
    })

    await checkWindow({snapshot: {cdt: []}, url: ''})
    const [results] = await close()
    const r = results.getStepsInfo()[0].getRenderId()
    expect(JSON.parse(r).visualGridOptions).to.eql({aaa: true})
  })

  it('handles visualGridOptions in checkWindow', async () => {
    openEyes = makeRenderingGridClient({
      apiKey,
      renderWrapper: wrapper,
    }).openEyes

    const {checkWindow, close} = await openEyes({
      apiKey,
      wrappers: [wrapper],
      appName,
    })

    await checkWindow({
      snapshot: {cdt: []},
      url: '',
      visualGridOptions: {aaa: true},
    })
    const [results] = await close()
    const r = results.getStepsInfo()[0].getRenderId()
    expect(JSON.parse(r).visualGridOptions).to.eql({aaa: true})
  })

  it('doesnt throw error on chrome canary browser name', async () => {
    const [err] = await presult(
      openEyes({
        wrappers: [wrapper],
        browser: {width: 320, height: 480, name: 'chrome-canary'},
        url: `${baseUrl}/test.html`,
        appName,
      }),
    )
    expect(err).to.be.undefined
  })

  it('translates previous browser versions', async () => {
    const wrapper1 = new FakeEyesWrapper({goodFilename: 'test.cdt.json', goodResourceUrls: []})
    const wrapper2 = new FakeEyesWrapper({goodFilename: 'test.cdt.json', goodResourceUrls: []})
    const wrapper3 = new FakeEyesWrapper({goodFilename: 'test.cdt.json', goodResourceUrls: []})
    const {checkWindow, close} = await openEyes({
      appName,
      wrappers: [wrapper1, wrapper2, wrapper3],
      browser: [
        {width: 1, height: 2, name: 'chrome-one-version-back'},
        {width: 3, height: 4, name: 'chrome-two-versions-back'},
        {width: 1, height: 2, name: 'edgechromium-one-version-back'},
      ],
    })
    checkWindow({
      snapshot: {cdt: []},
      url: '',
    })
    await close()
    expect(wrapper1.results[0].__browserName).to.equal('chrome-1')
    expect(wrapper2.results[0].__browserName).to.equal('chrome-2')
    expect(wrapper3.results[0].__browserName).to.equal('edgechromium-1')
  })

  it('sends the user agent even in case of render failure', async () => {
    wrapper.renderBatch = async () => {
      throw new Error('renderBatch')
    }
    openEyes = makeRenderingGridClient({
      showLogs: APPLITOOLS_SHOW_LOGS,
      apiKey,
      renderWrapper: wrapper,
    }).openEyes
    const {checkWindow, close} = await openEyes({
      browser: {width: 1, height: 1, name: 'firefox'},
      wrappers: [wrapper],
      url: `bla`,
      appName,
    })

    checkWindow({
      snapshot: {resourceUrls: [], cdt: []},
      url: `bla`,
    })
    const [err] = await presult(close())
    expect(err[0].message).to.equal('renderBatch')
    expect(wrapper.getAppEnvironment().inferred).to.equal('useragent:firefox')
  })

  it('sends the user agent even in case of render failure: when multiple browsers are sent', async () => {
    const wrapper1 = new FakeEyesWrapper({goodFilename: 'test.cdt.json', goodResourceUrls: []})
    const wrapper2 = new FakeEyesWrapper({goodFilename: 'test.cdt.json', goodResourceUrls: []})
    wrapper.renderBatch = async () => {
      throw new Error('renderBatch')
    }
    openEyes = makeRenderingGridClient({
      showLogs: APPLITOOLS_SHOW_LOGS,
      apiKey,
      renderWrapper: wrapper,
    }).openEyes
    const {checkWindow, close} = await openEyes({
      browser: [
        {width: 1, height: 1, name: 'firefox'},
        {width: 1, height: 1, name: 'safari-one-version-back'},
      ],
      wrappers: [wrapper1, wrapper2],
      url: `bla`,
      appName,
    })

    checkWindow({
      snapshot: {resourceUrls: [], cdt: []},
      url: `bla`,
    })
    const [err] = await presult(close())
    expect(err[0].message).to.equal('renderBatch')
    expect(wrapper1.getAppEnvironment().inferred).to.equal('useragent:firefox')
    expect(wrapper2.getAppEnvironment().inferred).to.equal('useragent:safari-1')
  })

  // TODO (amit): unskip this test once we implement getting the user agent from the render status result.It requires a refactor of waitForRenderedStatus which doesn't seem like a good ROI at the moment.
  it.skip('sends the user agent even in case of render-status failure', async () => {
    wrapper.getRenderStatus = async () => {
      return [
        new RenderStatusResults({
          status: RenderStatus.ERROR,
          error: 'renderStatusError',
          userAgent: 'some ua',
        }),
      ]
    }
    openEyes = makeRenderingGridClient({
      showLogs: APPLITOOLS_SHOW_LOGS,
      apiKey,
      renderWrapper: wrapper,
    }).openEyes
    const {checkWindow, close} = await openEyes({
      browser: {width: 1, height: 1, name: 'firefox'},
      wrappers: [wrapper],
      url: `bla`,
      appName,
    })

    checkWindow({
      snapshot: {resourceUrls: [], cdt: []},
      url: `bla`,
    })
    const [err] = await presult(close())
    expect(err[0].message).to.contain('renderStatusError')
    expect(wrapper.inferredEnvironment).to.equal('some ua')
  })

  // TODO this test should be deleted once the test above it is unskipped
  it('sends the user agent even in case of render-status failure', async () => {
    wrapper.getRenderStatus = async () => {
      return [
        new RenderStatusResults({
          status: RenderStatus.ERROR,
          error: 'renderStatusError',
          userAgent: 'some ua',
        }),
      ]
    }
    openEyes = makeRenderingGridClient({
      showLogs: APPLITOOLS_SHOW_LOGS,
      apiKey,
      renderWrapper: wrapper,
    }).openEyes
    const {checkWindow, close} = await openEyes({
      browser: {width: 1, height: 1, name: 'firefox'},
      wrappers: [wrapper],
      url: `bla`,
      appName,
    })

    checkWindow({
      snapshot: {resourceUrls: [], cdt: []},
      url: `bla`,
    })
    const [err] = await presult(close())
    expect(err[0].message).to.contain('renderStatusError')
    expect(wrapper.getAppEnvironment().inferred).to.equal('useragent:firefox')
  })
})
