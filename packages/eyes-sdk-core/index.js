'use strict'

/* eslint-disable max-len */

// config
exports.AccessibilityLevel = require('./lib/config/AccessibilityLevel').AccessibilityLevel
exports.AccessibilityGuidelinesVersion = require('./lib/config/AccessibilityGuidelinesVersion').AccessibilityGuidelinesVersion
exports.AccessibilityMatchSettings = require('./lib/config/AccessibilityMatchSettings').AccessibilityMatchSettings
exports.AccessibilityRegionType = require('./lib/config/AccessibilityRegionType').AccessibilityRegionType
exports.BatchInfo = require('./lib/config/BatchInfo').BatchInfo
exports.BrowserType = require('./lib/config/BrowserType').BrowserType
exports.Configuration = require('./lib/config/Configuration').Configuration
exports.DeviceName = require('./lib/config/DeviceName').DeviceName
exports.ExactMatchSettings = require('./lib/config/ExactMatchSettings').ExactMatchSettings
exports.FloatingMatchSettings = require('./lib/config/FloatingMatchSettings').FloatingMatchSettings
exports.ImageMatchSettings = require('./lib/config/ImageMatchSettings').ImageMatchSettings
exports.MatchLevel = require('./lib/config/MatchLevel').MatchLevel
exports.PropertyData = require('./lib/config/PropertyData').PropertyData
exports.ProxySettings = require('./lib/config/ProxySettings').ProxySettings
exports.ScreenOrientation = require('./lib/config/ScreenOrientation').ScreenOrientation
exports.SessionType = require('./lib/config/SessionType').SessionType
exports.StitchMode = require('./lib/config/StitchMode').StitchMode
exports.IosDeviceName = require('./lib/config/IosDeviceName').IosDeviceName
exports.IosScreenOrientation = require('./lib/config/IosScreenOrientation').IosScreenOrientation
exports.IosVersion = require('./lib/config/IosVersion').IosVersion

// debug
exports.DebugScreenshotsProvider = require('./lib/debug/DebugScreenshotsProvider').DebugScreenshotsProvider
exports.FileDebugScreenshotsProvider = require('./lib/debug/FileDebugScreenshotsProvider').FileDebugScreenshotsProvider
exports.NullDebugScreenshotProvider = require('./lib/debug/NullDebugScreenshotProvider').NullDebugScreenshotProvider

// errors
exports.EyesError = require('./lib/errors/EyesError').EyesError

// geometry
exports.CoordinatesType = require('./lib/geometry/CoordinatesType').CoordinatesType
exports.Location = require('./lib/geometry/Location').Location
exports.RectangleSize = require('./lib/geometry/RectangleSize').RectangleSize
exports.Region = require('./lib/geometry/Region').Region

// handler
exports.PropertyHandler = require('./lib/handler/PropertyHandler').PropertyHandler
exports.ReadOnlyPropertyHandler = require('./lib/handler/ReadOnlyPropertyHandler').ReadOnlyPropertyHandler
exports.SimplePropertyHandler = require('./lib/handler/SimplePropertyHandler').SimplePropertyHandler

// images
exports.ImageDeltaCompressor = require('./lib/images/ImageDeltaCompressor').ImageDeltaCompressor
exports.MutableImage = require('./lib/images/MutableImage').MutableImage

// logging
exports.ConsoleLogHandler = require('./lib/logging/ConsoleLogHandler').ConsoleLogHandler
exports.DebugLogHandler = require('./lib/logging/DebugLogHandler').DebugLogHandler
exports.FileLogHandler = require('./lib/logging/FileLogHandler').FileLogHandler // -browser
exports.Logger = require('./lib/logging/Logger').Logger
exports.LogHandler = require('./lib/logging/LogHandler').LogHandler
exports.NullLogHandler = require('./lib/logging/NullLogHandler').NullLogHandler

// useragent
exports.BrowserNames = require('./lib/useragent/BrowserNames').BrowserNames
exports.OSNames = require('./lib/useragent/OSNames').OSNames
exports.UserAgent = require('./lib/useragent/UserAgent').UserAgent

// utils
exports.ArgumentGuard = require('./lib/utils/ArgumentGuard').ArgumentGuard
exports.ConfigUtils = require('./lib/utils/ConfigUtils').ConfigUtils
exports.DateTimeUtils = require('./lib/utils/DateTimeUtils').DateTimeUtils
exports.FileUtils = require('./lib/utils/FileUtils').FileUtils
exports.GeneralUtils = require('./lib/utils/GeneralUtils').GeneralUtils
exports.ImageUtils = require('./lib/utils/ImageUtils').ImageUtils
exports.PerformanceUtils = require('./lib/utils/PerformanceUtils').PerformanceUtils
exports.StreamUtils = require('./lib/utils/StreamUtils')
exports.TypeUtils = require('./lib/utils/TypeUtils').TypeUtils
exports.deserializeDomSnapshotResult = require('./lib/utils/deserializeDomSnapshotResult')
exports.DomCapture = require('./lib/DomCapture').DomCapture
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
exports.ElementNotFoundError = require('./lib/errors/ElementNotFoundError').ElementNotFoundError

exports.CheckSettings = require('./lib/fluent/CheckSettings')
exports.DriverCheckSettings = require('./lib/fluent/DriverCheckSettings')
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
exports.EyesClassic = require('./lib/EyesClassic')
exports.EyesVisualGrid = require('./lib/EyesVisualGrid')
exports.EyesFactory = require('./lib/EyesFactory')
exports.EyesJsBrowserUtils = require('./lib/EyesJsBrowserUtils').EyesJsBrowserUtils
exports.EyesUtils = require('./lib/EyesUtils')
exports.FailureReports = require('./lib/FailureReports').FailureReports
exports.MatchSingleWindowTask = require('./lib/MatchSingleWindowTask').MatchSingleWindowTask
exports.MatchWindowTask = require('./lib/MatchWindowTask').MatchWindowTask
exports.TestResults = require('./lib/TestResults').TestResults
exports.TestResultsError = require('./lib/TestResults').TestResultsError
exports.AccessibilityStatus = require('./lib/AccessibilityStatus').AccessibilityStatus
exports.TestResultsFormatter = require('./lib/TestResultsFormatter').TestResultsFormatter
exports.TestResultsStatus = require('./lib/TestResultsStatus').TestResultsStatus

exports.FrameChain = require('./lib/frames/FrameChain')
exports.Frame = require('./lib/frames/Frame')

exports.EyesWrappedDriver = require('./lib/wrappers/EyesWrappedDriver')
exports.EyesWrappedElement = require('./lib/wrappers/EyesWrappedElement')
exports.EyesJsExecutor = require('./lib/wrappers/EyesJsExecutor')
exports.EyesElementFinder = require('./lib/wrappers/EyesElementFinder')
exports.EyesBrowsingContext = require('./lib/wrappers/EyesBrowsingContext')

exports.EyesRunner = require('./lib/runner/EyesRunner').EyesRunner
exports.ClassicRunner = require('./lib/runner/ClassicRunner').ClassicRunner
exports.VisualGridRunner = require('./lib/runner/VisualGridRunner').VisualGridRunner
exports.TestResultContainer = require('./lib/runner/TestResultContainer').TestResultContainer
exports.TestResultsSummary = require('./lib/runner/TestResultsSummary').TestResultsSummary
