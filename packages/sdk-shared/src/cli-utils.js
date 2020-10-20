function parseMap(str) {
  if (!str) return str
  const entries = str.split(/\s?;\s?/).map(entry => entry.trim().split(/\s?=>\s?/))
  if (entries.some(entry => entry.length !== 2)) return null
  return entries.reduce((map, [key, value]) => Object.assign(map, {[key]: value}), {})
}

function parseList(str) {
  if (!str) return str
  return str.split(/\s?,\s?/)
}

function parseSequence(keys, separator = ',') {
  return str => {
    if (!str) return str
    const values = str.split(new RegExp(`\s?${separator}\s?`))
    return keys.reduce((map, key, index) => Object.assign(map, {[key]: values[index]}), {})
  }
}

function parseLocation(str) {
  if (!str) return str
  const [x, y] = str.split(';').map(Number)
  if (Number.isNaN(x) || Number.isNaN(y)) return null
  return {x, y}
}

function parseSize(str) {
  if (!str) return str
  const [width, height] = str.split('x').map(Number)
  if (Number.isNaN(width) || Number.isNaN(height)) return null
  return {width, height}
}

function parseRegion(str) {
  if (!str) return str
  const match = str.match(/^\((.+?)\)(.+?)$/)
  if (!match) return null
  const [_, locationStr, sizeStr] = match
  if (!locationStr || !sizeStr) return null
  const location = parseLocation(locationStr)
  const size = parseSize(sizeStr)
  if (!location || !size) return null
  return {left: location.x, top: location.y, ...size}
}

function parseSelector(str) {
  if (!str) return str
  const [_, __, type = 'css', selector] = str.match(/^((css|xpath):)?(.+)$/)
  return {type, selector}
}

module.exports = {
  parseMap,
  parseList,
  parseSequence,
  parseLocation,
  parseSize,
  parseRegion,
  parseSelector,
}
