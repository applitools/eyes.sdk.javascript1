const takeDomSnapshot = require('./takeDomSnapshot')
const getBrowserInfo = require('./getBrowserInfo')
const chalk = require('chalk')
const GeneralUtils = require('./GeneralUtils')

async function takeDomSnapshots({
  breakpoints,
  browsers,
  disableBrowserFetching,
  driver,
  logger,
  showLogs,
  skipResources,
  getViewportSize,
  getEmulatedDevicesSizes,
  getIosDevicesSizes,
}) {
  let allCookies = false
  const allBrowserCookies = []

  if (!breakpoints) {
    logger.verbose(`taking single dom snapshot`)
    const snapshot = await takeDomSnapshot(logger, driver, {
      getContextCookies,
      disableBrowserFetching,
      showLogs,
      skipResources,
    })
    return {snapshots: Array(browsers.length).fill(snapshot), cookies: allBrowserCookies}
  }

  const requiredWidths = await getRequiredWidths()
  const isStrictBreakpoints = Array.isArray(breakpoints)
  const smallestBreakpoint = Math.min(...(isStrictBreakpoints ? breakpoints : []))

  if (isStrictBreakpoints && requiredWidths.has(smallestBreakpoint - 1)) {
    const smallestBrowsers = requiredWidths
      .get(smallestBreakpoint - 1)
      .map(({name, width}) => `(${name}, ${width})`)
      .join(', ')
    const message = chalk.yellow(
      `The following configuration's viewport-widths are smaller than the smallest configured layout breakpoint (${smallestBreakpoint} pixels): [${smallestBrowsers}]. As a fallback, the resources that will be used for these configurations have been captured on a viewport-width of ${smallestBreakpoint} - 1 pixels. If an additional layout breakpoint is needed for you to achieve better results - please add it to your configuration.`,
    )
    console.log(message)
  }

  logger.verbose(`taking multiple dom snapshots for breakpoints: ${breakpoints}`)
  logger.verbose(`required widths: ${[...requiredWidths.keys()].join(', ')}`)
  const viewportSize = await getViewportSize()
  const snapshots = Array(browsers.length)
  if (requiredWidths.has(viewportSize.width)) {
    logger.log(`taking dom snapshot for existing width ${viewportSize.width}`)
    const snapshot = await takeDomSnapshot(logger, driver, {
      disableBrowserFetching,
      showLogs,
      skipResources,
    })
    requiredWidths.get(viewportSize.width).forEach(({index}) => (snapshots[index] = snapshot))
  }
  for (const [requiredWidth, browsersInfo] of requiredWidths.entries()) {
    logger.log(`taking dom snapshot for width ${requiredWidth}`)
    try {
      await driver.setViewportSize({width: requiredWidth, height: viewportSize.height})
    } catch (err) {
      const actualViewportSize = await driver.getViewportSize()
      if (isStrictBreakpoints) {
        const failedBrowsers = browsersInfo.map(({name, width}) => `(${name}, ${width})`).join(', ')
        const message = chalk.yellow(
          `One of the configured layout breakpoints is ${requiredWidth} pixels, while your local browser has a limit of ${actualViewportSize.getWidth()}, so the SDK couldn't resize it to the desired size. As a fallback, the resources that will be used for the following configurations: [${failedBrowsers}] have been captured on the browser's limit (${actualViewportSize.getWidth()} pixels). To resolve this, you may use a headless browser as it can be resized to any size.`,
        )
        console.log(message)
      } else {
        const failedBrowsers = browsersInfo.map(({name}) => `(${name})`).join(', ')
        const message = chalk.yellow(
          `The following configurations [${failedBrowsers}] have a viewport-width of ${requiredWidth} pixels, while your local browser has a limit of ${actualViewportSize.getWidth()} pixels, so the SDK couldn't resize it to the desired size. As a fallback, the resources that will be used for these checkpoints have been captured on the browser's limit (${actualViewportSize.getWidth()} pixels). To resolve this, you may use a headless browser as it can be resized to any size.`,
        )
        console.log(message)
      }
    }

    const snapshot = await takeDomSnapshot(logger, driver, {
      getContextCookies,
      disableBrowserFetching,
      showLogs,
      skipResources,
    })

    browsersInfo.forEach(({index}) => (snapshots[index] = snapshot))
  }
  await driver.setViewportSize(viewportSize)
  return {snapshots, cookies: allBrowserCookies}

  async function getRequiredWidths() {
    return await browsers.reduce((widths, browser, index) => {
      const browserInfo = getBrowserInfo({browser, getEmulatedDevicesSizes, getIosDevicesSizes})
      return widths.then(async widths => {
        const {name, width} = await browserInfo
        const requiredWidth = GeneralUtils.getBreakpointWidth(breakpoints, width)
        let groupedBrowsers = widths.get(requiredWidth)
        if (!groupedBrowsers) {
          groupedBrowsers = []
          widths.set(requiredWidth, groupedBrowsers)
        }
        groupedBrowsers.push({index, width, name})
        return widths
      })
    }, Promise.resolve(new Map()))
  }

  async function getContextCookies(context) {
    if (!allCookies) {
      const {cookies, all} = await context.getCookies()
      if (all) allCookies = true
      allBrowserCookies.push(...cookies)
    }
  }
}

module.exports = takeDomSnapshots
