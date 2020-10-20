function createFramesPaths({snapshot, path = [], logger}) {
  const paths = snapshot.crossFrames
    ? snapshot.crossFrames.map(({selector, index}) => ({
        path: path.concat(selector),
        parentSnapshot: snapshot,
        cdtNode: snapshot.cdt[index],
      }))
    : []

  for (const frame of snapshot.frames) {
    if (frame.selector) {
      paths.push(...createFramesPaths({snapshot: frame, path: path.concat(frame.selector), logger}))
    }
  }

  logger.verbose(
    `frames paths for ${snapshot.crossFrames}`,
    paths.map(({path}) => path.join('-->')).join(' , '),
  )

  return paths
}

module.exports = createFramesPaths
