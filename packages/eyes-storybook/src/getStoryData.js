'use strict';
const {presult} = require('@applitools/functional-commons');
const {deserializeDomSnapshotResult} = require('@applitools/eyes-sdk-core');
const {ArgumentGuard} = require('@applitools/eyes-sdk-core');
const renderStoryWithClientAPI = require('../dist/renderStoryWithClientAPI');
const runRunBeforeScript = require('../dist/runRunBeforeScript');
const getStoryTitle = require('./getStoryTitle');
const {URL} = require('url');

function makeGetStoryData({
  logger,
  processPageAndSerialize,
  waitBeforeScreenshot,
  reloadPagePerStory,
}) {
  return async function getStoryData({story, storyUrl, page, waitBeforeStory}) {
    const title = getStoryTitle(story);
    logger.log(`getting data from story`, title);

    if (story.isApi && !reloadPagePerStory) {
      const actualVariationParam = await getEyesVariationParam(page);
      const expectedVariationUrlParam =
        story.parameters && story.parameters.eyes
          ? story.parameters.eyes.variationUrlParam
          : undefined;
      if (
        (!actualVariationParam && !expectedVariationUrlParam) ||
        actualVariationParam === expectedVariationUrlParam
      ) {
        const err = await page.evaluate(renderStoryWithClientAPI, story.index);
        err && handleRenderStoryError(err);
      } else {
        await renderStoryLegacy();
      }
    } else {
      await renderStoryLegacy();
    }

    const wait = waitBeforeStory || waitBeforeScreenshot;
    if (typeof wait === 'number') {
      ArgumentGuard.greaterThanOrEqualToZero(wait, 'waitBeforeScreenshot', true);
    }
    if (wait) {
      logger.log(`waiting before screenshot of ${title} ${wait}`);
      await page.waitFor(wait);
    }

    if (story.parameters && story.parameters.eyes && story.parameters.eyes.runBefore) {
      await page.evaluate(runRunBeforeScript, story.index).catch(err => {
        logger.log(`error during runBefore: ${err}`); // it might be good to aggregate these errors and output them at the end of the run
      });
    }

    logger.log(`running processPageAndSerialize for story ${title}`);
    const {resourceUrls, resourceContents, frames, cdt} = await page
      .evaluate(processPageAndSerialize)
      .then(deserializeDomSnapshotResult);

    logger.log(`done getting data from story`, title);
    logger.log('dom result: cdt', JSON.stringify(cdt));
    return {resourceUrls, resourceContents, cdt, frames};

    async function renderStoryLegacy() {
      logger.log(`getting data from story ${storyUrl}`);
      const [err] = await presult(page.goto(storyUrl, {timeout: 10000}));
      if (err) {
        logger.log(`error navigating to story ${storyUrl}`, err);
        throw err;
      }
    }

    async function getEyesVariationParam() {
      try {
        return new URL(await page.url()).searchParams.get('eyes-variation');
      } catch (ex) {
        logger.log('failed to get url from page (in need of eyes-variation param)');
      }
    }

    // TODO (amit): handle this error in the caller (probably renderStories)
    function handleRenderStoryError(error) {
      logger.log(error.message);
      const versionMsg = error.version
        ? ` The detected version of storybook is ${error.version}.`
        : '';
      throw new Error(
        `Eyes could not render stories properly.${versionMsg} Contact support@applitools.com for troubleshooting.`,
      );
    }
  };
}

module.exports = makeGetStoryData;
