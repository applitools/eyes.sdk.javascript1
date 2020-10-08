'use strict'

const EyesError = require('./EyesError')

/**
 * Encapsulates an error when trying to perform an action using WebDriver.
 */
class EyesDriverOperationError extends EyesError {}

module.exports = EyesDriverOperationError
