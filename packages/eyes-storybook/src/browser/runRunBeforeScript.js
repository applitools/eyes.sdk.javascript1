const getStoryIndex = require('./getStoryByIndex');

function runRunBeforeScript(index) {
  try {
    const story = getStoryIndex(index);
    if (!story) return;
    return story.parameters.eyes.runBefore({rootEl: document.getElementById('root'), story: story});
  } catch (ex) {
    return {message: ex.message};
  }
}

module.exports = runRunBeforeScript;
