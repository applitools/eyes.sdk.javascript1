'use strict';

const { ArgumentGuard, Location } = require('@applitools/eyes-common');

const { EyesWebElement } = require('./wrappers/EyesWebElement');

/**
 * @private
 * @param {Logger} logger
 * @param {EyesWebElement} element
 * @param {string} propName
 * @return {Promise<number>}
 */
async function getPropertyValue(logger, element, propName) {
  logger.verbose(`Get element's ${propName}...`);

  let styleResult;
  try {
    if (element instanceof EyesWebElement) {
      logger.verbose("Element is an EyesWebElement, using 'getComputedStyle'.");
      try {
        styleResult = await element.getComputedStyle(propName);
        logger.verbose('Done!');
      } catch (err) {
        logger.verbose(`Using getComputedStyle failed: ${err}`);
        logger.verbose('Using getCssValue...');
        styleResult = await element.getCssValue(propName);
      }
    } else {
      // OK, this is weird, we got an element which is not EyesWebElement?? Log it and try to move on.
      logger.log(`Element is not an EyesWebElement! (when trying to get ${propName}) Element's class: ${element.constructor.name}`);
      logger.verbose('Using getCssValue...');
      styleResult = await element.getCssValue(propName);
      logger.verbose('Done!');
    }
  } catch (err) {
    logger.verbose(`Couldn't get the element's ${propName}: ${err}. Falling back to default`);
    styleResult = 0;
  }

  // Convert value from the format "2px" to int.
  const borderWidth = Math.round(Number(styleResult.trim().replace('px', '')));
  logger.verbose(`${propName}: ${borderWidth}`);
  return borderWidth;
}

/**
 * Encapsulates an algorithm to find an element's content location, based on the element's location.
 *
 * @ignore
 */
class BordersAwareElementContentLocationProvider {
  /**
   * Returns a location based on the given location.
   *
   * @param {Logger} logger - The logger to use.
   * @param {EyesWebElement} element - The element for which we want to find the content's location.
   * @param {Location} location - The location of the element.
   * @return {Promise<Location>} - The location of the content of the element.
   */
  static async getLocation(logger, element, location) {
    ArgumentGuard.notNull(logger, 'logger');
    ArgumentGuard.notNull(element, 'element');
    ArgumentGuard.notNull(location, 'location');

    logger.verbose(`BordersAdditionFrameLocationProvider(logger, element, ${location})`);

    // Frame borders also have effect on the frame's location.
    const leftBorderWidth = await getPropertyValue(logger, element, 'border-left-width');
    const topBorderWidth = await getPropertyValue(logger, element, 'border-top-width');
    const contentLocation = new Location(location).offset(leftBorderWidth, topBorderWidth);
    logger.verbose('Done!');
    return contentLocation;
  }
}

exports.BordersAwareElementContentLocationProvider = BordersAwareElementContentLocationProvider;
