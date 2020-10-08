function createFramesPaths({snapshot, path = [], logger}) {
  const paths = snapshot.crossFramesSelectors
    ? snapshot.crossFramesSelectors.map(selector => ({
        path: path.concat(selector),
        parentSnapshot: snapshot,
      }))
    : []

  for (const frame of snapshot.frames) {
    if (frame.selector) {
      paths.push(...createFramesPaths({snapshot: frame, path: path.concat(frame.selector), logger}))
    }
  }

  logger.verbose(
    `frames paths for ${snapshot.crossFramesSelectors}`,
    paths.map(({path}) => path.join('-->')).join(' , '),
  )

  return paths
}

module.exports = createFramesPaths
