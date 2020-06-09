'use strict'

const {describe, it} = require('mocha')
const {expect} = require('chai')
const deserializeDomSnapshotResult = require('../../../lib/utils/deserializeDomSnapshotResult')

describe('deserializeDomSnapshotResult', () => {
  it('converts base64 strings in "blobs" property to buffers in "resourceContents"', () => {
    const domSnapshotResult = {
      blobs: [
        {url: 'u1', type: 't1', value: Buffer.from('v1').toString('base64')},
        {url: 'u2', type: 't2', value: Buffer.from('v2').toString('base64')},
      ],
      frames: [],
    }

    const deserializedResult = deserializeDomSnapshotResult(domSnapshotResult)
    expect(deserializedResult).to.eql({
      frames: [],
      resourceContents: {
        u1: {url: 'u1', type: 't1', value: Buffer.from('v1')},
        u2: {url: 'u2', type: 't2', value: Buffer.from('v2')},
      },
    })
  })

  it('handles frames', () => {
    const domSnapshotResult = {
      blobs: [],
      frames: [
        {
          blobs: [
            {url: 'u1', type: 't1', value: Buffer.from('v1').toString('base64')},
            {url: 'u2', type: 't2', value: Buffer.from('v2').toString('base64')},
          ],
          frames: [],
        },
        {
          blobs: [
            {url: 'u3', type: 't3', value: Buffer.from('v3').toString('base64')},
            {url: 'u4', type: 't4', value: Buffer.from('v4').toString('base64')},
          ],
          frames: [],
        },
      ],
    }

    const deserializedResult = deserializeDomSnapshotResult(domSnapshotResult)
    expect(deserializedResult).to.eql({
      frames: [
        {
          resourceContents: {
            u1: {url: 'u1', type: 't1', value: Buffer.from('v1')},
            u2: {url: 'u2', type: 't2', value: Buffer.from('v2')},
          },
          frames: [],
        },
        {
          resourceContents: {
            u3: {url: 'u3', type: 't3', value: Buffer.from('v3')},
            u4: {url: 'u4', type: 't4', value: Buffer.from('v4')},
          },
          frames: [],
        },
      ],
      resourceContents: {},
    })
  })

  it('handles nested frames', () => {
    const domSnapshotResult = {
      blobs: [],
      frames: [
        {
          blobs: [
            {url: 'u1', type: 't1', value: Buffer.from('v1').toString('base64')},
            {url: 'u2', type: 't2', value: Buffer.from('v2').toString('base64')},
          ],
          frames: [
            {
              blobs: [
                {url: 'u3', type: 't3', value: Buffer.from('v3').toString('base64')},
                {url: 'u4', type: 't4', value: Buffer.from('v4').toString('base64')},
              ],
              frames: [],
            },
          ],
        },
      ],
    }

    const deserializedResult = deserializeDomSnapshotResult(domSnapshotResult)
    expect(deserializedResult).to.eql({
      frames: [
        {
          resourceContents: {
            u1: {url: 'u1', type: 't1', value: Buffer.from('v1')},
            u2: {url: 'u2', type: 't2', value: Buffer.from('v2')},
          },
          frames: [
            {
              resourceContents: {
                u3: {url: 'u3', type: 't3', value: Buffer.from('v3')},
                u4: {url: 'u4', type: 't4', value: Buffer.from('v4')},
              },
              frames: [],
            },
          ],
        },
      ],
      resourceContents: {},
    })
  })

  it('keeps all properties that were originally in the input object', () => {
    const result = {
      x: 'x',
      y: 'y',
      blobs: [],
      frames: [],
    }

    const deserializedResult = deserializeDomSnapshotResult(result)
    expect(deserializedResult).to.eql({
      x: 'x',
      y: 'y',
      frames: [],
      resourceContents: {},
    })
  })
})
