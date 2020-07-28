function decodeFrame(frame) {
  return Object.assign(frame, {
    blobs: frame.blobs.map(blob =>
      blob.value !== undefined
        ? Object.assign(blob, {value: Buffer.from(blob.value, 'base64')})
        : blob,
    ),
    frames: frame.frames.map(decodeFrame),
  });
}

module.exports = decodeFrame;
