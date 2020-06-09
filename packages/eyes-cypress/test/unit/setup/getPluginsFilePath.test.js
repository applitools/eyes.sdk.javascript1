'use strict';

const {describe, it} = require('mocha');
const {expect} = require('chai');
const getFilePath = require('../../../src/setup/getFilePath');

describe('getFilePath', () => {
  it('handles null config', () => {
    const cwd = '/some/path';
    expect(getFilePath('plugins', null, cwd)).to.equal(`${cwd}/cypress/plugins/index.js`);
  });

  it('handles config without pluginsFile entry', () => {
    const cwd = '/some/path';
    expect(getFilePath('plugins', {}, cwd)).to.equal(`${cwd}/cypress/plugins/index.js`);
  });

  it('handles config WITH pluginsFile entry', () => {
    const cwd = '/some/path';
    expect(getFilePath('plugins', {pluginsFile: 'other/place/bla.js'}, cwd)).to.equal(
      `${cwd}/other/place/bla.js`,
    );
  });
});
