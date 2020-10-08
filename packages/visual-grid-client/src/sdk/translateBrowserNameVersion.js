'use strict'

const VERSION_BACK_REGEX = /^(chrome|firefox|safari|edgechromium)\-(1|2)$/

function translateBrowserNameVersion(browserName) {
  if (VERSION_BACK_REGEX.test(browserName)) {
    return browserName.replace('1', 'one-version-back').replace('2', 'two-versions-back')
  }

  return browserName
}

module.exports = translateBrowserNameVersion
