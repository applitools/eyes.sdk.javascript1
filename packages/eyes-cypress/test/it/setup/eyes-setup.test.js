'use strict';

const {describe, it, before, after} = require('mocha');
const {expect} = require('chai');
const {readFileSync, writeFileSync, unlinkSync} = require('fs');
const {resolve} = require('path');
const {pluginRequire} = require('../../../src/setup/addEyesCypressPlugin');
const {commandsImport} = require('../../../src/setup/addEyesCommands');
const {eyesIndexContent} = require('../../../src/setup/handleTypeScript');

describe('eyes-setup script', () => {
  let cwd;
  const fixturesPath = resolve(__dirname, 'fixtures');
  const pluginFilePath = resolve(fixturesPath, 'cypress/plugins/index-bla-plugin.js');
  const origPluginFileContent = readFileSync(pluginFilePath).toString();

  const supportFilePath = resolve(fixturesPath, 'cypress/support/index-bla-commands.js');
  const origSupportFileContent = readFileSync(supportFilePath).toString();

  const typescriptFilePath = resolve(fixturesPath, 'cypress/support/eyes-index.d.ts');

  before(() => {
    cwd = process.cwd();
    process.chdir(fixturesPath);
    try {
      unlinkSync(typescriptFilePath);
    } catch (e) {}
  });

  after(() => {
    process.chdir(cwd);
    writeFileSync(pluginFilePath, origPluginFileContent);
    writeFileSync(supportFilePath, origSupportFileContent);
  });

  it('works', () => {
    require('../../../bin/eyes-setup');

    expect(readFileSync(pluginFilePath).toString()).to.equal(
      origPluginFileContent.replace(/}\n$/, `}\n${pluginRequire}`),
    );

    expect(readFileSync(supportFilePath).toString()).to.equal(
      origSupportFileContent.replace(
        '\n// Import commands.js using ES2015 syntax:',
        `${commandsImport}\n\n// Import commands.js using ES2015 syntax:`,
      ),
    );

    expect(readFileSync(typescriptFilePath).toString()).to.equal(eyesIndexContent);
  });
});
