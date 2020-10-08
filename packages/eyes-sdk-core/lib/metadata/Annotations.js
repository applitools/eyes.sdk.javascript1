'use strict'

const {GeneralUtils, Region, FloatingMatchSettings} = require('../..')

class Annotations {
  /**
   * @param regions
   * @param {FloatingMatchSettings[]|object[]} regions.floating
   * @param {Region[]|object[]} regions.ignore
   * @param {Region[]|object[]} regions.strict
   * @param {Region[]|object[]} regions.content
   * @param {Region[]|object[]} regions.layout
   */
  constructor({floating, ignore, strict, content, layout} = {}) {
    if (ignore && ignore.length > 0 && !(ignore[0] instanceof Region)) {
      ignore = ignore.map(region => new Region(region))
    }

    if (strict && strict.length > 0 && !(strict[0] instanceof Region)) {
      strict = strict.map(region => new Region(region))
    }

    if (content && content.length > 0 && !(content[0] instanceof Region)) {
      content = content.map(region => new Region(region))
    }

    if (layout && layout.length > 0 && !(layout[0] instanceof Region)) {
      layout = layout.map(region => new Region(region))
    }

    if (floating && floating.length > 0 && !(floating[0] instanceof FloatingMatchSettings)) {
      floating = floating.map(region => new FloatingMatchSettings(region))
    }

    this._floating = floating
    this._ignore = ignore
    this._strict = strict
    this._content = content
    this._layout = layout
  }

  /**
   * @return {FloatingMatchSettings[]}
   */
  getFloating() {
    return this._floating
  }

  /**
   * @param {FloatingMatchSettings[]} value
   */
  setFloating(value) {
    this._floating = value
  }

  /**
   * @return {Region[]}
   */
  getIgnore() {
    return this._ignore
  }

  /**
   * @param {Region[]} value
   */
  setIgnore(value) {
    this._ignore = value
  }

  /**
   * @return {Region[]}
   */
  getStrict() {
    return this._strict
  }

  /**
   * @param {Region[]} value
   */
  setStrict(value) {
    this._strict = value
  }

  /**
   * @return {Region[]}
   */
  getContent() {
    return this._content
  }

  /**
   * @param {Region[]} value
   */
  setContent(value) {
    this._content = value
  }

  /**
   * @return {Region[]}
   */
  getLayout() {
    return this._layout
  }

  /**
   * @param {Region[]} value
   */
  setLayout(value) {
    this._layout = value
  }

  /**
   * @override
   */
  toJSON() {
    return GeneralUtils.toPlain(this)
  }

  /**
   * @override
   */
  toString() {
    return `Annotations { ${JSON.stringify(this)} }`
  }
}

module.exports = Annotations
