const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.js',
  },
  devtool: 'eval',
  node: {
    process: true,
    fs: 'empty',
    url: true,
    child_process: 'empty',
    module: 'empty',
  },
}
