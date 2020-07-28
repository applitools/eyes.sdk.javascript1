'use strict';

const {describe, it, before, after} = require('mocha');
const {expect} = require('chai');
const puppeteer = require('puppeteer');
const _extractLinks = require('../src/browser/extractLinks');
const uniq = require('../src/browser/uniq');
const absolutizeUrl = require('../src/browser/absolutizeUrl');
const {testServer} = require('@applitools/sdk-shared');

const extractLinks = new Function(`${uniq}${absolutizeUrl}return(${_extractLinks})()`);

describe('extractLinks', () => {
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
    const result = await page.evaluate(extractLinks);
    expect(result.sort()).to.eql(
      [
        'smurfs.jpg?x=12,y=13',
        'gargamel.jpg',
        'smurfs.jpg?x=12,y=13',
        'gargamel.jpg',
        'smurfs.jpg?x=12,y=13',
        'gargamel.jpg',
        'blob:http://www.google.com/cat.jpg',
        'http://www.google.com/body.jpg',
        'http://www.google.com/body.jpg',
        'http://www.google.com/input-image.jpg',
        'smurfs.jpg',
        'smurfs.jpg',
        'smurfs.jpg',
        '/path/to/video.mp4',
        '/path/to/src/attr/video.mp4',
        '/path/to/sound.mp3',
        'style.css',
        'http://bla/style.css',
        '/path/to/poster.jpg',
        'sourceTag.ogg',
        'sourceTag.mp3',
      ].sort(),
    );
  });

  it('works for svg', async () => {
    await page.goto(`http://localhost:7373/svg-links.html`);
    const result = await page.evaluate(extractLinks);
    expect(result).to.eql([
      'smurfs.jpg#hihi',
      'smurfs1.jpg#hihi',
      'basic.svg#hihi',
      'basic2.svg#img',
      'svg.css',
      'basic3.svg#img',
      'with-style.svg',
    ]);
  });
});
