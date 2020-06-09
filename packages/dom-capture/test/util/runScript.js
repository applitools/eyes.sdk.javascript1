'use strict';

// this frame is a utility to zig-zag between cross origin frames

function makeRunScript(page) {
  return async function runScript(scriptStr, frameXpathTrail) {
    let frame = page;
    for (const xpath of frameXpathTrail) {
      frame = (await frame.$x(xpath))[0];
      frame = frame && (await frame.contentFrame());
      if (!frame) throw new Error(`iframe not found at xpath ${xpath}`);
    }

    return await frame.evaluate(new Function(scriptStr));
  };
}

module.exports = makeRunScript;
