'use strict';

const assert = require('assert');

const { FrameChain, Frame, Logger, Location, RectangleSize } = require('../../index');

describe('FrameChain', function () {
  const logger = new Logger(true);

  it('clone', async function () {
    const frameChain = new FrameChain(logger);
    const frame = new Frame(logger, 'ref', new Location(0, 0), new RectangleSize(10, 20), new RectangleSize(10, 20), new Location(0, 0), 'mock');
    frameChain.push(frame);

    assert.strictEqual(frameChain.size(), 1);

    const clone = frameChain.clone();
    assert.strictEqual(frameChain.size(), 1);
    assert.strictEqual(clone.size(), 1);

    clone.pop();
    assert.strictEqual(frameChain.size(), 1);
    assert.strictEqual(clone.size(), 0);
  });

  it('iterator', async function () {
    const frameChain = new FrameChain(logger);
    frameChain.push(new Frame(logger, 'ref', new Location(0, 0), new RectangleSize(10, 20), new RectangleSize(10, 20), new Location(0, 0), 'mock'));
    frameChain.push(new Frame(logger, 'ref2', new Location(50, 75), new RectangleSize(10, 20), new RectangleSize(10, 20), new Location(0, 0), 'mock2'));
    frameChain.push(new Frame(logger, 'ref3', new Location(100, 150), new RectangleSize(10, 20), new RectangleSize(10, 20), new Location(0, 0), 'mock3'));

    let counter = 0;
    for (const frame of frameChain) {
      counter += 1;
      assert.ok(frame instanceof Frame);
    }
    assert.strictEqual(counter, 3);
  });
});
