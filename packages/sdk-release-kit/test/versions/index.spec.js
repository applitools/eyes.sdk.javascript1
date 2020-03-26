const assert = require('assert')
const {checkPackagesForUniqueVersions, findEntryByPackageName} = require('../../src/versions')

describe('versions', () => {
  describe('verify-installed-versions', () => {
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
