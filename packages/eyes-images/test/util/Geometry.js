'use strict'

function makeRectangle(left, top, width, height) {
  return {
    left: left,
    top: top,
    width: width,
    height: height,
  }
}

function makeFloatingRectangle(
  left,
  top,
  width,
  height,
  maxUpOffset,
  maxDownOffset,
  maxLeftOffset,
  maxRightOffset,
) {
  return {
    ...makeRectangle(left, top, width, height),
    maxUpOffset: maxUpOffset,
    maxDownOffset: maxDownOffset,
    maxLeftOffset: maxLeftOffset,
    maxRightOffset: maxRightOffset,
  }
}

module.exports.makeRectangle = makeRectangle
module.exports.makeFloatingRectangle = makeFloatingRectangle
