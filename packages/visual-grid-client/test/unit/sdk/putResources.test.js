'use strict'
const {describe, it} = require('mocha')
const {expect} = require('chai')
const makePutResources = require('../../../src/sdk/putResources')
const {RGridDom, RGridResource} = require('@applitools/eyes-sdk-core')
const {promisify: p} = require('util')
const createResourceCache = require('../../../src/sdk/createResourceCache')
const testLogger = require('../../util/testLogger')
const psetTimeout = p(setTimeout)

describe('putResources', () => {
  let putResources

  function getKey(resource) {
    return `${resource.getUrl() || 'dom'}_${resource.getSha256Hash()}`
  }

  it('adds resources from all resources - not just the dom', async () => {
    const resourceCache = createResourceCache()
    const fetchCache = createResourceCache()

    const dom1 = new RGridDom()
    dom1.setDomNodes({domNodes: 'domNodes1'})
    const r1 = new RGridResource()
    r1.setUrl('url1')
    r1.setContent('content1')

    const r2 = new RGridResource()
    r2.setUrl('url2')
    r2.setContent('content2')

    const r3 = new RGridResource()
    r3.setContent('content3')
    r3.setUrl('url3')

    const resources1 = [r1, r2]
    dom1.setResources(resources1)
    putResources = makePutResources({
      doCheckResources: async resources => Array(resources.length).fill(false),
      doPutResource: async resource => {
        const key = getKey(resource)
        await psetTimeout(0)
        return key
      },
      resourceCache,
      fetchCache,
      logger: testLogger,
    })

    const result1 = await putResources([dom1.asResource(), r1, r2, r3])
    expect(result1).to.eql([getKey(dom1.asResource()), getKey(r1), getKey(r2), getKey(r3)])
  })

  it('works', async () => {
    const resourceCache = createResourceCache()
    const fetchCache = createResourceCache()
    const r1 = new RGridResource()
    r1.setUrl('url1')
    r1.setContent('content1')
    const r1key = getKey(r1)

    const r2 = new RGridResource()
    r2.setUrl('url2')
    r2.setContent('content2')
    const r2key = getKey(r2)

    const r3 = new RGridResource()
    r3.setUrl('url3')
    r3.setContent('content3')
    const r3key = getKey(r3)

    const resources1 = [r1, r2]
    const resources2 = [r1, r3]

    const dom1 = new RGridDom()
    dom1.setDomNodes({domNodes: 'domNodes1'})
    dom1.setResources(resources1)
    const dom1resource = dom1.asResource()
    const dom1key = getKey(dom1resource)

    const dom2 = new RGridDom()
    dom2.setDomNodes({domNodes: 'domNodes2'})
    dom2.setResources(resources2)
    const dom2resource = dom2.asResource()
    const dom2key = getKey(dom2resource)

    const putCount = {}
    const checkCount = {}

    putResources = makePutResources({
      doCheckResources: async resources => {
        await psetTimeout(0)
        return resources.map(resource => {
          const key = getKey(resource)
          checkCount[key] = checkCount[key] ? checkCount[key] + 1 : 1
          return resource.getUrl() === 'url2'
        })
      },
      doPutResource: async resource => {
        const key = getKey(resource)
        putCount[key] = putCount[key] ? putCount[key] + 1 : 1
        await psetTimeout(0)
        return key
      },
      resourceCache,
      fetchCache,
      logger: testLogger,
    })

    const p1 = putResources([dom1.asResource(), r1, r2])
    const p2 = putResources([dom2.asResource(), r2, r3])

    const result1 = await p1
    const result2 = await p2

    expect(result1).to.eql([dom1key, r1key, undefined])
    expect(result2).to.eql([dom2key, undefined, r3key])

    expect(checkCount).to.eql({
      [dom1key]: 1,
      [dom2key]: 1,
      [r1key]: 1,
      [r2key]: 1,
      [r3key]: 1,
    })

    expect(putCount).to.eql({
      [dom1key]: 1,
      [dom2key]: 1,
      [r1key]: 1,
      [r3key]: 1,
    })
  })

  it('caches resources', async () => {
    const resourceCache = createResourceCache()
    const fetchCache = createResourceCache()
    const puttedResources = []

    putResources = makePutResources({
      doCheckResources: async resources => Array(resources.length).fill(false),
      doPutResource: async resource => puttedResources.push(resource),
      resourceCache,
      fetchCache,
      logger: testLogger,
    })

    const r1 = new RGridResource()
    r1.setUrl('url1')
    r1.setContent('content1')
    r1._sha256hash = 'sha256hash'
    const r2 = new RGridResource()
    r2.setUrl('url2')
    r2.setErrorStatusCode(404)

    await putResources([r1, r2])

    expect(puttedResources).to.eql([r1])

    expect(resourceCache.getValue('url1')).to.eql({
      url: 'url1',
      type: undefined,
      hash: 'sha256hash',
      content: undefined,
    })

    expect(resourceCache.getValue('url2')).to.eql({
      url: 'url2',
      errorStatusCode: 404,
    })
  })

  it('sends one request for sequence of put resources', async () => {
    const resourceCache = createResourceCache()
    const fetchCache = createResourceCache()
    const r1 = new RGridResource()
    r1.setUrl('url1')
    r1.setContent('content1')
    const r1key = getKey(r1)

    const r2 = new RGridResource()
    r2.setUrl('url2')
    r2.setContent('content2')
    const r2key = getKey(r2)

    const r3 = new RGridResource()
    r3.setUrl('url3')
    r3.setContent('content3')
    const r3key = getKey(r3)

    const resources1 = [r1, r2]
    const resources2 = [r1, r3]

    const dom1 = new RGridDom()
    dom1.setDomNodes({domNodes: 'domNodes1'})
    dom1.setResources(resources1)
    const dom1resource = dom1.asResource()
    const dom1key = getKey(dom1resource)

    const dom2 = new RGridDom()
    dom2.setDomNodes({domNodes: 'domNodes2'})
    dom2.setResources(resources2)
    const dom2resource = dom2.asResource()
    const dom2key = getKey(dom2resource)

    const putCount = new Map()

    putResources = makePutResources({
      doCheckResources: async resources => {
        await psetTimeout(0)
        return Array(resources.length).fill(false)
      },
      doPutResource: async resource => {
        const key = getKey(resource)
        const date = Date.now()
        if (putCount.has(date)) putCount.get(date).push(key)
        else putCount.set(date, [key])
        await psetTimeout(0)
        return key
      },
      timeout: 10,
      resourceCache,
      fetchCache,
      logger: testLogger,
    })

    const puts = []
    puts.push(putResources([dom1.asResource(), r1]))
    puts.push(putResources([dom2.asResource(), r2]))
    await psetTimeout(10)
    puts.push(putResources([dom2.asResource(), r3]))
    await psetTimeout(5)
    puts.push(putResources([dom1.asResource(), r1, r3]))

    await Promise.all(puts)

    const results = Array.from(putCount.values())

    expect(results.length).to.be.eql(2)
    expect(results[0]).to.be.eql([dom1key, r1key, dom2key, r2key])
    expect(results[1]).to.be.eql([r3key])
  })
})
