import { experimentalBrowsers, browserIds } from '../../app/components/VisualGrid/options'
import UAParser from 'ua-parser-js'
const parser = new UAParser()

export const maxExperimentalResolution = '1280x1024'
const parsedMax = parseViewport(maxExperimentalResolution)

export function parseBrowsers(
  browsers = ['Chrome'],
  viewports = ['1920x1080'],
  devices = [],
  orientations = ['Portrait']
) {
  const matrix = []
  let didRemoveResolution = false
  browsers.forEach(browser => {
    const name = browser.replace(/ /, '').toLowerCase()
    viewports.forEach(viewport => {
      const { width, height } = parseViewport(viewport)
      if (!(isExperimentalBrowser(name) && isBiggerResolution(parseViewport(viewport), parsedMax))) {
        const result = {
          width,
          height,
          name,
        }
        const id = browserIds[name.toLowerCase()]
        if (id) result.id = id
        matrix.push(result)
      } else {
        didRemoveResolution = true
      }
    })
  })
  devices.forEach(device => {
    orientations.forEach(orientation => {
      orientation = orientation.toLowerCase()
      if (device.type === 'emulator') {
        matrix.push({
          screenOrientation: orientation,
          deviceName: device.name,
          deviceId: devices.find(entry => entry.name === device.name).id,
        })
      } else if (device.type === 'simulator') {
        matrix.push({
          iosDeviceInfo: {
            screenOrientation: orientation === 'landscape' ? 'landscapeLeft' : orientation,
            deviceName: device.name,
          },
        })
      }
    })
  })
  return {
    matrix,
    didRemoveResolution,
  }
}

export function isExperimentalBrowser(browser) {
  if (!browser) return
  return experimentalBrowsers.includes(browser.toLowerCase())
}

function isBiggerResolution(res1, res2) {
  return res1.height > res2.height || res1.width > res2.width
}

export function parseViewport(vp) {
  const [width, height] = vp.split('x').map(s => parseInt(s))
  return { width, height }
}

export function parseRegion(region) {
  const x = +(region.match(/x:\s*(\d*)/) || [])[1]
  const y = +(region.match(/y:\s*(\d*)/) || [])[1]
  const width = +(region.match(/width:\s*(\d*)/) || [])[1]
  const height = +(region.match(/height:\s*(\d*)/) || [])[1]
  return { x, y, width, height }
}

export function parseEnvironment(userAgent, viewport) {
  parser.setUA(userAgent)
  return `${parser.getBrowser().name} ${parser.getOS().name} ${viewport.width}x${viewport.height}`
}

export function parseApiServer(server) {
  if (/^(?!.*(api)\.).*\.applitools\.com\/?$/.test(server)) {
    if (server === 'localhost.applitools.com') return server
    return server.replace('.applitools.com', 'api.applitools.com')
  }
  return server
}

export function parseMatchLevel(level = 'Strict') {
  const lvl = level[0].toUpperCase() + level.substr(1).toLowerCase()
  return lvl === 'Layout' ? 'Layout2' : lvl
}
