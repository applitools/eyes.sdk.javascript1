'use strict';

function extractLinks(doc = document) {
  const srcsetRegexp = /(\S+)(?:\s+[\d.]+[wx])?(?:,|$)/g;
  const srcsetUrls = Array.from(doc.querySelectorAll('img[srcset],source[srcset]'), srcsetEl =>
    execAll(srcsetRegexp, srcsetEl.getAttribute('srcset'), match => match[1]),
  ).reduce((acc, urls) => acc.concat(urls), []);

  const srcUrls = Array.from(
    doc.querySelectorAll('img[src],source[src],input[type="image"][src],audio[src]'),
  ).map(srcEl => srcEl.getAttribute('src'));

  const imageUrls = Array.from(doc.querySelectorAll('image,use'))
    .map(hrefEl => hrefEl.getAttribute('href') || hrefEl.getAttribute('xlink:href'))
    .filter(u => u && u[0] !== '#');

  const objectUrls = Array.from(doc.querySelectorAll('object'))
    .map(el => el.getAttribute('data'))
    .filter(Boolean);

  const cssUrls = Array.from(
    doc.querySelectorAll('link[rel~="stylesheet"], link[as="stylesheet"]'),
  ).map(link => link.getAttribute('href'));

  const videoPosterUrls = Array.from(doc.querySelectorAll('video[poster]')).map(videoEl =>
    videoEl.getAttribute('poster'),
  );

  return Array.from(srcsetUrls)
    .concat(Array.from(srcUrls))
    .concat(Array.from(imageUrls))
    .concat(Array.from(cssUrls))
    .concat(Array.from(videoPosterUrls))
    .concat(Array.from(objectUrls));

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

module.exports = extractLinks;
