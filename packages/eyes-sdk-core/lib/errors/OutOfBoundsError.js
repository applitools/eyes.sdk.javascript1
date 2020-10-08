'use strict'
const EyesError = require('./EyesError')

/**
 * Applitools Eyes error indicating the a geometrical element is out of bounds (point outside a region, region outside
 * another region etc.)
 */
class OutOfBoundsError extends EyesError {}

module.exports = OutOfBoundsError
