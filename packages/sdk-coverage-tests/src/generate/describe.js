const {isEmptyObject} = require('../common-util')

function describeTest({name, history, page, env = {}, config = {}}) {
  const description = {
    name,
    page,
    steps: [],
    browser: env.browser,
    vg: config.vg,
    stitchMode: config.stitchMode,
    classic: config.check === 'classic',
  }
  let step = {}

  for (const {name, args} of history) {
    const [domain] = name.split('.')
    const command = name.substring(domain.length + 1)
    if (domain === 'driver') {
      if (command === 'switchToFrame') {
        step.manual = step.manual || {}
        step.manual.switch = true
      } else if (name === 'executeScript') {
        const [script] = args
        if (script.search(/\bscroll(To|By)\b/) !== -1) {
          step.manual = step.manual || {}
          step.manual.scroll = true
        }
      }
    } else if (domain === 'eyes') {
      if (command === 'constructor.setViewportSize') {
        step.setViewportSize = true
      } else if (command === 'check') {
        const [checkSettings] = args
        step.check = describeCheckSettings(checkSettings)
        description.steps.push(step)
        step = {}
      }
    } else if (domain === 'assert') {
      step.assert = step.assert || []
      if (['strictEqual', 'deepStrictEqual'].includes(command)) {
        const [actual, expected] = args
        step.assert.push({
          type: 'equal',
          actual: actual.isRef ? describeRef(actual) : null,
          expected: expected.isRef ? describeRef(expected) : null,
        })
      }
    }
  }

  if (!isEmptyObject(step)) {
    description.steps.push(step)
  }

  return description
}

function describeCheckSettings(checkSettings = {}) {
  const description = {}
  if (checkSettings.region) {
    description.region = describeRegion(checkSettings.region)
  }
  if (checkSettings.frames) {
    description.frames = checkSettings.frames.map(frame => ({
      frame: describeRegion(frame.frame || frame),
      scrollRootElement: frame.scrollRootElement ? describeRegion(frame.scrollRootElement) : null,
    }))
  }
  if (checkSettings.scrollRootElement) {
    description.scrollRootElement = describeRegion(checkSettings.scrollRootElement)
  }
  if (checkSettings.ignoreRegions && checkSettings.ignoreRegions.length > 0) {
    description.ignoreRegions = checkSettings.ignoreRegions.map(describeRegion)
  }
  if (checkSettings.floatingRegions && checkSettings.floatingRegions.length > 0) {
    description.floatingRegions = checkSettings.floatingRegions.map(describeRegion)
  }
  if (checkSettings.accessibilityRegions && checkSettings.accessibilityRegions.length > 0) {
    description.accessibilityRegions = checkSettings.accessibilityRegions.map(describeRegion)
  }
  if (checkSettings.layoutRegions && checkSettings.layoutRegions.length > 0) {
    description.layoutRegions = checkSettings.layoutRegions.map(describeRegion)
  }
  if (checkSettings.strictRegions && checkSettings.strictRegions.length > 0) {
    description.strictRegions = checkSettings.strictRegions.map(describeRegion)
  }
  if (checkSettings.contentRegions && checkSettings.contentRegions.length > 0) {
    description.contentRegions = checkSettings.contentRegions.map(describeRegion)
  }
  if (checkSettings.isFully) {
    description.isFully = checkSettings.isFully
  }
  if (checkSettings.matchLevel) {
    description.matchLevel = checkSettings.matchLevel
  }
  return description
}

function describeRegion(region = {}) {
  const description = {}
  if (
    region.hasOwnProperty('left') &&
    region.hasOwnProperty('top') &&
    region.hasOwnProperty('width') &&
    region.hasOwnProperty('height')
  ) {
    description.type = 'Coordinates'
  } else if (
    typeof region === 'string' ||
    (region.hasOwnProperty('type') && region.hasOwnProperty('selector'))
  ) {
    description.type = 'Selector'
  } else if (region.isRef) {
    const type = region.type()
    description.type = type && type.name
  }
  return description
}

function describeRef(ref) {
  if (ref.ref()) {
    return ref.ref()
  } else if (ref.type()) {
    return ref.type()
  } else {
    return 'Ref'
  }
}

exports.describeTest = describeTest
