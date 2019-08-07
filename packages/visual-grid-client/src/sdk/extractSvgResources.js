'use strict';

const {makeExtractResourcesFromSvg, toUnAnchoredUri} = require('@applitools/dom-snapshot');
const extractCssResources = require('./extractCssResources');
const flat = require('./flat');

let parser;
if (typeof DOMParser !== 'function') {
  const {JSDOM} = eval('require')('jsdom');
  parser = {parseFromString: str => new JSDOM(str).window.document};
} else {
  // in browser
  /* eslint-disable-next-line no-undef */
  parser = new DOMParser();
}

const decoder = {decode: buff => buff};
const doExtractSvgResources = makeExtractResourcesFromSvg({
  parser,
  decoder,
  extractResourceUrlsFromStyleTags,
});

function extractSvgResources(value) {
  return doExtractSvgResources(value).map(toUnAnchoredUri);
}

function extractResourceUrlsFromStyleTags(doc) {
  const urls = [...doc.querySelectorAll('style')].map(
    s => s.textContent && extractCssResources(s.textContent),
  );
  return flat(urls).filter(Boolean);
}

module.exports = extractSvgResources;
