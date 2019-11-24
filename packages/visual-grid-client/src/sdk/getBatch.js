'use strict';
const {BatchInfo} = require('@applitools/eyes-sdk-core');

function getBatch({batchSequence, batchName, batchId}) {
  const batchInfo = new BatchInfo({name: batchName, id: batchId, sequenceName: batchSequence});

  return {
    batchSequence: batchInfo.getSequenceName(),
    batchName: batchInfo.getName(),
    batchId: batchInfo.getId(),
  };
}

module.exports = getBatch;
