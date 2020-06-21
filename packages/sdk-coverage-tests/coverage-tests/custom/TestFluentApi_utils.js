'use strict'
const path = require('path')
const cwd = process.cwd()
const spec = require(path.resolve(cwd, 'src/SpecWrappedDriver'))
const {Target, Region} = require(cwd)
const appName = 'Eyes Selenium SDK - Fluent API'

async function getElementRect(driver, el) {
  await spec.executeScript(driver, el => (el.style.overflow = 'hidden'), el)
  return spec.getElementRect(driver, el)
}

async function performChecksOnLongRegion(rect, eyes) {
  for (let currentY = rect.y, c = 1; currentY < rect.y + rect.height; currentY += 5000, c++) {
    let region
    if (rect.height > currentY + 5000) {
      region = new Region(rect.x, currentY, rect.width, 5000)
    } else {
      region = new Region(rect.x, currentY, rect.width, rect.height - currentY)
    }
    await eyes.check('Check Long Out of bounds Iframe Modal', Target.region(region).fully())
  }
}

async function TestCheckScrollableModal({testName, eyes, driver}) {
  driver = await eyes.open(driver, appName, testName, {
    width: 700,
    height: 460,
  })
  const el = await spec.findElement(driver, '#centered')
  await spec.click(driver, el)
  await eyes.check(
    'TestCheckScrollableModal',
    Target.region('#modal-content')
      .fully()
      .scrollRootElement('#modal1'),
  )
  await eyes.close()
}

async function TestCheckLongIFrameModal({testName, eyes, driver}) {
  driver = await eyes.open(driver, appName, testName, {
    width: 700,
    height: 460,
  })
  const el = await spec.findElement(driver, '#stretched')
  await spec.click(driver, el)
  let frame = await spec.findElement(driver, '#modal2 iframe')
  await spec.switchToFrame(driver, frame)
  let element = await spec.findElement(driver, 'html')
  let rect = await getElementRect(driver, element)
  eyes.setScrollRootElement('#modal2')
  await performChecksOnLongRegion(rect, eyes)
  await eyes.close()
}

async function TestCheckLongOutOfBoundsIFrameModal({testName, eyes, driver}) {
  driver = await eyes.open(driver, appName, testName, {
    width: 700,
    height: 460,
  })
  const el = await spec.findElement(driver, '#hidden_click')
  await spec.click(driver, el)
  let frame = await spec.findElement(driver, '#modal3 iframe')
  await spec.switchToFrame(driver, frame)
  let element = await spec.findElement(driver, 'html')
  let rect = await getElementRect(driver, element)
  eyes.setScrollRootElement('#modal3')
  await performChecksOnLongRegion(rect, eyes)
  await eyes.close()
}

module.exports = {
  getElementRect,
  performChecksOnLongRegion,
  TestCheckScrollableModal,
  TestCheckLongIFrameModal,
  TestCheckLongOutOfBoundsIFrameModal,
}
