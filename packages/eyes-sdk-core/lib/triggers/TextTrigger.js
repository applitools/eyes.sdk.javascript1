'use strict'

const {ArgumentGuard} = require('../..')

const Trigger = require('./Trigger')

/**
 * Encapsulates a text input by the user.
 */
class TextTrigger extends Trigger {
  /**
   *
   * @param {Region} control
   * @param {string} text
   */
  constructor(control, text) {
    super()

    ArgumentGuard.notNull(control, 'control')
    ArgumentGuard.notNullOrEmpty(text, 'text')

    this._text = text
    this._control = control
  }

  /**
   * @return {string}
   */
  getText() {
    return this._text
  }

  /**
   * @return {Region}
   */
  getControl() {
    return this._control
  }

  /**
   * @return {Trigger.TriggerType}
   */
  getTriggerType() {
    return Trigger.TriggerType.Text
  }

  /**
   * @override
   */
  toString() {
    return `Text [${this._control}] ${this._text}`
  }
}

module.exports = TextTrigger
