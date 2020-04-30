'use strict'

const ONE_VERSION_REGEX = /^(chrome|firefox|safari|edgechromium)\-1$/
const TWO_VERSIONS_REGEX = /^(chrome|firefox|safari)\-2$/

function translateBrowserNameVersion(browserName) {
  if (ONE_VERSION_REGEX.test(browserName)) {
    return browserName.replace('1', 'one-version-back')
  }

  if (TWO_VERSIONS_REGEX.test(browserName)) {
    return browserName.replace('2', 'two-versions-back')
  }

  return browserName
}

module.exports = translateBrowserNameVersion
