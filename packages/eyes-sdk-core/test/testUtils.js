'use strict';

/* eslint-disable no-bitwise */
const fs = require('fs');
const path = require('path');

const getResourcePath = fileName => path.resolve(__dirname, 'fixtures', fileName);

const getResource = fileName => fs.readFileSync(getResourcePath(fileName));

const getResourceAsText = fileName => fs.readFileSync(getResourcePath(fileName), 'utf8');

exports.getResourcePath = getResourcePath;
exports.getResource = getResource;
exports.getResourceAsText = getResourceAsText;
