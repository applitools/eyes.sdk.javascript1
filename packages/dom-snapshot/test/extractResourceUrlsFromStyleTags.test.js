'use strict';
const {describe, it} = require('mocha');
const {expect} = require('chai');
const makeExtractResourceUrlsFromStyleTags = require('../src/browser/extractResourceUrlsFromStyleTags');

describe('extractResourceUrlsFromStyleTags', () => {
  it('returns extracted resources uniquely', () => {
    const extractResourceUrlsFromStyleTags = makeExtractResourceUrlsFromStyleTags(styleSheet => {
      const {ownerNode} = styleSheet;
      switch (ownerNode) {
        case 'style1': {
          return ['u1'];
        }
        case 'style2': {
          return ['u2', 'u1'];
        }
        case 'style3': {
          return ['u3', 'u3.1'];
        }
        default: {
          break;
        }
      }
    });

    const doc = {
      querySelectorAll: () => ['style1', 'style2', 'style3', 'style4'],
      styleSheets: [{ownerNode: 'style1'}, {ownerNode: 'style2'}, {ownerNode: 'style3'}],
    };
    const resourceUrls = extractResourceUrlsFromStyleTags(doc);
    expect(resourceUrls).to.eql(['u1', 'u2', 'u3', 'u3.1']);
  });

  it('support onlyDocStylesheet', () => {
    const extractResourceUrlsFromStyleTags = makeExtractResourceUrlsFromStyleTags(styleSheet => {
      switch (styleSheet) {
        case 'style1': {
          return ['u1'];
        }
        case 'style2': {
          return ['u2'];
        }
        case 'style3': {
          return ['u3', 'u3.1'];
        }
        default: {
          break;
        }
      }
    });

    const doc = {
      querySelectorAll: () => [{sheet: 'style1'}, {sheet: 'style2'}, {sheet: 'style3'}, {}],
    };
    const resourceUrls = extractResourceUrlsFromStyleTags(doc, false);
    expect(resourceUrls).to.eql(['u1', 'u2', 'u3', 'u3.1']);
  });
});
