'use strict'

const path = require('path')
const fs = require('fs')
const os = require('os')

const LogHandler = require('./LogHandler')

/**
 * @private
 * @param {string} filename
 */
function ensureDirectoryExistence(filename) {
  const dirname = path.dirname(filename)
  if (!fs.existsSync(dirname)) {
    ensureDirectoryExistence(dirname)
    fs.mkdirSync(dirname)
  }
}

/**
 * Write log messages to the browser/node console
 */
class FileLogHandler extends LogHandler {
  /**
   * @param {boolean} isVerbose - Whether to handle or ignore verbose log messages.
   * @param {string} [filename] - The file in which to save the logs.
   * @param {boolean} [append=true] - Whether to append the logs to existing file, or to overwrite the existing file.
   */
  constructor(isVerbose, filename = 'eyes.log', append = true) {
    super(isVerbose)

    this._filename = filename
    this._append = append
  }

  /**
   * Create a file logger
   *
   * @override
   */
  open() {
    this.close()

    const file = path.normalize(this._filename)
    const opts = {
      flags: this._append ? 'a' : 'w',
      encoding: 'utf8',
    }

    ensureDirectoryExistence(file)
    this._writer = fs.createWriteStream(file, opts)
  }

  /**
   * Close the file logger
   *
   * @override
   */
  close() {
    if (this._writer) {
      this._writer.end()
      this._writer = undefined
    }
  }

  /**
   * Handle a message to be logged.
   *
   * @override
   * @param {boolean} verbose - Whether this message is flagged as verbose or not.
   * @param {string} logString - The string to log.
   */
  onMessage(verbose, logString) {
    if (this._writer && (!verbose || this.getIsVerbose())) {
      this._writer.write(logString + os.EOL)
    }
  }
}

module.exports = FileLogHandler
