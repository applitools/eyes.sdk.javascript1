#!/usr/bin/env node
'use strict'

const {startFakeEyesServer} = require('../lib/start-fake-eyes-server')

;(async () => {
  const {port} = await startFakeEyesServer({
    port: process.env.PORT || 0,
    hangUp: process.env.FAKE_SERVER_HANGUP,
  })
  console.log(`http://localhost:${port}`)
})().catch(err => {
  console.log('err', err)
  process.exit(1)
})
