'use strict';
const getUrlFromCssText = require('./getUrlFromCssText');
const uniq = require('./uniq');

function makeExtractResourcesFromStyleSheet({styleSheetCache, CSSRule = window.CSSRule}) {
  return function extractResourcesFromStyleSheet(styleSheet) {
    const urls = uniq(
      Array.from(styleSheet.cssRules || []).reduce((acc, rule) => {
        const getRuleUrls = {
          [CSSRule.IMPORT_RULE]: () => {
            if (rule.styleSheet) {
              styleSheetCache[rule.styleSheet.href] = rule.styleSheet;
            }
            return rule.href;
          },
          [CSSRule.FONT_FACE_RULE]: () => getUrlFromCssText(rule.cssText),
          [CSSRule.SUPPORTS_RULE]: () => extractResourcesFromStyleSheet(rule),
          [CSSRule.MEDIA_RULE]: () => extractResourcesFromStyleSheet(rule),
          [CSSRule.STYLE_RULE]: () => {
            let rv = [];
            for (let i = 0, ii = rule.style.length; i < ii; i++) {
              const property = rule.style[i];
              let propertyValue = rule.style.getPropertyValue(property);
              if (/^\s*var\s*\(/.test(propertyValue) || /^--/.test(property)) {
                propertyValue = unescapeCss(propertyValue);
              }
              const urls = getUrlFromCssText(propertyValue);
              rv = rv.concat(urls);
            }
            return rv;
          },
        }[rule.type];

        const urls = (getRuleUrls && getRuleUrls()) || [];
        return acc.concat(urls);
      }, []),
    );
    return urls.filter(u => u[0] !== '#');
  };
}

// copied from https://github.com/applitools/mono/commit/512ed8b805ab0ee6701ee04301e982afb382a7f0#diff-4d4bb24a63912943219ab77a43b29ee3R99
function unescapeCss(text) {
  return text
    .replace(/(\\[0-9a-fA-F]{1,6}\s?)/g, original =>
      String.fromCodePoint(parseInt(original.substr(1).trim(), 16)),
    )
    .replace(/\\([^0-9a-fA-F])/g, '$1');
}

module.exports = makeExtractResourcesFromStyleSheet;
