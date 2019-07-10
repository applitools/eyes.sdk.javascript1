'use strict';

const absolutizeUrl = require('./absolutizeUrl');
const {toUriEncoding, toUnAnchoredUri} = require('@applitools/dom-snapshot');
const valueParser = require('postcss-value-parser');

function makeExtractCssResources(logger) {
  return function extractCssResources(cssText, absoluteUrl) {
    const urls = [];
    const parsedValue = valueParser(cssText);
    try {
      parsedValue.walk((node, i, nodes) => {
        const nUrls = nodeUrls(node, i, nodes);
        nUrls && urls.push(...nUrls);
      });
    } catch (e) {
      logger.log(`could not parse css ${absoluteUrl}`, e);
    }
    return [...new Set(urls)]
      .map(toUriEncoding)
      .map(toUnAnchoredUri)
      .map(url => absolutizeUrl(url, absoluteUrl));
  };
}

function nodeUrls(node, i, nodes) {
  if (node.type === 'function' && node.value === 'url' && node.nodes && node.nodes.length == 1) {
    return [node.nodes[0].value];
  } else if (
    node.type === 'word' &&
    node.value === '@import' &&
    nodes[i + 2] &&
    nodes[i + 2].type === 'string'
  ) {
    return [nodes[i + 2].value];
  } else if (node.type === 'function' && node.value.includes('image-set') && node.nodes) {
    return node.nodes.filter(n => n.type === 'string').map(n => n.value);
  }
}

module.exports = makeExtractCssResources;
