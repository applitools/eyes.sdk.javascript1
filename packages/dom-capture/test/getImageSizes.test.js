'use strict';

const {describe, it} = require('mocha');
const {expect} = require('chai');
const getImageSizes = require('../src/browser/getImageSizes');
const psetTimeout = require('util').promisify(setTimeout);

function setSrc(url) {
  switch (url) {
    case 'http://bla/100x200':
      this.naturalWidth = 100;
      this.naturalHeight = 200;
      this.onload();
      break;
    case 'http://bla/200x300':
      this.naturalWidth = 200;
      this.naturalHeight = 300;
      this.onload();
      break;
    case 'http://bla/error':
      this.onerror();
      break;
    default:
      break;
  }
}

const Image = function() {};
Object.defineProperty(Image.prototype, 'src', {set: setSrc});

describe('getImageSizes', () => {
  it('handles images that load properly', async () => {
    const imageSizes = await getImageSizes({
      bgImages: new Set(['http://bla/100x200', 'http://bla/200x300']),
      timeout: 100,
      Image,
    });
    expect(imageSizes).to.eql({
      'http://bla/100x200': {width: 100, height: 200},
      'http://bla/200x300': {width: 200, height: 300},
    });
  });

  it("handles errors when images don't load", async () => {
    const imageSizes = await getImageSizes({
      bgImages: new Set(['http://bla/error']),
      timeout: 100,
      Image,
    });
    expect(imageSizes).to.eql({});
  });

  it('handles images that timeout', async () => {
    const imageSizes = await Promise.race([
      getImageSizes({
        bgImages: new Set(['http://bla/nonexistent']),
        timeout: 100,
        Image,
      }),
      psetTimeout(200),
    ]);
    expect(imageSizes).to.eql({});
  });

  it('handles all the cases together (load, error, timeout)', async () => {
    const imageSizes = await Promise.race([
      getImageSizes({
        bgImages: new Set([
          'http://bla/100x200',
          'http://bla/200x300',
          'http://bla/error',
          'http://bla/nonexistent',
        ]),
        timeout: 100,
        Image,
      }),
      psetTimeout(200),
    ]);

    expect(imageSizes).to.eql({
      'http://bla/100x200': {width: 100, height: 200},
      'http://bla/200x300': {width: 200, height: 300},
    });
  });
});
