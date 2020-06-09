'use strict';

const fs = require('fs');
const {describe, it} = require('mocha');
const {expect} = require('chai');
const makeExtractResourcesFromSvg = require('../src/browser/makeExtractResourcesFromSvg');
const {resolve} = require('path');
const {JSDOM} = eval('require')('jsdom');

describe('makeExtractResourcesFromSvg', () => {
  const parser = {parseFromString: str => new JSDOM(str).window.document};
  const decoder = {decode: buff => buff};
  const extractResourceUrlsFromStyleTags = () => [];
  const extractResourcesFromSvg = makeExtractResourcesFromSvg({
    extractResourceUrlsFromStyleTags,
    parser,
    decoder,
  });

  it('works', async () => {
    const svg = fs.readFileSync(resolve(__dirname, 'fixtures/hard.svg'));
    const result = extractResourcesFromSvg(svg);
    expect(result).to.eql([
      'someImg.jpg?x=11,y=22',
      'somePath/someImg.jpg',
      'someImg.jpg?type=main',
      'gargamel.jpg#hihi',
      'fromImage.jpg',
    ]);
  });
});
