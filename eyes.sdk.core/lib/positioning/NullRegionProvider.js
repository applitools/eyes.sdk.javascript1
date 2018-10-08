'use strict';

const { RegionProvider } = require('./RegionProvider');
const { Region } = require('../geometry/Region');

class NullRegionProvider extends RegionProvider {
  constructor() {
    super(Region.EMPTY);
  }
}

exports.NullRegionProvider = NullRegionProvider;
