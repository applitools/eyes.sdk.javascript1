'use strict';
const flat = require('./flat');
const toUnAnchoredUri = require('./toUnAnchoredUri');
const sanitizeAuthUrl = require('./sanitizeAuthUrl');

function makeFindStyleSheetByUrl({styleSheetCache}) {
  return function findStyleSheetByUrl(url, documents) {
    const allStylesheets = flat(
      documents.map(d => {
        try {
          return Array.from(d.styleSheets);
        } catch (_e) {
          // A 'fake' documnetFragment doesn't have styleSheets
          return [];
        }
      }),
    );
    return (
      styleSheetCache[url] ||
      allStylesheets.find(styleSheet => {
        const styleUrl = styleSheet.href && toUnAnchoredUri(styleSheet.href);
        return styleUrl && sanitizeAuthUrl(styleUrl) === url;
      })
    );
  };
}

module.exports = makeFindStyleSheetByUrl;
