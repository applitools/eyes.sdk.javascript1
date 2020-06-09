'use strict';
const {describe, it, before, after} = require('mocha');
const {expect} = require('chai');
const {exec} = require('child_process');
const {promisify: p} = require('util');
const {resolve} = require('path');
const {TIMEOUT_MSG} = require('../../src/plugin/handlers');
const {msgText} = require('../../src/plugin/concurrencyMsg');
const concurrencyMsg = msgText.substr(0, 100);
const pexec = p(exec);

const rootPath = resolve(__dirname, '../..');
const testAppPath = resolve(__dirname, '../fixtures/testApp');

describe('cypress run', () => {
  before(async () => {
    process.chdir(testAppPath);
    await pexec(`npm install`, {
      maxBuffer: 1000000,
    });
  });

  after(async () => {
    process.chdir(testAppPath);
    await pexec(
      `rm -rf node_modules cypress/videos cypress/screenshots cypress/fixtures package-lock.json`,
      {
        maxBuffer: 1000000,
      },
    );
    process.chdir(rootPath);
  });

  it('works', async () => {
    try {
      await pexec(
        './node_modules/.bin/cypress run --config integrationFolder=cypress/integration-run,pluginsFile=cypress/plugins/index-run.js,supportFile=cypress/support/index-run.js',
        {
          maxBuffer: 10000000,
        },
      );
    } catch (ex) {
      console.error('Error during test!', ex.stdout);
      throw ex;
    }
  });

  it('considers timeout passed to close', async () => {
    try {
      await pexec(
        './node_modules/.bin/cypress run --config integrationFolder=cypress/integration-timeout,pluginsFile=cypress/plugins/index-run.js,supportFile=cypress/support/index-run.js',
        {
          maxBuffer: 10000000,
        },
      );
    } catch (ex) {
      expect(ex.stdout).to.include(TIMEOUT_MSG(100));
    }
  });

  it('works with disabled eyes', async () => {
    try {
      const {stdout} = await pexec(
        'APPLITOOLS_IS_DISABLED=1 ./node_modules/.bin/cypress run --spec cypress/integration-play/iframe.js --config integrationFolder=cypress/integration-play,pluginsFile=cypress/plugins/index-run.js,supportFile=cypress/support/index-run.js',
        {
          maxBuffer: 10000000,
        },
      );

      expect(
        stdout,
        'cypress ran with eyes disabled but concurrency msg is shown',
      ).to.not.have.string(concurrencyMsg);
    } catch (ex) {
      console.error('Error during test!', ex.stdout);
      throw ex;
    }
  });

  it('does not fail Cypress test if failCypressOnDiff flag is false', async () => {
    try {
      await pexec(
        'APPLITOOLS_FAIL_CYPRESS_ON_DIFF=false ./node_modules/.bin/cypress run --spec cypress/integration-play/always-fail.js --config integrationFolder=cypress/integration-play,pluginsFile=cypress/plugins/index-run.js,supportFile=cypress/support/index-run.js',
        {
          maxBuffer: 10000000,
        },
      );
    } catch (ex) {
      console.error(
        'Test Failed even though failCypressOnDiff flag is false, If this is the first time u ran this test then u need to set up an invalid baseline for it.',
        ex.stdout,
      );
      throw ex;
    }
  });
});
