'use strict'

const fs = require('fs')

/**
 * @param {Buffer} imageBuffer
 * @param {string} filename
 * @return {Promise}
 */
function writeFromBuffer(imageBuffer, filename) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, imageBuffer, err => {
      if (err) {
        return reject(err)
      }
      return resolve()
    })
  })
}

/**
 * @param {string} path
 * @return {Promise<Buffer>}
 */
function readToBuffer(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) {
        return reject(err)
      }
      return resolve(data)
    })
  })
}

module.exports = {
  writeFromBuffer,
  readToBuffer,
}
