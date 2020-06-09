'use strict';
const {describe, it} = require('mocha');
const {expect} = require('chai');
const {
  parse,
  CSSImportRule,
  CSSFontFaceRule,
  CSSSupportsRule,
  CSSMediaRule,
  CSSStyleRule,
  CSSRule,
} = require('cssom');
const makeExtractResourceUrlsFromStyleTags = require('../src/browser/extractResourceUrlsFromStyleTags');
const makeExtractResourcesFromStyleSheet = require('../src/browser/extractResourcesFromStyleSheet');
const extractResourcesFromStyleSheet = makeExtractResourcesFromStyleSheet({
  styleSheetCache: {},
  CSSRule,
});

describe('extractResourceUrlsFromStyleTags', () => {
  it('supports resources in style attributes', () => {
    const extractResourceUrlsFromStyleTags = makeExtractResourceUrlsFromStyleTags(
      extractResourcesFromStyleSheet,
    );
    const doc = {
      querySelectorAll: () => ['style1', 'style2', 'style3', 'style4'],
      styleSheets: [
        createStyleSheet('@import "something.css";', 'style1'),
        createStyleSheet('div{display:none;}', 'style2'),
        createStyleSheet('span{background: url("image.png");}', 'style3'),
        createStyleSheet('.some{clip-path:url(#firstSvg)};', 'style4'), // filter inline refrences
      ],
      defaultView: {
        CSSImportRule,
        CSSFontFaceRule,
        CSSSupportsRule,
        CSSMediaRule,
        CSSStyleRule,
      },
    };
    const resourceUrls = extractResourceUrlsFromStyleTags(doc);
    expect(resourceUrls).to.eql(['something.css', 'image.png']);
  });
});

function createStyleSheet(cssText, styleEl) {
  const styleSheet = parse(cssText);
  styleSheet.ownerNode = styleEl;
  return styleSheet;
}
