const chromedriver = require('chromedriver')

if (!process.env.SKIP_CHROMEDRIVER || process.env.CVG_TESTS_REMOTE) {
  const returnPromise = true
  chromedriver.start(['--port=4444', '--url-base=wd/hub', '--silent'], returnPromise)
}
process.exit(0)
