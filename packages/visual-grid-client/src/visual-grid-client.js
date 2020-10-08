'use strict'

const {
  DiffsFoundError,
  TestResults,
  TestFailedError,
  TestResultsStatus,
} = require('@applitools/eyes-sdk-core')

const makeVisualGridClient = require('./sdk/renderingGridClient')
const configParams = require('./sdk/configParams')
const takeScreenshot = require('./sdk/takeScreenshot')

module.exports = {
  configParams,
  makeVisualGridClient,
  takeScreenshot,
  DiffsFoundError,
  TestResults,
  TestFailedError,
  TestResultsStatus,
}
