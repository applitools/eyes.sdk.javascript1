'use strict';
const {describe, it, before, after} = require('mocha');
const {exec} = require('child_process');
const {promisify: p} = require('util');
const path = require('path');
const pexec = p(exec);
const testServer = require('@applitools/sdk-shared/src/run-test-server');
const fs = require('fs');

const sourceTestAppPath = path.resolve(__dirname, '../fixtures/testApp');
const targetTestAppPath = path.resolve(__dirname, '../fixtures/testAppCopies/testApp-breakpoint');

describe('layout breakpoints', () => {
  let closeServer;
  before(async () => {
    const middlewareFile = path.resolve(
      __dirname,
      '../../../sdk-shared/coverage-tests/util/slow-middleware.js',
    );
    const staticPath = path.resolve(__dirname, '../fixtures');
    const server = await testServer({
      port: 5555,
      staticPath,
      middlewareFile,
    });
    closeServer = server.close;
    if (fs.existsSync(targetTestAppPath)) {
      fs.rmdirSync(targetTestAppPath, {recursive: true});
    }
    await pexec(`cp -r ${sourceTestAppPath}/. ${targetTestAppPath}`);
    process.chdir(targetTestAppPath);
    await pexec(`npm install`, {
      maxBuffer: 1000000,
    });
  });

  after(async () => {
    fs.rmdirSync(targetTestAppPath, {recursive: true});
    await closeServer();
  });

  it('works for js layouts', async () => {
    try {
      await pexec(
        './node_modules/.bin/cypress run --headless --config testFiles=layout-breakpoints.js,integrationFolder=cypress/integration-run,pluginsFile=cypress/plugins/index-run.js,supportFile=cypress/support/index-run.js',
        {
          maxBuffer: 10000000,
        },
      );
    } catch (ex) {
      console.error('Error during test!', ex.stdout);
      throw ex;
    }
  });
});
