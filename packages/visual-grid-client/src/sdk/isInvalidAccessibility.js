'use strict'
const {AccessibilityRegionType, TypeUtils} = require('@applitools/eyes-sdk-core')

function isInvalidAccessibility(accessibility = []) {
  const accObjects = [].concat(accessibility)
  const err = []
  const typeMsg = `Valid accessibilityType values are: ${Object.values(AccessibilityRegionType)}`
  for (const acc of accObjects) {
    if (acc.accessibilityType && !TypeUtils.has(AccessibilityRegionType, acc.accessibilityType)) {
      err.push(
        `The region ${JSON.stringify(acc)} has an invalid accessibilityType of: ${
          acc.accessibilityType
        } `,
      )
      !err.length && err.unshift(typeMsg)
    }
  }
  return err.join('\n')
}

module.exports = isInvalidAccessibility
