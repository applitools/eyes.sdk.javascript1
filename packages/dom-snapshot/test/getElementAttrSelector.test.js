'use strict';
const {describe, it} = require('mocha');
const {expect} = require('chai');
const {JSDOM} = require('jsdom');
const getElementAttrSelector = require('../src/browser/getElementAttrSelector');

function getDocNode(htmlStr) {
  const dom = new JSDOM(htmlStr, {url: 'http://something.org/'});
  return dom.window.document;
}

describe('getElementAttrSelector', () => {
  it('works', () => {
    const doc = getDocNode(
      '<style id="some-id" class="c1 c2" name="some-name" data-something="bla"></style>',
    );
    expect(getElementAttrSelector(doc.querySelector('style'))).to.equal(
      'STYLE#some-id.c1.c2[name="some-name"][data-something="bla"]',
    );
  });
});
