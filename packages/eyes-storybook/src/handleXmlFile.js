'use strict';

const fs = require('fs');
const {resolve} = require('path');

function handleXmlFile(xmlFilePath, formatter, {suiteName = 'Eyes Storybook', totalTime} = {}) {
  const path = resolve(xmlFilePath, 'eyes.xml');
  fs.writeFileSync(path, formatter.toXmlOutput({suiteName, totalTime}));
  return path;
}

module.exports = handleXmlFile;
