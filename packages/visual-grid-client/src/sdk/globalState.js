'use strict';
const makeTestController = require('./makeTestController');
const makeBatchStore = require('./makeBatchStore');

function makeGlobalState({logger}) {
  let queuedRendersCount = 0;
  const queuedRendersConditions = [];

  return {
    makeTestController,
    getQueuedRendersCount,
    setQueuedRendersCount,
    waitForQueuedRenders,
    batchStore: makeBatchStore(),
  };

  function getQueuedRendersCount() {
    return queuedRendersCount;
  }

  function setQueuedRendersCount(value) {
    logger.log('setting queued renders count to', value);
    queuedRendersCount = value;
    checkCondition();
  }

  async function waitForQueuedRenders(desiredCount) {
    if (desiredCount < queuedRendersCount) {
      return new Promise(resolve => {
        queuedRendersConditions.push({resolve, desiredCount});
      });
    }
  }

  function checkCondition() {
    const condition = queuedRendersConditions[0];
    if (condition && condition.desiredCount >= queuedRendersCount) {
      queuedRendersConditions.splice(0, 1);
      condition.resolve();
    }
  }
}

module.exports = makeGlobalState;
