'use strict';

const {describe, it} = require('mocha');
const {expect} = require('chai');
const isCommandsDefined = require('../../../src/setup/isCommandsDefined');

describe('isCommandsDefined', () => {
  it('handles single quote require', () => {
    const text = "require('@applitools/eyes-cypress/commands');";
    expect(isCommandsDefined(text)).to.equal(true);
  });

  it('handles double quote require', () => {
    const text = 'require("@applitools/eyes-cypress/commands");';
    expect(isCommandsDefined(text)).to.equal(true);
  });

  it('handles require with spaces', () => {
    const text = 'require ( "@applitools/eyes-cypress/commands" ) ;';
    expect(isCommandsDefined(text)).to.equal(true);
  });

  it('handles multiline with require', () => {
    const text = `
    'use strict';

    require('@applitools/eyes-cypress/commands');

    import './commands'
    
    `;

    expect(isCommandsDefined(text)).to.equal(true);
  });

  it('handles single quote import', () => {
    const text = "import '@applitools/eyes-cypress/commands'";
    expect(isCommandsDefined(text)).to.equal(true);
  });

  it('handles double quote import', () => {
    const text = 'import "@applitools/eyes-cypress/commands"';
    expect(isCommandsDefined(text)).to.equal(true);
  });

  it('handles import with spaces', () => {
    const text = 'import   "@applitools/eyes-cypress/commands"    ;   ';
    expect(isCommandsDefined(text)).to.equal(true);
  });

  it('handles multiline with import', () => {
    const text = `
    'use strict';

    import '@applitools/eyes-cypress/commands'

    import './commands'
    
    `;

    expect(isCommandsDefined(text)).to.equal(true);
  });

  it('handles wrong inner require', () => {
    const text = 'require("@applitools/eyes-cypress/bla");';
    expect(isCommandsDefined(text)).to.equal(false);
  });

  it('handles wrong require', () => {
    const text = 'require("@applitools/eyes-cypress");';
    expect(isCommandsDefined(text)).to.equal(false);
  });
});
