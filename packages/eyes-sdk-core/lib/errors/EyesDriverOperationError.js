'use strict'

const {EyesError} = require('@applitools/eyes-common')

/**
 * Encapsulates an error when trying to perform an action using WebDriver.
 */
class EyesDriverOperationError extends EyesError {}

exports.EyesDriverOperationError = EyesDriverOperationError
