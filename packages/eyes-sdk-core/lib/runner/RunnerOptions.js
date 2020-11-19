'use strict'

function RunnerOptions() {
  const options = {}

  return {
    testConcurrency(value) {
      return {...options, testConcurrency: value}
    },
  }
}

module.exports = RunnerOptions
