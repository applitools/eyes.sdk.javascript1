function logDebug(thingToLog) {
  if (process.env.COVERAGE_TESTS_DEBUG) console.dir(thingToLog, {depth: null})
}

module.exports = {
  logDebug,
}
