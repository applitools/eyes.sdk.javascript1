'use strict';

const ArgumentGuard = require('./ArgumentGuard');
const GeneralUtils = require('./utils/GeneralUtils');
const RenderStatus = require('./renderer/RenderStatus');
const RenderRequest = require('./renderer/RenderRequest');

const GET_STATUS_INTERVAL = 500; // Milliseconds

class RenderWindowTask {

    /**
     * @param {PromiseFactory} promiseFactory An object which will be used for creating deferreds/promises.
     * @param {Logger} logger A logger instance.
     * @param {ServerConnector} serverConnector Our gateway to the agent
     */
    constructor(promiseFactory, logger, serverConnector) {
        ArgumentGuard.notNull(promiseFactory, "promiseFactory");
        ArgumentGuard.notNull(logger, "logger");
        ArgumentGuard.notNull(serverConnector, "serverConnector");

        this._promiseFactory = promiseFactory;
        this._logger = logger;
        this._serverConnector = serverConnector;
    }

    /**
     * @param {String} webhook
     * @param {String} url
     * @param {RGridDom} rGridDom
     * @param {number} renderWidth
     * @return {Promise.<String>} Rendered image URL
     */
    renderWindow(webhook, url, rGridDom, renderWidth) {
        const renderRequest = new RenderRequest(webhook, url, rGridDom, renderWidth);

        const that = this;
        return that.postRender(rGridDom, renderRequest).then(runningRender => {
            return that.getRenderStatus(runningRender);
        }).then(/** RenderStatusResults */ renderStatus => {
            return renderStatus.getImageLocation();
        });
    }

    /**
     * @param {RunningRender} runningRender
     * @return {Promise.<RenderStatusResults>}
     */
    getRenderStatus(runningRender) {
        const that = this;
        return that._serverConnector.renderStatus(runningRender).catch(() => {
            return GeneralUtils.sleep(GET_STATUS_INTERVAL, that._promiseFactory).then(() => {
                return that.getRenderStatus(runningRender);
            });
        }).then(renderStatusResults => {

            if (renderStatusResults.getStatus() === RenderStatus.RENDERING) {
                return GeneralUtils.sleep(GET_STATUS_INTERVAL, that._promiseFactory).then(() => {
                    return that.getRenderStatus(runningRender);
                });
            } else if (renderStatusResults.getStatus() === RenderStatus.ERROR) {
                return that._promiseFactory.reject(renderStatusResults.getError());
            }

            return renderStatusResults;
        });
    }

    /**
     * @param {RGridDom} rGridDom
     * @param {RenderRequest} renderRequest
     * @param {RunningRender} [runningRender]
     * @return {Promise.<RunningRender>}
     */
    postRender(rGridDom, renderRequest, runningRender) {
        const that = this;
        return that._serverConnector.render(renderRequest, runningRender).then(runningRender => {

            if (runningRender.getRenderStatus() === RenderStatus.NEED_MORE_RESOURCES) {
                return that.putResources(rGridDom, renderRequest, runningRender).then(() => {
                    return that.postRender(rGridDom, renderRequest, runningRender);
                });
            }

            return runningRender;
        });
    }

    /**
     * @param {RGridDom} rGridDom
     * @param {RenderRequest} renderRequest
     * @param {RunningRender} [runningRender]
     * @return {Promise.<RunningRender>}
     */
    putResources(rGridDom, renderRequest, runningRender) {
        const that = this;
        const promises = [];

        if (runningRender.getNeedMoreDom()) {
            promises.push(that._serverConnector.renderPutResource(runningRender, rGridDom.asResource()));
        }

        if (runningRender.getNeedMoreResources()) {
            for (const resource of rGridDom.getResources()) {
                if (runningRender.getNeedMoreResources().includes(resource.getUrl())) {
                    promises.push(that._serverConnector.renderPutResource(runningRender, resource));
                }
            }
        }

        return that._promiseFactory.all(promises);
    }
}

module.exports = RenderWindowTask;
