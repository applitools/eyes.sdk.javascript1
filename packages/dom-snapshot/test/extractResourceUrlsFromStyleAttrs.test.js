'use strict';
const {describe, it} = require('mocha');
const {expect} = require('chai');
const extractResourceUrlsFromStyleAttrs = require('../src/browser/extractResourceUrlsFromStyleAttrs');
const getDocNode = require('./util/getDocNode');

describe('extractResourceUrlsFromStyleAttrs', () => {
  it('works', () => {
    const doc = getDocNode(
      `<div style='position: absolute; z-index: 0; cursor: url("https://maps.gstatic.com/mapfiles/openhand_8_8.cur"), default; left: 0px; top: 0px; height: 100%; width: 100%; padding: 0px; border-width: 0px; margin: 0px; touch-action: pan-x pan-y;'></div>`,
    );
    const resourceUrls = extractResourceUrlsFromStyleAttrs(doc.querySelector('div'));
    expect(resourceUrls).to.eql(['https://maps.gstatic.com/mapfiles/openhand_8_8.cur']);
  });
});
