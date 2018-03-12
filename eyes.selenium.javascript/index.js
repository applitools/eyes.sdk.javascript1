exports.EyesWebDriverScreenshot = require('./src/capture/EyesWebDriverScreenshot');
exports.EyesWebDriverScreenshotFactory = require('./src/capture/EyesWebDriverScreenshotFactory');
exports.FirefoxScreenshotImageProvider = require('./src/capture/FirefoxScreenshotImageProvider');
exports.FullPageCaptureAlgorithm = require('./src/capture/FullPageCaptureAlgorithm');
exports.ImageProviderFactory = require('./src/capture/ImageProviderFactory');
exports.SafariScreenshotImageProvider = require('./src/capture/SafariScreenshotImageProvider');
exports.TakesScreenshotImageProvider = require('./src/capture/TakesScreenshotImageProvider');

exports.EyesDriverOperationError = require('./src/errors/EyesDriverOperationError');
exports.NoFramesError = require('./src/errors/NoFramesError');

exports.FloatingRegionByElement = require('./src/fluent/FloatingRegionByElement');
exports.FloatingRegionBySelector = require('./src/fluent/FloatingRegionBySelector');
exports.FrameLocator = require('./src/fluent/FrameLocator');
exports.IgnoreRegionByElement = require('./src/fluent/IgnoreRegionByElement');
exports.IgnoreRegionBySelector = require('./src/fluent/IgnoreRegionBySelector');
exports.SeleniumCheckSettings = require('./src/fluent/SeleniumCheckSettings');
exports.Target = require('./src/fluent/Target');

exports.Frame = require('./src/frames/Frame');
exports.FrameChain = require('./src/frames/FrameChain');

exports.CssTranslatePositionMemento = require('./src/positioning/CssTranslatePositionMemento');
exports.CssTranslatePositionProvider = require('./src/positioning/CssTranslatePositionProvider');
exports.ElementPositionMemento = require('./src/positioning/ElementPositionMemento');
exports.ElementPositionProvider = require('./src/positioning/ElementPositionProvider');
exports.FirefoxRegionPositionCompensation = require('./src/positioning/FirefoxRegionPositionCompensation');
exports.ImageRotation = require('./src/positioning/ImageRotation');
exports.NullRegionPositionCompensation = require('./src/positioning/NullRegionPositionCompensation');
exports.RegionPositionCompensation = require('./src/positioning/RegionPositionCompensation');
exports.RegionPositionCompensationFactory = require('./src/positioning/RegionPositionCompensationFactory');
exports.SafariRegionPositionCompensation = require('./src/positioning/SafariRegionPositionCompensation');
exports.ScrollPositionMemento = require('./src/positioning/ScrollPositionMemento');
exports.ScrollPositionProvider = require('./src/positioning/ScrollPositionProvider');
exports.StitchMode = require('./src/positioning/StitchMode');

exports.MoveToRegionVisibilityStrategy = require('./src/regionVisibility/MoveToRegionVisibilityStrategy');
exports.NopRegionVisibilityStrategy = require('./src/regionVisibility/NopRegionVisibilityStrategy');
exports.RegionVisibilityStrategy = require('./src/regionVisibility/RegionVisibilityStrategy');

exports.EyesTargetLocator = require('./src/wrappers/EyesTargetLocator');
exports.EyesWebDriver = require('./src/wrappers/EyesWebDriver');
exports.EyesWebElement = require('./src/wrappers/EyesWebElement');
exports.EyesWebElementPromise = require('./src/wrappers/EyesWebElementPromise');

exports.BordersAwareElementContentLocationProvider = require('./src/BordersAwareElementContentLocationProvider');
exports.Eyes = require('./src/Eyes');
exports.EyesSeleniumUtils = require('./src/EyesSeleniumUtils');
exports.ImageOrientationHandler = require('./src/ImageOrientationHandler');
exports.JavascriptHandler = require('./src/JavascriptHandler');
exports.SeleniumJavaScriptExecutor = require('./src/SeleniumJavaScriptExecutor');
