'use strict'

function getFinalConcurrency({concurrency, testConcurrency}) {
  if (testConcurrency !== undefined) {
    return Number(testConcurrency)
  }
  const concurrencyNumber = Number(concurrency)
  if (!isNaN(concurrencyNumber)) {
    return concurrencyNumber * 5
  }
  return concurrencyNumber
}

module.exports = getFinalConcurrency
