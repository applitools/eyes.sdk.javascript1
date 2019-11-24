'use strict';

function makeBatchStore() {
  const store = {
    ids: new Set(),
    addId: id => {
      if (id && !store.ids.has(id)) {
        store.ids.add(id);
      }
    },
    hasCloseBatch: () => !!store.closeBatch,
    setCloseBatch: closeBatch => (store.closeBatch = closeBatch),
  };
  return store;
}

module.exports = makeBatchStore;
