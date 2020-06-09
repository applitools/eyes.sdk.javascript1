'use strict';

const {describe, it} = require('mocha');
const {expect} = require('chai');
const extractFrames = require('../src/browser/extractFrames');

describe('extractFrames', () => {
  it('returns all non inline frames (that have no http src)', async () => {
    const frameDoc1 = {location: {protocol: 'bla'}, defaultView: {frameElement: 'doc1'}};
    const frameDoc2 = {location: {protocol: 'bla'}, defaultView: {frameElement: 'doc2'}};
    const frame1 = {contentDocument: frameDoc1, src: 'http://www.google.com'};
    const frame2 = {contentDocument: frameDoc2, src: 'https://www.google.com'};
    const frame3 = {
      contentDocument: {location: {protocol: 'http:'}, defaultView: {frameElement: undefined}},
      src: 'https://www.google.com',
    };
    const frame4 = {
      contentDocument: {defaultView: {}, location: 'http:'},
      src: 'https://www.google.com',
    };
    const frame5 = {};
    const frame6 = {contentDocument: {location: 'http:'}};
    const frame7 = undefined;

    const doc = {
      querySelectorAll: () => [frame1, frame2, frame3, frame4, frame5, frame6, frame7],
    };

    expect(extractFrames([doc])).to.eql([frameDoc1, frameDoc2]);
  });

  it('filters out non-http(s) protocol frames', async () => {
    const frameDoc1 = {location: {protocol: 'http:'}, defaultView: {frameElement: 'doc1'}};
    const frameDoc2 = {location: {protocol: 'https:'}, defaultView: {frameElement: 'doc2'}};
    const frame1 = {contentDocument: frameDoc1, src: 'https://www.google.com'};
    const frame2 = {contentDocument: frameDoc2, src: 'http://www.google.com'};

    const frame3 = {
      contentDocument: {
        location: {protocol: 'http:'},
        defaultView: {frameElement: 'doc3'},
        src: 'about:blank',
      },
    };

    const frame4 = {
      contentDocument: {
        location: {protocol: 'http:'},
        defaultView: {frameElement: 'doc3'},
        src: 'javascript:void(0)',
      },
    };

    const doc = {
      querySelectorAll: () => [frame1, frame2, frame3, frame4],
    };

    expect(extractFrames([doc])).to.eql([frameDoc1, frameDoc2]);
  });

  it('defaults to global document', () => {
    const frameDoc1 = {location: {protocol: 'http:'}, defaultView: {frameElement: 'doc1'}};
    const frame1 = {contentDocument: frameDoc1, src: 'https://www.google.com'};

    global.document = {querySelectorAll: () => [frame1]};
    try {
      expect(extractFrames()).to.eql([frameDoc1]);
    } finally {
      delete global.document;
    }
  });
});
