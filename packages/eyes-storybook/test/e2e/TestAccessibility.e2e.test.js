'use strict';

const {describe, it, before, after} = require('mocha');
const flatten = require('lodash.flatten');
const {expect} = require('chai');
const testStorybook = require('../util/testStorybook');
const path = require('path');
const testServer = require('@applitools/sdk-shared/src/run-test-server');
const eyesStorybook = require('../../src/eyesStorybook');
const generateConfig = require('../../src/generateConfig');
const {configParams: externalConfigParams} = require('@applitools/visual-grid-client');
const {makeTiming} = require('@applitools/monitoring-commons');
const logger = require('../util/testLogger');
const testStream = require('../util/testStream');
const {performance, timeItAsync} = makeTiming();
const fetch = require('node-fetch');

describe('eyes-storybook accessibility', () => {
  let closeStorybook;
  before(async () => {
    closeStorybook = await testStorybook({
      port: 9001,
      storybookConfigDir: path.resolve(__dirname, '../fixtures/accessibilityStorybook'),
    });
  });
  after(async () => {
    await closeStorybook();
  });

  let closeTestServer;
  before(async () => {
    closeTestServer = (await testServer({port: 7272})).close;
  });
  after(async () => {
    await closeTestServer();
  });

  it('renders storybook with accessibility validation', async () => {
    const {stream, getEvents} = testStream();
    const configPath = path.resolve(__dirname, 'happy-config/accessibility.config.js');
    const globalConfig = require(configPath);
    const defaultConfig = {waitBeforeScreenshots: 50};
    const config = generateConfig({argv: {conf: configPath}, defaultConfig, externalConfigParams});
    let results = await eyesStorybook({
      config: {
        storybookUrl: 'http://localhost:9001',
        ...config,
        // puppeteerOptions: {headless: false, devtools: true},
      },
      logger,
      performance,
      timeItAsync,
      outputStream: stream,
    });

    const expectedTitles = ['Single category: Story with local accessibility region'];

    expect(results.map(e => e.title).sort()).to.eql(expectedTitles.sort());
    results = flatten(results.map(r => r.resultsOrErr));
    expect(results.some(x => x instanceof Error)).to.be.false;
    expect(results).to.have.length(1);

    for (const testResults of results) {
      const sessionUrl = `${testResults
        .getApiUrls()
        .getSession()}?format=json&AccessToken=${testResults.getSecretToken()}&apiKey=${
        process.env.APPLITOOLS_API_KEY
      }`;

      const session = await fetch(sessionUrl).then(r => r.json());
      const [actualAppOutput] = session.actualAppOutput;
      expect(actualAppOutput.imageMatchSettings.accessibilitySettings).to.eql({
        level: globalConfig.accessibilityValidation.level,
        version: globalConfig.accessibilityValidation.guidelinesVersion,
      });
      expect(actualAppOutput.imageMatchSettings.accessibility).to.eql([
        {type: 'LargeText', isDisabled: false, left: 8, top: 8, width: 50, height: 50},
      ]);
    }

    expect(getEvents().join('')).to.equal(`- Reading stories
✔ Reading stories
- Done 0 stories out of 1
✔ Done 1 stories out of 1
`);
  });
});
