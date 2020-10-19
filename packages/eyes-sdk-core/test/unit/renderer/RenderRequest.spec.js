'use strict'

const assert = require('assert')

const {RenderRequest} = require('../../../index')

describe('RenderRequest', () => {
  describe('constructor', () => {
    it("doesn't allow empty webhook", () => {
      assert.throws(() => new RenderRequest(), /IllegalArgument: webhook is null or empty/)
      assert.throws(
        () => new RenderRequest({webhook: ''}),
        /IllegalArgument: webhook is null or empty/,
      )
    })

    it("doesn't allow empty url", () => {
      assert.throws(
        () => new RenderRequest({webhook: 'webhook'}),
        /IllegalArgument: url is null or undefined/,
      )
    })

    it("doesn't allow empty dom", () => {
      assert.throws(
        () => new RenderRequest({webhook: 'webhook', url: 'url'}),
        /IllegalArgument: dom is null or undefined/,
      )
    })

    it("doesn't allow empty resources", () => {
      assert.throws(
        () => new RenderRequest({webhook: 'webhook', url: 'url', dom: 'dom'}),
        /IllegalArgument: resources is null or undefined/,
      )
    })

    it('fills values', () => {
      const renderRequest = new RenderRequest({
        webhook: 'webhook',
        stitchingService: 'stitchingService',
        url: 'url',
        dom: 'dom',
        resources: 'resources',
        renderInfo: 'renderInfo',
        platform: 'platform',
        browserName: 'browserName',
        scriptHooks: 'scriptHooks',
        selectorsToFindRegionsFor: 'selectorsToFindRegionsFor',
        sendDom: 'sendDom',
        visualGridOptions: {polyfillAdoptedStyleSheets: true},
      })
      assert.strictEqual(renderRequest.getWebhook(), 'webhook')
      assert.strictEqual(renderRequest.getUrl(), 'url')
      assert.strictEqual(renderRequest.getDom(), 'dom')
      assert.strictEqual(renderRequest.getResources(), 'resources')
      assert.strictEqual(renderRequest.getRenderInfo(), 'renderInfo')
      assert.strictEqual(renderRequest.getPlatform(), 'platform')
      assert.strictEqual(renderRequest.getBrowserName(), 'browserName')
      assert.strictEqual(renderRequest.getScriptHooks(), 'scriptHooks')
      assert.strictEqual(renderRequest.getSelectorsToFindRegionsFor(), 'selectorsToFindRegionsFor')
      assert.strictEqual(renderRequest.getSendDom(), 'sendDom')
      assert.strictEqual(renderRequest.getStitchingService(), 'stitchingService')
      assert.deepStrictEqual(renderRequest.getVisualGridOptions(), {
        polyfillAdoptedStyleSheets: true,
      })
    })
  })

  describe('toJSON', () => {
    it('returns the correct object', () => {
      const resource1 = {
        getUrl() {
          return 'url1'
        },
        getHashAsObject() {
          return 'hashAsObject1'
        },
      }
      const resource2 = {
        getUrl() {
          return 'url2'
        },
        getHashAsObject() {
          return 'hashAsObject2'
        },
      }
      const dom = {
        getHashAsObject() {
          return 'dom_hashAsObject'
        },
      }

      const renderInfo = {
        toJSON() {
          return 'renderInfoToJSON'
        },
      }

      const renderRequest = new RenderRequest({
        webhook: 'webhook',
        url: 'url',
        resources: [resource1, resource2],
        dom,
        renderInfo,
        platform: 'platform',
        browserName: 'browserName',
        scriptHooks: 'scriptHooks',
        selectorsToFindRegionsFor: 'selectorsToFindRegionsFor',
        sendDom: 'sendDom',
        visualGridOptions: {polyfillAdoptedStyleSheets: true},
        enableMultipleResultsPerSelector: true,
      })
      const expected = {
        stitchingService: undefined,
        webhook: 'webhook',
        url: 'url',
        dom: 'dom_hashAsObject',
        resources: {
          url1: 'hashAsObject1',
          url2: 'hashAsObject2',
        },
        renderInfo: 'renderInfoToJSON',
        browser: {
          name: 'browserName',
        },
        platform: {
          name: 'platform',
        },
        scriptHooks: 'scriptHooks',
        selectorsToFindRegionsFor: 'selectorsToFindRegionsFor',
        sendDom: 'sendDom',
        options: {polyfillAdoptedStyleSheets: true},
        enableMultipleResultsPerSelector: true,
      }
      assert.deepStrictEqual(renderRequest.toJSON(), expected)
    })
  })

  describe('toString', () => {
    it('returns the correct string', () => {
      const resource1 = {
        getUrl() {
          return 'url1'
        },
        getHashAsObject() {
          return 'hashAsObject1'
        },
      }
      const resource2 = {
        getUrl() {
          return 'url2'
        },
        getHashAsObject() {
          return 'hashAsObject2'
        },
      }
      const dom = {
        getHashAsObject() {
          return 'dom_hashAsObject'
        },
      }

      const renderInfo = {
        toJSON() {
          return 'renderInfoToJSON'
        },
      }

      const renderRequest = new RenderRequest({
        webhook: 'webhook',
        url: 'url',
        dom,
        resources: [resource1, resource2],
        renderInfo,
        platform: 'platform',
        browserName: 'browserName',
        scriptHooks: 'scriptHooks',
        selectorsToFindRegionsFor: 'selectorsToFindRegionsFor',
        sendDom: 'sendDom',
        visualGridOptions: {polyfillAdoptedStyleSheets: true},
        enableMultipleResultsPerSelector: true,
      })
      assert.strictEqual(
        renderRequest.toString(),
        'RenderRequest { {"webhook":"webhook","url":"url","dom":"dom_hashAsObject","resources":{"url1":"hashAsObject1","url2":"hashAsObject2"},"enableMultipleResultsPerSelector":true,"browser":{"name":"browserName"},"platform":{"name":"platform"},"renderInfo":"renderInfoToJSON","scriptHooks":"scriptHooks","selectorsToFindRegionsFor":"selectorsToFindRegionsFor","sendDom":"sendDom","options":{"polyfillAdoptedStyleSheets":true}} }',
      )
    })
  })
})
