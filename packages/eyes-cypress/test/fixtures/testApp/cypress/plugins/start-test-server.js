/* eslint-disable */
const {testServerInProcess} = require('@applitools/sdk-shared');
const {join} = require('path')

module.exports = async (_on, _config) => {
  const staticPath  = join(__dirname, '../../../../../fixtures')
  const server = await testServerInProcess({staticPath});
  return {testPort: server.port};
};
