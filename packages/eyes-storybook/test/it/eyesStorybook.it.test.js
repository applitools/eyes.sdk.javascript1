const {describe, it, before, after} = require('mocha');
const flatten = require('lodash.flatten');
const {expect} = require('chai');
const testStorybook = require('../util/testStorybook');
const path = require('path');
const {testServer} = require('@applitools/sdk-shared');
const fakeEyesServer = require('../util/fakeEyesServer');
const eyesStorybook = require('../../src/eyesStorybook');
const generateConfig = require('../../src/generateConfig');
const {configParams: externalConfigParams} = require('@applitools/visual-grid-client');
const {makeTiming} = require('@applitools/monitoring-commons');
const logger = require('../util/testLogger');
const testStream = require('../util/testStream');
const {performance, timeItAsync} = makeTiming();
const fetch = require('node-fetch');

describe('eyesStorybook', () => {
  let closeStorybook;
  before(async () => {
    closeStorybook = await testStorybook({port: 9001});
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

  let serverUrl, closeEyesServer;
  before(async () => {
    const {port, close} = await fakeEyesServer();
    closeEyesServer = close;
    serverUrl = `http://localhost:${port}`;
  });
  after(async () => {
    await closeEyesServer();
  });

  it('renders test storybook with fake eyes and visual grid', async () => {
    const {stream, getEvents} = testStream();
    const configPath = path.resolve(__dirname, '../fixtures/applitools.config.js');
    const globalConfig = require(configPath);
    const defaultConfig = {waitBeforeScreenshots: 50};
    const config = generateConfig({argv: {conf: configPath}, defaultConfig, externalConfigParams});
    let results = await eyesStorybook({
      config: {
        serverUrl,
        storybookUrl: 'http://localhost:9001',
        ...config,
        // puppeteerOptions: {headless: false, devtools: true},
        // include: (() => {
        //   let counter = 0;
        //   return () => counter++ < 1;
        // })(),
      },
      logger,
      performance,
      timeItAsync,
      outputStream: stream,
    });

    const expectedResults = [
      {
        name: 'Button with-space yes-indeed/nested with-space yes/nested again-yes a: c yes-a b',
        isPassed: true,
      },
      {name: 'Button with-space yes-indeed/nested with-space yes: b yes-a b', isPassed: true},
      {name: 'Button with-space yes-indeed: a yes-a b', isPassed: true},
      {name: 'Button: with some emoji', isPassed: true},
      {name: 'Button: with text', isPassed: true},
      {name: 'Image: image', isPassed: true},
      {name: 'Interaction: Popover', isPassed: true},
      {name: 'Nested/Component: story 1.1', isPassed: true},
      {name: 'Nested/Component: story 1.2', isPassed: true},
      {name: 'Nested: story 1', isPassed: true},
      {name: 'RTL: local RTL config', isPassed: true},
      {name: 'RTL: local RTL config [rtl]', isPassed: true},
      {name: 'RTL: should also do RTL', isPassed: true},
      {name: 'RTL: should also do RTL [rtl]', isPassed: true},
      {name: 'Responsive UI: Red/green', isPassed: true},
      {name: 'SOME section|Nested/Component: story 1.1', isPassed: true},
      {name: 'SOME section|Nested/Component: story 1.2', isPassed: true},
      {name: 'Text: appears after a delay', isPassed: true},
      {
        name: 'Wow|one with-space yes-indeed/nested with-space yes/nested again-yes a: c yes-a b',
        isPassed: true,
      },
    ];

    const [strict, layout, content, floating, accessibility] = [
      globalConfig.strictRegions,
      globalConfig.layoutRegions,
      globalConfig.contentRegions,
      globalConfig.floatingRegions,
      globalConfig.accessibilityRegions,
    ].map(([{selector}]) => {
      const {x, y, width, height} = JSON.parse(selector);
      return [
        {
          left: x,
          top: y,
          width,
          height,
        },
      ];
    });

    const expectedTitles = [
      'Button: with some emoji',
      'Button: with text',
      'Nested: story 1',
      'Image: image',
      'Nested/Component: story 1.1',
      'Nested/Component: story 1.2',
      'Button with-space yes-indeed: a yes-a b',
      'Button with-space yes-indeed/nested with-space yes: b yes-a b',
      'Button with-space yes-indeed/nested with-space yes/nested again-yes a: c yes-a b',
      'SOME section|Nested/Component: story 1.1',
      'SOME section|Nested/Component: story 1.2',
      'Wow|one with-space yes-indeed/nested with-space yes/nested again-yes a: c yes-a b',
      'RTL: local RTL config',
      'RTL: should also do RTL',
      'Responsive UI: Red/green',
      'RTL: should also do RTL [rtl]',
      'RTL: local RTL config [rtl]',
      'Text: appears after a delay',
      'Interaction: Popover',
    ];

    expect(results.map(e => e.title).sort()).to.eql(expectedTitles.sort());
    results = flatten(results.map(r => r.resultsOrErr));
    expect(results.some(x => x instanceof Error)).to.be.false;
    expect(results).to.have.length(expectedResults.length);

    for (const testResults of results) {
      const sessionUrl = `${serverUrl}/api/sessions/batches/${encodeURIComponent(
        testResults.getBatchId(),
      )}/${encodeURIComponent(testResults.getId())}`;

      const session = await fetch(sessionUrl).then(r => r.json());
      const {scenarioIdOrName} = session.startInfo;
      const [componentName, state] = scenarioIdOrName.split(':').map(s => s.trim());
      expect(session.startInfo.defaultMatchSettings.ignoreDisplacements).to.be.true;
      expect(session.startInfo.properties).to.eql([
        {name: 'Component name', value: componentName},
        {name: 'State', value: state.replace(/ \[.+\]$/, '')}, // strip off variation
        {name: 'some prop', value: 'some value'},
      ]);

      expect(session.steps[0].options.imageMatchSettings.strict).to.eql([
        {
          ...strict[0],
          coordinatesType: 'SCREENSHOT_AS_IS',
        },
      ]);
      expect(session.steps[0].options.imageMatchSettings.layout).to.eql([
        {
          ...layout[0],
          coordinatesType: 'SCREENSHOT_AS_IS',
        },
      ]);
      expect(session.steps[0].options.imageMatchSettings.content).to.eql([
        {
          ...content[0],
          coordinatesType: 'SCREENSHOT_AS_IS',
        },
      ]);
      expect(session.steps[0].options.imageMatchSettings.floating).to.eql(floating);
      expect(session.steps[0].options.imageMatchSettings.accessibility).to.eql(accessibility);
    }

    expect(
      results
        .map(r => ({name: r.getName(), isPassed: r.isPassed()}))
        .sort((a, b) => (a.name < b.name ? -1 : 1)),
    ).to.eql(expectedResults);

    expect(getEvents().join('')).to.equal(`- Reading stories
✔ Reading stories
- Done 0 stories out of 19
✔ Done 19 stories out of 19
`);
  });
});
