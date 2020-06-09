'use strict';
const {describe, it} = require('mocha');
const {expect} = require('chai');
const extractResourceUrlsFromStyleAttrs = require('../src/browser/extractResourceUrlsFromStyleAttrs');

describe('extractCssResourcesFromCdt', () => {
  it('works', () => {
    const cdt = [
      {
        nodeType: 9,
        childNodeIndexes: [1],
      },
      {
        nodeType: 1,
        nodeName: 'HTML',
        attributes: [],
        childNodeIndexes: [2],
      },
      {
        nodeType: 1,
        nodeName: 'BODY',
        attributes: [],
        childNodeIndexes: [3],
      },
      {
        nodeType: 1,
        nodeName: 'DIV',
        attributes: [
          {
            name: 'style',
            value:
              'position: absolute; z-index: 0; cursor: url("https://maps.gstatic.com/mapfiles/openhand_8_8.cur"), default; left: 0px; top: 0px; height: 100%; width: 100%; padding: 0px; border-width: 0px; margin: 0px; touch-action: pan-x pan-y;',
          },
        ],
        childNodeIndexes: [3],
      },
    ];

    const resourceUrls = extractResourceUrlsFromStyleAttrs(cdt, 'http://some/url');
    expect(resourceUrls).to.eql(['https://maps.gstatic.com/mapfiles/openhand_8_8.cur']);
  });
});
