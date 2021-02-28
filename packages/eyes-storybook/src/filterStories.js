'use strict';
const getStoryTitle = require('./getStoryTitle');

function filterStories({stories, config}) {
  return stories.filter(story => filterStory(story, config));
}

function filterStory(story, config) {
  const storyTitle = getStoryTitle(story);
  const localInclude =
    story.parameters && story.parameters.eyes && story.parameters.eyes.hasOwnProperty('include')
      ? story.parameters.eyes.include
      : undefined;

  if (localInclude !== undefined) {
    return localInclude;
  } else if (typeof config.include === 'function') {
    return config.include({...story, storyTitle});
  } else if (typeof config.include === 'string') {
    return config.include == storyTitle;
  } else if (Object.prototype.toString.call(config.include) === '[object RegExp]') {
    return config.include.test(storyTitle);
  } else if (config.include !== undefined) {
    return config.include;
  } else {
    return true;
  }
}

module.exports = filterStories;
