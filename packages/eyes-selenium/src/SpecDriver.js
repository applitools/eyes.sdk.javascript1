module.exports =
  process.env.APPLITOOLS_SELENIUM_MAJOR_VERSION === '3'
    ? require('./SpecDriver.selenium3.js')
    : require('./SpecDriver.selenium4.js')
