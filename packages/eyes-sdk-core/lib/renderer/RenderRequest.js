'use strict';

const { ArgumentGuard } = require('@applitools/eyes-common');

/**
 * Encapsulates data required to start render using the RenderingGrid API.
 */
class RenderRequest {
  /**
   * @param {string} webhook
   * @param {string} url
   * @param {RGridDom} dom
   * @param {RGridResource[]} resources
   * @param {RenderInfo} [renderInfo]
   * @param {string} [platform]
   * @param {string} [browserName]
   * @param {Object} [scriptHooks]
   * @param {string[]} selectorsToFindRegionsFor
   * @param {boolean} sendDom
   * @param {string} renderId
   * @param {string} agentId
   */
  constructor({ webhook, url, dom, resources, renderInfo, platform, browserName, scriptHooks, selectorsToFindRegionsFor,
    sendDom, renderId, agentId } = {}) {
    ArgumentGuard.notNullOrEmpty(webhook, 'webhook');
    ArgumentGuard.notNull(url, 'url');
    ArgumentGuard.notNull(dom, 'dom');
    ArgumentGuard.notNull(resources, 'resources');

    this._webhook = webhook;
    this._url = url;
    this._dom = dom;
    this._resources = resources;
    this._renderInfo = renderInfo;
    this._platform = platform;
    this._browserName = browserName;
    this._renderId = renderId;
    this._scriptHooks = scriptHooks;
    this._selectorsToFindRegionsFor = selectorsToFindRegionsFor;
    this._sendDom = sendDom;
    this._agentId = agentId;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string}
   */
  getWebhook() {
    return this._webhook;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string}
   */
  getUrl() {
    return this._url;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {RGridDom}
   */
  getDom() {
    return this._dom;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {RGridResource[]}
   */
  getResources() {
    return this._resources;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {RenderInfo}
   */
  getRenderInfo() {
    return this._renderInfo;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string}
   */
  getPlatform() {
    return this._platform;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string}
   */
  getBrowserName() {
    return this._browserName;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string}
   */
  getRenderId() {
    return this._renderId;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string}
   */
  getAgentId() {
    return this._agentId;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {string} value
   */
  setAgentId(value) {
    this._agentId = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {string} value
   */
  setRenderId(value) {
    this._renderId = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string}
   */
  getScriptHooks() {
    return this._scriptHooks;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {string} value
   */
  setScriptHooks(value) {
    this._scriptHooks = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string[]}
   */
  getSelectorsToFindRegionsFor() {
    return this._selectorsToFindRegionsFor;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {string[]} value
   */
  setSelectorsToFindRegionsFor(value) {
    this._selectorsToFindRegionsFor = value;
  }

  /**
   * @return {boolean}
   */
  getSendDom() {
    return this._sendDom;
  }

  /**
   * @param {boolean} value
   */
  setSendDom(value) {
    this._sendDom = value;
  }

  /**
   * @override
   */
  toJSON() {
    const resources = {};
    this.getResources().forEach((resource) => {
      resources[resource.getUrl()] = resource.getHashAsObject();
    });

    const object = {
      webhook: this._webhook,
      url: this._url,
      dom: this._dom.getHashAsObject(),
      resources,
    };

    if (this._renderId) {
      object.renderId = this._renderId;
    }

    if (this._agentId) {
      object.agentId = this._agentId;
    }

    if (this._browserName) {
      object.browser = {
        name: this._browserName,
      };

      if (this._platform) {
        object.browser.platform = this._platform;
      }
    }

    if (this._renderInfo) {
      object.renderInfo = this._renderInfo.toJSON();
    }

    if (this._scriptHooks) {
      object.scriptHooks = this._scriptHooks;
    }

    if (this._selectorsToFindRegionsFor) {
      object.selectorsToFindRegionsFor = this._selectorsToFindRegionsFor;
    }

    if (this._sendDom !== undefined) {
      object.sendDom = this._sendDom;
    }

    return object;
  }

  /**
   * @override
   */
  toString() {
    return `RenderRequest { ${JSON.stringify(this)} }`;
  }
}

exports.RenderRequest = RenderRequest;
