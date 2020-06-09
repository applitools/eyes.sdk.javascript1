'use strict'

/* eslint-disable no-bitwise */
const fs = require('fs')
const path = require('path')
const {EyesBase} = require('../index')

const getResourcePath = fileName => path.resolve(__dirname, 'fixtures', fileName)

const getResource = fileName => fs.readFileSync(getResourcePath(fileName))

const getResourceAsText = fileName => fs.readFileSync(getResourcePath(fileName), 'utf8').trim()

class EyesBaseImpl extends EyesBase {
  getBaseAgentId() {
    return 'implBaseAgent'
  }
  getAndSetBatchInfo() {}
  getAndSaveRenderingInfo() {}
  getInferredEnvironment() {}
}

const colors = {
  v: 0x9400d3ff, // Violet
  i: 0x4b00827f, // Indigo
  b: 0x0000ffff, // Blue
  g: 0x00ff007f, // Green
  y: 0xffff00ff, // Yellow
  o: 0xff7f007f, // Orange
  r: 0xff0000ff, // Red
}

const invColors = {}
Object.keys(colors).forEach(key => {
  invColors[colors[key]] = key
})

const makeImageMock = (...args) => {
  const width = args[0].length
  const height = args.length

  const imageMock = {width, height, data: Buffer.alloc(width * height * 4)}

  for (let y = 0; y < height; y += 1) {
    const line = args[y]
    if (line.length !== width) {
      throw new Error(`Unexpected length of line ${line.length}, expected ${width} chars.`)
    }

    for (let x = 0; x < width; x += 1) {
      if (typeof colors[line[x]] === 'undefined') {
        throw new Error(`Unknown character: ${line[x]}. The char is not defined in colors.`)
      } else {
        imageMock.data.writeUInt32BE(colors[line[x]], (y * width + x) * 4)
      }
    }
  }

  return imageMock
}

// Helps to debug image data
const imageMock2String = imageMock => {
  const {width, height} = imageMock

  const lines = []
  for (let row = 0; row < height; row += 1) {
    lines[row] = ''
    for (let col = 0; col < width; col += 1) {
      const i = (width * row + col) << 2
      const r = imageMock.data[i]
      const g = imageMock.data[i + 1]
      const b = imageMock.data[i + 2]
      const a = imageMock.data[i + 3]

      const color =
        ((((r & 0xff) << 24) >>> 0) | ((g & 0xff) << 16) | ((b & 0xff) << 8) | (a & 0xff)) >>> 0

      lines[row] += invColors[color] || '?'
    }
  }

  return lines.map(line => `'${line}'`).join('\n')
}

function resetEnvVars() {
  Object.keys(process.env).forEach(envVar => {
    if (envVar.includes('APPLITOOLS_')) {
      delete process.env[envVar]
    }
  })
}

exports.getResourcePath = getResourcePath
exports.getResource = getResource
exports.getResourceAsText = getResourceAsText
exports.EyesBaseImpl = EyesBaseImpl
exports.makeImageMock = makeImageMock
exports.imageMock2String = imageMock2String
exports.getResourcePath = getResourcePath
exports.getResource = getResource
exports.resetEnvVars = resetEnvVars
