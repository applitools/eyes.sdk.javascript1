'use strict';

const {describe, it} = require('mocha');
const {expect} = require('chai');
const {resolve} = require('path');
const getCypressConfig = require('../../../src/setup/getCypressConfig');

describe('getCypressConfig', () => {
  it('finds existing cypress.json', () => {
    const cwd = resolve(__dirname, 'fixtures');
    expect(getCypressConfig(cwd)).to.eql({
      pluginsFile: 'cypress/plugins/bla.js',
    });
  });

  it('handles non-existing cypress.json', () => {
    const cwd = '/some/nonexisting/path';
    expect(getCypressConfig(cwd)).to.equal(undefined);
  });
});
