'use strict';

const PropertyHandler = require('./PropertyHandler');

/**
 * A property handler for read-only properties (i.e., set always fails).
 */
class ReadOnlyPropertyHandler extends PropertyHandler {

    /**
     * @param {Logger} [logger]
     * @param {Object} [obj] The object to set.
     **/
    constructor(logger, obj) {
        super();
        this._logger = logger;
        this._obj = obj || null;
    }

    /**
     * @param {Object} obj The object to set.
     * @return {boolean|void} {@code true} if the object was set, {@code false} otherwise.
     */
    set(obj) {
        this._logger.verbose("Ignored. (%s)", "ReadOnlyPropertyHandler");
        return false;
    }

    /**
     * @return {Object} The object that was set. (Note that object might also be set in the constructor of an implementation class).
     */
    get() {
        return this._obj;
    }
}

module.exports = ReadOnlyPropertyHandler;
