'use strict';

const { LogHandler } = require('./LogHandler');

/**
 * Ignores all log messages.
 */
class NullLogHandler extends LogHandler {}

exports.NullLogHandler = NullLogHandler;
