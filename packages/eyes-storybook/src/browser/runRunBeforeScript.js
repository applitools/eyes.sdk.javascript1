const getStoryIndex = require('../getStoryIndex');

function runRunBeforeScript(index) {
  try {
    let story = getStoryIndex(index);
    return story.parameters.eyes.runBefore({rootEl: document.getElementById('root'), story});
  } catch (ex) {
    return {message: ex.message};
  }
}

module.exports = runRunBeforeScript;
