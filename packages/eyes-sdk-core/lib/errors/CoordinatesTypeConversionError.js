'use strict';

const { EyesError } = require('@applitools/eyes-common');

/**
 * Encapsulates an error converting between two coordinate types.
 */
class CoordinatesTypeConversionError extends EyesError {
  /**
   * Represents an error trying to convert between two coordinate types.
   *
   * @param {CoordinatesType|string} fromOrMsg - The source coordinates type or message.
   * @param {CoordinatesType} [to] - The target coordinates type.
   */
  constructor(fromOrMsg, to) {
    if (arguments.length === 2) {
      super(`Cannot convert from '${fromOrMsg}' to '${to}'`);
    } else {
      super(fromOrMsg);
    }
  }
}

exports.CoordinatesTypeConversionError = CoordinatesTypeConversionError;
