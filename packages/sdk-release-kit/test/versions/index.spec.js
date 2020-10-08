const assert = require('assert')
const {
  checkPackagesForUniqueVersions,
  findEntryByPackageName,
  findPackageInPackageLock,
} = require('../../src/versions/versions-utils')
const path = require('path')

describe('versions-utils', () => {
  it('finds all references to a given package', () => {
    const packageLock = require(path.join(__dirname, 'fixtures', 'package-lock.json'))
    const expected = [
      {'@applitools/eyes-webdriverio@file:../dry-run.tgz': '@applitools/eyes-sdk-core@9.0.2'},
      {'@applitools/visual-grid-client@13.6.12': '@applitools/eyes-sdk-core@9.0.3'},
    ]
    assert.deepStrictEqual(
      findPackageInPackageLock({packageLock, packageName: '@applitools/eyes-sdk-core'}),
      expected,
    )
  })
})

describe('versions', () => {
  describe('verify-installed-versions', () => {
    describe('with package-lock.json', () => {
      it('checks if different versions of the same package are installed', () => {
        const packageLock = require(path.join(__dirname, 'fixtures', 'package-lock.json'))
        const packageNames = ['@applitools/eyes-sdk-core', '@applitools/dom-utils']
        assert.throws(() => {
          checkPackagesForUniqueVersions(packageLock, packageNames, {isNpmLs: false})
        }, /Non-unique package versions found of @applitools\/eyes\-sdk-core\./)
      })
    })
    describe('with npm ls', () => {
      it('filters package name exactly', () => {
        const npmLsOutput = `
        └─┬ @applitools/eyes-webdriverio@5.9.21
        ├─┬ selenium-webdriver@4.0.0-alpha.7
        └─┬ webdriverio@5.22.4
          └─┬ webdriver@5.22.4
        `
        assert.deepStrictEqual(findEntryByPackageName(npmLsOutput, 'webdriverio'), [
          '        └─┬ webdriverio@5.22.4',
        ])
      })
      it('checks if different versions of the same package are installed', () => {
        const npmLsOutput = `
        ├─┬ @applitools/eyes-selenium@4.33.24
        │ │ ├─┬ @applitools/eyes-common@3.19.0
        │ ├─┬ @applitools/eyes-common@3.20.1
        │ ├─┬ @applitools/eyes-sdk-core@8.1.1
        │ │ ├─┬ @applitools/eyes-common@3.20.0
        │   ├─┬ @applitools/eyes-common@3.20.0
        │   ├── @applitools/eyes-sdk-core@8.1.1 deduped
        `
        const packageNames = ['@applitools/eyes-sdk-core', '@applitools/eyes-common']
        assert.throws(() => {
          checkPackagesForUniqueVersions(npmLsOutput, packageNames)
        }, /Non-unique package versions found of @applitools\/eyes\-common/)
      })
    })
  })
})
