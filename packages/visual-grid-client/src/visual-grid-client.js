'use strict';

const {
  DiffsFoundError,
  TestResults,
  TestFailedError,
  TestResultsStatus,
} = require('@applitools/eyes-sdk-core');

const makeVisualGridClient = require('./sdk/renderingGridClient');
const configParams = require('./sdk/configParams');
const takeScreenshot = require('./sdk/takeScreenshot');
const takeDomSnapshot = require('./utils/takeDomSnapshot');

module.exports = {
  configParams,
  makeVisualGridClient,
  takeScreenshot,
  capturePageDom: takeDomSnapshot, // TODO: should be removed later (used from WDIO SDKs)
  takeDomSnapshot,
  DiffsFoundError,
  TestResults,
  TestFailedError,
  TestResultsStatus,
};
