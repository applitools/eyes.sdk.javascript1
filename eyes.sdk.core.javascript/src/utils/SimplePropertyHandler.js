'use strict';

const PropertyHandler = require('./PropertyHandler');

/**
 * A simple implementation of {@link PropertyHandler}. Allows get/set.
 */
class SimplePropertyHandler extends PropertyHandler {

    /**
     * @param {Object} [obj] The object to set.
     **/
    constructor(obj) {
        super();
        this._obj = obj || null;
    }

    /**
     * @param {Object} obj The object to set.
     * @return {boolean|void} {@code true} if the object was set, {@code false} otherwise.
     */
    set(obj) {
        this._obj = obj;
        return true;
    }

    /**
     * @return {Object} The object that was set. (Note that object might also be set in the constructor of an implementation class).
     */
    get() {
        return this._obj;
    }
}

module.exports = SimplePropertyHandler;
