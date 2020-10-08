'use strict'

/**
 * Encapsulates image retrieval.
 *
 * @abstract
 */
class Trigger {
  /**
   * @return {Trigger.TriggerType}
   */
  getTriggerType() {
    throw new TypeError('The method is not implemented!')
  }
}

/**
 * @readonly
 * @enum {string}
 */
Trigger.TriggerType = {
  Unknown: 'Unknown',
  Mouse: 'Mouse',
  Text: 'Text',
  Keyboard: 'Keyboard',
}

Object.freeze(Trigger.TriggerType)
module.exports = Trigger
