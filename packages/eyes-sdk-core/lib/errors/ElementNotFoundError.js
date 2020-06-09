const {EyesError} = require('./EyesError')

/**
 * Indicates that element wasn't found
 */
class ElementNotFoundError extends EyesError {
  /**
   * Creates a new ElementNotFoundError instance.
   * @param {SupportedSelector} selector - element selector.
   */
  constructor(selector) {
    const message = `Unable to find element using provided selector - "${selector}"`
    super(message)
  }
}

exports.ElementNotFoundError = ElementNotFoundError
