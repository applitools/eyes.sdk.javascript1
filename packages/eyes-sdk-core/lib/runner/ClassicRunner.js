'use strict'

const {GeneralUtils} = require('../..')
const {EyesRunner} = require('./EyesRunner')

class ClassicRunner extends EyesRunner {
  constructor() {
    super()
    this._getRenderingInfo = undefined
  }

  attachEyes(eyes, serverConnector) {
    super.attachEyes(eyes, serverConnector)
    if (!this._getRenderingInfo) {
      const getRenderingInfo = serverConnector.renderInfo.bind(serverConnector)
      this._getRenderingInfo = GeneralUtils.cachify(getRenderingInfo)
    }
  }

  async getRenderingInfoWithCache() {
    if (this._getRenderingInfo) {
      return this._getRenderingInfo()
    } else {
      throw new Error(
        'Eyes runner could not get rendering info since attachEyes was not called before',
      )
    }
  }
}

exports.ClassicRunner = ClassicRunner
