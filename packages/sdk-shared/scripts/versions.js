const {exec} = require('child_process')
const {promisify} = require('util')
const pexec = promisify(exec)

const packages = [
  '@applitools/eyes-selenium',
  '@applitools/eyes-webdriverio',
  '@applitools/eyes.webdriverio',
  '@applitools/eyes-webdriverio5-service',
  '@applitools/eyes-webdriverio4-service',
  '@applitools/eyes-protractor',
  '@applitools/eyes-playwright',
  '@applitools/eyes-cypress',
  '@applitools/eyes-storybook',
  '@applitools/eyes-testcafe',
  '@applitools/eyes-images',
  'eyes.selenium',
  '@applitools/dom-snapshot',
  '@applitools/dom-capture',
]

;(async function main() {
  const versions = await Promise.all(
    packages.map(async pkg => {
      const {stdout} = await pexec(`npm view ${pkg} version`)
      return stdout
    }),
  )
  const maxLen = packages.reduce((max, curr) => Math.max(curr.length, max), 0)
  console.log(
    packages
      .map((pkg, i) => {
        return `${pkg.padEnd(maxLen)} : ${versions[i]}`
      })
      .join(''),
  )
})().catch(err => {
  console.log(err)
  process.exit(1)
})
