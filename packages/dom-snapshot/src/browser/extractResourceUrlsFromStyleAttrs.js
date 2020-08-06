'use strict';
const getUrlFromCssText = require('./getUrlFromCssText');

function extractResourceUrlsFromStyleAttrs(el) {
  const style = el.getAttribute('style');
  if (style) return getUrlFromCssText(style);
}

module.exports = extractResourceUrlsFromStyleAttrs;
