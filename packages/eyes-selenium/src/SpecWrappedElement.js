module.exports =
  process.env.APPLITOOLS_SELENIUM_MAJOR_VERSION === '3'
    ? require('./selenium3/SpecWrappedElement')
    : require('./selenium4/SpecWrappedElement')
