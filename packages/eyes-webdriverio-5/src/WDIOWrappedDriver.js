const {EyesWrappedDriver} = require('@applitools/eyes-sdk-core')
const LegacyWrappedDriver = require('./LegacyWrappedDriver')
/** @type {import('./SpecWrappedDriver'.WDIOSpecDriver)} */
const SpecWrappedDriver = require('./SpecWrappedDriver')

const WDIOWrappedDriver = EyesWrappedDriver.specialize(SpecWrappedDriver, {
  /** @override */
  async switchToFrame(proxies, reference) {
    return proxies.switchToFrame(reference)
  },
  /** @override */
  async switchToParentFrame(proxies) {
    return proxies.switchToParentFrame()
  },
  /** @override */
  async url(proxies, url) {
    return proxies.visit(url)
  },
})

module.exports = LegacyWrappedDriver(WDIOWrappedDriver)
