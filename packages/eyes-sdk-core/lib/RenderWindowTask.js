'use strict';

const PromisePool = require('es6-promise-pool');

const { ArgumentGuard } = require('@applitools/eyes-common');

const { RenderStatus } = require('./renderer/RenderStatus');

const DEFAULT_CONCURRENCY_LIMIT = 100;

/**
 * @ignore
 */
class RenderWindowTask {
  /**
   * @param {Logger} logger - A logger instance.
   * @param {ServerConnector} serverConnector - Our gateway to the agent
   */
  constructor(logger, serverConnector) {
    ArgumentGuard.notNull(logger, 'logger');
    ArgumentGuard.notNull(serverConnector, 'serverConnector');

    this._logger = logger;
    this._serverConnector = serverConnector;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {RenderRequest} renderRequest
   * @return {Promise<string>} - Rendered image URL
   */
  async renderWindow(renderRequest) {
    const runningRender = await this.postRender(renderRequest);
    const renderStatus = await this.getRenderStatus(runningRender);
    return renderStatus.getImageLocation();
  }

  /**
   * @param {RenderRequest} renderRequest
   * @return {Promise<RunningRender>}
   */
  async postRender(renderRequest) {
    const newRender = await this._serverConnector.render(renderRequest);
    if (newRender.getRenderStatus() === RenderStatus.NEED_MORE_RESOURCES) {
      renderRequest.setRenderId(newRender.getRenderId());

      await this.putResources(renderRequest.getDom(), newRender);
      return this.postRender(renderRequest);
    }

    return newRender;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {RenderRequest[]} renderRequests
   * @return {Promise<RunningRender>}
   */
  postRenderBatch(renderRequests) {
    return this._serverConnector.render(renderRequests);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {RenderRequest} renderRequest
   * @return {Promise}
   */
  async checkAndPutResources(renderRequest) {
    const newRender = await this._serverConnector.render(renderRequest);
    if (newRender.getRenderStatus() === RenderStatus.NEED_MORE_RESOURCES) {
      return this.putResources(renderRequest.getDom(), newRender);
    }

    return null;
  }

  /**
   * @param {RunningRender} runningRender
   * @param {boolean} [delayBeforeRequest=false]
   * @return {Promise<RenderStatusResults>}
   */
  async getRenderStatus(runningRender, delayBeforeRequest = false) {
    const renderStatusResults = await this._serverConnector.renderStatus(runningRender, delayBeforeRequest);
    if (renderStatusResults.getStatus() === undefined || renderStatusResults.getStatus() === RenderStatus.RENDERING) {
      return this.getRenderStatus(runningRender, true);
    }

    if (renderStatusResults.getStatus() === RenderStatus.ERROR) {
      throw new Error(renderStatusResults.getError());
    }

    return renderStatusResults;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {string[]} renderIds
   * @param {boolean} [delayBeforeRequest=false] - If {@code true}, then the request will be delayed
   * @return {Promise<RenderStatusResults[]>}
   */
  getRenderStatusBatch(renderIds, delayBeforeRequest) {
    return this._serverConnector.renderStatusById(renderIds, delayBeforeRequest);
  }

  /**
   * @param {RGridDom} rGridDom
   * @param {RunningRender} runningRender
   * @param {number} [concurrency]
   * @return {Promise}
   */
  async putResources(rGridDom, runningRender, concurrency = DEFAULT_CONCURRENCY_LIMIT) {
    if (runningRender.getNeedMoreDom()) {
      await this._serverConnector.renderPutResource(runningRender, rGridDom.asResource());
    }

    if (runningRender.getNeedMoreResources()) {
      const resources = rGridDom.getResources();

      const pool = new PromisePool(function* generatePutResourcesPromises() {
        for (let l = resources.length - 1; l >= 0; l -= 1) {
          if (runningRender.getNeedMoreResources().includes(resources[l].getUrl())) {
            yield this._serverConnector.renderPutResource(runningRender, resources[l]);
          }
        }
      }, concurrency);

      await pool.start();
    }
  }
}

exports.RenderWindowTask = RenderWindowTask;
