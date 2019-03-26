'use strict';

const { BrowserNames } = require('@applitools/eyes-common');
const { NullRegionPositionCompensation } = require('@applitools/eyes-sdk-core');

const { FirefoxRegionPositionCompensation } = require('./FirefoxRegionPositionCompensation');
const { SafariRegionPositionCompensation } = require('./SafariRegionPositionCompensation');

/**
 * @ignore
 */
class RegionPositionCompensationFactory {
  /**
   * @param {UserAgent} userAgent
   * @param {Eyes} eyes
   * @param {Logger} logger
   * @return {RegionPositionCompensation}
   */
  static getRegionPositionCompensation(userAgent, eyes, logger) {
    if (userAgent) {
      if (userAgent.getBrowser() === BrowserNames.Firefox) {
        try {
          if (parseInt(userAgent.getBrowserMajorVersion(), 10) >= 48) {
            return new FirefoxRegionPositionCompensation(eyes, logger);
          }
        } catch (ignore) {
          return new NullRegionPositionCompensation();
        }
      } else if (userAgent.getBrowser() === BrowserNames.Safari) {
        return new SafariRegionPositionCompensation();
      }
    }
    return new NullRegionPositionCompensation();
  }
}

exports.RegionPositionCompensationFactory = RegionPositionCompensationFactory;
