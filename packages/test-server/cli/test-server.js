#!/usr/bin/env node
const testServer = require('../src/test-server')

const {argv} = require('yargs').option('hbData', {corece: JSON.stringify})
console.log('running test server', argv)
testServer(argv)
  .then(({close, port}) => {
    process.on('SIGTERM', () => {
      close()
    })
    if (process.send) {
      process.send({success: true, port})
    }
  })
  .catch(err => {
    if (process.send) {
      process.send({success: false, err})
    }
    process.exit(1)
  })
