'use strict'

const {describe, it} = require('mocha')
const {expect} = require('chai')
const {startFakeEyesServer} = require('..')
const fetch = require('node-fetch')
const path = require('path')
const zlib = require('zlib')
const uuid = require('uuid/v4')
const {getDom, getSession} = require('../lib/fake-server-utils')

describe('fake eyes server utils', () => {
  let baseUrl, closeServer
  before(async () => {
    const {port, close} = await startFakeEyesServer({
      expectedFolder: path.resolve(__dirname, 'fixtures'),
      updateFixtures: process.env.APPLITOOLS_UPDATE_FIXTURES,
    })
    baseUrl = `http://localhost:${port}`
    closeServer = close
  })
  after(async () => {
    await closeServer()
  })

  it('getSession', async () => {
    const {id: sessionId} = await runTest({
      appName: 'app name',
      testName: 'test name',
      batchName: 'batch name',
      batchId: 'batch id',
      displaySize: 'display size',
      inferred:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36',
    })
    const session = await getSession(
      {getBatchId: () => 'batch id', getId: () => sessionId},
      baseUrl,
    )
    expect(session.id).to.eql(sessionId)
    expect(session.startInfo.appIdOrName).to.eql('app name')
    expect(session.startInfo.scenarioIdOrName).to.eql('test name')
    expect(session.startInfo.batchInfo.name).to.eql('batch name')
    expect(session.startInfo.batchInfo.id).to.eql('batch id')
    expect(session.hostApp).to.eql('Chrome@60')
    expect(session.hostOS).to.eql('Windows@10')
    expect(session.startInfo.environment).to.eql({
      displaySize: 'display size',
      inferred:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36',
    })
  })

  it('getDom', async () => {
    const {id: sessionId} = await runTest({
      appName: 'app name',
      testName: 'test name',
      batchName: 'batch name',
      hostApp: 'host app',
      hostOS: 'host os',
      batchId: 'batch id',
      displaySize: 'display size',
      inferred:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36',
    })
    const session = await getSession(
      {getBatchId: () => 'batch id', getId: () => sessionId},
      baseUrl,
    )
    const dom = await getDom(session)
    expect(dom).to.eql({some: 'dom'})
  })

  async function runTest({appName, testName, batchName, batchId, displaySize, inferred}) {
    // 1. get render info
    const {resultsUrl} = await fetch(`${baseUrl}/api/sessions/renderinfo`).then(r => r.json())

    // 2. upload screenshot
    const imageId = uuid()
    const screenshotUrl = `${resultsUrl.replace('__random__', imageId)}`
    await fetch(screenshotUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/octet-stream',
      },
      body: 'some image',
    }).then(r => r.buffer())

    // 3. upload DOM
    const domId = uuid()
    const domUrl = `${resultsUrl.replace('__random__', domId)}`
    await fetch(domUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/octet-stream',
      },
      body: zlib.gzipSync(Buffer.from(JSON.stringify({some: 'dom'}))),
    }).then(r => r.buffer())

    // 4. matchSingleWindow
    const body = {
      startInfo: {
        appIdOrName: appName,
        scenarioIdOrName: testName,
        batchInfo: {id: batchId, name: batchName},
        environment: {displaySize, inferred},
      },
      appOutput: {
        screenshotUrl,
        domUrl,
      },
    }
    let resp = await fetch(`${baseUrl}/api/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    while (resp.status === 202) {
      resp = await fetch(resp.headers.get('location'))
    }

    return fetch(resp.headers.get('location'), {method: 'DELETE'}).then(r => r.json())
  }
})
