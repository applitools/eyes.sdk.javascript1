'use strict'

function deserializeDomSnapshotResult(domSnapshotResult) {
  const ret = {
    ...domSnapshotResult,
    resourceContents: blobDataToResourceContents(domSnapshotResult.blobs),
    frames: domSnapshotResult.frames.map(deserializeDomSnapshotResult),
  }
  delete ret.blobs
  delete ret.selector
  delete ret.crossFrames
  return ret
}

function blobDataToResourceContents(blobs) {
  return blobs.reduce((acc, blob) => {
    acc[blob.url] =
      blob.value !== undefined
        ? Object.assign(blob, {value: Buffer.from(blob.value, 'base64')})
        : blob
    return acc
  }, {})
}

module.exports = deserializeDomSnapshotResult
