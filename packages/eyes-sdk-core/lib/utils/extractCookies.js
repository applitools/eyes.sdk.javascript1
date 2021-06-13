async function extractCookies({driver, logger, snapshots}) {
  // TODO: check cypress https cert
  // TODO: handle context drivers
  // TODO: handle non-secure cookies
  const urls = getResourceUrls(snapshots)
  const cookies = await driver.getCookies()
  logger.log('resourceUrls', urls)
  logger.log('cookies', cookies)
}

function getResourceUrls(snapshots) {
  return snapshots.reduce((acc, snapshot) => {
    if (snapshot.frames.length > 0) {
      acc.push(...snapshot.frames.map(frame => getResourceUrls([frame])))
    }

    if (snapshot.resourceUrls.length > 0) {
      acc.push(...snapshot.resourceUrls)
    }

    return acc
  }, [])
}

module.exports = extractCookies
