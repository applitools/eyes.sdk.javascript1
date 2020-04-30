'use strict'

const {startFakeEyesServer} = require('./lib/start-fake-eyes-server')
const {getDom, getSession} = require('./lib/fake-server-utils')

module.exports = {
  startFakeEyesServer,
  getDom,
  getSession,
}
