'use strict';

module.exports = {
  storybookPort: 9000,
  storybookHost: 'localhost',
  storybookConfigDir: '.storybook',
  storybookUrl: undefined,
  storybookStaticDir: undefined,
  showStorybookOutput: false,
  waitBeforeScreenshot: 50,
  waitBeforeScreenshots: 50, // backward compatibility
  viewportSize: {width: 1024, height: 768},
  tapFilePath: undefined,
  xmlFilePath: undefined,
  exitcode: true,
  readStoriesTimeout: 60000,
  reloadPagePerStory: false,
  include: undefined,
};
