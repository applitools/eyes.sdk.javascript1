const path = require('path');

module.exports = {
  appName: 'visualGridOptions storybook',
  batchName: 'visualGridOptions storybook',
  storybookConfigDir: path.resolve(__dirname, '../../fixtures/customFont'),
  storybookStaticDir: path.resolve(__dirname, '../../fixtures'),
  browser: [{width: 640, height: 480, name: 'chrome'}],
  waitBeforeScreenshot: 1000,
  visualGridOptions: {chromeHeadless: false},
};
