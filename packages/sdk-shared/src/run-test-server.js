'use strict'

const {executeAndControlProcess} = require('./process-commons')
const path = require('path')

async function runTestServer(args = {}) {
  let resolve, reject
  const ret = new Promise((r, j) => {
    resolve = r
    reject = j
  })
  const filepath = path.resolve(__dirname, 'test-server.js')
  const spawnArgs = [
    filepath,
    ...Object.entries(args).reduce(
      (acc, [key, value]) =>
        acc.concat([`--${key}`, typeof value === 'object' ? JSON.stringify(value) : value]),
      [],
    ),
  ]
  const {subProcess, exitPromise} = executeAndControlProcess('node', spawnArgs, {
    spawnOptions: {stdio: ['pipe', 'pipe', 'pipe', 'ipc']},
  })

  exitPromise.catch(ex => {
    if (ex.signal !== 'SIGTERM') throw ex
  })

  subProcess.on('message', ({success, port, err}) => {
    if (success) {
      resolve({close: () => subProcess.kill(), port})
    } else {
      reject(new Error(err))
    }
  })

  return ret
}

module.exports = runTestServer
