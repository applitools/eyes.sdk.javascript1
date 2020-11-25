'use strict'
const cwd = process.cwd()
const fs = require('fs')
const path = require('path')
const filenamify = require('filenamify')
const {Logger} = require(cwd)
const {Driver} = require(path.resolve(cwd, 'src/sdk'))
const spec = require(path.resolve(cwd, 'src/spec-driver'))
// eslint-disable-next-line node/no-missing-require
const {takeDomCapture} = require(require.resolve('@applitools/eyes-sdk-core', cwd))

;(async function main() {
  const logger = new Logger(process.env.APPLITOOLS_SHOW_LOGS)
  const [driver, destroyDriver] = await spec.build({browser: 'chrome', attach: true})
  // const [driver, destroyDriver] = await spec.build({browser: 'safari-12', legacy: true})
  // const [driver, destroyDriver] = await spec.build({device: 'iPad Air', browser: 'safari'})
  const eyesDriver = new Driver(logger, driver)
  await eyesDriver.init()

  // const url = '...'
  // await spec.visit(driver, url)
  const url = await driver.getUrl()
  console.log(url)

  const domStr = await takeDomCapture(logger, eyesDriver)
  console.log('captured dom of size', domStr.length)
  let obj
  try {
    obj = JSON.parse(domStr)
  } catch (ex) {
    console.log('failed to parse dom str', ex)
  } finally {
    await destroyDriver()
  }
  const filepath = path.resolve(cwd, `${filenamify(url)}.json`)
  console.log('writing result to file', filepath)
  fs.writeFileSync(filepath, obj ? JSON.stringify(obj, null, 2) : domStr)
})().catch(ex => {
  console.log(ex)
  process.exit(1)
})
