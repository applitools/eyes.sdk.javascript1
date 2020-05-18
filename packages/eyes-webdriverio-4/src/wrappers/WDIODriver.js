const {ArgumentGuard, EyesWrappedDriver} = require('@applitools/eyes-sdk-core')
const WDIOJSExecutor = require('./WDIOJSExecutor')
const WDIOElementFinder = require('./WDIOElementFinder')
const WDIOBrowsingContext = require('./WDIOBrowsingContext')
const WDIODriverController = require('./WDIODriverController')
const LegacyAPIDriver = require('./LegacyAPIDriver')

class WDIODriver extends EyesWrappedDriver {
  constructor(logger, driver) {
    ArgumentGuard.notNull(driver, 'driver')
    if (driver instanceof WDIODriver) {
      return driver
    }
    super()
    this._logger = logger
    this._driver = driver

    this._proxy = new Proxy(this, {
      get(target, key, receiver) {
        // WORKAROUND we couldn't return this object from the async function because it think this is a Promise
        if (key === 'then') {
          return undefined
        } else if (key in target) {
          return Reflect.get(target, key, receiver)
        } else {
          return Reflect.get(target._driver, key)
        }
      },
    })

    this._executor = new WDIOJSExecutor(this._logger, this._proxy)
    this._finder = new WDIOElementFinder(this._logger, this._proxy)
    this._context = new WDIOBrowsingContext(this._logger, this._proxy)
    this._controller = new WDIODriverController(this._logger, this._proxy)

    return this._proxy
  }

  get unwrapped() {
    return this._driver
  }

  get executor() {
    return this._executor
  }

  get finder() {
    return this._finder
  }

  get context() {
    return this._context
  }

  get controller() {
    return this._controller
  }

  async frame(arg) {
    return this._context.frame(arg)
  }

  async frameParent() {
    return this._context.frameParent()
  }

  async url(url) {
    this._context.reset()
    return this._driver.url(url)
  }
}

module.exports = LegacyAPIDriver(WDIODriver)
