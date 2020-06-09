const {EyesWrappedDriver} = require('@applitools/eyes-sdk-core')
const SpecWrappedDriver = require('./SpecWrappedDriver')

const ProtractorWrappedDriver = EyesWrappedDriver.specialize(SpecWrappedDriver, {
  /** @override */
  switchTo(proxies) {
    const switchTo = this._driver.switchTo()
    return new Proxy(switchTo, {
      get(target, key, receiver) {
        switch (key) {
          case 'defaultContent':
            return proxies.switchToFrame
          case 'frame':
            return proxies.switchToFrame
          case 'parentFrame':
            return proxies.switchToParentFrame
          default:
            return Reflect.get(target, key, receiver)
        }
      },
    })
  },
  /** @override */
  async get(proxies, url) {
    return proxies.visit(url)
  },
})

module.exports = ProtractorWrappedDriver
