const getClientAPI = require('./getClientAPI');

function getStoryByIndex(index) {
  let api;
  try {
    api = getClientAPI();
    const story = api.getStories()[index];
    if (!story) {
      console.log('error cannot get story', index);
    }
    return story;
  } catch (ex) {
    throw new Error(JSON.stringify({message: ex.message, version: api ? api.version : undefined}));
  }
}

module.exports = getStoryByIndex;
