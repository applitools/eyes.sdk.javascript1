'use strict';

const { DateTimeUtils } = require('../utils/DateTimeUtils');
const { FileUtils } = require('../utils/FileUtils');
const { DebugScreenshotsProvider } = require('./DebugScreenshotsProvider');

/**
 * A debug screenshot provider for saving screenshots to file.
 */
class FileDebugScreenshotsProvider extends DebugScreenshotsProvider {
  /**
   * @param {MutableImage} image
   * @param {string} suffix
   * @return {Promise}
   */
  async save(image, suffix) {
    const timestamp = DateTimeUtils.toLogFileDateTime().replace(' ', '_');
    const filename = `${this._path}${this._prefix}${timestamp}_${suffix}.png`;

    const imageBuffer = await image.getImageBuffer();
    await FileUtils.writeFromBuffer(imageBuffer, filename);
  }
}

exports.FileDebugScreenshotsProvider = FileDebugScreenshotsProvider;
