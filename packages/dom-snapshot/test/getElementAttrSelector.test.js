'use strict';
const {describe, it} = require('mocha');
const {expect} = require('chai');
const getElementAttrSelector = require('../src/browser/getElementAttrSelector');
const getDocNode = require('./util/getDocNode');

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
