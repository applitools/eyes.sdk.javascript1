const EyesError = require('./EyesError')

/**
 * Indicates that element wasn't found
 */
class ElementNotFoundError extends EyesError {
  /**
   * Creates a new ElementNotFoundError instance.
   * @param {string} selector - element selector.
   */
  constructor(selector) {
    const message = `Unable to find element using provided selector - "${selector}"`
    super(message)
  }
}

module.exports = ElementNotFoundError
