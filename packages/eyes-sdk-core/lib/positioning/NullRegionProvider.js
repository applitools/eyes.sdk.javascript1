'use strict'

const {Region} = require('../..')

const RegionProvider = require('./RegionProvider')

class NullRegionProvider extends RegionProvider {
  constructor() {
    super(Region.EMPTY)
  }
}

module.exports = NullRegionProvider
