'use strict';
const {describe, it} = require('mocha');
const {expect} = require('chai');
const {JSDOM} = require('jsdom');
const genXpath = require('../src/browser/genXpath');
const testServer = require('@applitools/sdk-shared/src/run-test-server');
const psetTimeout = require('util').promisify(setTimeout);

describe('genXpath', () => {
  it('works for document', () => {
    const dom = new JSDOM('<html>');
    const el = dom.window.document;
    const result = genXpath(el);
    expect(result).to.equal('');
  });

  it('works for document element (html)', () => {
    const dom = new JSDOM('<html>');
    const el = dom.window.document.documentElement;
    const result = genXpath(el);
    expect(result).to.equal('HTML[1]');
    const expectedEl = dom.window.document
      .evaluate(result, dom.window.document, null, 0)
      .iterateNext();
    expect(expectedEl).to.equal(el);
  });

  it('works for element', () => {
    const dom = new JSDOM(
      '<html><body><div class="one"></div><span></span><div class="two"></div></body></html>',
    );
    const el = dom.window.document.querySelector('div:nth-of-type(2)');
    const result = genXpath(el);
    expect(result).to.equal('HTML[1]/BODY[1]/DIV[2]');
    const expectedEl = dom.window.document
      .evaluate(result, dom.window.document, null, 0)
      .iterateNext();
    expect(expectedEl).to.equal(el);
  });

  it('works for element inside iframe', async () => {
    let server;
    try {
      server = await testServer({port: 7373});
      const dom = new JSDOM(
        '<html><body><div class="one"></div><iframe src="http://localhost:7373/iframe.html"></iframe></body></html>',
        {resources: 'usable'},
      );
      await psetTimeout(100);

      const doc = dom.window.document.querySelector('iframe').contentDocument;
      const el = doc.querySelector('span');
      const result = genXpath(el);
      expect(result).to.equal('HTML[1]/BODY[1]/IFRAME[1],HTML[1]/BODY[1]/SPAN[1]');
      const xpaths = result.split(',');
      const expectedEl = xpaths.reduce(
        (el, xpath) =>
          dom.window.document.evaluate(xpath, el.contentDocument, null, 0).iterateNext(),
        {contentDocument: dom.window.document},
      );
      expect(expectedEl).to.equal(el);
    } finally {
      await server.close();
    }
  });
});
