'use strict';
const filterInlineUrl = require('./filterInlineUrl');
const toUnAnchoredUri = require('./toUnAnchoredUri');
const absolutizeUrl = require('./absolutizeUrl');
const noop = require('./noop');
const flat = require('./flat');
const uniq = require('./uniq');

function makeProcessResource({
  fetchUrl,
  findStyleSheetByUrl,
  getCorsFreeStyleSheet,
  extractResourcesFromStyleSheet,
  extractResourcesFromSvg,
  sessionCache,
  cache = {},
  log = noop,
}) {
  return function processResource({
    url,
    documents,
    getResourceUrlsAndBlobs,
    forceCreateStyle = false,
    skipResources,
  }) {
    if (!cache[url]) {
      if (sessionCache && sessionCache.getItem(url)) {
        const resourceUrls = getDependencies(url);
        log('doProcessResource from sessionStorage', url, 'deps:', resourceUrls.slice(1));
        cache[url] = Promise.resolve({resourceUrls});
      } else if (
        (skipResources && skipResources.indexOf(url) > -1) ||
        /https:\/\/fonts.googleapis.com/.test(url)
      ) {
        log('not processing resource from skip list (or google font):', url);
        cache[url] = Promise.resolve({resourceUrls: [url]});
      } else {
        const now = Date.now();
        cache[url] = doProcessResource(url).then(result => {
          log('doProcessResource', `[${Date.now() - now}ms]`, url);
          return result;
        });
      }
    }
    return cache[url];

    function doProcessResource(url) {
      log('fetching', url);
      const now = Date.now();
      return fetchUrl(url)
        .catch(e => {
          if (probablyCORS(e)) {
            return {probablyCORS: true, url};
          } else if (e.isTimeout) {
            return {isTimeout: true, url};
          } else {
            throw e;
          }
        })
        .then(({url, type, value, probablyCORS, errorStatusCode, isTimeout}) => {
          if (probablyCORS) {
            log('not fetched due to CORS', `[${Date.now() - now}ms]`, url);
            sessionCache && sessionCache.setItem(url, []);
            return {resourceUrls: [url]};
          }

          if (errorStatusCode) {
            const blobsObj = {[url]: {errorStatusCode}};
            sessionCache && sessionCache.setItem(url, []);
            return {blobsObj};
          }

          if (isTimeout) {
            log('not fetched due to timeout, returning error status code 504 (Gateway timeout)');
            sessionCache && sessionCache.setItem(url, []);
            return {
              blobsObj: {[url]: {errorStatusCode: 504}},
            };
          }

          log(`fetched [${Date.now() - now}ms] ${url} bytes: ${value.byteLength}`);

          const thisBlob = {[url]: {type, value}};
          let dependentUrls;
          if (/text\/css/.test(type)) {
            let styleSheet = findStyleSheetByUrl(url, documents);
            if (styleSheet || forceCreateStyle) {
              const {corsFreeStyleSheet, cleanStyleSheet} = getCorsFreeStyleSheet(
                value,
                styleSheet,
              );
              dependentUrls = extractResourcesFromStyleSheet(corsFreeStyleSheet);
              cleanStyleSheet();
            }
          } else if (/image\/svg/.test(type)) {
            try {
              dependentUrls = extractResourcesFromSvg(value);
              forceCreateStyle = !!dependentUrls;
            } catch (e) {
              log('could not parse svg content', e);
            }
          }

          if (dependentUrls) {
            const absoluteDependentUrls = dependentUrls
              .map(resourceUrl => absolutizeUrl(resourceUrl, url.replace(/^blob:/, '')))
              .map(toUnAnchoredUri)
              .filter(filterInlineUrl);

            sessionCache && sessionCache.setItem(url, absoluteDependentUrls);

            return getResourceUrlsAndBlobs({
              documents,
              urls: absoluteDependentUrls,
              forceCreateStyle,
              skipResources,
            }).then(({resourceUrls, blobsObj}) => ({
              resourceUrls,
              blobsObj: Object.assign(blobsObj, thisBlob),
            }));
          } else {
            sessionCache && sessionCache.setItem(url, []);
            return {blobsObj: thisBlob};
          }
        })
        .catch(err => {
          log(
            'error while fetching',
            url,
            err,
            err ? `message=${err.message} | name=${err.name}` : '',
          );
          sessionCache && clearFromSessionStorage();
          return {};
        });
    }

    function probablyCORS(err) {
      const msg =
        err.message &&
        (err.message.includes('Failed to fetch') || err.message.includes('Network request failed'));
      const name = err.name && err.name.includes('TypeError');
      return msg && name;
    }

    function getDependencies(url) {
      const dependentUrls = sessionCache.getItem(url);
      return [url].concat(dependentUrls ? uniq(flat(dependentUrls.map(getDependencies))) : []);
    }

    function clearFromSessionStorage() {
      log('clearing from sessionStorage:', url);
      sessionCache.keys().forEach(key => {
        const dependentUrls = sessionCache.getItem(key);
        sessionCache.setItem(
          key,
          dependentUrls.filter(dep => dep !== url),
        );
      });
      log('cleared from sessionStorage:', url);
    }
  };
}

module.exports = makeProcessResource;
