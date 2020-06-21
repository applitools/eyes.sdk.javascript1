const path = require('path')
const {config} = require('../wdio.base.conf')

exports.config = {
  ...config,
  specs: [path.join(__dirname, '*.spec.js')],
  eyes: {
    useVisualGrid: true,
    browsersInfo: [
      {width: 1000, height: 1000, name: 'firefox'},
      {width: 320, height: 480, name: 'chrome'},
    ],
    concurrency: 10,
  },
}
