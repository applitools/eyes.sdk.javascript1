'use strict';
const fs = require('fs');
const path = require('path');

function loadJsonFixture(filename) {
  const json = require(`../fixtures/${filename}`);

  // must be a copy of the json fixture
  return JSON.parse(JSON.stringify(json));
}

function loadFixtureBuffer(filename) {
  return fs.readFileSync(path.resolve(__dirname, `../fixtures/${filename}`));
}

function loadFixture(filename, {replaceSource, replaceTarget} = {}) {
  return loadFixtureBuffer(filename)
    .toString()
    .trim()
    .replace(replaceSource, replaceTarget);
}

module.exports = {
  loadFixture,
  loadFixtureBuffer,
  loadJsonFixture,
};
