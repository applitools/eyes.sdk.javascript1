'use strict';

class PropertyData {

    /**
     * @param {String} name
     * @param {String} value
     */
    constructor(name, value) {
        this._name = name;
        this._value = value;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @return {String} */
    getName() {
        return this._name;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @param {String} value */
    setName(value) {
        this._name = value;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @return {String} */
    getValue() {
        return this._value;
    }

    // noinspection JSUnusedGlobalSymbols
    /** @param {String} value */
    setValue(value) {
        this._value = value;
    }

    toJSON() {
        return {
            name: this._name,
            value: this._value,
        };
    }

    /** @override */
    toString() {
        return `PropertyData { ${JSON.stringify(this)} }`;
    }
}

module.exports = PropertyData;
