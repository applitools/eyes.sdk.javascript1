'use strict';

/**
 * Encapsulates image retrieval.
 *
 * @abstract
 */
class Trigger {
  constructor() {
    if (new.target === Trigger) {
      throw new TypeError('Can not construct `Trigger` instance directly, should be used implementation!');
    }
  }

  // noinspection JSMethodCanBeStatic, JSUnusedGlobalSymbols
  /**
   * @return {Trigger.TriggerType}
   */
  getTriggerType() {
    throw new TypeError('The method `getTriggerType` from `Trigger` should be implemented!');
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
};

Object.freeze(Trigger.TriggerType);
exports.Trigger = Trigger;
