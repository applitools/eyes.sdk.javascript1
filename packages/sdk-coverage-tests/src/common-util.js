function findDifferencesBetweenCollections(hostCollection = [], guestCollection = []) {
  const _hostCollection = Array.isArray(hostCollection)
    ? hostCollection
    : Object.keys(hostCollection)
  const _guestCollection = Array.isArray(guestCollection)
    ? new Set(guestCollection)
    : new Set(Object.keys(guestCollection))
  return _hostCollection.filter(test => !_guestCollection.has(test))
}

function isUrl(value) {
  if (typeof value !== 'string') return false
  return /^https?:/.test(value)
}

function isFunction(value) {
  return typeof value === 'function'
}

function isObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isEmptyObject(value) {
  return isObject(value) && Object.keys(value).length === 0
}

function mergeObjects(base, other) {
  return Object.entries(other).reduce((merged, [key, value]) => {
    if (key in merged) {
      merged[key] = isObject(value) ? mergeObjects(merged[key], value) : value
    } else {
      merged[key] = value
    }
    return merged
  }, Object.assign({}, base))
}

function capitalize(string) {
  return string[0].toUpperCase() + string.substring(1)
}

function toPascalCase(string) {
  if (!string) return string
  return string
    .split(' ')
    .map(word => capitalize(word))
    .join('')
}

module.exports = {
  findDifferencesBetweenCollections,
  mergeObjects,
  isUrl,
  isFunction,
  isObject,
  isEmptyObject,
  capitalize,
  toPascalCase,
}
