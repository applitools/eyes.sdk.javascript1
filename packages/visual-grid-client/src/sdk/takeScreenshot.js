/* global fetch */
'use script';

const makeGetAllResources = require('./getAllResources');
const extractCssResources = require('./extractCssResources');
const makeFetchResource = require('./fetchResource');
const createResourceCache = require('./createResourceCache');
const makeWaitForRenderedStatus = require('./waitForRenderedStatus');
const makeGetRenderStatus = require('./getRenderStatus');
const makePutResources = require('./putResources');
const makeRenderBatch = require('./renderBatch');
const makeCreateRGridDOMAndGetResourceMapping = require('./createRGridDOMAndGetResourceMapping');
const getRenderMethods = require('./getRenderMethods');
const {createRenderWrapper} = require('./wrapperUtils');
const {ptimeoutWithError} = require('@applitools/functional-commons');
const createRenderRequests = require('./createRenderRequests');
const {RenderingInfo, Logger} = require('@applitools/eyes-sdk-core');

require('@applitools/isomorphic-fetch'); // TODO can just use node-fetch

const fetchResourceTimeout = 120000;

async function takeScreenshot({
  showLogs,
  apiKey,
  serverUrl,
  proxy,
  renderInfo,
  cdt,
  url,
  resourceUrls,
  blobs,
  frames,
  browsers = [{width: 1024, height: 768}],
  sizeMode = 'full-page',
  // selector,
  // region,
  // scriptHooks,
}) {
  const resourceContents = blobDataToResourceContents(blobs);
  const framesWithResources = createResourceContents(frames);
  const renderingInfo = new RenderingInfo({
    serviceUrl: renderInfo.serviceUrl,
    accessToken: renderInfo.accessToken,
    resultsUrl: renderInfo.resultsUrl,
  });

  const {createRGridDOMAndGetResourceMapping, renderBatch, waitForRenderedStatus} = makeRenderer({
    apiKey,
    showLogs,
    serverUrl,
    proxy,
    renderingInfo,
  });

  const {rGridDom: dom, allResources: resources} = await createRGridDOMAndGetResourceMapping({
    resourceUrls,
    resourceContents,
    cdt,
    frames: framesWithResources,
  });

  const renderRequests = createRenderRequests({
    url,
    dom,
    resources: Object.values(resources),
    browsers,
    renderInfo: renderingInfo,
    sizeMode,
    // selector,
    // region,
    // scriptHooks,
    sendDom: true,
  });

  const renderIds = await renderBatch(renderRequests);

  const renderStatusResults = await Promise.all(
    renderIds.map(renderId =>
      waitForRenderedStatus(renderId, () => false).then(({imageLocation}) => ({
        imageLocation,
        renderId,
      })),
    ),
  );

  return renderStatusResults;
}

function makeRenderer({apiKey, showLogs, serverUrl, proxy, renderingInfo}) {
  const logger = new Logger(showLogs);

  const renderWrapper = createRenderWrapper({
    apiKey,
    logHandler: logger.getLogHandler(),
    serverUrl,
    proxy,
  });

  const {doRenderBatch, doPutResource, doGetRenderStatus} = getRenderMethods(renderWrapper);
  renderWrapper.setRenderingInfo(renderingInfo);

  const resourceCache = createResourceCache();
  const fetchCache = createResourceCache();
  const fetchWithTimeout = url =>
    ptimeoutWithError(fetch(url), fetchResourceTimeout, 'fetche timed out');
  const fetchResource = makeFetchResource({logger, fetchCache, fetch: fetchWithTimeout});
  const putResources = makePutResources({doPutResource});
  const renderBatch = makeRenderBatch({
    putResources,
    resourceCache,
    fetchCache,
    logger,
    doRenderBatch,
  });
  const getRenderStatus = makeGetRenderStatus({logger, doGetRenderStatus});
  const waitForRenderedStatus = makeWaitForRenderedStatus({logger, getRenderStatus});
  const getAllResources = makeGetAllResources({
    resourceCache,
    extractCssResources,
    fetchResource,
    logger,
  });
  const createRGridDOMAndGetResourceMapping = makeCreateRGridDOMAndGetResourceMapping({
    getAllResources,
  });

  return {createRGridDOMAndGetResourceMapping, renderBatch, waitForRenderedStatus};
}

function createResourceContents(frames) {
  return frames.map(frame => {
    return {
      url: frame.url,
      cdt: frame.cdt,
      resourceUrls: frame.resourceUrls,
      resourceContents: blobDataToResourceContents(frame.blobs),
      frames: frame.frames ? createResourceContents(frame.frames) : undefined,
    };
  });
}

function blobDataToResourceContents(blobs) {
  return blobs.reduce((acc, {url, type, value}) => {
    acc[url] = {url, type, value: Buffer.from(value, 'base64')};
    return acc;
  }, {});
}

module.exports = takeScreenshot;
