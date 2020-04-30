const {CheckSettingsFactory} = require('@applitools/eyes-sdk-core')
const WDIOElement = require('./wrappers/WDIOElement')
const WDIOElementFinder = require('./wrappers/WDIOElementFinder')

module.exports = CheckSettingsFactory(WDIOElement, WDIOElementFinder)
