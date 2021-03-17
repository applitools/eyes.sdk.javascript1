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
      const parameters = {
        fileName: './test/fixtures/appWithStorybook/index.js',
        framework: 'react',
      };
      expect(stories).to.eql(
        [
          {
            name: 'background color',
            kind: 'Button',
            parameters: {eyes: {runBefore: '__func', runAfter: '__func'}},
          },
          {
            name: 'with text',
            kind: 'Button',
            parameters: {
              ...parameters,
              someParam: 'i was here, goodbye',
              eyes: {ignoreRegions: [{selector: '.ignore-this'}]},
            },
          },
          {
            name: 'with some emoji',
            kind: 'Button',
            error: `Ignoring parameters for story: "with some emoji Button" since they are not serilizable. Error: "Converting circular structure to JSON\n    --> starting at object with constructor 'Object'\n    --- property 'inner' closes the circle"`,
          },
          {name: 'image', kind: 'Image', parameters},
          {name: 'story 1', kind: 'Nested', parameters},
          {name: 'story 1.1', kind: 'Nested/Component', parameters},
          {name: 'story 1.2', kind: 'Nested/Component', parameters},
          {name: 'a yes-a b', kind: 'Button with-space yes-indeed', parameters},
          {
            name: 'b yes-a b',
            kind: 'Button with-space yes-indeed/nested with-space yes',
            parameters,
          },
          {
            name: 'c yes-a b',
            kind: 'Button with-space yes-indeed/nested with-space yes/nested again-yes a',
            parameters,
          },
          {name: 'story 1.1', kind: 'SOME section|Nested/Component', parameters},
          {name: 'story 1.2', kind: 'SOME section|Nested/Component', parameters},
          {
            name: 'c yes-a b',
            kind: 'Wow|one with-space yes-indeed/nested with-space yes/nested again-yes a',
            parameters,
          },
          {name: 'should also do RTL', kind: 'RTL', parameters},
          {
            name: 'local RTL config',
            kind: 'RTL',
            parameters: {...parameters, eyes: {variations: ['rtl']}},
          },
          {
            name:
              'this story should not be checked visually by eyes-storybook because of local parameter',
            kind: 'skipped tests',
            parameters: {...parameters, eyes: {include: false}},
          },
          {
            name:
              '[SKIP] this story should not be checked visually by eyes-storybook because of global config',
            kind: 'skipped tests',
            parameters,
          },
          {
            name: 'testing circular parameters',
            kind: 'skipped tests',
            parameters: {eyes: {include: false}}, // note that fileName and framework parameters are not present here because of the circular reference
          },
          {
            kind: 'Text',
            name: 'appears after a delay',
            parameters: {
              ...parameters,
              eyes: {
                waitBeforeScreenshot: '.ready',
              },
            },
          },
          {
            name: 'Popover',
            kind: 'Interaction',
            parameters: {...parameters, bgColor: 'lime', eyes: {runBefore: '__func'}},
          },
          {
            kind: 'Responsive UI',
            name: 'Red/green',
            parameters,
          },
        ].map((story, index) => {
          return {
            ...story,
            index,
            isApi: true,
          };
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
