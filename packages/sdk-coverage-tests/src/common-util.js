function getNameFromObject(object) {
  return Object.keys(object)[0]
}

function findDifferencesBetweenCollections(hostCollection = [], guestCollection = []) {
  const _hostCollection = Array.isArray(hostCollection)
    ? hostCollection
    : Object.keys(hostCollection)
  const _guestCollection = Array.isArray(guestCollection)
    ? new Set(guestCollection)
    : new Set(Object.keys(guestCollection))
  return _hostCollection.filter(test => !_guestCollection.has(test))
}

module.exports = {
  findDifferencesBetweenCollections,
  getNameFromObject,
}
