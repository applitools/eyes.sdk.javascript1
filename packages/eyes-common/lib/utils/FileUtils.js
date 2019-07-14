'use strict';

const fs = require('fs');

/**
 * @ignore
 */
class FileUtils {
  /**
   * @param {Buffer} imageBuffer
   * @param {string} filename
   * @return {Promise}
   */
  static writeFromBuffer(imageBuffer, filename) {
    return new Promise((resolve, reject) => {
      fs.writeFile(filename, imageBuffer, (err) => {
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    });
  }

  /**
   * @param {string} path
   * @return {Promise<Buffer>}
   */
  static readToBuffer(path) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, (err, data) => {
        if (err) {
          return reject(err);
        }
        return resolve(data);
      });
    });
  }
}

exports.FileUtils = FileUtils;
