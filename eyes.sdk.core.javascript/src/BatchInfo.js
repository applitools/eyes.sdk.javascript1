'use strict';

const ArgumentGuard = require('./ArgumentGuard');
const GeneralUtils = require('./utils/GeneralUtils');

/**
 * A batch of tests.
 */
class BatchInfo {

    /**
     * Creates a new BatchInfo instance.
     * @param {String} [name] Name of batch or {@code null} if anonymous.
     * @param {Date} [startedAt] Batch start time, defaults to the current time.
     * @param {String} [id]
     */
    constructor(name = null, startedAt = new Date(), id = GeneralUtils.guid()) {
        ArgumentGuard.notNull(startedAt, "startedAt");

        this._id = id;
        this._name = name;
        this._startedAt = GeneralUtils.toISO8601DateTime(startedAt);
    }

    /**
     * @return {String} The id of the current batch.
     */
    getId() {
        return this._id;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Sets a unique identifier for the batch. Sessions with batch info which includes the same ID will be grouped together.
     * @param {String} value The batch's ID
     */
    setId(value) {
        ArgumentGuard.notNullOrEmpty(value, "id");
        this._id = value;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @return The name of the batch or {@code null} if anonymous.
     */
    getName() {
        return this._name;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @return {Date} The batch start date
     */
    getStartedAt() {
        return new Date(this._startedAt);
    }

    toJSON() {
        return {
            id: this._id,
            name: this._name,
            startedAt: this._startedAt
        };
    }

    /** @override */
    toString() {
        return `BatchInfo { ${JSON.stringify(this)} }`;
    }
}

module.exports = BatchInfo;
