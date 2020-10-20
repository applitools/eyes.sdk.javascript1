const createFramesPaths = require('../../../lib/utils/createFramesPaths')
const assert = require('assert')
const {Logger} = require('../../../')

const logger = new Logger(process.env.APPLITOOLS_SHOW_LOGS)

describe('createFramesPaths', () => {
  it('should return an empty array when no cross frames exist', () => {
    const snapshot = {
      frames: [],
      crossFrames: [],
    }
    const result = createFramesPaths({snapshot, logger})
    assert.deepStrictEqual(result, [])
  })

  it('should create frame paths for cross origin frames', () => {
    const snapshot = {
      cdt: [{nodeName: 'IFRAME'}],
      frames: [],
      crossFrames: [{selector: 'selector1', index: 0}],
    }
    const result = createFramesPaths({snapshot, logger})
    assert.deepStrictEqual(result, [
      {
        path: ['selector1'],
        parentSnapshot: snapshot,
        cdtNode: snapshot.cdt[0],
      },
    ])
  })

  it('should create frame paths for frames that have cross origin frames', () => {
    const frameSnapshot = {
      cdt: [{nodeName: 'IFRAME-1'}, {nodeName: 'NOT-IFRAME'}, {nodeName: 'IFRAME-2'}],
      frames: [],
      crossFrames: [
        {selector: 'selector1', index: 0},
        {selector: 'selector2', index: 2},
      ],
      selector: 'selector0',
    }
    const snapshot = {
      cdt: 'top',
      frames: [frameSnapshot],
      crossFrames: [],
    }

    const result = createFramesPaths({snapshot, logger})
    assert.deepStrictEqual(result, [
      {
        path: ['selector0', 'selector1'],
        parentSnapshot: frameSnapshot,
        cdtNode: frameSnapshot.cdt[0],
      },
      {
        path: ['selector0', 'selector2'],
        parentSnapshot: frameSnapshot,
        cdtNode: frameSnapshot.cdt[2],
      },
    ])
  })
})
