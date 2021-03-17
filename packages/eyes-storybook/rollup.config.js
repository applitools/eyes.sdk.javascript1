const commonjs = require('rollup-plugin-commonjs');
const wrapBundle = require('./src/wrapBundle');

module.exports = [
  'getStories',
  'renderStoryWithClientAPI',
  'runRunBeforeScript',
  'runRunAfterScript',
  'getClientAPI',
].map(config);

function config(fileName) {
  return {
    input: `src/browser/${fileName}.js`,
    output: {
      file: `dist/${fileName}.js`,
      format: 'iife',
      name: fileName,
    },
    plugins: [commonjs({include: '**', ignoreGlobal: true}), wrapBundle(fileName)],
  };
}
