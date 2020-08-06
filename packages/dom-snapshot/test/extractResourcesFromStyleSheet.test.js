'use strict';
const {describe, it} = require('mocha');
const {expect} = require('chai');
const {parse, CSSRule} = require('cssom');
const makeExtractResourcesFromStyleSheet = require('../src/browser/extractResourcesFromStyleSheet');

describe('extractResourceUrlsFromStyleTags', () => {
  let extractResourcesFromStyleSheet, styleSheetCache;

  beforeEach(() => {
    styleSheetCache = {};
    extractResourcesFromStyleSheet = makeExtractResourcesFromStyleSheet({
      styleSheetCache,
      CSSRule,
    });
  });

  it('supports @import rules', () => {
    const urls = extractResourcesFromStyleSheet(parse('@import "something.css";'));
    expect(urls).to.eql(['something.css']);
    expect(Object.keys(styleSheetCache).length).to.equal(1);
  });

  it('supports url() function', () => {
    const urls = extractResourcesFromStyleSheet(
      parse('span{background: url("image.png");.some{clip-path:url(image.svg);}'),
    );
    expect(urls).to.eql(['image.png', 'image.svg']);
    expect(styleSheetCache).to.eql({});
  });

  it('returns unique urls', () => {
    const urls = extractResourcesFromStyleSheet(
      parse('span{background: url("image.png");.some{clip-path:url(image.png);}'),
    );
    expect(urls).to.eql(['image.png']);
    expect(styleSheetCache).to.eql({});
  });

  it('skips urls that start with hash', () => {
    const urls = extractResourcesFromStyleSheet(parse('.some{clip-path:url(#firstSvg)};'));
    expect(urls).to.eql([]);
    expect(styleSheetCache).to.eql({});
  });

  it('supports @font-face rules', () => {
    const urls = extractResourcesFromStyleSheet(
      parse(`@font-face {
        font-family: 'Roboto';
        font-style: normal;
        font-weight: 400;
        src: url('roboto/roboto-v19-latin-regular.eot') format('eot'), url('roboto/roboto-v19-latin-regular.ttf') format('ttf'), url('roboto/roboto-v19-latin-regular.woff2') format('woff2');
      }
      `),
    );
    expect(urls).to.eql([
      'roboto/roboto-v19-latin-regular.eot',
      'roboto/roboto-v19-latin-regular.ttf',
      'roboto/roboto-v19-latin-regular.woff2',
    ]);
    expect(styleSheetCache).to.eql({});
  });

  it('supports @supports rules', () => {
    const urls = extractResourcesFromStyleSheet(
      parse(`@supports (display: grid) {
        div { background: url(some-url.jpg);}
      }`),
    );
    expect(urls).to.eql(['some-url.jpg']);
    expect(styleSheetCache).to.eql({});
  });

  it('supports @media rules', () => {
    const urls = extractResourcesFromStyleSheet(
      parse(`@media (max-width: 20px) and (min-width: 19px) {
        div { background: url(some-url.jpg);}
      }`),
    );
    expect(urls).to.eql(['some-url.jpg']);
    expect(styleSheetCache).to.eql({});
  });

  it('unescapes css', () => {
    const urls = extractResourcesFromStyleSheet(
      parse(`:root{--u: url(/a/b/c.png);}div{background-image: var(--u, url(/d/e/f.png));}`),
    );
    expect(urls).to.eql(['/a/b/c.png', '/d/e/f.png']);
  });
});
