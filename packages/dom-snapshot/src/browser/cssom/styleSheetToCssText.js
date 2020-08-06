'use strict';
const csstree = require('css-tree');
const createAstFromCssom = require('./createAstFromCssom');

function styleSheetToCssText(sheet) {
  const cssomAst = createAstFromCssom(sheet.cssRules);
  return csstree.generate(csstree.fromPlainObject({type: 'StyleSheet', children: cssomAst}));
}

module.exports = styleSheetToCssText;
