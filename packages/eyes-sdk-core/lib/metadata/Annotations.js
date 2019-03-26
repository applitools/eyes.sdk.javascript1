'use strict';

const { GeneralUtils, Region } = require('@applitools/eyes-common');

const { FloatingMatchSettings } = require('../match/FloatingMatchSettings');

class Annotations {
  // noinspection FunctionWithMoreThanThreeNegationsJS
  /**
   * @param {FloatingMatchSettings[]|object[]} floating
   * @param {Region[]|object[]} ignore
   * @param {Region[]|object[]} strict
   * @param {Region[]|object[]} content
   * @param {Region[]|object[]} layout
   */
  constructor({ floating, ignore, strict, content, layout } = {}) {
    if (ignore && ignore.length > 0 && !(ignore[0] instanceof Region)) {
      ignore = ignore.map(region => new Region(region));
    }

    if (strict && strict.length > 0 && !(strict[0] instanceof Region)) {
      strict = strict.map(region => new Region(region));
    }

    if (content && content.length > 0 && !(content[0] instanceof Region)) {
      content = content.map(region => new Region(region));
    }

    if (layout && layout.length > 0 && !(layout[0] instanceof Region)) {
      layout = layout.map(region => new Region(region));
    }

    if (floating && floating.length > 0 && !(floating[0] instanceof FloatingMatchSettings)) {
      floating = floating.map(region => new FloatingMatchSettings(region));
    }

    this._floating = floating;
    this._ignore = ignore;
    this._strict = strict;
    this._content = content;
    this._layout = layout;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {FloatingMatchSettings[]}
   */
  getFloating() {
    return this._floating;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {FloatingMatchSettings[]} value
   */
  setFloating(value) {
    this._floating = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {Region[]}
   */
  getIgnore() {
    return this._ignore;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {Region[]} value
   */
  setIgnore(value) {
    this._ignore = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {Region[]}
   */
  getStrict() {
    return this._strict;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {Region[]} value
   */
  setStrict(value) {
    this._strict = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {Region[]}
   */
  getContent() {
    return this._content;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {Region[]} value
   */
  setContent(value) {
    this._content = value;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {Region[]}
   */
  getLayout() {
    return this._layout;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {Region[]} value
   */
  setLayout(value) {
    this._layout = value;
  }

  /**
   * @override
   */
  toJSON() {
    return GeneralUtils.toPlain(this);
  }

  /**
   * @override
   */
  toString() {
    return `Annotations { ${JSON.stringify(this)} }`;
  }
}

exports.Annotations = Annotations;
