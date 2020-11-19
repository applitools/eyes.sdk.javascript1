'use strict'
const {describe, it, beforeEach} = require('mocha')
const {expect} = require('chai')
const {promisify: p} = require('util')
const makeRender = require('../../../src/sdk/render')
const {RenderStatus} = require('@applitools/eyes-sdk-core')
const FakeRunningRender = require('../../util/FakeRunningRender')
const FakeRenderRequest = require('../../util/FakeRenderRequest')
const createResourceCache = require('../../../src/sdk/createResourceCache')
const testLogger = require('../../util/testLogger')
const psetTimeout = p(setTimeout)

async function fakeDoRenderBatch(renderRequests) {
  return renderRequests.map((_, i) => {
    return new FakeRunningRender(`id${i + 1}`, `status${i + 1}`)
  })
}

function makePutResources(resourcesPutted) {
  return function putResources(rGridDom, runningRender) {
    return resourcesPutted.push({dom: rGridDom, renderId: runningRender.getRenderId()})
  }
}

function FakeRGridResource({url, contentType, content, sha256Hash, errorStatusCode}) {
  return {
    getUrl() {
      return url
    },
    getSha256Hash() {
      return sha256Hash
    },
    getContentType() {
      return contentType
    },
    getContent() {
      return content
    },
    getErrorStatusCode() {
      return errorStatusCode
    },
  }
}

describe('render', () => {
  let resourceCache, render, fetchCache, resourcesPutted

  beforeEach(() => {
    resourcesPutted = []
    resourceCache = createResourceCache()
    fetchCache = createResourceCache()
    render = makeRender({
      resourceCache,
      fetchCache,
      logger: testLogger,
      doRenderBatch: fakeDoRenderBatch,
    })
  })

  it('works', async () => {
    const renderRequests = [
      new FakeRenderRequest('dom1', []),
      new FakeRenderRequest('dom2', []),
      new FakeRenderRequest('dom3', [
        FakeRGridResource({
          url: 'url-1',
          sha256Hash: 'sha256hash',
          contentType: 'contentType',
          content: 'content',
        }),
        FakeRGridResource({
          url: 'url-2',
          sha256Hash: 'sha256hash-2',
          contentType: 'text/css',
          content: 'content-2',
        }),
      ]),
    ]

    const renderIds = await Promise.all(renderRequests.map(render))
    expect(renderIds).to.eql(['id1', 'id2', 'id3'])
  })

  it('throws an error if need-more-resources is received', async () => {
    render = makeRender({
      putResources: makePutResources(resourcesPutted),
      resourceCache,
      fetchCache,
      logger: testLogger,
      doRenderBatch: async () => [
        new FakeRunningRender('some id', RenderStatus.NEED_MORE_RESOURCES),
      ],
    })
    const error = await render(new FakeRenderRequest('some dom')).then(
      x => x,
      err => err,
    )

    expect(error).to.be.an.instanceof(Error)
  })

  it('sends one request for sequence of render calls', async () => {
    const renderCalls = []
    render = makeRender({
      timeout: 10,
      logger: testLogger,
      doRenderBatch: async renderRequests => {
        renderCalls.push(renderRequests)
        return renderRequests.map(
          (_, index) => new FakeRunningRender(`id${index + 1}`, RenderStatus.RENDERED),
        )
      },
    })

    const renders = []

    renders.push(render(new FakeRenderRequest('dom1', [])))
    renders.push(render(new FakeRenderRequest('dom2', [])))
    renders.push(render(new FakeRenderRequest('dom3', [])))
    await psetTimeout(10)
    renders.push(render(new FakeRenderRequest('dom4', [])))
    await psetTimeout(5)
    renders.push(render(new FakeRenderRequest('dom5', [])))
    await psetTimeout(5)
    renders.push(render(new FakeRenderRequest('dom6', [])))

    await Promise.all(renders)

    expect(renderCalls.length).to.be.eql(3)
    expect(renderCalls[0].length).to.be.eql(3)
    expect(renderCalls[1].length).to.be.eql(2)
    expect(renderCalls[2].length).to.be.eql(1)
  })
})
