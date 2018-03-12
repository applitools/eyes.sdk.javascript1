'use strict';

const dateformat = require('dateformat');
const stackTrace = require('stack-trace');

const DATE_FORMAT_ISO8601_FOR_OUTPUT = "yyyy-mm-dd'T'HH:MM:ss'Z'";
const DATE_FORMAT_RFC1123 = "ddd, dd mmm yyyy HH:MM:ss 'GMT'";

const BASE64_CHARS_PATTERN = /[^A-Z0-9+\/=]/i;

const MS_IN_S = 1000;
const MS_IN_M = 60000;

/**
 * Collection of utility methods.
 */
class GeneralUtils {

    /**
     * Concatenate the url to the suffixes - making sure there are no double slashes
     *
     * @param {String} url The left side of the URL.
     * @param {String...} suffixes The right side.
     * @return {String} the URL
     **/
    static urlConcat(url, ...suffixes) {
        let concatUrl = GeneralUtils.stripTrailingSlash(url);

        for (let i = 0, l = suffixes.length; i < l; ++i) {
            /** @type {string} */
            const suffix = suffixes[i];
            if (!suffix.startsWith('/') && !((i === l - 1) && suffix.startsWith('?'))) {
                concatUrl += '/';
            }
            concatUrl += GeneralUtils.stripTrailingSlash(suffix);
        }

        return concatUrl;
    };

    /**
     * If given URL ends with '/', the method with cut it and return URL without it
     *
     * @param {String} url
     * @return {String}
     */
    static stripTrailingSlash(url) {
        return url.endsWith('/') ? url.slice(0, -1) : url;
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Convert object into json string
     *
     * @deprecated use JSON.stringify instead
     * @param {Object} object
     * @return {String}
     */
    static toJson(object) {
        return JSON.stringify(object);
    };

    /**
     * Convert a class to plain object
     *
     * @param {Object} object
     * @param {Array.<string>} [exclude]
     * @return {Object}
     */
    static toPlain(object, exclude = []) {
        if (object == null) {
            throw new TypeError('Cannot make null plain.');
        }

        const plainObject = {};
        for (let objectKey in object) {
            const publicKey = objectKey.replace('_', '');
            if (object.hasOwnProperty(objectKey) && !exclude.includes(objectKey)) {
                if (object[objectKey] instanceof Object && typeof object[objectKey].toJSON === 'function') {
                    plainObject[publicKey] = object[objectKey].toJSON();
                } else {
                    plainObject[publicKey] = object[objectKey];
                }
            }
        }
        return plainObject;
    };

    /**
     * Assign all properties of the object that exists in the instance to it
     *
     * @template T
     * @param {T} inst
     * @param {Object} object
     * @param {Object} [mapping]
     * @return {T}
     */
    static assignTo(inst, object, mapping = {}) {
        if (inst == null) {
            throw new TypeError('Cannot assign object to null.');
        }

        if (object == null) {
            throw new TypeError('Cannot assign empty object or null.');
        }

        for (let objectKey in object) {
            const privateKey = '_' + objectKey;
            if (object.hasOwnProperty(objectKey) && inst.hasOwnProperty(privateKey)) {
                if (mapping.hasOwnProperty(objectKey)) {
                    inst[privateKey] = mapping[objectKey].call(null, object[objectKey]);
                } else {
                    inst[privateKey] = object[objectKey];
                }
            }
        }

        return inst;
    };

    /**
     * Mixin methods from one object into another.
     * Follow the prototype chain and apply form root to current - but skip the top (Object)
     *
     * @param {Object} to The object to which methods will be added
     * @param {Object} from The object from which methods will be copied
     */
    static mixin(to, from) {
        let index, protos = [], proto = from;
        while (!!proto) {
            protos.push(Object.getOwnPropertyNames(proto));
            proto = Object.getPrototypeOf(proto);
        }

        for (index = protos.length - 2; index >= 0; index--) {
            protos[index].forEach(function(method) {
                if (!to[method] && typeof from[method] === 'function' && method !== 'constructor') {
                    _mixin(to, from, method);
                }
            });
        }
    };

    /**
     * Generate GUID
     *
     * @return {String}
     */
    static guid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            // noinspection MagicNumberJS, NonShortCircuitBooleanExpressionJS
            const r = Math.random() * 16 | 0;
            // noinspection MagicNumberJS, NonShortCircuitBooleanExpressionJS
            const v = (c === 'x') ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    /**
     * Clone object
     *
     * @param {Date|Array|Object} obj
     * @return {*}
     */
    static clone(obj) {
        // noinspection EqualityComparisonWithCoercionJS
        if (obj == null || typeof obj !== "object") {
            return obj;
        }

        if (obj instanceof Date) {
            return new Date(obj.getTime());
        }

        if (obj instanceof Array) {
            return Array.from(obj);
        }

        if (obj instanceof Object) {
            const copy = obj.constructor();
            for (const attr in obj) {
                if (obj.hasOwnProperty(attr)) {
                    copy[attr] = GeneralUtils.clone(obj[attr]);
                }
            }
            return copy;
        }

        throw new Error("Unable to copy object! Its type isn't supported.");
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Creates a property with default configuration (writable, enumerable, configurable).
     *
     * @param {Object} obj The object to create the property on.
     * @param {String} name The name of the property
     * @param {Function} getFunc The getter of the property
     * @param {Function} setFunc The setter of the property
     */
    static definePropertyWithDefaultConfig(obj, name, getFunc, setFunc) {
        Object.defineProperty(obj, name, {
            enumerable: true,
            configurable: true,
            get: getFunc,
            set: setFunc
        });
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * Creates a property with default configuration (writable, enumerable, configurable) and default getter/setter.
     *
     * @param {Object} obj The object to create the property on.
     * @param {String} name The name of the property
     */
    static defineStandardProperty(obj, name) {
        const getFunc = function get () { return this[`_${name}`]; };
        const setFunc = function set (v) { this[`_${name}`] = v; };
        GeneralUtils.definePropertyWithDefaultConfig(obj, name, getFunc, setFunc);
    };

    /**
     * Waits a specified amount of time before resolving the returned promise.
     *
     * @param {int} ms The amount of time to sleep in milliseconds.
     * @param {PromiseFactory} promiseFactory
     * @return {Promise} A promise which is resolved when sleep is done.
     */
    static sleep(ms, promiseFactory) {
        return promiseFactory.makePromise(resolve => {
            setTimeout(() => {
                resolve();
            }, ms);
        });
    };

    /**
     * Convert a Date object to a ISO-8601 date string
     *
     * @param {Date} [date] Date which will be converted
     * @return {String} String formatted as ISO-8601 (yyyy-MM-dd'T'HH:mm:ss'Z')
     */
    static toISO8601DateTime(date = new Date()) {
        return dateformat(date, DATE_FORMAT_ISO8601_FOR_OUTPUT, true);
    };

    /**
     * Convert a Date object to a RFC-1123 date string
     *
     * @param {Date} [date] Date which will be converted
     * @return {String} String formatted as RFC-1123 (E, dd MMM yyyy HH:mm:ss 'GMT')
     */
    static toRfc1123DateTime(date = new Date()) {
        return dateformat(date, DATE_FORMAT_RFC1123, true);
    };

    /**
     * Creates {@link Date} instance from an ISO 8601 formatted string.
     *
     * @param {String} dateTime An ISO 8601 formatted string.
     * @return {Date} A {@link Date} instance representing the given date and time.
     */
    static fromISO8601DateTime(dateTime) {
        return new Date(dateTime);
    };

    /**
     * Format elapsed time by template (#m #s #ms)
     *
     * @param {number} elapsedMs
     * @return {string} formatted string
     */
    static elapsedString(elapsedMs) {
        const min = Math.floor(elapsedMs / MS_IN_M);
        if (min > 0) { elapsedMs -= min * MS_IN_M; }
        const sec = Math.floor(elapsedMs / MS_IN_S);
        if (sec > 0) { elapsedMs -= sec * MS_IN_S; }

        if (min > 0) {
            return `${min}m ${sec}s ${elapsedMs}ms`;
        } else {
            return `${sec}s ${elapsedMs}ms`;
        }
    }

    /**
     * Convert object(s) to a string
     *
     * @param {*} args
     * @return {String}
     */
    static stringify(...args) {
        return args.map(function (arg) {
            if (typeof arg === 'object') {
                return JSON.stringify(arg);
            }

            return arg;
        }).join(" ");
    };

    /**
     * @return {int}
     */
    static currentTimeMillis() {
        return Date.now();
    }

    /**
     * @param value
     * @return {boolean}
     */
    static isString(value) {
        return typeof value === 'string' || value instanceof String;
    }

    /**
     * @param value
     * @return {boolean}
     */
    static isNumber(value) {
        return typeof value === 'number' || value instanceof Number;
    }

    /**
     * @param value
     * @return {boolean}
     */
    static isBoolean(value) {
        return typeof value === 'boolean' || value instanceof Boolean;
    }

    /**
     * @param value
     * @return {boolean}
     */
    static isBuffer(value) {
        return value != null && !!value.constructor && typeof value.constructor.isBuffer === 'function' && value.constructor.isBuffer(value);
    }

    static isBase64(str) {
        if (!GeneralUtils.isString(str)) {
            return false;
        }

        const len = str.length;
        if (!len || len % 4 !== 0 || BASE64_CHARS_PATTERN.test(str)) {
            return false;
        }

        const firstPaddingChar = str.indexOf('=');
        return firstPaddingChar === -1 || firstPaddingChar === len - 1 || (firstPaddingChar === len - 2 && str[len - 1] === '=');
    }

    /**
     * @typedef {Object} CallSite
     * @property {function} getTypeName returns the type of this as a string.
     * @property {function} getFunctionName returns the name of the current function, typically its name property.
     * @property {function} getMethodName returns the name of the property of this or one of its prototypes that holds the current function
     * @property {function} getFileName if this function was defined in a script returns the name of the script
     * @property {function} getLineNumber if this function was defined in a script returns the current line number
     * @property {function} getColumnNumber if this function was defined in a script returns the current column number
     * @property {function} isNative is this call in native V8 code?
     *
     * @return {Array.<CallSite>}
     */
    static getStackTrace() {
        return stackTrace.get();
    }

    /**
     * Simple method that decode JSON Web Tokens
     *
     * @param {String} token
     * @return {Object}
     */
    static jwtDecode(token) {
        let payloadSeg = token.split('.')[1];
        payloadSeg += new Array(5 - payloadSeg.length % 4).join('=');
        payloadSeg = payloadSeg.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(new Buffer(payloadSeg, 'base64').toString());
    }
}

/**
 * @private
 * @param {Object} to
 * @param {Object} from
 * @param {string} fnName
 */
function _mixin(to, from, fnName) {
    to[fnName] = function () {
        return from[fnName].apply(from, arguments);
    };
}

module.exports = GeneralUtils;
