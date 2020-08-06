'use strict';
const extractResourceUrlsFromStyleAttrs = require('./extractResourceUrlsFromStyleAttrs');

const srcsetRegexp = /(\S+)(?:\s+[\d.]+[wx])?(?:,|$)/g;

function extractLinksFromElement(el) {
  const matches = (el.matches || el.msMatchesSelector).bind(el);

  let urls = [];

  // srcset urls
  if (matches('img[srcset],source[srcset]')) {
    urls = urls.concat(execAll(srcsetRegexp, el.getAttribute('srcset'), match => match[1]));
  }

  // src urls
  if (matches('img[src],source[src],input[type="image"][src],audio[src],video[src]')) {
    urls.push(el.getAttribute('src'));
  }

  // image urls
  if (matches('image,use')) {
    const href = el.getAttribute('href') || el.getAttribute('xlink:href');
    if (href && href[0] !== '#') {
      urls.push(href);
    }
  }

  // object urls
  if (matches('object') && el.getAttribute('data')) {
    urls.push(el.getAttribute('data'));
  }

  // css urls
  if (matches('link[rel~="stylesheet"], link[as="stylesheet"]')) {
    urls.push(el.getAttribute('href'));
  }

  // video poster urls
  if (matches('video[poster]')) {
    urls.push(el.getAttribute('poster'));
  }

  // style attribute urls
  const styleAttrUrls = extractResourceUrlsFromStyleAttrs(el);
  if (styleAttrUrls) {
    urls = urls.concat(styleAttrUrls);
  }

  return urls;

  // can be replaced with matchAll once Safari supports it
  function execAll(regexp, string, mapper) {
    const matches = [];
    const clonedRegexp = new RegExp(regexp.source, regexp.flags);
    const isGlobal = clonedRegexp.global;
    let match;
    while ((match = clonedRegexp.exec(string))) {
      matches.push(mapper(match));
      if (!isGlobal) break;
    }
    return matches;
  }
}

module.exports = extractLinksFromElement;
