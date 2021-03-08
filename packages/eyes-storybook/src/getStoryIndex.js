const getClientAPI = require('./browser/getClientAPI');

function getStoryIndex(index) {
  let api;
  try {
    api = getClientAPI();
    const story = api.getStories()[index];
    if (!story) {
      console.log('error cannot get story', index);
      return;
    }
    return story;
  } catch (ex) {
    return {message: ex.message, version: api ? api.version : undefined};
  }
}

module.exports = getStoryIndex;
