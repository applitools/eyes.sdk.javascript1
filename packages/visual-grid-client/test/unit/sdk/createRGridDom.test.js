'use strict';
const {describe, it} = require('mocha');
const {expect} = require('chai');
const {RGridResource} = require('@applitools/eyes-sdk-core');
const createRGridDom = require('../../../src/sdk/createRGridDom');

describe('createRGridDom', () => {
  it('sets content', () => {
    const resources = {r1: {getUrl: () => 'url', getHashAsObject: () => 'hash'}};
    const domResource = createRGridDom({cdt: 'cdt', resources});
    expect(domResource.getContent().toString()).to.equal(
      JSON.stringify({resources: {url: 'hash'}, domNodes: 'cdt'}),
    );
  });

  it('sorts resources by key', () => {
    const aaa = new RGridResource();
    aaa.setUrl('a');
    aaa.setContent('aaa');
    aaa.setContentType('aaa/type');

    const bbb = new RGridResource();
    bbb.setUrl('b');
    bbb.setContent('bbb');

    const ccc = new RGridResource();
    ccc.setUrl('c');
    ccc.setContent('ccc');

    const ddd = new RGridResource();
    ddd.setUrl('d');
    ddd.setContent('ddd');

    const eee = new RGridResource();
    eee.setUrl('e');
    eee.setContent('eee');

    const resources = {
      bbb,
      aaa,
      eee,
      ddd,
      ccc,
    };

    const domResource = createRGridDom({cdt: 'cdt', resources});

    const expected = {
      resources: {
        a: {
          hashFormat: 'sha256',
          hash: '9834876dcfb05cb167a5c24953eba58c4ac89b1adf57f28f2f9d09af107ee8f0',
          contentType: 'aaa/type',
        },
        b: {
          hashFormat: 'sha256',
          hash: '3e744b9dc39389baf0c5a0660589b8402f3dbb49b89b3e75f2c9355852a3c677',
        },
        c: {
          hashFormat: 'sha256',
          hash: '64daa44ad493ff28a96effab6e77f1732a3d97d83241581b37dbd70a7a4900fe',
        },
        d: {
          hashFormat: 'sha256',
          hash: '730f75dafd73e047b86acb2dbd74e75dcb93272fa084a9082848f2341aa1abb6',
        },
        e: {
          hashFormat: 'sha256',
          hash: '282b91e08fd50a38f030dbbdee7898d36dd523605d94d9dd6e50b298e47844be',
        },
      },
      domNodes: 'cdt',
    };

    expect(domResource.getContent().toString()).to.equal(JSON.stringify(expected));

    // different order, should produce the same sha
    const resources2 = {
      eee,
      ddd,
      aaa,
      ccc,
      bbb,
    };

    const domResource2 = createRGridDom({cdt: 'cdt', resources: resources2});
    expect(domResource2.getSha256Hash()).to.equal(domResource.getSha256Hash());
  });
});
