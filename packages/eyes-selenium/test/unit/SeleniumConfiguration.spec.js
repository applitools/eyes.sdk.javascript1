'use strict';

const { expect } = require('chai');
const { SeleniumConfiguration } = require('../../index');

describe('SeleniumConfiguration', () => {
  it('should parse empty config', () => {
    const config = {};
    const cfg = new SeleniumConfiguration(config);
    expect(cfg).to.be.instanceOf(SeleniumConfiguration);
  });

  it('should parse a single browser', () => {
    const config = {
      browsersInfo: [
        {
          width: 1920,
          height: 1080,
          name: 'chrome',
        },
      ],
    };
    const cfg = new SeleniumConfiguration(config);
    expect(cfg._browsersInfo.length).to.equal(1);
    expect(cfg._browsersInfo[0].name).to.equal(config.browsersInfo[0].name);
    expect(cfg._browsersInfo[0].width).to.equal(config.browsersInfo[0].width);
    expect(cfg._browsersInfo[0].height).to.equal(config.browsersInfo[0].height);
  });

  it('should parse config from array', () => {
    const config = {
      browsersInfo: [
        {
          width: 1920,
          height: 1080,
          name: 'chrome',
        },
        {
          width: 800,
          height: 600,
          name: 'firefox',
        },
        {
          deviceName: 'iPhone 4',
          screenOrientation: 'portrait',
        },
      ],
    };
    const cfg = new SeleniumConfiguration(config);
    expect(cfg._browsersInfo.length).to.equal(config.browsersInfo.length);
    expect(cfg._browsersInfo[0].name).to.equal(config.browsersInfo[0].name);
    expect(cfg._browsersInfo[1].name).to.equal(config.browsersInfo[1].name);
    expect(cfg._browsersInfo[2].deviceName).to.equal(config.browsersInfo[2].deviceName);
  });
});
