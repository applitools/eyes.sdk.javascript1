'use strict';

const { Region, CoordinatesType } = require('@applitools/eyes-common');

class SelectorRegionProvider {
  constructor({ selector, t }) {
    this._selector = selector;
    this._t = t;
  }

  async getRegion() {
    const rect = await this._selector.with({ boundTestRun: this._t }).boundingClientRect;
    const region = new Region(Math.ceil(rect.left), Math.ceil(rect.top), rect.width, rect.height, CoordinatesType.CONTEXT_RELATIVE);
    return region;
  }
}

exports.SelectorRegionProvider = SelectorRegionProvider;
