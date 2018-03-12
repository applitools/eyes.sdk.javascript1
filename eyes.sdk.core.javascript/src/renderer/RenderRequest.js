'use strict';

const ArgumentGuard = require('../ArgumentGuard');

/**
 * Encapsulates data required to start render using the RenderingGrid API.
 */
class RenderRequest {

    /**
     * @param {string} webhook
     * @param {string} url
     * @param {RGridDom} dom
     * @param {number} [renderWidth]
     */
    constructor(webhook, url, dom, renderWidth) {
        ArgumentGuard.notNullOrEmpty(webhook, "webhook");
        ArgumentGuard.notNull(url, "url");
        ArgumentGuard.notNull(dom, "dom");

        this._webhook = webhook;
        this._url = url;
        this._dom = dom;
        this._renderWidth = renderWidth;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @return {String} */
    getWebhook() {
        return this._webhook;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @return {String} */
    getUrl() {
        return this._url;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @return {RGridDom} */
    getDom() {
        return this._dom;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @return {RGridResource[]} */
    getResources() {
        return this._dom.getResources();
    }

    // noinspection JSUnusedGlobalSymbols
    /** @return {number} */
    getRenderWidth() {
        return this._renderWidth;
    }

    /** @override */
    toJSON() {
        const resources = {};
        for (const resource of this._dom.getResources()) {
            resources[resource.getUrl()] = resource.getHashAsObject()
        }

        return {
            webhook: this._webhook,
            url: this._url,

            dom: this._dom.getHashAsObject(),
            resources: resources,
            renderWidth: this._renderWidth,
        };
    }

    /** @override */
    toString() {
        return `RenderRequest { ${JSON.stringify(this)} }`;
    }
}

module.exports = RenderRequest;
