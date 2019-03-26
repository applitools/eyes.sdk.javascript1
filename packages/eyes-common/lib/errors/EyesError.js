'use strict';

/**
 * The base Applitools Eyes error type.
 */
class EyesError extends Error {
  /**
   * @param {string} [message] - The error description string
   * @param {Error} [error] - Another error to inherit from
   */
  constructor(message, error) {
    super();

    /** @inheritDoc */
    this.name = this.constructor.name;

    /** @inheritDoc */
    this.message = message;

    if (error instanceof Error) {
      this.message = `${message}: ${error.message}`;
      this.stack = error.stack;
    }
  }
}

exports.EyesError = EyesError;
