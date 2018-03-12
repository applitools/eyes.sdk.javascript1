'use strict';

const ArgumentGuard = require('../ArgumentGuard');
const GeneralUtils = require('../utils/GeneralUtils');
const NullLogHandler = require('./NullLogHandler');

/**
 * Write log massages using the provided Log Handler
 **/
class Logger {

    constructor() {
        this._logHandler = new NullLogHandler(); // Default.
    }

    /**
     * @return {LogHandler} The currently set log handler.
     */
    getLogHandler() {
        return this._logHandler;
    }

    /**
     * @param {Object} handler The log handler to set. If you want a log handler which does nothing, use {@link NullLogHandler}.
     */
    setLogHandler(handler) {
        ArgumentGuard.notNull(handler, "handler");

        this._logHandler = handler;
    }

    /**
     * Writes a verbose write message.
     *
     * @param {*} args
     */
    verbose(...args) {
        this._logHandler.onMessage(true, this._getPrefix() + GeneralUtils.stringify(...args));
    }

    /**
     * Writes a (non-verbose) write message.
     *
     * @param {*} args
     */
    log(...args) {
        this._logHandler.onMessage(false, this._getPrefix() + GeneralUtils.stringify(...args));
    }

    // noinspection JSMethodCanBeStatic
    /**
     * @private
     * @return {String} The name of the method which called the logger, if possible, or an empty string.
     */
    _getPrefix() {
        const trace = GeneralUtils.getStackTrace();

        let prefix = "";
        // getStackTrace()<-getPrefix()<-log()/verbose()<-"actual caller"
        if (trace && trace.length >= 2 && trace[2].getMethodName()) {
            prefix = `${trace[2].getMethodName()}():`;
        }

        return prefix;
    }
}

module.exports = Logger;
