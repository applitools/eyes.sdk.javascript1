'use strict';
const pick = require('lodash.pick');
const {ConfigUtils, GeneralUtils} = require('@applitools/eyes-sdk-core');
const {resolve} = require('path');
const {deprecationWarning} = GeneralUtils;
const uniq = require('./uniq');

function generateConfig({argv = {}, defaultConfig = {}, externalConfigParams = []}) {
  const configPath = argv.conf ? resolve(process.cwd(), argv.conf) : undefined;
  const defaultConfigParams = Object.keys(defaultConfig);
  const configParams = uniq(defaultConfigParams.concat(externalConfigParams));
  const config = ConfigUtils.getConfig({configPath, configParams});
  const argvConfig = pick(argv, configParams);
  const result = Object.assign({}, defaultConfig, config, argvConfig);

  // backward compatibility
  if (
    result.waitBeforeScreenshots !== defaultConfig.waitBeforeScreenshots &&
    result.waitBeforeScreenshot === defaultConfig.waitBeforeScreenshot
  ) {
    console.log(deprecationWarning({deprecatedThing: "'waitBeforeScreenshots'", newThing: "'waitBeforeScreenshot' (no 's')"}));
    result.waitBeforeScreenshot = result.waitBeforeScreenshots;
  }

  if (
    typeof result.waitBeforeScreenshot === 'string' &&
    !isNaN(parseInt(result.waitBeforeScreenshot))
  ) {
    result.waitBeforeScreenshot = Number(result.waitBeforeScreenshot);
  }

  if (result.showLogs === '1') {
    result.showLogs = true;
  }

  if (
    result.storyDataGap === undefined &&
    result.concurrency !== undefined &&
    result.renderConcurrencyFactor !== undefined
  ) {
    result.storyDataGap = result.concurrency * result.renderConcurrencyFactor;
  }
  return result;
}

module.exports = generateConfig;
