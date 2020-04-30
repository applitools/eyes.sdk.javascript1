'use strict'

const assert = require('assert')
const {startFakeEyesServer} = require('@applitools/sdk-fake-eyes-server')
const {
  Eyes,
  ClassicRunner,
  VisualGridRunner,
  ConsoleLogHandler,
  Configuration,
} = require('../../index')

describe('Eyes', function() {
  let eyesClassic, eyesClassic2, eyesClassic3, eyesVG, eyesVG2, eyesVG3
  let closeServer

  before(async function() {
    const cr = new ClassicRunner()
    eyesClassic = new Eyes(cr)
    eyesClassic2 = new Eyes(cr)
    eyesClassic3 = new Eyes(cr)

    const vgr = new VisualGridRunner()
    eyesVG = new Eyes(vgr)
    eyesVG2 = new Eyes(vgr)
    eyesVG3 = new Eyes(vgr)

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
    eyesVG.setConfiguration(configuration)
    eyesVG2.setConfiguration(configuration)
    eyesVG3.setConfiguration(configuration)
  })

  after(() => closeServer())

  it('_getAndSaveBatchInfoFromServer() works with classic runner', async function() {
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

  it('_getAndSaveBatchInfoFromServer() works with VG runner', async function() {
    const [res1, res2, res3] = await Promise.all([
      eyesVG._getAndSaveBatchInfoFromServer('id1'),
      eyesVG2._getAndSaveBatchInfoFromServer('id1'),
      eyesVG3._getAndSaveBatchInfoFromServer('id2'),
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
