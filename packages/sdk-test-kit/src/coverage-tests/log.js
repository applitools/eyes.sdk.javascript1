function logDebug(thingToLog) {
  if (process.env.DEBUG) console.dir(thingToLog, {depth: null})
}

module.exports = {
  logDebug,
}
