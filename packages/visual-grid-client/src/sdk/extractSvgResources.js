'use strict';

const {DOMParser} = require('xmldom');
const {makeExtractResourcesFromSvg, toUnAnchoredUri} = require('@applitools/dom-snapshot');
const absolutizeUrl = require('./absolutizeUrl');

const parser = new DOMParser();
const decoder = {decode: buff => buff};
const extractResources = makeExtractResourcesFromSvg({parser, decoder});

function extractSvgResources(value, absoluteUrl) {
  return extractResources(value)
    .map(toUnAnchoredUri)
    .map(url => absolutizeUrl(url, absoluteUrl));
}

module.exports = extractSvgResources;
