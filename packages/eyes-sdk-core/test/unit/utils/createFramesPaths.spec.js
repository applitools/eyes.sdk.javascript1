const createFramesPaths = require('../../../lib/utils/createFramesPaths')
const assert = require('assert')
const {Logger} = require('../../../')

const logger = new Logger(process.env.APPLITOOLS_SHOW_LOGS)

describe('createFramesPaths', () => {
  it('should return an empty array when no cross frames exist', () => {
    const snapshot = {
      frames: [],
      crossFramesSelectors: [],
    }
    const result = createFramesPaths({snapshot, logger})
    assert.deepStrictEqual(result, [])
  })

  it('should create frame paths for cross origin frames', () => {
    const snapshot = {
      frames: [],
      crossFramesSelectors: ['selector1'],
    }
    const result = createFramesPaths({snapshot, logger})
    assert.deepStrictEqual(result, [
      {
        parentSnapshot: snapshot,
        path: ['selector1'],
      },
    ])
  })

  it('should create frame paths for frames that have cross origin frames', () => {
    const frameSnapshot = {
      cdt: 'frame',
      frames: [],
      crossFramesSelectors: ['selector1', 'selector2'],
      selector: 'selector0',
    }
    const snapshot = {
      cdt: 'top',
      frames: [frameSnapshot],
      crossFramesSelectors: [],
    }

    const result = createFramesPaths({snapshot, logger})
    assert.deepStrictEqual(result, [
      {
        parentSnapshot: frameSnapshot,
        path: ['selector0', 'selector1'],
      },
      {
        parentSnapshot: frameSnapshot,
        path: ['selector0', 'selector2'],
      },
    ])
  })
})
