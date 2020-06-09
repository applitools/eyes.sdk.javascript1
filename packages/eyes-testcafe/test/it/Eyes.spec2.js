'use strict'

const assert = require('assert')
const {Eyes, ConsoleLogHandler, Configuration} = require('../../index')
const {startFakeEyesServer} = require('@applitools/sdk-fake-eyes-server')

describe('Eyes', function() {
  let eyesClassic, eyesClassic2, eyesClassic3
  let closeServer

  before(async function() {
    eyesClassic = new Eyes()
    eyesClassic2 = new Eyes()
    eyesClassic3 = new Eyes()

    if (process.env.APPLITOOLS_SHOW_LOGS) {
      eyesClassic.setLogHandler(new ConsoleLogHandler(true))
    }
    const {port, close} = await startFakeEyesServer({logger: eyesClassic._logger})
    closeServer = close
    const serverUrl = `http://localhost:${port}`
    const configuration = new Configuration()
    configuration.setServerUrl(serverUrl)

    eyesClassic.setConfiguration(configuration)
    eyesClassic2.setConfiguration(configuration)
    eyesClassic3.setConfiguration(configuration)
  })

  after(() => closeServer())

  it('_getAndSaveBatchInfoFromServer() works', async function() {
    const [res1, res2, res3] = await Promise.all([
      eyesClassic._getAndSaveBatchInfoFromServer('id1'),
      eyesClassic2._getAndSaveBatchInfoFromServer('id1'),
      eyesClassic3._getAndSaveBatchInfoFromServer('id2'),
    ])
    assert.deepStrictEqual(res1, {
      scmSourceBranch: 'scmSourceBranch_id1',
      scmTargetBranch_: 'scmTargetBranch_id1',
    })
    assert.deepStrictEqual(res2, {
      scmSourceBranch: 'scmSourceBranch_id1',
      scmTargetBranch_: 'scmTargetBranch_id1',
    })
    assert.deepStrictEqual(res3, {
      scmSourceBranch: 'scmSourceBranch_id2',
      scmTargetBranch_: 'scmTargetBranch_id2',
    })
  })
})
