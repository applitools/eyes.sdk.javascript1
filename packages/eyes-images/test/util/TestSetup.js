'use strict'
const {Eyes, BatchInfo, ConsoleLogHandler} = require('../../index')

const batch = new BatchInfo('JS Coverage Tests - eyes-selenium')

function getEyes(options) {
  const eyes = new Eyes()
  if (options) {
    if (options.branchName) eyes.setBranchName(options.branchName)
    else eyes.setBranchName('master')
    if (options.config) eyes.setConfiguration(options.config)
  } else setDefault()

  if (process.env.APPLITOOLS_SHOW_LOGS) {
    eyes.setLogHandler(new ConsoleLogHandler(true))
  }

  return eyes

  function setDefault() {
    eyes.setParentBranchName('master')
    eyes.setBatch(batch)
  }
}

function getBatch() {
  return batch
}

module.exports = {
  getEyes: getEyes,
  getBatch: getBatch,
}
