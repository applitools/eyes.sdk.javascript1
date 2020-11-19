'use strict'

const ArgumentGuard = require('../utils/ArgumentGuard')

/**
 * Encapsulates data required to start render using the RenderingGrid API.
 */
class RenderRequest {
  /**
   * @param request
   * @param {string} request.webhook
   * @param {string} request.url
   * @param {RGridDom} request.dom
   * @param {RGridResource[]} request.resources
   * @param {RenderInfo} [request.renderInfo]
   * @param {string} [request.platform]
   * @param {string} [request.browserName]
   * @param {Object} [request.scriptHooks]
   * @param {string[]} request.selectorsToFindRegionsFor
   * @param {boolean} request.sendDom
   * @param {string} request.renderId
   * @param {Object} request.visualGridOptions
   */
  constructor({
    webhook,
    stitchingService,
    url,
    dom,
    resources,
    renderInfo,
    platform,
    browserName,
    scriptHooks,
    selectorsToFindRegionsFor,
    sendDom,
    renderId,
    agentId,
    visualGridOptions,
    renderer,
  } = {}) {
    // ArgumentGuard.notNullOrEmpty(webhook, 'webhook')
    // ArgumentGuard.notNull(url, 'url')
    // ArgumentGuard.notNull(dom, 'dom')
    // ArgumentGuard.notNull(resources, 'resources')

    this._webhook = webhook
    this._stitchingService = stitchingService
    this._url = url
    this._dom = dom
    this._resources = resources
    this._renderInfo = renderInfo
    this._platform = platform
    this._browserName = browserName
    this._renderId = renderId
    this._scriptHooks = scriptHooks
    this._selectorsToFindRegionsFor = selectorsToFindRegionsFor
    this._sendDom = sendDom
    this._agentId = agentId
    this._visualGridOptions = visualGridOptions
    this._renderer = renderer
  }

  /**
   * @return {string}
   */
  getWebhook() {
    return this._webhook
  }

  /**
   * @return {string}
   */
  getStitchingService() {
    return this._stitchingService
  }

  /**
   * @return {string}
   */
  getUrl() {
    return this._url
  }

  /**
   * @return {RGridDom}
   */
  getDom() {
    return this._dom
  }

  /**
   * @return {RGridDom}
   */
  setDom(dom) {
    this._dom = dom
  }

  /**
   * @return {RGridResource[]}
   */
  getResources() {
    return this._resources
  }

  setResources(resources) {
    this._resources = resources
  }

  /**
   * @return {RenderInfo}
   */
  getRenderInfo() {
    return this._renderInfo
  }

  /**
   * @return {string}
   */
  getPlatform() {
    return this._platform
  }

  /**
   * @return {string}
   */
  getBrowserName() {
    return this._browserName
  }

  /**
   * @return {string}
   */
  getRenderId() {
    return this._renderId
  }

  /**
   * @return {string}
   */
  getAgentId() {
    return this._agentId
  }

  /**
   * @param {string} value
   */
  setAgentId(value) {
    this._agentId = value
  }

  /**
   * @param {string} value
   */
  setRenderId(value) {
    this._renderId = value
  }

  /**
   * @return {string}
   */
  getScriptHooks() {
    return this._scriptHooks
  }

  /**
   * @param {string} value
   */
  setScriptHooks(value) {
    this._scriptHooks = value
  }

  /**
   * @return {string[]}
   */
  getSelectorsToFindRegionsFor() {
    return this._selectorsToFindRegionsFor
  }

  /**
   * @param {string[]} value
   */
  setSelectorsToFindRegionsFor(value) {
    this._selectorsToFindRegionsFor = value
  }

  /**
   * @return {boolean}
   */
  getSendDom() {
    return this._sendDom
  }

  /**
   * @param {boolean} value
   */
  setSendDom(value) {
    this._sendDom = value
  }

  getVisualGridOptions() {
    return this._visualGridOptions
  }

  setVisualGridOptions(options) {
    this._visualGridOptions = options
  }

  getRenderer() {
    return this._renderer
  }

  setRenderer(renderer) {
    this._renderer = renderer
  }

  /**
   * @override
   */
  toJSON() {
    const resources = {}
    if (this.getResources()) {
      this.getResources().forEach(resource => {
        resources[resource.getUrl()] = resource.getHashAsObject()
      })
    }

    const object = {
      webhook: this._webhook,
      stitchingService: this._stitchingService,
      url: this._url,
      dom: this._dom ? this._dom.getHashAsObject() : null,
      resources: this._resources
        ? this._resources.reduce((resources, resource) => {
            return Object.assign(resources, {[resource.getUrl()]: resource.getHashAsObject()})
          }, {})
        : null,
      enableMultipleResultsPerSelector: true,
    }

    if (this._renderId) {
      object.renderId = this._renderId
    }

    if (this._agentId) {
      object.agentId = this._agentId
    }

    if (this._browserName) {
      object.browser = {
        name: this._browserName,
      }
    }

    if (this._platform) {
      object.platform = {
        name: this._platform,
      }
    }

    if (this._renderInfo) {
      object.renderInfo = this._renderInfo.toJSON()
    }

    if (this._scriptHooks) {
      object.scriptHooks = this._scriptHooks
    }

    if (this._selectorsToFindRegionsFor) {
      object.selectorsToFindRegionsFor = this._selectorsToFindRegionsFor
    }

    if (this._sendDom !== undefined) {
      object.sendDom = this._sendDom
    }

    if (this._visualGridOptions) {
      object.options = this._visualGridOptions
    }

    return object
  }

  /**
   * @override
   */
  toString() {
    return `RenderRequest { ${JSON.stringify(this)} }`
  }
}

module.exports = RenderRequest
