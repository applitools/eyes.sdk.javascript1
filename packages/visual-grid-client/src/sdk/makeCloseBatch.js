'use strict';

function makeCloseBatch({globalState, dontCloseBatches, isDisabled}) {
  if (dontCloseBatches || isDisabled) {
    return async () => {};
  }

  return async () => {
    const {ids, closeBatch} = globalState.batchStore;
    const promises = [...ids.values()].map(id => closeBatch(id));
    await Promise.all(promises);
  };
}

module.exports = makeCloseBatch;
