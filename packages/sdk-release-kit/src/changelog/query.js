const path = require('path')
const {readFileSync} = require('fs')

// returns the entries for a given heading
// each entry has an index for where it is in the changelog
function getEntriesForHeading({changelogContents, targetHeading, includeHeading}) {
  let foundEntries = []
  let headingFound = false
  for (let [index, entry] of changelogContents.split('\n').entries()) {
    const _entry = entry.trim()
    if (headingFound && _entry.includes('##')) break
    if (headingFound && _entry.length) foundEntries.push({entry, index})
    if (_entry === targetHeading) {
      if (includeHeading) foundEntries.push({entry, index})
      headingFound = true
    }
  }
  return foundEntries
}

function getLatestReleaseEntries(changelogContents) {
  const targetHeading = getLatestReleaseHeading(changelogContents).heading
  const entries = getEntriesForHeading({changelogContents, targetHeading})
  return entries.map(entry => entry.entry)
}

function getLatestReleaseHeading(changelogContents) {
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

function getReleaseNumberFromHeading(heading) {
  return heading.match(/([0-9]{1,2}\.[0-9]{1,2}\.[0-9]{1,2})/)[0]
}

function verifyChangelog(targetFolder) {
  const changelogContents = readFileSync(path.resolve(targetFolder, 'CHANGELOG.md'), 'utf8')
  const {version} = require(path.resolve(targetFolder, 'package.json'))
  verifyChangelogContents({changelogContents, version})
}

function verifyChangelogContents({changelogContents}) {
  const unreleasedEntries = getEntriesForHeading({
    changelogContents,
    targetHeading: '## Unreleased',
  })
  if (!unreleasedEntries.length)
    throw new Error('No unreleased entries found in the changelog. Add some before releasing.')
}

module.exports = {
  getEntriesForHeading,
  getLatestReleaseEntries,
  getLatestReleaseHeading,
  getReleaseNumberFromHeading,
  verifyChangelogContents,
  verifyChangelog,
}
