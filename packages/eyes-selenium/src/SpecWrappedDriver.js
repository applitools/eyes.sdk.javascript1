module.exports =
  process.env.SELENIUM_MAJOR_VERSION === '3'
    ? require('./selenium3/SpecWrappedDriver')
    : require('./selenium4/SpecWrappedDriver')
