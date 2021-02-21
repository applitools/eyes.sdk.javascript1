'use strict';
const getStoryTitle = require('./getStoryTitle');

function filterStories({stories, config}) {
  return stories.filter(story => filterStory(story, config));
}

function filterStory(story, config) {
  const story_title = getStoryTitle(story);
  const localInclude =
    story.parameters && story.parameters.eyes && story.parameters.eyes.hasOwnProperty('include')
      ? story.parameters.eyes.include
      : undefined;

  if (localInclude !== undefined) {
    return localInclude;
  } else if (typeof config.include === 'function') {
    return config.include(story, story_title);
  } else if(typeof config.include === 'string') {
    if(config.include.startsWith("/") && config.include.endsWith("/")){
      // create a regex and remove slashes from the start and end of the input
      let include_input = new RegExp(config.include.substring(1, config.include.length - 1));
      return include_input.test(story_title);
    } else
        return (config.include == story_title);
  }else if (config.include !== undefined) {
    return config.include;
  } else {
    return true;
  }
}

module.exports = filterStories;
