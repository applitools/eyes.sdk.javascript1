'use strict'

const {ArgumentGuard} = require('../..')

const Trigger = require('./Trigger')

/**
 * Encapsulates a text input by the user.
 */
class MouseTrigger extends Trigger {
  /**
   * @param {MouseTrigger.MouseAction} mouseAction
   * @param {Region} control
   * @param {Location} location
   */
  constructor(mouseAction, control, location) {
    super()

    ArgumentGuard.notNull(mouseAction, 'mouseAction')
    ArgumentGuard.notNull(control, 'control')
    ArgumentGuard.notNull(location, 'location')

    this._mouseAction = mouseAction
    this._control = control
    this._location = location // Relative to the top left corner of {@link #control}, or null if unknown.
  }

  /**
   * @return {MouseTrigger.MouseAction}
   */
  getMouseAction() {
    return this._mouseAction
  }

  /**
   * @return {Region}
   */
  getControl() {
    return this._control
  }

  /**
   * @return {Location}
   */
  getLocation() {
    return this._location
  }

  /**
   * @return {Trigger.TriggerType}
   */
  getTriggerType() {
    return Trigger.TriggerType.Mouse
  }

  /**
   * @override
   */
  toString() {
    return `${this._mouseAction} [${this._control}] ${this._location}`
  }
}

/**
 * @readonly
 * @enum {string}
 */
MouseTrigger.MouseAction = {
  None: 'None',
  Click: 'Click',
  RightClick: 'RightClick',
  DoubleClick: 'DoubleClick',
  Move: 'Move',
  Down: 'Down',
  Up: 'Up',
}

Object.freeze(MouseTrigger.MouseAction)
module.exports = MouseTrigger
