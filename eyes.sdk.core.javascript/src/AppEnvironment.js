'use strict';

/**
 * The environment in which the application under test is executing.
 */
class AppEnvironment {

    /**
     * Creates a new AppEnvironment instance.
     *
     * @param {String} [os]
     * @param {String} [hostingApp]
     * @param {RectangleSize} [displaySize]
     */
    constructor(os, hostingApp, displaySize) {
        this._inferred = null;
        this._os = os;
        this._hostingApp = hostingApp;
        this._displaySize = displaySize;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Creates a new AppEnvironment instance.
     *
     * @param {String} inferred
     * @return {AppEnvironment}
     */
    static fromInferred(inferred) {
        const env = new AppEnvironment();
        env.inferred = inferred;
        return env;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Gets the information inferred from the execution environment or {@code null} if no information could be inferred.
     *
     * @return {String}
     */
    geInferred() {
        return this._inferred;
    }

    /**
     * Sets the inferred environment information.
     *
     * @param {String} value
     */
    setInferred(value) {
        this._inferred = value;
    }

    /**
     * Gets the OS hosting the application under test or {@code null} if unknown.
     *
     * @return {String}
     */
    getOs() {
        return this._os;
    }

    /**
     * Sets the OS hosting the application under test or {@code null} if unknown.
     *
     * @param {String} value
     */
    setOs(value) {
        this._os = value;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Gets the application hosting the application under test or {@code null} if unknown.
     *
     * @return {String}
     */
    getHostingApp() {
        return this._hostingApp;
    }

    /**
     * Sets the application hosting the application under test or {@code null} if unknown.
     *
     * @param {String} value
     */
    setHostingApp(value) {
        this._hostingApp = value;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Gets the display size of the application or {@code null} if unknown.
     *
     * @return {RectangleSize}
     */
    getDisplaySize() {
        return this._displaySize;
    }

    /**
     * Sets the display size of the application or {@code null} if unknown.
     *
     * @param {RectangleSize} value
     */
    setDisplaySize(value) {
        this._displaySize = value;
    }

    toJSON() {
        return {
            inferred: this._inferred,
            os: this._os,
            hostingApp: this._hostingApp,
            displaySize: this._displaySize
        };
    }

    /** @override */
    toString() {
        return `AppEnvironment { ${JSON.stringify(this)} }`;
    }
}

module.exports = AppEnvironment;
