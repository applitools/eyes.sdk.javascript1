function getLatestReleaseEntries(changelogContents) {
  const targetHeading = _getLatestReleaseHeading(changelogContents).heading
  const entries = _getEntriesForHeading({changelogContents, targetHeading})
  return entries.map(entry => entry.entry)
}

function updateChangelogContents({changelogContents, version, withDate}) {
  let _changelogContents = changelogContents
  const now = new Date()
  let _version = withDate
    ? version + ` - ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`
    : version
  _changelogContents = _addReleaseEntryForUnreleasedItems({
    changelogContents: _changelogContents,
    version: _version,
  })
  _changelogContents = _removeUnreleasedItems({changelogContents: _changelogContents})
  return _changelogContents
}

function _addReleaseEntryForUnreleasedItems({changelogContents, version}) {
  const unreleasedEntries = _getEntriesForHeading({
    changelogContents,
    targetHeading: '## Unreleased',
  })
  const indentationCount =
    unreleasedEntries[0].entry.length - unreleasedEntries[0].entry.trim().length
  const padding = new Array(indentationCount + 1).join(' ')
  const releaseEntry = [
    '',
    `${padding}## ${version}\n`,
    ...unreleasedEntries.map(entry => entry.entry),
  ]
  const latestReleaseHeadingIndex = _getLatestReleaseHeading(changelogContents).index
  const _changelogContents = changelogContents.split('\n')
  _changelogContents.splice(latestReleaseHeadingIndex - 1, 0, ...releaseEntry)
  return _changelogContents.join('\n')
}

function _removeUnreleasedItems({changelogContents}) {
  const unreleasedEntries = _getEntriesForHeading({
    changelogContents,
    targetHeading: '## Unreleased',
  })
  const _changelogContents = changelogContents.split('\n')
  const entryIndexes = unreleasedEntries.map(entry => entry.index)
  entryIndexes.reverse().forEach(index => {
    _changelogContents.splice(index, 1)
  })
  return _changelogContents.join('\n')
}

function _getEntriesForHeading({changelogContents, targetHeading}) {
  let foundEntries = []
  let headingFound = false
  for (let [index, entry] of changelogContents.split('\n').entries()) {
    const _entry = entry.trim()
    if (headingFound && _entry.includes('##')) break
    if (headingFound && _entry.length) foundEntries.push({entry, index})
    if (_entry === targetHeading) headingFound = true
  }
  return foundEntries
}

function _getLatestReleaseHeading(changelogContents) {
  let latestReleaseHeading = {}
  for (let [index, entry] of changelogContents.split('\n').entries()) {
    const _entry = entry.trim()
    if (_entry.includes('##') && !_entry.includes('Unreleased')) {
      latestReleaseHeading.heading = _entry
      latestReleaseHeading.index = index
      break
    }
  }
  return latestReleaseHeading
}

function _getReleaseNumberFromHeading(heading) {
  return heading.match(/([0-9]{1,2}\.[0-9]{1,2}\.[0-9]{1,2})/)[0]
}

function verifyChangelog({changelogContents}) {
  const unreleasedEntries = _getEntriesForHeading({
    changelogContents,
    targetHeading: '## Unreleased',
  })
  if (!unreleasedEntries.length)
    throw new Error('No unreleased entries found in the changelog. Add some before releasing.')
}

module.exports = {
  _getEntriesForHeading,
  _getLatestReleaseHeading,
  _getReleaseNumberFromHeading,
  verifyChangelog,
  updateChangelogContents,
  getLatestReleaseEntries,
}
