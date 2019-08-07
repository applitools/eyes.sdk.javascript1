'use strict';

const {toUriEncoding, toUnAnchoredUri} = require('@applitools/dom-snapshot');
const valueParser = require('postcss-value-parser');

function extractCssResources(cssText) {
  const urls = [];
  const parsedValue = valueParser(cssText);
  parsedValue.walk((node, i, nodes) => {
    const nUrls = nodeUrls(node, i, nodes);
    nUrls && urls.push(...nUrls);
  });
  return [...new Set(urls)].map(toUriEncoding).map(toUnAnchoredUri);
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

module.exports = extractCssResources;
