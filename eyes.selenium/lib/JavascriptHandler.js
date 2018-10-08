'use strict';

/**
 * @interface
 */
class JavascriptHandler {
  // noinspection JSMethodCanBeStatic
  /**
   * @param {!string} script
   * @param {object...} args
   * @return {Promise<void>}
   */
  async handle(script, ...args) {
    return null; // do nothing
  }
}

exports.JavascriptHandler = JavascriptHandler;
