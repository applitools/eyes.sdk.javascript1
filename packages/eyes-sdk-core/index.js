'use strict'

/* eslint-disable max-len */

const common = require('@applitools/eyes-common')

exports.AppOutputProvider = require('./lib/capture/AppOutputProvider').AppOutputProvider
exports.AppOutputWithScreenshot = require('./lib/capture/AppOutputWithScreenshot').AppOutputWithScreenshot
exports.EyesScreenshot = require('./lib/capture/EyesScreenshot').EyesScreenshot
exports.EyesScreenshotNew = require('./lib/capture/EyesScreenshotNew')
exports.EyesScreenshotFactory = require('./lib/capture/EyesScreenshotFactory')
exports.EyesSimpleScreenshot = require('./lib/capture/EyesSimpleScreenshot').EyesSimpleScreenshot
exports.EyesSimpleScreenshotFactory = require('./lib/capture/EyesSimpleScreenshotFactory').EyesSimpleScreenshotFactory
exports.FullPageCaptureAlgorithm = require('./lib/capture/FullPageCaptureAlgorithm').FullPageCaptureAlgorithm
exports.ImageProvider = require('./lib/capture/ImageProvider').ImageProvider
exports.ImageProviderFactory = require('./lib/capture/ImageProviderFactory')
exports.CorsIframeHandle = require('./lib/capture/CorsIframeHandler').CorsIframeHandle
exports.CorsIframeHandler = require('./lib/capture/CorsIframeHandler').CorsIframeHandler

exports.CutProvider = require('./lib/cropping/CutProvider').CutProvider
exports.FixedCutProvider = require('./lib/cropping/FixedCutProvider').FixedCutProvider
exports.NullCutProvider = require('./lib/cropping/NullCutProvider').NullCutProvider
exports.UnscaledFixedCutProvider = require('./lib/cropping/UnscaledFixedCutProvider').UnscaledFixedCutProvider

exports.RemoteSessionEventHandler = require('./lib/events/RemoteSessionEventHandler').RemoteSessionEventHandler
exports.SessionEventHandler = require('./lib/events/SessionEventHandler').SessionEventHandler
exports.ValidationInfo = require('./lib/events/ValidationInfo').ValidationInfo
exports.ValidationResult = require('./lib/events/ValidationResult').ValidationResult

exports.CoordinatesTypeConversionError = require('./lib/errors/CoordinatesTypeConversionError').CoordinatesTypeConversionError
exports.DiffsFoundError = require('./lib/errors/DiffsFoundError').DiffsFoundError
exports.NewTestError = require('./lib/errors/NewTestError').NewTestError
exports.OutOfBoundsError = require('./lib/errors/OutOfBoundsError').OutOfBoundsError
exports.TestFailedError = require('./lib/errors/TestFailedError').TestFailedError
exports.EyesDriverOperationError = require('./lib/errors/EyesDriverOperationError').EyesDriverOperationError

exports.CheckSettings = require('./lib/fluent/CheckSettings')
exports.CheckSettingsFactory = require('./lib/fluent/CheckSettingsFactory')
exports.FrameLocator = require('./lib/fluent/FrameLocator')
exports.locatorToPersistedRegions = require('./lib/fluent/locatorToPersistedRegions')
exports.GetRegion = require('./lib/fluent/GetRegion').GetRegion
exports.GetSelector = require('./lib/fluent/GetSelector').GetSelector
exports.IgnoreRegionByRectangle = require('./lib/fluent/IgnoreRegionByRectangle').IgnoreRegionByRectangle
exports.IgnoreRegionBySelector = require('./lib/fluent/IgnoreRegionBySelector')
exports.IgnoreRegionByElement = require('./lib/fluent/IgnoreRegionByElement')
exports.GetFloatingRegion = require('./lib/fluent/GetFloatingRegion').GetFloatingRegion
exports.FloatingRegionByRectangle = require('./lib/fluent/FloatingRegionByRectangle').FloatingRegionByRectangle
exports.FloatingRegionBySelector = require('./lib/fluent/FloatingRegionBySelector')
exports.FloatingRegionByElement = require('./lib/fluent/FloatingRegionByElement')
exports.GetAccessibilityRegion = require('./lib/fluent/GetAccessibilityRegion').GetAccessibilityRegion
exports.AccessibilityRegionByRectangle = require('./lib/fluent/AccessibilityRegionByRectangle').AccessibilityRegionByRectangle
exports.AccessibilityRegionBySelector = require('./lib/fluent/AccessibilityRegionBySelector')
exports.AccessibilityRegionByElement = require('./lib/fluent/AccessibilityRegionByElement')
exports.TargetRegionBySelector = require('./lib/fluent/TargetRegionBySelector')
exports.TargetRegionByElement = require('./lib/fluent/TargetRegionByElement')

exports.AppOutput = require('./lib/match/AppOutput').AppOutput
exports.MatchResult = require('./lib/match/MatchResult').MatchResult
exports.MatchSingleWindowData = require('./lib/match/MatchSingleWindowData').MatchSingleWindowData
exports.MatchWindowData = require('./lib/match/MatchWindowData').MatchWindowData
exports.ImageMatchOptions = require('./lib/match/MatchWindowData').ImageMatchOptions
exports.MatchWindowDataWithScreenshot = require('./lib/match/MatchWindowDataWithScreenshot').MatchWindowDataWithScreenshot

exports.metadata = require('./lib/metadata/index')

exports.ImageRotation = require('./lib/positioning/ImageRotation')
exports.RegionProvider = require('./lib/positioning/RegionProvider')
exports.NullRegionProvider = require('./lib/positioning/NullRegionProvider')
exports.RegionPositionCompensation = require('./lib/positioning/RegionPositionCompensation')
exports.NullRegionPositionCompensation = require('./lib/positioning/NullRegionPositionCompensation')
exports.FirefoxRegionPositionCompensation = require('./lib/positioning/FirefoxRegionPositionCompensation')
exports.SafariRegionPositionCompensation = require('./lib/positioning/SafariRegionPositionCompensation')
exports.RegionPositionCompensationFactory = require('./lib/positioning/RegionPositionCompensationFactory')
exports.PositionProvider = require('./lib/positioning/PositionProvider')
exports.InvalidPositionProvider = require('./lib/positioning/InvalidPositionProvider')
exports.ScrollPositionProvider = require('./lib/positioning/ScrollPositionProvider')
exports.CssTranslatePositionProvider = require('./lib/positioning/CssTranslatePositionProvider')
exports.ScrollElementPositionProvider = require('./lib/positioning/ScrollElementPositionProvider')
exports.CssTranslateElementPositionProvider = require('./lib/positioning/CssTranslateElementPositionProvider')
exports.PositionMemento = require('./lib/positioning/PositionMemento')
exports.ScrollPositionMemento = require('./lib/positioning/ScrollPositionMemento')
exports.CssTranslatePositionMemento = require('./lib/positioning/CssTranslatePositionMemento')

exports.RenderInfo = require('./lib/renderer/RenderInfo').RenderInfo
exports.RenderRequest = require('./lib/renderer/RenderRequest').RenderRequest
exports.RenderStatus = require('./lib/renderer/RenderStatus').RenderStatus
exports.RenderStatusResults = require('./lib/renderer/RenderStatusResults').RenderStatusResults
exports.RGridDom = require('./lib/renderer/RGridDom').RGridDom
exports.RGridResource = require('./lib/renderer/RGridResource').RGridResource
exports.RunningRender = require('./lib/renderer/RunningRender').RunningRender
exports.EmulationInfo = require('./lib/renderer/EmulationInfo').EmulationInfo
exports.EmulationDevice = require('./lib/renderer/EmulationDevice').EmulationDevice

exports.ContextBasedScaleProvider = require('./lib/scaling/ContextBasedScaleProvider').ContextBasedScaleProvider
exports.ContextBasedScaleProviderFactory = require('./lib/scaling/ContextBasedScaleProviderFactory').ContextBasedScaleProviderFactory
exports.FixedScaleProvider = require('./lib/scaling/FixedScaleProvider').FixedScaleProvider
exports.FixedScaleProviderFactory = require('./lib/scaling/FixedScaleProviderFactory').FixedScaleProviderFactory
exports.NullScaleProvider = require('./lib/scaling/NullScaleProvider').NullScaleProvider
exports.ScaleProvider = require('./lib/scaling/ScaleProvider').ScaleProvider
exports.ScaleProviderFactory = require('./lib/scaling/ScaleProviderFactory').ScaleProviderFactory
exports.ScaleProviderIdentityFactory = require('./lib/scaling/ScaleProviderIdentityFactory').ScaleProviderIdentityFactory

exports.RenderingInfo = require('./lib/server/RenderingInfo').RenderingInfo
exports.RunningSession = require('./lib/server/RunningSession').RunningSession
exports.ServerConnector = require('./lib/server/ServerConnector').ServerConnector
exports.SessionStartInfo = require('./lib/server/SessionStartInfo').SessionStartInfo

exports.MouseTrigger = require('./lib/triggers/MouseTrigger').MouseTrigger
exports.TextTrigger = require('./lib/triggers/TextTrigger').TextTrigger
exports.Trigger = require('./lib/triggers/Trigger').Trigger

exports.AppEnvironment = require('./lib/AppEnvironment').AppEnvironment
exports.EyesBase = require('./lib/EyesBase').EyesBase
exports.EyesJsBrowserUtils = require('./lib/EyesJsBrowserUtils').EyesJsBrowserUtils
exports.EyesUtils = require('./lib/EyesUtils')
exports.FailureReports = require('./lib/FailureReports').FailureReports
exports.MatchSingleWindowTask = require('./lib/MatchSingleWindowTask').MatchSingleWindowTask
exports.MatchWindowTask = require('./lib/MatchWindowTask').MatchWindowTask
exports.RenderWindowTask = require('./lib/RenderWindowTask').RenderWindowTask
exports.TestResults = require('./lib/TestResults').TestResults
exports.TestAccessibilityStatus = require('./lib/TestResults').TestAccessibilityStatus
exports.AccessibilityStatus = require('./lib/AccessibilityStatus').AccessibilityStatus
exports.TestResultsFormatter = require('./lib/TestResultsFormatter').TestResultsFormatter
exports.TestResultsStatus = require('./lib/TestResultsStatus').TestResultsStatus

exports.FrameChain = require('./lib/frames/FrameChain').FrameChain
exports.Frame = require('./lib/frames/Frame').Frame

exports.EyesWrappedDriver = require('./lib/wrappers/EyesWrappedDriver').EyesWrappedDriver
exports.EyesWrappedElement = require('./lib/wrappers/EyesWrappedElement').EyesWrappedElement
exports.EyesJsExecutor = require('./lib/wrappers/EyesJsExecutor').EyesJsExecutor
exports.EyesElementFinder = require('./lib/wrappers/EyesElementFinder').EyesElementFinder
exports.EyesBrowsingContext = require('./lib/wrappers/EyesBrowsingContext').EyesBrowsingContext

exports.EyesRunner = require('./lib/runner/EyesRunner').EyesRunner
exports.ClassicRunner = require('./lib/runner/ClassicRunner').ClassicRunner
exports.VisualGridRunner = require('./lib/runner/VisualGridRunner').VisualGridRunner
exports.TestResultContainer = require('./lib/runner/TestResultContainer').TestResultContainer
exports.TestResultsSummary = require('./lib/runner/TestResultsSummary').TestResultsSummary

// Classes from eyes-common which may be used as part of public API
exports.AccessibilityLevel = common.AccessibilityLevel
exports.AccessibilityMatchSettings = common.AccessibilityMatchSettings
exports.AccessibilityRegionType = common.AccessibilityRegionType
exports.BatchInfo = common.BatchInfo
exports.BrowserType = common.BrowserType
exports.Configuration = common.Configuration
exports.DeviceName = common.DeviceName
exports.ExactMatchSettings = common.ExactMatchSettings
exports.FloatingMatchSettings = common.FloatingMatchSettings
exports.ImageMatchSettings = common.ImageMatchSettings
exports.MatchLevel = common.MatchLevel
exports.PropertyData = common.PropertyData
exports.ProxySettings = common.ProxySettings
exports.ScreenOrientation = common.ScreenOrientation
exports.SessionType = common.SessionType
exports.StitchMode = common.StitchMode

exports.DebugScreenshotsProvider = common.DebugScreenshotsProvider
exports.FileDebugScreenshotsProvider = common.FileDebugScreenshotsProvider
exports.NullDebugScreenshotProvider = common.NullDebugScreenshotProvider

exports.EyesError = common.EyesError

exports.CoordinatesType = common.CoordinatesType
exports.Location = common.Location
exports.RectangleSize = common.RectangleSize
exports.Region = common.Region

exports.PropertyHandler = common.PropertyHandler
exports.ReadOnlyPropertyHandler = common.ReadOnlyPropertyHandler
exports.SimplePropertyHandler = common.SimplePropertyHandler

exports.ImageDeltaCompressor = common.ImageDeltaCompressor
exports.MutableImage = common.MutableImage

exports.ConsoleLogHandler = common.ConsoleLogHandler
exports.DebugLogHandler = common.DebugLogHandler
exports.FileLogHandler = common.FileLogHandler
exports.Logger = common.Logger
exports.LogHandler = common.LogHandler
exports.NullLogHandler = common.NullLogHandler

// Classes which can be used internally, but should not be exported from final SDKs
exports.BrowserNames = common.BrowserNames
exports.OSNames = common.OSNames
exports.UserAgent = common.UserAgent

exports.ArgumentGuard = common.ArgumentGuard
exports.ConfigUtils = common.ConfigUtils
exports.DateTimeUtils = common.DateTimeUtils
exports.FileUtils = common.FileUtils
exports.GeneralUtils = common.GeneralUtils
exports.ImageUtils = common.ImageUtils
exports.PerformanceUtils = common.PerformanceUtils
exports.StreamUtils = common.StreamUtils
exports.TypeUtils = common.TypeUtils
exports.deserializeDomSnapshotResult = common.deserializeDomSnapshotResult
