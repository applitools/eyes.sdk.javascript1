const {
  _getEntriesForHeading,
  _getLatestReleaseHeading,
  _getReleaseNumberFromHeading,
  verifyChangelog,
  updateChangelogContents,
  getLatestReleaseEntries,
} = require('../../src/changelog')
const assert = require('assert')

describe('query-changelog', () => {
  it('should get entries for the latest release', () => {
    const changelogContents = `
      # Changelog
## Unreleased

      ## 1.2.3 - date

      - more blah

      ## [3.2.1] - date

      - some more blah as well
    `
    assert.deepStrictEqual(getLatestReleaseEntries(changelogContents), ['      - more blah'])
  })
})

describe('verify-changelog', () => {
  let changelogContents
  before(() => {
    changelogContents = `
      # Changelog

      ## Unreleased

      - blah
      - also blah

      ## 1.2.3 - date

      - more blah

      ## [3.2.1] - date

      - some more blah as well
    `
  })
  it('should get entries for an explicit heading', () => {
    assert.deepStrictEqual(
      _getEntriesForHeading({changelogContents, targetHeading: '## Unreleased'}),
      [
        {entry: '      - blah', index: 5},
        {entry: '      - also blah', index: 6},
      ],
    )
    assert.deepStrictEqual(
      _getEntriesForHeading({changelogContents, targetHeading: '## 1.2.3 - date'}),
      [{entry: '      - more blah', index: 10}],
    )
  })
  it('should get latest release heading', () => {
    const result = _getLatestReleaseHeading(changelogContents)
    assert.deepStrictEqual(result.heading, '## 1.2.3 - date')
    assert.deepStrictEqual(result.index, 8)
  })
  it('should get version number from release heading', () => {
    assert.deepStrictEqual(_getReleaseNumberFromHeading('## 1.2.3 - date'), '1.2.3')
    assert.deepStrictEqual(_getReleaseNumberFromHeading('## [3.2.1] - date'), '3.2.1')
  })
  it('should throw if the unreleased entries is empty', () => {
    const _changelogContents = `
      # Changelog

      ## Unreleased
    `
    assert.throws(() => {
      verifyChangelog({changelogContents: _changelogContents})
    }, /No unreleased entries found/)
  })
})

describe('update-changelog', () => {
  let changelogContents
  before(() => {
    changelogContents = `
      # Changelog

      ## Unreleased
      - blah
      - also blah

      ## 1.2.3 - date

      - more blah

      ## [3.2.1] - date

      - some more blah as well
    `
  })
  it('should add release entry and move unreleased items into it', () => {
    const updatedChangelog = updateChangelogContents({
      changelogContents,
      version: '1.2.4',
    })
    const expectedChangelogContents = `
      # Changelog

      ## Unreleased

      ## 1.2.4

      - blah
      - also blah

      ## 1.2.3 - date

      - more blah

      ## [3.2.1] - date

      - some more blah as well
    `
    assert.deepStrictEqual(updatedChangelog, expectedChangelogContents)
  })
  it('should add release entry with date', () => {
    const updatedChangelog = updateChangelogContents({
      changelogContents,
      version: '1.2.4',
      withDate: true,
    })
    const date = () => {
      const now = new Date()
      return `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`
    }
    const expectedChangelogContents = `
      # Changelog

      ## Unreleased

      ## 1.2.4 - ${date()}

      - blah
      - also blah

      ## 1.2.3 - date

      - more blah

      ## [3.2.1] - date

      - some more blah as well
    `
    assert.deepStrictEqual(updatedChangelog, expectedChangelogContents)
  })
})
