'use strict'

function deserializeDomSnapshotResult(domSnapshotResult) {
  const ret = {
    ...domSnapshotResult,
    resourceContents: blobDataToResourceContents(domSnapshotResult.blobs),
    frames: domSnapshotResult.frames.map(deserializeDomSnapshotResult),
  }
  delete ret.blobs
  return ret
}

function blobDataToResourceContents(blobs) {
  return blobs.reduce((acc, {url, type, value}) => {
    acc[url] = {url, type, value: Buffer.from(value, 'base64')}
    return acc
  }, {})
}

module.exports = deserializeDomSnapshotResult
