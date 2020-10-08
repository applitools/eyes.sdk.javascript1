'use strict'

const LogHandler = require('./LogHandler')

/**
 * Ignores all log messages.
 */
class NullLogHandler extends LogHandler {}

module.exports = NullLogHandler
