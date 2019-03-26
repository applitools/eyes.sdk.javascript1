'use strict';

const { PropertyHandler } = require('./PropertyHandler');

/**
 * A property handler for read-only properties (i.e., set always fails).
 */
class ReadOnlyPropertyHandler extends PropertyHandler {
  /**
   * @param {Logger} [logger]
   * @param {object} [obj] - The object to set.
   */
  constructor(logger, obj) {
    super();
    this._logger = logger;
    this._obj = obj || null;
  }

  /**
   * @inheritDoc
   */
  set(obj) { // eslint-disable-line no-unused-vars
    this._logger.verbose('Ignored. (ReadOnlyPropertyHandler)');
    return false;
  }

  /**
   * @inheritDoc
   */
  get() {
    return this._obj;
  }
}

exports.ReadOnlyPropertyHandler = ReadOnlyPropertyHandler;
