'use strict'

const {Region} = require('@applitools/eyes-common')

const RegionProvider = require('./RegionProvider')

class NullRegionProvider extends RegionProvider {
  constructor() {
    super(Region.EMPTY)
  }
}

module.exports = NullRegionProvider
