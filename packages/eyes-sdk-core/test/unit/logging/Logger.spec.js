'use strict'

const assert = require('assert')
const {Logger, DebugLogHandler, ConsoleLogHandler} = require('../../../index')

describe('Logger', () => {
  describe('constructor', () => {
    it('by default should be used DebugLogHandler', () => {
      const logger = new Logger()
      assert.ok(logger.getLogHandler() instanceof DebugLogHandler)
    })

    it('if `false` passed should be used DebugLogHandler', () => {
      const logger = new Logger(false, 'hello')
      assert.ok(logger.getLogHandler() instanceof DebugLogHandler)
    })

    it('if `false` (as string) passed should be used DebugLogHandler', () => {
      const logger = new Logger('false')
      assert.ok(logger.getLogHandler() instanceof DebugLogHandler)
    })

    it('if `true` passed should be used ConsoleLogHandler', () => {
      const logger = new Logger(true)
      assert.ok(logger.getLogHandler() instanceof ConsoleLogHandler)
    })

    it('if `true` (as string) passed should be used ConsoleLogHandler', () => {
      const logger = new Logger('true')
      assert.ok(logger.getLogHandler() instanceof ConsoleLogHandler)
    })

    it('if `random string` passed should be used DebugLogHandler', () => {
      const logger = new Logger('random string')
      assert.ok(logger.getLogHandler() instanceof DebugLogHandler)
    })
  })
})
