'use strict';

function makeCloseBatch(batches) {
  return async () => {
    const promises = [...batches.entries()].map(([id, closeBatch]) => closeBatch(id));
    await Promise.all(promises);
  };
}

module.exports = makeCloseBatch;
