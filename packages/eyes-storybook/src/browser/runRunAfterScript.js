const getStoryByIndex = require('./getStoryByIndex');

function runRunAfterScript(index) {
  try {
    const story = getStoryByIndex(index);
    if (!story) return;
    return story.parameters.eyes.runAfter({rootEl: document.getElementById('root'), story});
  } catch (ex) {
    return {message: ex.message};
  }
}

module.exports = runRunAfterScript;
