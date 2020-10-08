'use strict'

const {describe, it} = require('mocha')
const {expect} = require('chai')
const {startFakeEyesServer} = require('..')
const fetch = require('node-fetch')
const path = require('path')
const fs = require('fs')

describe('fake eyes server', () => {
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

  it('saves dom', async () => {
    const resp = await fetch(`${baseUrl}/api/sessions/running/data`, {
      method: 'POST',
      headers: {
        'content-type': 'application/octet-stream',
      },
      body: 'some dom',
    })
    const location = resp.headers.get('location')
    const dom = await fetch(location).then(r => r.text())
    expect(dom).to.equal('some dom')
  })

  it('returns 404 on non existent resource', async () => {
    const resp = await fetch(`${baseUrl}/resources/non-existent`)
    expect(resp.status).to.equal(404)
  })

  it('handles matchWindow with screenshot buffer', async () => {
    const runningSession = await fetch(`${baseUrl}/api/sessions/running`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        startInfo: {
          appIdOrName: 'x',
          scenarioIdOrName: 'y',
          environment: {
            inferred:
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36',
          },
          batchInfo: {},
        },
      }),
    }).then(r => r.json())

    const buff = fs.readFileSync(
      path.resolve(__dirname, 'fixtures', 'x__y__running__Windows@10__Chrome@60.png'), // TODO utility for naming files
    )

    const matchResult = await fetch(`${baseUrl}/api/sessions/running/${runningSession.id}`, {
      method: 'POST',
      headers: {'content-type': 'application/octet-stream'},
      body: Buffer.concat([createDataBytes({}), buff]),
    }).then(r => r.json())

    expect(matchResult.asExpected).to.equal(true)
  })

  it('handles matchWindow with screenshot url and no buffer', async () => {
    const runningSession = await fetch(`${baseUrl}/api/sessions/running`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        startInfo: {
          appIdOrName: 'x',
          scenarioIdOrName: 'y',
          environment: {
            inferred:
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36',
          },
          batchInfo: {},
        },
      }),
    }).then(r => r.json())

    const renderInfo = await fetch(`${baseUrl}/api/sessions/renderinfo`).then(r => r.json())
    const resourceId = 'bla'
    const resourceContent = fs.readFileSync(
      path.resolve(__dirname, 'fixtures', 'x__y__running__Windows@10__Chrome@60.png'), // TODO utility for naming files
    )
    const resourceUrl = renderInfo.resultsUrl.replace('__random__', resourceId)

    await fetch(resourceUrl, {
      method: 'PUT',
      headers: {'content-type': 'application/octet-stream'},
      body: Buffer.from(resourceContent),
    })

    const result = await fetch(`${baseUrl}/api/sessions/running/${runningSession.id}`, {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({appOutput: {screenshotUrl: resourceUrl}}),
    }).then(r => r.json())

    expect(result.asExpected).to.equal(true)
  })
})

// TODO move to utils
const createDataBytes = jsonData => {
  const dataStr = JSON.stringify(jsonData)
  const dataLen = Buffer.byteLength(dataStr, 'utf8')

  // The result buffer will contain the length of the data + 4 bytes of size
  const result = Buffer.alloc(dataLen + 4)
  result.writeUInt32BE(dataLen, 0)
  result.write(dataStr, 4, dataLen)
  return result
}
