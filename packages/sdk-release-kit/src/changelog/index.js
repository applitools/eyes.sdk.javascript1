const {getLatestReleaseEntries, verifyChangelog} = require('./query')
const {writeReleaseEntryToChangelog, writeUnreleasedItemToChangelog} = require('./update')

module.exports = {
  getLatestReleaseEntries,
  verifyChangelog,
  writeReleaseEntryToChangelog,
  writeUnreleasedItemToChangelog,
}
