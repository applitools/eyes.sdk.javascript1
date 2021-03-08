const getStoryIndex = require('../getStoryIndex');

function runRunAfterScript(index) {
  try {
    let story = getStoryIndex(index);
    return story.parameters.eyes.runAfter({rootEl: document.getElementById('root'), story});
  } catch (ex) {
    return {message: ex.message};
  }
}

module.exports = runRunAfterScript;
