const {Builder} = require('selenium-webdriver');
const ie = require('selenium-webdriver/ie');

async function openPageWith({
  browserName,
  version,
  url = 'http://applitools-dom-capture-origin-1.surge.sh/ie.html',
}) {
  const username = process.env.SAUCE_USERNAME;
  const accessKey = process.env.SAUCE_ACCESS_KEY;
  if (!username || !accessKey) {
    throw new Error('Missing SAUCE_USERNAME and/or SAUCE_ACCESS_KEY!');
  }

  const sauceUrl = 'https://ondemand.saucelabs.com:443/wd/hub';
  const sauceCaps = {
    browserName,
    version,
    username: process.env.SAUCE_USERNAME,
    accessKey: process.env.SAUCE_ACCESS_KEY,
  };

  const driver = await new Builder()
    .withCapabilities(sauceCaps)
    .setIeOptions(new ie.Options().addArguments('-k', '-private'))
    .usingServer(sauceUrl)
    .build();
  await driver.manage().setTimeouts({script: 10000});
  await driver
    .manage()
    .window()
    .setRect({width: 1024, height: 768});

  await driver.get(url);
  return driver;
}

module.exports = openPageWith;
