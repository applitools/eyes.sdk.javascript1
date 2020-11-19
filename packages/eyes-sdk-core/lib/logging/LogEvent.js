'use strict'
/**
 * @typedef {'Info'|'Notice'|'Warn'|'Error'} LogLevel
 */

/**
 * @typedef {{timestamp: string, level: LogLevel, event: {type: string, ...data: object}}} LogEvent
 */

/**
 *
 * @param {LogLevel} level
 * @param {string} type
 * @param {object} data
 * @return {LogEvent}
 */
function LogEvent({level = 'Info', type, ...data}) {
  return {timestamp: new Date().toISOString(), level, event: {type, ...data}}
}

module.exports = LogEvent
