const {
  getEntriesForHeading,
  getLatestReleaseHeading,
  getReleaseNumberFromHeading,
  verifyChangelogContents,
  getLatestReleaseEntries,
} = require('../../src/changelog/query')
const {addUnreleasedItem, createReleaseEntry} = require('../../src/changelog/update')
const assert = require('assert')

describe('add-changelog-entry', () => {
  it('should append an entry to a populated unreleased section', () => {
    const changelogContents = `
# Changelog

## Unreleased
- a
- b

## 1.2.3 - date

- more blah
`
    const updatedChangelogContents = addUnreleasedItem({
      changelogContents,
      entry: '- blah blah',
    })
    const expectedChangelogContents = `
# Changelog

## Unreleased
- a
- b
- blah blah

## 1.2.3 - date

- more blah
`
    assert.deepStrictEqual(updatedChangelogContents, expectedChangelogContents)
  })
  it('should append an entry to an empty unreleased section', () => {
    const changelogContents = `
# Changelog

## Unreleased

## 1.2.3 - date

- more blah
`
    const updatedChangelogContents = addUnreleasedItem({
      changelogContents,
      entry: '- blah blah',
    })
    const expectedChangelogContents = `
# Changelog

## Unreleased
- blah blah

## 1.2.3 - date

- more blah
`
    assert.deepStrictEqual(updatedChangelogContents, expectedChangelogContents)
  })
})

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
      getEntriesForHeading({changelogContents, targetHeading: '## Unreleased'}),
      [
        {entry: '      - blah', index: 5},
        {entry: '      - also blah', index: 6},
      ],
    )
    assert.deepStrictEqual(
      getEntriesForHeading({changelogContents, targetHeading: '## 1.2.3 - date'}),
      [{entry: '      - more blah', index: 10}],
    )
  })
  it('should get latest release heading', () => {
    const result = getLatestReleaseHeading(changelogContents)
    assert.deepStrictEqual(result.heading, '## 1.2.3 - date')
    assert.deepStrictEqual(result.index, 8)
  })
  it('should get version number from release heading', () => {
    assert.deepStrictEqual(getReleaseNumberFromHeading('## 1.2.3 - date'), '1.2.3')
    assert.deepStrictEqual(getReleaseNumberFromHeading('## [3.2.1] - date'), '3.2.1')
  })
  it('should throw if the unreleased entries is empty', () => {
    const _changelogContents = `
      # Changelog

      ## Unreleased
    `
    assert.throws(() => {
      verifyChangelogContents({changelogContents: _changelogContents})
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
    const updatedChangelog = createReleaseEntry({
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
    const updatedChangelog = createReleaseEntry({
      changelogContents,
      version: '1.2.4',
      withDate: true,
    })
    const date = () => {
      const now = new Date()
      return `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`
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
