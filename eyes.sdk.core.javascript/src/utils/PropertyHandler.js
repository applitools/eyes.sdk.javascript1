'use strict';

/**
 * Encapsulates getter/setter behavior. (e.g., set only once etc.).
 *
 * @interface
 **/
class PropertyHandler {

    /**
     * @param {*} obj The object to set.
     * @return {boolean|void} {@code true} if the object was set, {@code false} otherwise.
     */
    set(obj) {}

    /**
     * @return {*} The object that was set. (Note that object might also be set in the constructor of an implementation class).
     */
    get() {}
}

module.exports = PropertyHandler;
