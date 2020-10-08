'use strict'

const {Logger} = require('@applitools/eyes-sdk-core')

module.exports = new Logger(process.env.APPLITOOLS_SHOW_LOGS)
