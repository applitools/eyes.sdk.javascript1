'use strict';
const {URL} = require('url');

function getIframeUrl(baseUrl) {
  const {origin, pathname} = new URL(baseUrl);

  let baseUrlFixed = `${origin}${pathname.replace(/\/[^\/]+\.html/, '')}`;

  if (!/\/$/.test(baseUrlFixed)) {
    baseUrlFixed += '/';
  }

  const url = new URL(`iframe.html?eyes-storybook=true`, baseUrlFixed);
  return url.href;
}

module.exports = getIframeUrl;
