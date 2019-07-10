'use strict';
const mapValues = require('lodash.mapvalues');
const {loadFixtureBuffer} = require('./loadFixture');
const toRGridResource = require('./toRGridResource');

function getTestSvgResources(baseUrl) {
  const jpgName1 = 'gargamel.jpg';
  const jpgName2 = 'gargamel1.jpg';
  const jpgUrl1 = `${baseUrl}/${jpgName1}`;
  const jpgUrl2 = `${baseUrl}/${jpgName2}`;
  const jpgContent1 = loadFixtureBuffer(jpgName1);
  const jpgContent2 = loadFixtureBuffer(jpgName2);
  const svgType = 'image/jpeg';

  return mapValues(
    {
      [jpgUrl1]: {type: svgType, value: jpgContent1},
      [jpgUrl2]: {type: svgType, value: jpgContent2},
    },
    (o, url) => toRGridResource({type: o.type, value: o.value, url}),
  );
}

module.exports = getTestSvgResources;
