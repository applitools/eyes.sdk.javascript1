'use strict';
const getStoryTitle = require('./getStoryTitle');
const deprecationWarning = require('./deprecationWarning');

function makeRenderStory({config, logger, testWindow, performance, timeItAsync}) {
  return function renderStory({story, snapshot, url}) {
    const {name, kind, parameters} = story;
    const title = getStoryTitle({name, kind, parameters});
    const eyesOptions = (parameters && parameters.eyes) || {};
    const {
      ignoreDisplacements,
      ignoreRegions,
      accessibilityRegions,
      floatingRegions,
      strictRegions,
      contentRegions,
      layoutRegions,
      scriptHooks,
      sizeMode,
      target,
      fully,
      selector,
      region,
      tag,
      properties,
      ignore,
      accessibilityValidation,
    } = eyesOptions;

    if (sizeMode) {
      console.log(deprecationWarning("'sizeMode'", "'target'"));
    }

    let ignoreRegionsBackCompat = ignoreRegions;
    if (ignore && ignoreRegions === undefined) {
      console.log(deprecationWarning("'ignore'", "'ignoreRegions'"));
      ignoreRegionsBackCompat = ignore;
    }

    logger.log('running story', title);

    const openParams = {
      testName: title,
      properties: [
        {name: 'Component name', value: kind},
        {name: 'State', value: name},
        ...(properties !== undefined ? properties : config.properties || []),
      ],
      ignoreDisplacements,
      accessibilitySettings:
        accessibilityValidation !== undefined
          ? accessibilityValidation
          : config.accessibilityValidation,
    };

    const checkParams = {
      url,
      snapshot,
      ignore:
        ignoreRegionsBackCompat !== undefined ? ignoreRegionsBackCompat : config.ignoreRegions,
      floating: floatingRegions !== undefined ? floatingRegions : config.floatingRegions,
      layout: layoutRegions !== undefined ? layoutRegions : config.layoutRegions,
      strict: strictRegions !== undefined ? strictRegions : config.strictRegions,
      content: contentRegions !== undefined ? contentRegions : config.contentRegions,
      accessibility:
        accessibilityRegions !== undefined ? accessibilityRegions : config.accessibilityRegions,
      scriptHooks,
      sizeMode,
      target,
      fully,
      selector,
      region,
      tag,
    };

    return timeItAsync(title, async () => {
      return testWindow({openParams, checkParams, throwEx: false});
    }).then(onDoneStory);

    function onDoneStory(results) {
      logger.log('finished story', title, 'in', performance[title]);
      return results;
    }
  };
}

module.exports = makeRenderStory;
