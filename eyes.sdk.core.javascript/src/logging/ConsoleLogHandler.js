'use strict';

const GeneralUtils = require('../utils/GeneralUtils');
const LogHandler = require('./LogHandler');

/**
 * Write log massages to the browser/node console
 */
class ConsoleLogHandler extends LogHandler {

    /**
     * @param {Boolean} isVerbose Whether to handle or ignore verbose log messages.
     **/
    constructor(isVerbose) {
        super();

        this.setIsVerbose(isVerbose);
    }

    open() {}

    close() {}

    //noinspection JSUnusedGlobalSymbols
    /**
     * Handle a message to be logged.
     *
     * @param {Boolean} verbose - is the message verbose
     * @param {String} logString
     */
    onMessage(verbose, logString) {
        if (!verbose || this._isVerbose) {
            console.log(`${GeneralUtils.toISO8601DateTime()} Eyes: ${logString}`);
        }
    }
}

module.exports = ConsoleLogHandler;
