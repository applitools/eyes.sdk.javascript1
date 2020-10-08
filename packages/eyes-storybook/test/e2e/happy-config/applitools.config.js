const path = require('path');

module.exports = {
  appName: 'Simple storybook',
  batchName: 'Simple storybook',
  storybookConfigDir: path.resolve(__dirname, '../../fixtures/appWithStorybook'),
  storybookStaticDir: path.resolve(__dirname, '../../fixtures'),
  viewportSize: {width: 900, height: 800},
  include: ({name}) => !/^\[SKIP\]/.test(name),
  variations: ({name}) => {
    if (/should also do RTL/.test(name)) {
      return ['rtl'];
    }
  },
  ignoreRegions: [{selector: '.global-ignore-this'}],
  // puppeteerOptions: {headless: false, devtools: true},
};
