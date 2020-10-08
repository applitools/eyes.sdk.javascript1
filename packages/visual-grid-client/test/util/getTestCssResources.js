'use strict'
const mapValues = require('lodash.mapvalues')
const {loadFixtureBuffer} = require('./loadFixture')
const toRGridResource = require('./toRGridResource')

function getTestCssResources(baseUrl) {
  const jpgName1 = 'smurfs1.jpg'
  const jpgName2 = 'smurfs2.jpg'
  const jpgName3 = 'smurfs3.jpg'
  const cssName = 'test.css'
  const importedName = 'imported.css'
  const importedNestedName = 'imported-nested.css'
  const fontZillaName = 'zilla_slab.woff2'
  const fontShadowName = 'shadows_into_light.woff2'
  const jpgUrl1 = `${baseUrl}/${jpgName1}`
  const jpgUrl2 = `${baseUrl}/${jpgName2}`
  const jpgUrl3 = `${baseUrl}/${jpgName3}`
  const cssUrl = `${baseUrl}/${cssName}`
  const importedUrl = `${baseUrl}/${importedName}`
  const importedNestedUrl = `${baseUrl}/${importedNestedName}`
  const fontZillaUrl = `${baseUrl}/${fontZillaName}`
  const fontShadowUrl = `${baseUrl}/${fontShadowName}`
  const err404Url = `${baseUrl}/predefined-status/404`
  const err403Url = `${baseUrl}/predefined-status/403`
  const errHangupUrl = `${baseUrl}/predefined-status/hangup`
  const jpgContent1 = loadFixtureBuffer(jpgName1)
  const jpgContent2 = loadFixtureBuffer(jpgName2)
  const jpgContent3 = loadFixtureBuffer(jpgName3)
  const cssContent = loadFixtureBuffer(cssName)
  const importedContent = loadFixtureBuffer(importedName)
  const importedNestedContent = loadFixtureBuffer(importedNestedName)
  const fontZillaContent = loadFixtureBuffer(fontZillaName)
  const fontShadowContent = loadFixtureBuffer(fontShadowName)
  const cssType = 'text/css; charset=UTF-8'
  const fontType = 'font/woff2'
  const jpgType = 'image/jpeg'

  return mapValues(
    {
      [cssUrl]: {type: cssType, value: cssContent},
      [importedUrl]: {type: cssType, value: importedContent},
      [fontZillaUrl]: {type: fontType, value: fontZillaContent},
      [importedNestedUrl]: {
        type: cssType,
        value: importedNestedContent,
      },
      [fontShadowUrl]: {type: fontType, value: fontShadowContent},
      [jpgUrl3]: {type: jpgType, value: jpgContent3},
      [jpgUrl1]: {type: jpgType, value: jpgContent1},
      [jpgUrl2]: {type: jpgType, value: jpgContent2},
      [err404Url]: {errorStatusCode: 404},
      [err403Url]: {errorStatusCode: 403},
      [errHangupUrl]: {errorStatusCode: 504},
    },
    (o, url) =>
      toRGridResource({type: o.type, value: o.value, url, errorStatusCode: o.errorStatusCode}),
  )
}

module.exports = getTestCssResources
