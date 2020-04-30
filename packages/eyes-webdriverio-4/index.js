const core = require('@applitools/eyes-sdk-core')

exports.Eyes = require('./src/Eyes').Eyes
exports.EyesWDIO = require('./src/EyesWDIO').EyesWDIO
exports.EyesVisualGrid = require('./src/EyesVisualGrid').EyesVisualGrid
exports.By = require('./src/By')
exports.Target = require('./src/WDIOCheckSettings')
exports.WebdriverioCheckSettings = require('./src/WDIOCheckSettings')

exports.EyesScreenshot = core.EyesScreenshotNew
exports.StitchMode = core.StitchMode
exports.Logger = core.Logger
exports.ClassicRunner = core.ClassicRunner
exports.VisualGridRunner = core.VisualGridRunner
exports.Configuration = core.Configuration
exports.ConsoleLogHandler = core.ConsoleLogHandler
exports.FileLogHandler = core.FileLogHandler
exports.BatchInfo = core.BatchInfo
exports.BrowserType = core.BrowserType
exports.DeviceName = core.DeviceName
exports.ScreenOrientation = core.ScreenOrientation
exports.Region = core.Region
exports.MatchLevel = core.MatchLevel
exports.RectangleSize = core.RectangleSize
exports.AccessibilityLevel = core.AccessibilityLevel
exports.AccessibilityRegionType = core.AccessibilityRegionType
exports.AccessibilityMatchSettings = core.AccessibilityMatchSettings
