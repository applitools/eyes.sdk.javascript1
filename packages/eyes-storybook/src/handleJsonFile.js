'use strict';

const fs = require('fs');
const {resolve} = require('path');

function handleJsonFile(jsonFilePath, formatter) {
  const path = resolve(jsonFilePath, 'eyes.json');
  fs.writeFileSync(path, formatter.toJsonOutput());
  return path;
}

module.exports = handleJsonFile;
