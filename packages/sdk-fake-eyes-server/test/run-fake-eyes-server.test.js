'use strict'

const {describe, it} = require('mocha')
const {expect} = require('chai')
const {spawn} = require('child_process')
const path = require('path')
const fetch = require('node-fetch')
const {URL} = require('url')

describe('run-fake-eyes-server script', () => {
  it('starts the server', async () => {
    const {close, port} = await spawnServer()
    try {
      await heartbeat(port)
    } finally {
      await close()
    }
  })

  it('starts the server at port from env variable PORT', async () => {
    const origPort = process.env.PORT
    process.env.PORT = 3000
    const {close} = await spawnServer()
    try {
      await heartbeat(3000)
    } finally {
      process.env.PORT = origPort
      await close()
    }
  })
})

async function spawnServer() {
  const scriptPath = path.resolve(__dirname, '../scripts/run-fake-eyes-server.js')
  let resolveClose, actualPort, resolveStart
  const closePromise = new Promise(r => (resolveClose = r))
  const startPromise = new Promise(r => (resolveStart = r))
  const child = spawn('node', [scriptPath])
  child.stdout.on('data', d => {
    try {
      const u = new URL(d.toString())
      actualPort = u.port
      resolveStart()
    } catch (_ex) {}
  })
  child.on('exit', resolveClose)
  await startPromise
  return {
    port: actualPort,
    close: () => {
      child.kill()
      return closePromise
    },
  }
}

async function heartbeat(port) {
  const resp = await fetch(`http://localhost:${port}/api/sessions/running/data`, {
    method: 'POST',
    headers: {
      'content-type': 'application/octet-stream',
    },
    body: 'some dom',
  })
  const location = resp.headers.get('location')
  const dom = await fetch(location).then(r => r.text())
  expect(dom).to.equal('some dom')
}
