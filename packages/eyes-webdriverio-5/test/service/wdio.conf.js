const path = require('path')
const {config} = require('./wdio.base.conf')

exports.config = {
  ...config,
  specs: [path.join(__dirname, '*.spec.js')],
  eyes: {
    properties: [{name: 'propName', value: 'propValue'}],
  },
}
