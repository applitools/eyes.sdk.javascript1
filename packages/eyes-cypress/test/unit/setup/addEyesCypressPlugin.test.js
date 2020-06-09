'use strict';

const {describe, it} = require('mocha');
const {expect} = require('chai');
const addEyesCypressPlugin = require('../../../src/setup/addEyesCypressPlugin');
const {pluginRequire} = addEyesCypressPlugin;

describe('addEyesCypressPlugin', () => {
  it('adds before other code', () => {
    const content = 'some.code();';
    expect(addEyesCypressPlugin(content)).to.equal(`some.code();${pluginRequire}`);
  });

  it('add after "use strict" and comments', () => {
    const content = `'use strict';
    
    // some comment
    // another comment

    some.code();

    module.exports = (on, config) => {
      return config;
    };

    `;

    const expected = `'use strict';
    
    // some comment
    // another comment

    some.code();

    module.exports = (on, config) => {
      return config;
    };

    ${pluginRequire}`;

    expect(addEyesCypressPlugin(content)).to.equal(expected);
  });
});
