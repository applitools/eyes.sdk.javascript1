'use strict';

const { Location, Region } = require('@applitools/eyes-common');
const { MouseTrigger } = require('@applitools/eyes-sdk-core');

const COMMAND_PREFIX = 'mobile: ';
const TAP_COMMAND = `${COMMAND_PREFIX}tap`;
const APPIUM_COORDINATES_DEFAULT = 0.5;
const APPIUM_TAP_COUNT_DEFAULT = 1;

/**
 * @ignore
 */
class AppiumJsCommandExtractor {
  /**
   * Used for identifying if a javascript script is a command to Appium.
   *
   * @param {string} script - The script to test whether it's an Appium command.
   * @return {boolean} - True if the script is an Appium command, false otherwise.
   */
  static isAppiumJsCommand(script) {
    return script.startsWith(COMMAND_PREFIX);
  }

  /**
   * Given a command and its parameters, returns the equivalent trigger.
   *
   * @param {Map<string, EyesWebElement>} elementsIds - A mapping of known elements' IDs to elements.
   * @param {{width: number, height: number}} viewportSize - The dimensions of the current viewport
   * @param {string} script - The Appium command from which the trigger would be extracted
   * @param {...object} args - The trigger's parameters.
   * @return {Promise<Trigger>} - The trigger which represents the given command.
   */
  static async extractTrigger(elementsIds, viewportSize, script, ...args) {
    if (script === TAP_COMMAND) {
      if (args.length !== 1) {
        // We don't know what the rest of the parameters are, so...
        return null;
      }

      /** @type {Map<string, string>} */
      let tapObject = new Map();

      /** @type {string} */
      let xObj, yObj, tapCountObj;

      try {
        tapObject = args[0]; // eslint-disable-line prefer-destructuring
        xObj = tapObject.get('x');
        yObj = tapObject.get('y');
        tapCountObj = tapObject.get('tapCount');
      } catch (ignore) {
        // We only know how to handle Map as the arguments container.
        return null;
      }

      let x = xObj ? Number(xObj) : APPIUM_COORDINATES_DEFAULT;
      let y = yObj ? Number(yObj) : APPIUM_COORDINATES_DEFAULT;

      let control;

      const elementId = tapObject.get('element');
      if (elementId) {
        // If an element is referenced, then the coordinates are relative to the element.
        const referencedElement = elementsIds.get(elementId);

        // If an element was referenced, but we don't have it's ID,
        // we can't create the trigger.
        if (!referencedElement) {
          return null;
        }

        const elementRect = await referencedElement.getRect();
        control = new Region(Math.ceil(elementRect.x), Math.ceil(elementRect.y), elementRect.width, elementRect.height);

        // If coordinates are percentage of the size of the viewport/element.
        if (x < 1) {
          x *= elementRect.width;
        }
        if (y < 1) {
          y *= elementRect.height;
        }
      } else {
        // If coordinates are percentage of the size of the viewport/element.
        if (x < 1) {
          x *= viewportSize.width;
        }
        if (y < 1) {
          y *= viewportSize.height;
        }

        // creating a fake control, for which the tap is at the right bottom corner
        control = new Region(0, 0, Math.round(x), Math.round(y));
      }

      const location = new Location(Math.round(x), Math.round(y));

      // Deciding whether this is click/double click.
      const tapCount = tapCountObj ? Number(tapCountObj) : APPIUM_TAP_COUNT_DEFAULT;
      const action = (tapCount === 1) ? MouseTrigger.MouseAction.Click : MouseTrigger.MouseAction.DoubleClick;
      return new MouseTrigger(action, control, location);
    }

    // No trigger from the given command.
    return null;
  }
}

exports.AppiumJsCommandExtractor = AppiumJsCommandExtractor;
