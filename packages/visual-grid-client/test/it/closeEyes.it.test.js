'use strict'
const {describe, it, before, after, beforeEach, afterEach} = require('mocha')
const chai = require('chai')
chai.use(require('chai-uuid'))
const {expect} = chai
const makeRenderingGridClient = require('../../src/sdk/renderingGridClient')
const makeGlobalState = require('../../src/sdk/globalState')
const createFakeWrapper = require('../util/createFakeWrapper')
const testServer = require('@applitools/sdk-shared/src/run-test-server')
const {promisify: p} = require('util')
const psetTimeout = p(setTimeout)
const {presult} = require('@applitools/functional-commons')

describe('closeEyes', () => {
  let baseUrl, closeServer, openEyes, prevEnv, APPLITOOLS_SHOW_LOGS
  let wrapper, wrapper2
  const apiKey = 'some api key'
  const appName = 'some app name'

  before(async () => {
    const server = await testServer({port: 4456}) // TODO fixed port avoids 'need-more-resources' for dom. Is this desired? should both paths be tested?
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
    wrapper2 = createFakeWrapper(baseUrl)

    openEyes = makeRenderingGridClient({
      showLogs: APPLITOOLS_SHOW_LOGS,
      apiKey,
      renderWrapper: wrapper,
      fetchResourceTimeout: 2000,
    }).openEyes
  })

  afterEach(() => {
    process.env = prevEnv
  })

  it("doesn't reject", async () => {
    const {checkWindow, close} = await openEyes({
      wrappers: [wrapper],
      appName,
    })
    checkWindow({
      snapshot: {cdt: [], resourceUrls: []},
      tag: 'good1',
      url: `${baseUrl}/basic.html`,
    })
    const [err, result] = await presult(close())
    console.log('err', err)
    expect(err).to.be.undefined
    expect(result[0].getStepsInfo().map(r => r.result.getAsExpected())).to.eql([true])
  })

  it('rejects with an error with bad tag', async () => {
    const {checkWindow, close} = await openEyes({
      wrappers: [wrapper],
      appName,
    })
    checkWindow({
      snapshot: {cdt: [], resourceUrls: []},
      tag: 'bad!',
      url: `${baseUrl}/basic.html`,
    })
    await psetTimeout(0) // because FakeEyesWrapper throws, and then the error is set async and will be read in the next call to close()
    const result = (await presult(close()))[0]
    expect(result[0].message).to.equal('Tag bad! should be one of the good tags good1,good2')
  })

  it('rejects with a general error and test result', async () => {
    wrapper2.goodTags = ['ok-in-1-test']
    const {checkWindow, close} = await openEyes({
      wrappers: [wrapper, wrapper2],
      browser: [
        {width: 1, height: 1},
        {width: 2, height: 2},
      ],
      appName,
    })
    checkWindow({
      snapshot: {cdt: [], resourceUrls: []},
      tag: 'ok-in-1-test',
      url: `${baseUrl}/basic.html`,
    })
    await psetTimeout(0) // because FakeEyesWrapper throws, and then the error is set async and will be read in the next call to close()
    const result = (await presult(close()))[0]
    expect(result[0].message).to.equal(
      'Tag ok-in-1-test should be one of the good tags good1,good2',
    )
    expect(result[1].getStepsInfo().map(r => r.result.getAsExpected())).to.eql([true])
  })

  it('rejects with a diff and test result', async () => {
    const alwaysDiffWrapper = createFakeWrapper(baseUrl, {closeErr: true})
    const {checkWindow, close} = await openEyes({
      wrappers: [wrapper, alwaysDiffWrapper],
      browser: [
        {width: 1, height: 1},
        {width: 2, height: 2},
      ],
      appName,
    })
    checkWindow({
      snapshot: {cdt: [], resourceUrls: []},
      tag: 'good1',
      url: `${baseUrl}/basic.html`,
    })
    await psetTimeout(0) // because FakeEyesWrapper throws, and then the error is set async and will be read in the next call to close()
    const result = (await presult(close()))[0]
    expect(result[0].getStepsInfo().map(r => r.result.getAsExpected())).to.eql([true])
    expect(result[1].message).to.equal('mismatch')
  })

  it('rejects with 2 diffs when thorwEx = true', async () => {
    const alwaysDiffWrapper = createFakeWrapper(baseUrl, {closeErr: true})
    const alwaysDiffWrapper2 = createFakeWrapper(baseUrl, {closeErr: true})
    const {checkWindow, close} = await openEyes({
      wrappers: [alwaysDiffWrapper2, alwaysDiffWrapper],
      browser: [
        {width: 1, height: 1},
        {width: 2, height: 2},
      ],
      appName,
    })
    checkWindow({
      snapshot: {cdt: [], resourceUrls: []},
      tag: 'good1',
      url: `${baseUrl}/basic.html`,
    })
    await psetTimeout(0) // because FakeEyesWrapper throws, and then the error is set async and will be read in the next call to close()
    const resultWithErr = (await presult(close()))[0]
    expect(resultWithErr[0].message).to.equal('mismatch')
    expect(resultWithErr[1].message).to.equal('mismatch')
  })

  it('returns 2 diffs when thorwEx = false', async () => {
    const alwaysDiffWrapper = createFakeWrapper(baseUrl, {closeErr: true})
    const alwaysDiffWrapper2 = createFakeWrapper(baseUrl, {closeErr: true})
    const {checkWindow, close} = await openEyes({
      wrappers: [alwaysDiffWrapper2, alwaysDiffWrapper],
      browser: [
        {width: 1, height: 1},
        {width: 2, height: 2},
      ],
      appName,
    })
    checkWindow({
      snapshot: {cdt: [], resourceUrls: []},
      tag: 'good1',
      url: `${baseUrl}/basic.html`,
    })
    await psetTimeout(0) // because FakeEyesWrapper throws, and then the error is set async and will be read in the next call to close()
    const [, resultWithErr] = await presult(close(false))
    expect(resultWithErr[0].message).to.equal('mismatch')
    expect(resultWithErr[1].message).to.equal('mismatch')
  })

  it('rejectes and fails all tests on render error', async () => {
    const failRenderWrapper = createFakeWrapper(baseUrl, {failRender: true})
    const openEyesRenderFail = makeRenderingGridClient({
      showLogs: APPLITOOLS_SHOW_LOGS,
      apiKey,
      renderWrapper: failRenderWrapper,
      fetchResourceTimeout: 2000,
    }).openEyes

    const {checkWindow, close} = await openEyesRenderFail({
      wrappers: [wrapper, wrapper2],
      browser: [
        {width: 1, height: 1},
        {width: 2, height: 2},
      ],
      appName,
    })
    checkWindow({
      snapshot: {cdt: [], resourceUrls: []},
      tag: 'good1',
      url: `${baseUrl}/basic.html`,
    })
    await psetTimeout(0) // because FakeEyesWrapper throws, and then the error is set async and will be read in the next call to close()
    const resultWithErr = (await presult(close()))[0]
    expect(resultWithErr[0].message).to.equal('render error')
    expect(resultWithErr[1].message).to.equal('render error')
  })

  it('resolves and fails all tests on render error with throwEx=false', async () => {
    const failRenderWrapper = createFakeWrapper(baseUrl, {failRender: true})
    const openEyesRenderFail = makeRenderingGridClient({
      showLogs: APPLITOOLS_SHOW_LOGS,
      apiKey,
      renderWrapper: failRenderWrapper,
      fetchResourceTimeout: 2000,
    }).openEyes

    const {checkWindow, close} = await openEyesRenderFail({
      wrappers: [wrapper, wrapper2],
      browser: [
        {width: 1, height: 1},
        {width: 2, height: 2},
      ],
      appName,
    })
    checkWindow({
      snapshot: {cdt: [], resourceUrls: []},
      tag: 'good1',
      url: `${baseUrl}/basic.html`,
    })
    await psetTimeout(0) // because FakeEyesWrapper throws, and then the error is set async and will be read in the next call to close()
    const resultWithErr = (await presult(close(false)))[1]
    expect(resultWithErr[0].message).to.equal('render error')
    expect(resultWithErr[1].message).to.equal('render error')
  })

  it('rejects with empty array if aborted by user', async () => {
    const {checkWindow, abort, close} = await openEyes({
      wrappers: [wrapper, wrapper2],
      browser: [
        {width: 1, height: 1},
        {width: 2, height: 2},
      ],
      appName,
    })
    checkWindow({
      snapshot: {cdt: [], resourceUrls: []},
      tag: 'good1',
      url: `${baseUrl}/basic.html`,
    })
    await abort()
    await psetTimeout(0) // because FakeEyesWrapper throws, and then the error is set async and will be read in the next call to close()
    const resultWithErr = (await presult(close()))[0]
    expect(resultWithErr).to.deep.equal([])
  })

  it('sets the correct batchId on batches when closing', async () => {
    const globalState = makeGlobalState({logger: {log: () => {}}})
    const openEyes = makeRenderingGridClient({
      showLogs: APPLITOOLS_SHOW_LOGS,
      apiKey,
      renderWrapper: wrapper,
      fetchResourceTimeout: 2000,
      globalState,
    }).openEyes

    let {checkWindow, close} = await openEyes({
      wrappers: [wrapper, wrapper2],
      browser: [
        {width: 1, height: 1},
        {width: 2, height: 2},
      ],
      appName,
    })
    checkWindow({
      snapshot: {cdt: [], resourceUrls: []},
      tag: 'good1',
      url: `${baseUrl}/basic.html`,
    })
    await close()

    // this simulates setting batchId: 'secondBatchId' in openEyes
    const wrapper3 = createFakeWrapper(baseUrl)
    const wrapper4 = createFakeWrapper(baseUrl)

    ;({checkWindow, close} = await openEyes({
      wrappers: [wrapper3, wrapper4],
      browser: [
        {width: 1, height: 1},
        {width: 2, height: 2},
      ],
      appName,
      batchId: 'secondBatchId',
    }))
    await close()

    expect(globalState.batchStore.ids.size).to.equal(2)

    const batchStoreArr = [...globalState.batchStore.ids]
    expect(batchStoreArr[0]).to.be.a.uuid('v4')
    expect(batchStoreArr[1]).to.equal('secondBatchId')
  })

  it('resolves with empty array if aborted by user with throwEx=false', async () => {
    const {checkWindow, abort, close} = await openEyes({
      wrappers: [wrapper, wrapper2],
      browser: [
        {width: 1, height: 1},
        {width: 2, height: 2},
      ],
      appName,
    })
    checkWindow({
      snapshot: {cdt: [], resourceUrls: []},
      tag: 'good1',
      url: `${baseUrl}/basic.html`,
    })
    await abort()
    await psetTimeout(0) // because FakeEyesWrapper throws, and then the error is set async and will be read in the next call to close()
    const resultWithErr = (await presult(close(false)))[1]
    expect(resultWithErr).to.deep.equal([])
  })

  it('rejects with a diff, error and a test result', async () => {
    const alwaysDiffWrapper = createFakeWrapper(baseUrl, {closeErr: true})
    wrapper2.goodTags = ['ok-in-1-test']
    alwaysDiffWrapper.goodTags = ['ok-in-1-test']
    const {checkWindow, close} = await openEyes({
      wrappers: [alwaysDiffWrapper, wrapper, wrapper2],
      browser: [
        {width: 1, height: 1},
        {width: 2, height: 2},
        {width: 3, height: 3},
      ],
      appName,
    })
    checkWindow({
      snapshot: {cdt: [], resourceUrls: []},
      tag: 'ok-in-1-test',
      url: `${baseUrl}/basic.html`,
    })
    await psetTimeout(0) // because FakeEyesWrapper throws, and then the error is set async and will be read in the next call to close()
    const result = (await presult(close()))[0]
    expect(result[0].message).to.equal('mismatch')
    expect(result[1].message).to.equal(
      'Tag ok-in-1-test should be one of the good tags good1,good2',
    )
    expect(result[2].getStepsInfo().map(r => r.result.getAsExpected())).to.eql([true])
  })

  it('rejects with 2 diffs', async () => {
    const alwaysDiffWrapper = createFakeWrapper(baseUrl, {closeErr: true})
    const alwaysDiffWrapper2 = createFakeWrapper(baseUrl, {closeErr: true})
    alwaysDiffWrapper.goodTags = ['ok']
    alwaysDiffWrapper2.goodTags = ['ok']
    const {checkWindow, close} = await openEyes({
      wrappers: [alwaysDiffWrapper, alwaysDiffWrapper2],
      browser: [
        {width: 1, height: 1},
        {width: 2, height: 2},
      ],
      appName,
    })
    checkWindow({
      snapshot: {cdt: [], resourceUrls: []},
      tag: 'ok',
      url: `${baseUrl}/basic.html`,
    })
    await psetTimeout(0) // because FakeEyesWrapper throws, and then the error is set async and will be read in the next call to close()
    const result = (await presult(close()))[0]
    expect(result[0].message).to.equal('mismatch')
    expect(result[1].message).to.equal('mismatch')
  })

  it('resolves with 2 diffs if throwEx=false', async () => {
    const alwaysDiffWrapper = createFakeWrapper(baseUrl, {closeErr: true})
    const alwaysDiffWrapper2 = createFakeWrapper(baseUrl, {closeErr: true})
    alwaysDiffWrapper.goodTags = ['ok']
    alwaysDiffWrapper2.goodTags = ['ok']
    const {checkWindow, close} = await openEyes({
      wrappers: [alwaysDiffWrapper, alwaysDiffWrapper2],
      browser: [
        {width: 1, height: 1},
        {width: 2, height: 2},
      ],
      appName,
    })
    checkWindow({
      snapshot: {cdt: [], resourceUrls: []},
      tag: 'ok',
      url: `${baseUrl}/basic.html`,
    })
    await psetTimeout(0) // because FakeEyesWrapper throws, and then the error is set async and will be read in the next call to close()
    const result = (await presult(close(false)))[1]
    expect(result[0].message).to.equal('mismatch')
    expect(result[1].message).to.equal('mismatch')
  })

  it('resolves with a diff, error and a test result if thorwEx=false', async () => {
    const alwaysDiffWrapper = createFakeWrapper(baseUrl, {closeErr: true})
    wrapper2.goodTags = ['ok-in-1-test']
    alwaysDiffWrapper.goodTags = ['ok-in-1-test']
    const {checkWindow, close} = await openEyes({
      wrappers: [alwaysDiffWrapper, wrapper, wrapper2],
      browser: [
        {width: 1, height: 1},
        {width: 2, height: 2},
        {width: 3, height: 3},
      ],
      appName,
    })
    checkWindow({
      snapshot: {cdt: [], resourceUrls: []},
      tag: 'ok-in-1-test',
      url: `${baseUrl}/basic.html`,
    })
    await psetTimeout(0) // because FakeEyesWrapper throws, and then the error is set async and will be read in the next call to close()
    const result = (await presult(close(false)))[1]
    expect(result[0].message).to.equal('mismatch')
    expect(result[1].message).to.equal(
      'Tag ok-in-1-test should be one of the good tags good1,good2',
    )
    expect(result[2].getStepsInfo().map(r => r.result.getAsExpected())).to.eql([true])
  })
})
