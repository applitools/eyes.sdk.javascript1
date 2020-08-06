'use strict';

const {describe, it, before, after, beforeEach} = require('mocha');
const {expect} = require('chai');
const fetch = require('node-fetch');
const jsdom = require('jsdom');
const {JSDOM} = jsdom;
const makeProcessResource = require('../src/browser/processResource');
const makeFetchUrl = require('../src/browser/fetchUrl');
const makeFindStyleSheetByUrl = require('../src/browser/findStyleSheetByUrl');
const makeExtractResourcesFromStyleSheet = require('../src/browser/extractResourcesFromStyleSheet');
const getCorsFreeStyleSheet = require('../src/browser/getCorsFreeStyleSheet');
const makeExtractResourceUrlsFromStyleTags = require('../src/browser/extractResourceUrlsFromStyleTags');
const makeExtractResourcesFromSvg = require('../src/browser/makeExtractResourcesFromSvg');
const makeGetResourceUrlsAndBlobs = require('../src/browser/getResourceUrlsAndBlobs');
const aggregateResourceUrlsAndBlobs = require('../src/browser/aggregateResourceUrlsAndBlobs');
const testServer = require('@applitools/sdk-shared/src/run-test-server');
const {loadFixture, loadFixtureBuffer} = require('./util/loadFixture');
const bufferToArrayBuffer = require('./util/bufferToArrayBuffer');
const AbortController = require('abort-controller');

const {
  parse,
  CSSImportRule,
  CSSFontFaceRule,
  CSSSupportsRule,
  CSSMediaRule,
  CSSStyleRule,
  CSSRule,
} = require('cssom');

describe('processResource', () => {
  let server,
    processResource,
    getResourceUrlsAndBlobs,
    findStyleSheetByUrl,
    extractResourcesFromStyleSheet,
    extractResourcesFromSvg;

  before(async () => {
    server = await testServer({port: 7373});
  });

  after(async () => {
    await server.close();
  });

  beforeEach(() => {
    const styleSheetCache = {};
    extractResourcesFromStyleSheet = makeExtractResourcesFromStyleSheet({styleSheetCache, CSSRule});
    findStyleSheetByUrl = makeFindStyleSheetByUrl({styleSheetCache});
    const parser = {parseFromString: str => new JSDOM(str).window.document};
    const decoder = {decode: buff => String.fromCharCode.apply(null, new Uint8Array(buff))};

    const extractResourceUrlsFromStyleTags = makeExtractResourceUrlsFromStyleTags(
      extractResourcesFromStyleSheet,
    );
    extractResourcesFromSvg = makeExtractResourcesFromSvg({
      parser,
      decoder,
      extractResourceUrlsFromStyleTags,
    });

    processResource = makeProcessResource({
      fetchUrl: makeFetchUrl({fetch, AbortController}),
      findStyleSheetByUrl,
      getCorsFreeStyleSheet,
      extractResourcesFromStyleSheet,
      extractResourcesFromSvg,
      log: process.env.APPLITOOLS_SHOW_LOGS ? console.log : undefined,
    });

    getResourceUrlsAndBlobs = makeGetResourceUrlsAndBlobs({
      processResource,
      aggregateResourceUrlsAndBlobs,
    });
  });

  it('handles same-origin image in css', async () => {
    const doc = createDoc('test.css');

    const {resourceUrls, blobsObj} = await processResource({
      url: 'http://localhost:7373/test.css',
      documents: [doc],
      getResourceUrlsAndBlobs,
    });

    expect(resourceUrls).to.eql([]);
    expect(blobsObj).to.eql({
      'http://localhost:7373/test.css': {
        type: 'text/css; charset=UTF-8',
        value: bufferToArrayBuffer(loadFixtureBuffer('test.css')),
      },
      'http://localhost:7373/smurfs.jpg': {
        type: 'image/jpeg',
        value: bufferToArrayBuffer(loadFixtureBuffer('smurfs.jpg')),
      },
      'http://localhost:7373/blabla': {
        errorStatusCode: 404,
      },
    });
  });

  it('handles same-origin css import', async () => {
    const doc = createDoc('import.css', 'imported.css'); // imported2.css isn't included in document.styleSheets. It's is rather referenced from the import rule in cssom

    const {resourceUrls, blobsObj} = await processResource({
      url: 'http://localhost:7373/import.css',
      documents: [doc],
      getResourceUrlsAndBlobs,
    });

    expect(resourceUrls).to.eql([]);
    expect(blobsObj).to.eql({
      'http://localhost:7373/import.css': {
        type: 'text/css; charset=UTF-8',
        value: bufferToArrayBuffer(loadFixtureBuffer('import.css')),
      },
      'http://localhost:7373/imported.css': {
        type: 'text/css; charset=UTF-8',
        value: bufferToArrayBuffer(loadFixtureBuffer('imported.css')),
      },
      'http://localhost:7373/imported2.css': {
        type: 'text/css; charset=UTF-8',
        value: bufferToArrayBuffer(loadFixtureBuffer('imported2.css')),
      },
    });
  });

  it('handles cross-origin image in css', async () => {});

  it('handles cross-origin import in css', async () => {});

  it('handles nested css dependencies', async () => {});

  it('handles both same-origin and cross-origin ans nested css dependencies', async () => {});

  it('handles failure to fetch resource', async () => {
    const processResourceWithRejection = makeProcessResource({
      fetchUrl: () => Promise.reject(new Error('bla')),
    });
    const {resourceUrls, blobsObj} = await processResourceWithRejection('something', {}, () => {});
    expect(resourceUrls).to.be.undefined;
    expect(blobsObj).to.be.undefined;
  });

  it('handles data urls inside css resources', async () => {
    const doc = createDoc('inline-url.css');

    const {resourceUrls, blobsObj} = await processResource({
      url: 'http://localhost:7373/inline-url.css',
      documents: [doc],
      getResourceUrlsAndBlobs,
    });

    expect(resourceUrls).to.eql([]);
    expect(blobsObj).to.eql({
      'http://localhost:7373/inline-url.css': {
        type: 'text/css; charset=UTF-8',
        value: bufferToArrayBuffer(loadFixtureBuffer('inline-url.css')),
      },
    });
  });

  it('handles svg resources', async () => {
    const doc = createDoc();

    const {resourceUrls, blobsObj} = await processResource({
      url: 'http://localhost:7373/basic3.svg',
      documents: [doc],
      getResourceUrlsAndBlobs,
    });

    expect(resourceUrls).to.eql([]);
    expect(blobsObj).to.eql({
      'http://localhost:7373/gargamel3.jpg': {
        type: 'image/jpeg',
        value: bufferToArrayBuffer(loadFixtureBuffer('gargamel3.jpg')),
      },
      'http://localhost:7373/basic3.svg': {
        type: 'image/svg+xml',
        value: bufferToArrayBuffer(loadFixtureBuffer('basic3.svg')),
      },
    });
  });

  // this was caused in Atlassian's storybook, where they monkeypatched window.fetch and their code threw an error synchronously
  it("doesn't crash in synchronous exceptions during fetchUrl", async () => {
    const fetchThatThrowsSync = () => {
      throw new Error('bla');
    };
    processResource = makeProcessResource({
      fetchUrl: makeFetchUrl({fetch: fetchThatThrowsSync, AbortController}),
      findStyleSheetByUrl,
      getCorsFreeStyleSheet,
      extractResourcesFromStyleSheet,
      extractResourcesFromSvg,
      // log: console.log,
    });

    const doc = createDoc('test.css');

    const result = await processResource({
      url: 'http://localhost:7373/test.css',
      documents: [doc],
      getResourceUrlsAndBlobs,
    });

    expect(result).to.eql({});
  });

  it('handles fetch timeout', async () => {
    const fetchThatHangs = async () => {
      await new Promise(r => setTimeout(r, 1000));
    };
    processResource = makeProcessResource({
      fetchUrl: makeFetchUrl({fetch: fetchThatHangs, AbortController, timeout: 100}),
      findStyleSheetByUrl,
      getCorsFreeStyleSheet,
      extractResourcesFromStyleSheet,
      extractResourcesFromSvg,
      log: console.log,
    });

    const doc = createDoc('test.css');

    const url = 'http://localhost:7373/test.css';
    const result = await processResource({
      url,
      documents: [doc],
      getResourceUrlsAndBlobs,
    });

    expect(result).to.eql({
      blobsObj: {
        [url]: {errorStatusCode: 504},
      },
    });
  });

  it("doesn't fetch google fonts", async () => {
    const {resourceUrls, blobsObj} = await processResource({
      url: 'https://fonts.googleapis.com/some-font',
    });

    expect(resourceUrls).to.eql(['https://fonts.googleapis.com/some-font']);
    expect(blobsObj).to.eql(undefined);
  });

  it('handles non-200 urls', async () => {
    const doc = createDoc();

    const {blobsObj} = await processResource({
      url: 'http://localhost:7373/predefined-status/404',
      documents: [doc],
      getResourceUrlsAndBlobs,
    });

    expect(blobsObj).to.eql({
      'http://localhost:7373/predefined-status/404': {
        errorStatusCode: 404,
      },
    });
  });
});

function createDoc(...cssUrls) {
  return {
    styleSheets: cssUrls.map(createStyleSheet),
    defaultView: {
      CSSImportRule,
      CSSFontFaceRule,
      CSSSupportsRule,
      CSSMediaRule,
      CSSStyleRule,
    },
  };
}

function createStyleSheet(name) {
  const styleSheet = parse(loadFixture(name));
  styleSheet.href = `http://localhost:7373/${name}`;
  return styleSheet;
}
