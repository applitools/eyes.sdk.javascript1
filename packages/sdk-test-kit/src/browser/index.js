const chromedriver = require('chromedriver')

async function startChromeDriver(options = []) {
  const returnPromise = true
  return await chromedriver.start(options, returnPromise).catch(console.error)
}

async function stopChromeDriver() {
  chromedriver.stop()
}

module.exports = {
  startChromeDriver,
  stopChromeDriver,
}
