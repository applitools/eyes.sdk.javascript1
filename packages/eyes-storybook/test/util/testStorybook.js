const {resolve} = require('path');
const StorybookConnector = require('../../src/storybookConnector');

async function testStorybook({
  port,
  storybookConfigDir = resolve(__dirname, '../fixtures/appWithStorybook'),
}) {
  const isWindows = process.platform.startsWith('win');
  const storybookPath = resolve(
    __dirname,
    `../../node_modules/.bin/start-storybook${isWindows ? '.cmd' : ''}`,
  );
  const storybookConnector = new StorybookConnector({
    storybookPath,
    storybookPort: port,
    storybookHost: 'localhost',
    storybookConfigDir,
    storybookStaticDir: 'test/fixtures',
    isWindows,
    logger: console,
  });

  await storybookConnector.start(30000);
  return storybookConnector.kill.bind(storybookConnector);
}

module.exports = testStorybook;
