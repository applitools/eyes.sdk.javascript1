'use strict';

const {ConfigUtils, Logger, TypeUtils} = require('@applitools/eyes-sdk-core');
const {makeVisualGridClient, configParams} = require('@applitools/visual-grid-client');
const makeStartServer = require('./server');
const makePluginExport = require('./pluginExport');
const {startApp} = require('./app');
const getErrorsAndDiffs = require('./getErrorsAndDiffs');
const processCloseAndAbort = require('./processCloseAndAbort');
const errorDigest = require('./errorDigest');
const makeHandlers = require('./handlers');
const {version: packageVersion} = require('../../package.json');
const agentId = `eyes-cypress/${packageVersion}`;

const config = Object.assign(
  {agentId},
  ConfigUtils.getConfig({
    configParams: [
      ...configParams,
      'failCypressOnDiff',
      'tapDirPath',
      'eyesTimeout',
      'disableBrowserFetching',
    ],
  }),
);
if (config.failCypressOnDiff === '0') {
  config.failCypressOnDiff = false;
}
if (TypeUtils.isString(config.showLogs)) {
  config.showLogs = config.showLogs === 'true' || config.showLogs === '1';
}

const logger = new Logger(config.showLogs, 'eyes');
const handlers = makeHandlers({
  logger,
  config,
  makeVisualGridClient,
  processCloseAndAbort,
  getErrorsAndDiffs,
  errorDigest,
});
const app = startApp({handlers, logger});
const startServer = makeStartServer({app, logger});

logger.log('eyes-cypress plugin running with config:', config);

module.exports = makePluginExport({startServer, config});
