'use strict';

function storeBatchHandle(wrappers, batches) {
  const batchId = wrappers[0].getExistingBatchId();
  if (batchId && !batches.has()) {
    const deleteBatchSessions = wrappers[0]._serverConnector.deleteBatchSessions.bind(
      wrappers[0]._serverConnector,
    );
    batches.set(batchId, deleteBatchSessions);
  }
}

module.exports = storeBatchHandle;
