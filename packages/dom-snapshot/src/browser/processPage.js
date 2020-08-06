'use strict';
const domNodesToCdt = require('./domNodesToCdt');
const aggregateResourceUrlsAndBlobs = require('./aggregateResourceUrlsAndBlobs');
const makeGetResourceUrlsAndBlobs = require('./getResourceUrlsAndBlobs');
const makeProcessResource = require('./processResource');
const makeExtractResourcesFromSvg = require('./makeExtractResourcesFromSvg');
const makeFetchUrl = require('./fetchUrl');
const makeFindStyleSheetByUrl = require('./findStyleSheetByUrl');
const makeExtractResourcesFromStyleSheet = require('./extractResourcesFromStyleSheet');
const makeExtractResourceUrlsFromStyleTags = require('./extractResourceUrlsFromStyleTags');
const getCorsFreeStyleSheet = require('./getCorsFreeStyleSheet');
const buildCanvasBlobs = require('./buildCanvasBlobs');
const extractFrames = require('./extractFrames');
const getBaesUrl = require('./getBaseUrl');
const absolutizeUrl = require('./absolutizeUrl');
const toUriEncoding = require('./toUriEncoding');
const toUnAnchoredUri = require('./toUnAnchoredUri');
const uniq = require('./uniq');
const flat = require('./flat');
const filterInlineUrl = require('./filterInlineUrl');
const makeLog = require('./log');
const noop = require('./noop');
const makeSessionCache = require('./sessionCache');

function processPage(
  doc = document,
  {showLogs, useSessionCache, dontFetchResources, fetchTimeout, skipResources} = {},
) {
  /* MARKER FOR TEST - DO NOT DELETE */
  const log = showLogs ? makeLog(Date.now()) : noop;
  log('processPage start');
  log(`skipResources length: ${skipResources && skipResources.length}`);
  const sessionCache = useSessionCache && makeSessionCache({log});
  const styleSheetCache = {};
  const extractResourcesFromStyleSheet = makeExtractResourcesFromStyleSheet({styleSheetCache});
  const findStyleSheetByUrl = makeFindStyleSheetByUrl({styleSheetCache});
  const extractResourceUrlsFromStyleTags = makeExtractResourceUrlsFromStyleTags(
    extractResourcesFromStyleSheet,
  );

  const extractResourcesFromSvg = makeExtractResourcesFromSvg({extractResourceUrlsFromStyleTags});
  const fetchUrl = makeFetchUrl({timeout: fetchTimeout});
  const processResource = makeProcessResource({
    fetchUrl,
    findStyleSheetByUrl,
    getCorsFreeStyleSheet,
    extractResourcesFromStyleSheet,
    extractResourcesFromSvg,
    absolutizeUrl,
    log,
    sessionCache,
  });

  const getResourceUrlsAndBlobs = makeGetResourceUrlsAndBlobs({
    processResource,
    aggregateResourceUrlsAndBlobs,
  });

  return doProcessPage(doc).then(result => {
    log('processPage end');
    result.scriptVersion = 'DOM_SNAPSHOT_SCRIPT_VERSION_TO_BE_REPLACED';
    return result;
  });

  function doProcessPage(doc, pageUrl = doc.location.href) {
    const baseUrl = getBaesUrl(doc) || pageUrl;
    const {cdt, docRoots, canvasElements, inlineFrames, linkUrls} = domNodesToCdt(
      doc,
      baseUrl,
      log,
    );

    const styleTagUrls = flat(docRoots.map(docRoot => extractResourceUrlsFromStyleTags(docRoot)));
    const absolutizeThisUrl = getAbsolutizeByUrl(baseUrl);
    const urls = uniq(Array.from(linkUrls).concat(Array.from(styleTagUrls)))
      .map(toUriEncoding)
      .map(absolutizeThisUrl)
      .map(toUnAnchoredUri)
      .filter(filterInlineUrlsIfExisting);

    const resourceUrlsAndBlobsPromise = dontFetchResources
      ? Promise.resolve({resourceUrls: urls, blobsObj: {}})
      : getResourceUrlsAndBlobs({documents: docRoots, urls, skipResources}).then(result => {
          sessionCache && sessionCache.persist();
          return result;
        });
    const canvasBlobs = buildCanvasBlobs(canvasElements);
    const frameDocs = extractFrames(docRoots);

    const processFramesPromise = frameDocs.map(f => doProcessPage(f));
    const processInlineFramesPromise = inlineFrames.map(({element, url}) =>
      doProcessPage(element.contentDocument, url),
    );

    const srcAttr =
      doc.defaultView &&
      doc.defaultView.frameElement &&
      doc.defaultView.frameElement.getAttribute('src');

    return Promise.all(
      [resourceUrlsAndBlobsPromise].concat(processFramesPromise).concat(processInlineFramesPromise),
    ).then(function(resultsWithFrameResults) {
      const {resourceUrls, blobsObj} = resultsWithFrameResults[0];
      const framesResults = resultsWithFrameResults.slice(1);
      return {
        cdt,
        url: pageUrl,
        srcAttr,
        resourceUrls: resourceUrls.map(url => url.replace(/^blob:/, '')),
        blobs: blobsObjToArray(blobsObj).concat(canvasBlobs),
        frames: framesResults,
      };
    });
  }
}

function getAbsolutizeByUrl(url) {
  return function(someUrl) {
    try {
      return absolutizeUrl(someUrl, url);
    } catch (err) {
      // can't do anything with a non-absolute url
    }
  };
}

function blobsObjToArray(blobsObj) {
  return Object.keys(blobsObj).map(blobUrl =>
    Object.assign(
      {
        url: blobUrl.replace(/^blob:/, ''),
      },
      blobsObj[blobUrl],
    ),
  );
}

function filterInlineUrlsIfExisting(absoluteUrl) {
  return absoluteUrl && filterInlineUrl(absoluteUrl);
}

module.exports = processPage;
