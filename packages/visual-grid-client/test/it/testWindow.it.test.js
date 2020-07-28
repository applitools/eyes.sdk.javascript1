'use strict'
const {describe, it, before, after, beforeEach} = require('mocha')
const {expect} = require('chai')
const makeRenderingGridClient = require('../../src/sdk/renderingGridClient')
const createFakeWrapper = require('../util/createFakeWrapper')
const {testServer} = require('@applitools/sdk-shared')
const {loadJsonFixture} = require('../util/loadFixture')
const nock = require('nock')
const {ptimeoutWithError, presult} = require('@applitools/functional-commons')

describe('testWindow', () => {
  let baseUrl, closeServer, testWindow
  let wrapper
  const apiKey = 'some api key'
  const appName = 'some app name'
  const testName = 'some test name'

  before(async () => {
    const server = await testServer({port: 3453}) // TODO fixed port avoids 'need-more-resources' for dom. Is this desired? should both paths be tested?
    baseUrl = `http://localhost:${server.port}`
    closeServer = server.close
  })

  after(async () => {
    await closeServer()
  })

  beforeEach(() => {
    wrapper = createFakeWrapper(baseUrl)
    testWindow = makeRenderingGridClient({
      showLogs: process.env.APPLITOOLS_SHOW_LOGS,
      apiKey,
      renderWrapper: wrapper,
      fetchResourceTimeout: 2000,
    }).testWindow

    nock(wrapper.baseUrl)
      .persist()
      .post(wrapper.resultsRoute)
      .reply(201, (_url, body) => body, {
        location: (_req, _res, body) => body,
      })
  })

  it('calls open without starting a session', async () => {
    const openParams = {
      wrappers: [wrapper],
      appName,
      testName,
    }
    const resourceUrls = wrapper.goodResourceUrls
    const cdt = loadJsonFixture('test.cdt.json')
    const checkParams = {resourceUrls, cdt, tag: 'good1', url: `${baseUrl}/test.html`}

    let done
    const p = new Promise(r => (done = r))
    let done2
    const p2 = new Promise(r => (done2 = r))
    let done3
    const p3 = new Promise(r => (done3 = r))

    wrapper.on('openEnd', args => {
      done(args)
    })
    wrapper.on('testWindowEnd', args => {
      done2(args)
    })
    wrapper.on('closeTestWindowEnd', args => {
      done3(args)
    })

    const [err, resultsArr] = await presult(testWindow({openParams, checkParams}))

    expect(err).to.be.undefined
    const results = resultsArr[0]

    const [openArgs, testWindowArgs, closeTestWindowArgs] = await ptimeoutWithError(
      Promise.all([p, p2, p3]),
      1000,
      'timeout',
    )

    expect(results.constructor.name).to.eql('TestResults')
    expect(openArgs).to.eql([
      {
        appName: 'some app name',
        skipStartingSession: true,
        testName: 'some test name',
        viewportSize: {
          _height: 768,
          _width: 1024,
        },
      },
    ])

    const removeSalt = str => {
      const obj = JSON.parse(str)
      delete obj.salt
      return JSON.stringify(obj)
    }

    closeTestWindowArgs[0]._stepsInfo[0]._renderId = removeSalt(
      closeTestWindowArgs[0]._stepsInfo[0]._renderId,
    )

    expect(closeTestWindowArgs).to.eql([
      {
        _accessibilityStatus: undefined,
        _apiUrls: undefined,
        _appName: undefined,
        _appUrls: undefined,
        _batchId: undefined,
        _batchName: undefined,
        _branchName: undefined,
        _contentMatches: undefined,
        _duration: undefined,
        _exactMatches: undefined,
        _hostApp: undefined,
        _hostDisplaySize: undefined,
        _hostOS: undefined,
        _id: undefined,
        _isAborted: undefined,
        _isDifferent: undefined,
        _isNew: undefined,
        _layoutMatches: undefined,
        _matches: undefined,
        _mismatches: undefined,
        _missing: undefined,
        _name: undefined,
        _noneMatches: undefined,
        _secretToken: undefined,
        _serverConnector: undefined,
        _startedAt: undefined,
        _status: undefined,
        _steps: undefined,
        _stepsInfo: [
          {
            _appUrls: undefined,
            _hasBaselineImage: undefined,
            _hasCurrentImage: undefined,
            _isDifferent: undefined,
            _name: undefined,
            _apiUrls: undefined,
            _renderId: '{"isGood":true,"sizeMode":"full-page"}',
          },
        ],
        _strictMatches: undefined,
        _url: undefined,
      },
      true,
    ])

    testWindowArgs[0].checkSettings._renderId = removeSalt(
      testWindowArgs[0].checkSettings._renderId,
    )
    testWindowArgs[0].screenshotUrl = removeSalt(testWindowArgs[0].screenshotUrl)

    expect(testWindowArgs).to.eql([
      {
        checkSettings: {
          _accessibilityLevel: undefined,
          _accessibilityRegions: [],
          _contentRegions: [],
          _enablePatterns: undefined,
          _floatingRegions: [],
          _ignoreCaret: true,
          _ignoreDisplacements: undefined,
          _ignoreRegions: [],
          _layoutRegions: [],
          _matchLevel: undefined,
          _renderId: '{"isGood":true,"sizeMode":"full-page"}',
          _sendDom: undefined,
          _stitchContent: false,
          _strictRegions: [],
          _targetRegion: undefined,
          _timeout: 0,
          _useDom: undefined,
        },
        domUrl: undefined,
        imageLocation: undefined,
        screenshotUrl: '{"isGood":true,"sizeMode":"full-page"}',
        tag: 'good1',
        url: `${baseUrl}/test.html`,
      },
    ])
  })

  it('dont throw error with throwEx=false', async () => {
    const openParams = {
      wrappers: [wrapper],
      appName,
      testName,
    }
    const resourceUrls = wrapper.goodResourceUrls
    const cdt = loadJsonFixture('test.cdt.json')
    const checkParams = {resourceUrls, cdt, tag: 'good1', url: `${baseUrl}/test.html`}

    wrapper.closeTestWindow = () => {
      return Promise.reject(new Error('test diff'))
    }

    const [error] = await testWindow({openParams, checkParams, throwEx: false})
    expect(error.message).to.eql('test diff')
  })
})
