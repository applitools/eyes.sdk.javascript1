const crypto = require('crypto');

const GeneralUtils = require('../utils/GeneralUtils');
const ArgumentGuard = require('../ArgumentGuard');

class RGridResource {

    constructor() {
        this._url = null;
        this._contentType = null;
        this._content = null;

        this._sha256hash = null;
    }

    /**
     * @return {String} The url of the current resource.
     */
    getUrl() {
        return this._url;
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * @param {String} value The resource's url
     */
    setUrl(value) {
        ArgumentGuard.notNull(value, "url");
        this._url = value;
    }

    /**
     * @return {String} The contentType of the current resource.
     */
    getContentType() {
        return this._contentType;
    }

    /**
     * @param {String} value The resource's contentType
     */
    setContentType(value) {
        ArgumentGuard.notNull(value, "contentType");
        this._contentType = value;
    }

    /**
     * @return {Buffer} The content of the current resource.
     */
    getContent() {
        return this._content;
    }

    /**
     * @param {Buffer} value The resource's content
     */
    setContent(value) {
        ArgumentGuard.notNull(value, "content");
        this._content = value;
    }

    getSha256Hash() {
        if (!this._sha256hash) {
            this._sha256hash = crypto.createHash('sha256')
                .update(this._content)
                .digest('hex');
        }

        return this._sha256hash;
    }

    getHashAsObject() {
        return {
            hashFormat: "sha256",
            hash: this.getSha256Hash()
        };
    }

    /** @override */
    toJSON() {
        return GeneralUtils.toPlain(this, ['_sha256hash']);
    }

    /** @override */
    toString() {
        return `RGridResource { ${JSON.stringify(this)} }`;
    }
}

module.exports = RGridResource;
