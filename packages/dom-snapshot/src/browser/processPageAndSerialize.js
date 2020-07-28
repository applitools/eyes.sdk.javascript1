'use strict';

const arrayBufferToBase64 = require('./arrayBufferToBase64');
const processPage = require('./processPage');

function processPageAndSerialize() {
  return processPage.apply(this, arguments).then(serializeFrame);
}

function serializeFrame(frame) {
  frame.blobs = frame.blobs.map(blob =>
    blob.value ? Object.assign(blob, {value: arrayBufferToBase64(blob.value)}) : blob,
  );
  frame.frames.forEach(serializeFrame);
  return frame;
}

module.exports = processPageAndSerialize;
