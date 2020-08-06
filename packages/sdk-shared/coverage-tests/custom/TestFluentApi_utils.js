'use strict'
const path = require('path')
const cwd = process.cwd()
const spec = require(path.resolve(cwd, 'src/SpecDriver'))
const {Target, Region} = require(cwd)
const appName = 'Eyes Selenium SDK - Fluent API'

async function getElementSplittedRegions(driver, element) {
  function calculateElementRect(element) {
    const originalOverflow = element.style.overflow
    element.style.overflow = 'hidden'
    const rect = element.getBoundingClientRect()
    element.style = originalOverflow
    return {
      x: rect.left + window.scrollX, // eslint-disable-line no-undef
      y: rect.top + window.scrollY, // eslint-disable-line no-undef
      width: rect.width,
      height: rect.height,
    }
  }
  const region = await spec.executeScript(driver, calculateElementRect, element)
  const regions = []
  for (let currentY = region.y; currentY < region.y + region.height; currentY += 5000) {
    if (region.height > currentY + 5000) {
      regions.push(new Region(region.x, currentY, region.width, 5000))
    } else {
      regions.push(new Region(region.x, currentY, region.width, region.height - currentY))
    }
  }
  return regions
}

async function TestCheckScrollableModal({testName, eyes, driver}) {
  driver = await eyes.open(driver, appName, testName, {
    width: 700,
    height: 460,
  })
  await spec.click(driver, '#centered')
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
  await spec.click(driver, '#stretched')
  const frameElement = await spec.findElement(driver, '#modal2 iframe')
  const frameDriver = await spec.childContext(driver, frameElement)
  const element = await spec.findElement(frameDriver, 'html')
  const regions = await getElementSplittedRegions(frameDriver, element)
  await spec.mainContext(driver)
  for (const region of regions) {
    await eyes.check({
      name: 'Check Long Out of bounds Iframe Modal',
      scrollRootElement: '#modal2',
      frames: [frameElement],
      region,
      isFully: true,
    })
  }
  await eyes.close()
}

async function TestCheckLongOutOfBoundsIFrameModal({testName, eyes, driver}) {
  driver = await eyes.open(driver, appName, testName, {
    width: 700,
    height: 460,
  })
  await spec.click(driver, '#hidden_click')
  const frameElement = await spec.findElement(driver, '#modal3 iframe')
  const frameDriver = await spec.childContext(driver, frameElement)
  const element = await spec.findElement(frameDriver, 'html')
  const regions = await getElementSplittedRegions(frameDriver, element)
  await spec.mainContext(driver)
  for (const region of regions) {
    await eyes.check({
      name: 'Check Long Out of bounds Iframe Modal',
      scrollRootElement: '#modal3',
      frames: [frameElement],
      region,
      isFully: true,
    })
  }
  await eyes.close()
}

module.exports = {
  TestCheckScrollableModal,
  TestCheckLongIFrameModal,
  TestCheckLongOutOfBoundsIFrameModal,
}
