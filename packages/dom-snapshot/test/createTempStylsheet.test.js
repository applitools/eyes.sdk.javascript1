'use strict';

const {describe, it, before, after} = require('mocha');
const {expect} = require('chai');
const puppeteer = require('puppeteer');
const createTempStylsheet = require('../src/browser/createTempStyleSheet');
const testServer = require('@applitools/sdk-shared/src/run-test-server');

const style = `div {background-image: url("/smurfs5.jpg")}`;
const doCreateTempStylsheet = new Function(`
  const ab = new TextEncoder("utf-8").encode('${style}')
  const sheet = (${createTempStylsheet})(ab);
  return [...sheet.cssRules].map(r => r.cssText).join('\\n');
`);

describe('createTempStylsheet', () => {
  let browser, page, server;
  before(async () => {
    server = await testServer({port: 7373});
    browser = await puppeteer.launch({headless: true});
    page = await browser.newPage();
    // page.on('console', msg => {
    //   console.log(msg.args().join(' '));
    // });
  });

  after(async () => {
    await browser.close();
    await server.close();
    // await new Promise(r => setTimeout(r, 100000));
  });

  it('works', async () => {
    await page.goto(`http://localhost:7373/links.html`);
    const result = await page.evaluate(doCreateTempStylsheet);
    expect(result).to.eql('div { background-image: url("/smurfs5.jpg"); }');
  });
});
