module.exports =
  process.env.APPLITOOLS_SELENIUM_MAJOR_VERSION === '3'
    ? require('./spec-driver.selenium3.js')
    : require('./spec-driver.selenium4.js')
