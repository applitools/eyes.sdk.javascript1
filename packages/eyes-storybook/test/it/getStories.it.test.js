const puppeteer = require('puppeteer');
const {describe, it, before, after} = require('mocha');
const {expect} = require('chai');
const testServer = require('@applitools/sdk-shared/src/run-test-server');
const testStorybook = require('../util/testStorybook');
const getStories = require('../../dist/getStories');
const {delay: psetTimeout} = require('@applitools/functional-commons');
const browserLog = require('../../src/browserLog');
const logger = require('../util/testLogger');

describe('getStories', () => {
  let closeTestServer, browser;
  before(async () => {
    const server = await testServer({port: 7272});
    closeTestServer = server.close;
    browser = await puppeteer.launch(); // {headless: false, devtools: true}
  });

  after(async () => {
    await closeTestServer();
    await browser.close();
  });

  it('gets stories', async () => {
    const page = await browser.newPage();
    const closeStorybook = await testStorybook({port: 9001});
    browserLog({page, onLog: text => logger.log(`[browser] ${text}`)});
    try {
      await page.goto('http://localhost:9001');
      const stories = await page.evaluate(getStories);
      expect(stories).to.eql(
        [
          {
            name: 'with text',
            kind: 'Button',
            parameters: {
              someParam: 'i was here, goodbye',
              eyes: {ignoreRegions: [{selector: '.ignore-this'}]},
            },
          },
          {
            name: 'with some emoji',
            kind: 'Button',
            error: `Ignoring parameters for story: "with some emoji Button" since they are not serilizable. Error: "Converting circular structure to JSON\n    --> starting at object with constructor 'Object'\n    --- property 'inner' closes the circle"`,
          },
          {name: 'image', kind: 'Image'},
          {name: 'story 1', kind: 'Nested'},
          {name: 'story 1.1', kind: 'Nested/Component'},
          {name: 'story 1.2', kind: 'Nested/Component'},
          {name: 'a yes-a b', kind: 'Button with-space yes-indeed'},
          {name: 'b yes-a b', kind: 'Button with-space yes-indeed/nested with-space yes'},
          {
            name: 'c yes-a b',
            kind: 'Button with-space yes-indeed/nested with-space yes/nested again-yes a',
          },
          {name: 'story 1.1', kind: 'SOME section|Nested/Component'},
          {name: 'story 1.2', kind: 'SOME section|Nested/Component'},
          {
            name: 'c yes-a b',
            kind: 'Wow|one with-space yes-indeed/nested with-space yes/nested again-yes a',
          },
          {name: 'should also do RTL', kind: 'RTL'},
          {name: 'local RTL config', kind: 'RTL', parameters: {eyes: {variations: ['rtl']}}},
          {
            name:
              'this story should not be checked visually by eyes-storybook because of local parameter',
            kind: 'skipped tests',
            parameters: {eyes: {include: false}},
          },
          {
            name:
              '[SKIP] this story should not be checked visually by eyes-storybook because of global config',
            kind: 'skipped tests',
          },
          {
            kind: 'Text',
            name: 'appears after a delay',
            parameters: {
              eyes: {
                waitBeforeScreenshot: '.ready',
              },
            },
          },
          {
            name: 'Popover',
            kind: 'Interaction',
            parameters: {bgColor: 'lime', eyes: {runBefore: '__func'}},
          },
          {
            kind: 'Responsive UI',
            name: 'Red/green',
          },
        ].map((story, index) => {
          const {name, kind, parameters, error} = story;
          const res = {
            index,
            name,
            kind,
            isApi: true,
          };
          if (!error) {
            res.parameters = {
              fileName: './test/fixtures/appWithStorybook/index.js',
              framework: 'react',
              ...parameters,
            };
          } else {
            res.error = error;
          }

          return res;
        }),
      );
    } finally {
      await closeStorybook();
    }
  });

  it('fails on timeout', async () => {
    const page = await browser.newPage();
    browserLog({page, onLog: text => logger.log(`[browser] ${text}`)});

    await page.goto('http://localhost:7272');

    const result = await Promise.race([
      page.evaluate(getStories, {timeout: 100}).catch(err => err.message),
      psetTimeout(200).then(() => 'not ok'),
    ]);

    expect(result).to.equal(
      'Evaluation failed: could not determine storybook version in order to extract stories',
    );
  });
});
