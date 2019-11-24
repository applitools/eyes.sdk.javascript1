'use strict';

/* eslint-disable no-bitwise */
const fs = require('fs');
const path = require('path');

const colors = {
  v: 0x9400D3FF, // Violet
  i: 0x4B00827F, // Indigo
  b: 0x0000FFFF, // Blue
  g: 0x00FF007F, // Green
  y: 0xFFFF00FF, // Yellow
  o: 0xFF7F007F, // Orange
  r: 0xFF0000FF, // Red
};

const invColors = {};
Object.keys(colors).forEach((key) => { invColors[colors[key]] = key; });

const getResourcePath = fileName => path.resolve(__dirname, 'fixtures', fileName);

const getResource = fileName => fs.readFileSync(getResourcePath(fileName));

const makeImageMock = (...args) => {
  const width = args[0].length;
  const height = args.length;

  const imageMock = { width, height, data: Buffer.alloc(width * height * 4) };

  for (let y = 0; y < height; y += 1) {
    const line = args[y];
    if (line.length !== width) {
      throw new Error(`Unexpected length of line ${line.length}, expected ${width} chars.`);
    }

    for (let x = 0; x < width; x += 1) {
      if (typeof colors[line[x]] === 'undefined') {
        throw new Error(`Unknown character: ${line[x]}. The char is not defined in colors.`);
      } else {
        imageMock.data.writeUInt32BE(colors[line[x]], ((y * width) + x) * 4);
      }
    }
  }

  return imageMock;
};

// Helps to debug image data
const imageMock2String = (imageMock) => {
  const { width, height } = imageMock;

  const lines = [];
  for (let row = 0; row < height; row += 1) {
    lines[row] = '';
    for (let col = 0; col < width; col += 1) {
      const i = ((width * row) + col) << 2;
      const r = imageMock.data[i];
      const g = imageMock.data[i + 1];
      const b = imageMock.data[i + 2];
      const a = imageMock.data[i + 3];

      // noinspection NonShortCircuitBooleanExpressionJS
      const color = (
        (((r & 0xFF) << 24) >>> 0) |
        ((g & 0xFF) << 16) |
        ((b & 0xFF) << 8) |
        (a & 0xFF)
      ) >>> 0;

      lines[row] += invColors[color] || '?';
    }
  }

  return lines.map(line => `'${line}'`).join('\n');
};

exports.makeImageMock = makeImageMock;
exports.imageMock2String = imageMock2String;
exports.getResourcePath = getResourcePath;
exports.getResource = getResource;
