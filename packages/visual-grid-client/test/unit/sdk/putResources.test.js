'use strict';
const {describe, it} = require('mocha');
const {expect} = require('chai');
const makePutResources = require('../../../src/sdk/putResources');
const {RGridDom, RGridResource} = require('@applitools/eyes-sdk-core');
const {promisify: p} = require('util');
const psetTimeout = p(setTimeout);

describe('putResources', () => {
  let putResources;

  function getKey(resource) {
    return `${resource.getUrl() || 'dom'}_${resource.getSha256Hash()}`;
  }

  it('adds resources from all resources - not just the dom', async () => {
    const dom1 = new RGridDom();
    dom1.setDomNodes({domNodes: 'domNodes1'});
    const r1 = new RGridResource();
    r1.setUrl('url1');
    r1.setContent('content1');

    const r2 = new RGridResource();
    r2.setUrl('url2');
    r2.setContent('content2');

    const r3 = new RGridResource();
    r3.setContent('content3');
    r3.setUrl('url3');

    const resources1 = [r1, r2];
    dom1.setResources(resources1);
    putResources = makePutResources({
      doPutResource: async (runningRender, resource) => {
        const key = getKey(resource);
        await psetTimeout(0);
        return `${runningRender.getRenderId()}_${key}`;
      },
    });
    const runningRender1 = {
      getNeedMoreDom() {
        return true;
      },
      getNeedMoreResources() {
        return ['url1', 'url2', 'url3'];
      },
      getRenderId() {
        return 'renderId1';
      },
    };

    const result1 = await putResources(dom1.asResource(), runningRender1, [r1, r2, r3]);
    expect(result1).to.eql([
      `renderId1_${getKey(dom1.asResource())}`,
      `renderId1_${getKey(r1)}`,
      `renderId1_${getKey(r2)}`,
      `renderId1_${getKey(r3)}`,
    ]);
  });

  it('works', async () => {
    const r1 = new RGridResource();
    r1.setUrl('url1');
    r1.setContent('content1');
    const r1key = getKey(r1);

    const r2 = new RGridResource();
    r2.setUrl('url2');
    r2.setContent('content2');
    const r2key = getKey(r2);

    const r3 = new RGridResource();
    r3.setUrl('url3');
    r3.setContent('content3');
    const r3key = getKey(r3);

    const resources1 = [r1, r2];
    const resources2 = [r1, r3];

    const dom1 = new RGridDom();
    dom1.setDomNodes({domNodes: 'domNodes1'});
    dom1.setResources(resources1);
    const dom1resource = dom1.asResource();
    const dom1key = getKey(dom1resource);

    const dom2 = new RGridDom();
    dom2.setDomNodes({domNodes: 'domNodes2'});
    dom2.setResources(resources2);
    const dom2resource = dom2.asResource();
    const dom2key = getKey(dom2resource);

    const runningRender1 = {
      getNeedMoreDom() {
        return true;
      },
      getNeedMoreResources() {
        return ['url1', 'url2'];
      },
      getRenderId() {
        return 'renderId1';
      },
    };

    const runningRender2 = {
      getNeedMoreDom() {
        return true;
      },
      getNeedMoreResources() {
        return ['url1', 'url3'];
      },
      getRenderId() {
        return 'renderId2';
      },
    };

    const putCountPerResource = {};

    putResources = makePutResources({
      doPutResource: async (runningRender, resource) => {
        const key = getKey(resource);
        putCountPerResource[key] = putCountPerResource[key] ? putCountPerResource[key] + 1 : 1;
        await psetTimeout(0);
        return `${runningRender.getRenderId()}_${key}`;
      },
    });

    const p1 = putResources(dom1.asResource(), runningRender1, [r1, r2, r3]);
    const p2 = putResources(dom2.asResource(), runningRender2, [r1, r2, r3]);

    const result1 = await p1;
    const result2 = await p2;

    expect(result1).to.eql([`renderId1_${dom1key}`, `renderId1_${r1key}`, `renderId1_${r2key}`]);
    expect(result2).to.eql([`renderId1_${r1key}`, `renderId2_${dom2key}`, `renderId2_${r3key}`]);

    expect(putCountPerResource).to.eql({
      [dom1key]: 1,
      [dom2key]: 1,
      [r1key]: 1,
      [r2key]: 1,
      [r3key]: 1,
    });
  });
});
