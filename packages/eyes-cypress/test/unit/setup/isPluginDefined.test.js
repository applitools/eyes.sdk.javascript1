'use strict';

const {describe, it} = require('mocha');
const {expect} = require('chai');
const isPluginDefined = require('../../../src/setup/isPluginDefined');

describe('isPluginDefined', () => {
  it('handles single quote require', () => {
    const text = "require('@applitools/eyes-cypress');";
    expect(isPluginDefined(text)).to.equal(true);
  });

  it('handles double quote require', () => {
    const text = 'require("@applitools/eyes-cypress");';
    expect(isPluginDefined(text)).to.equal(true);
  });

  it('handles require with spaces', () => {
    const text = 'require ( "@applitools/eyes-cypress" ) ;';
    expect(isPluginDefined(text)).to.equal(true);
  });

  it('handles multiline with require', () => {
    const text = `
    'use strict';

    require('@applitools/eyes-cypress');

    module.exports = (on, config) = {
      return config;
    }
    
    `;

    expect(isPluginDefined(text)).to.equal(true);
  });

  it('handles wrong inner require', () => {
    const text = 'require("@applitools/eyes-cypress/bla");';
    expect(isPluginDefined(text)).to.equal(false);
  });
});
